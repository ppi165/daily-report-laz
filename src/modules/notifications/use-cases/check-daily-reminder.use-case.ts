import { notificationRepository } from "../repositories/notification.repository";
import { scheduleRepository } from "@/src/modules/schedules/repositories/schedule.repository";
import { settingRepository } from "@/src/modules/settings/repositories/setting.repository";
import { reportRepository } from "@/src/modules/reports/repositories/report.repository";

export class CheckDailyReminderUseCase {
  private lastCheckedMap = new Map<string, number>();
  private remindedDateMap = new Map<string, string>();

  async execute(userId: string) {
    if (!userId) return { reminded: false };

    const now = new Date();

    // 1. Konversi waktu dan tanggal ke zona waktu WIB (Asia/Jakarta, UTC+7)
    const wibFormatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });

    const parts = wibFormatter.formatToParts(now);
    const getPart = (type: string) =>
      parts.find((p) => p.type === type)?.value || "";
    const year = getPart("year");
    const month = getPart("month");
    const day = getPart("day");
    const hour = getPart("hour");
    const minute = getPart("minute");

    const currentTimeStr = `${hour}:${minute}`;
    const todayWibStr = `${year}-${month}-${day}`;

    // Awal dan akhir hari WIB yang valid di zona waktu Asia/Jakarta (+07:00)
    const startOfToday = new Date(`${todayWibStr}T00:00:00.000+07:00`);
    const endOfToday = new Date(`${todayWibStr}T23:59:59.999+07:00`);

    // Bersihkan notifikasi pengingat usang dari hari-hari sebelumnya
    await notificationRepository
      .deleteExpiredReminders(userId, startOfToday)
      .catch(() => {});

    // Jika user sudah diingatkan hari ini di memori proses, lewati query
    if (this.remindedDateMap.get(userId) === todayWibStr) {
      return { reminded: false, reason: "ALREADY_REMINDED" };
    }

    // Throttling: Cek per-user maksimal setiap 5 menit untuk menghemat koneksi database Supabase
    const lastChecked = this.lastCheckedMap.get(userId) || 0;
    const nowTime = Date.now();
    if (nowTime - lastChecked < 5 * 60 * 1000) {
      return { reminded: false, reason: "THROTTLED" };
    }
    this.lastCheckedMap.set(userId, nowTime);

    // 2. Cek apakah ada jadwal khusus (SpecialSchedule) aktif hari ini via repository
    const activeSchedule = await scheduleRepository.findActiveForDate(now);

    // 3. Ambil pengaturan sistem reguler via repository
    const settings = await settingRepository.findDefault();

    const reminderTime =
      activeSchedule?.reminderTime || settings?.reminderTime || "16:00";
    const deadlineTime =
      activeSchedule?.deadlineTime ||
      (settings?.isRamadhanMode
        ? settings?.ramadhanDeadlineTime || "15:30"
        : settings?.dailyDeadlineTime || "17:00");

    const workDays = settings?.workDays || [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
    ];

    const dayFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
    });
    const currentDay = dayFormatter.format(now).toUpperCase();

    // Cek apakah hari ini termasuk hari kerja (jadwal khusus mengesampingkan pengecekan jika diatur)
    if (!activeSchedule && !workDays.includes(currentDay)) {
      return { reminded: false, reason: "NOT_WORK_DAY" };
    }

    // Cek apakah belum memasuki jam pengingat
    if (currentTimeStr < reminderTime) {
      return { reminded: false, reason: "BEFORE_REMINDER_TIME" };
    }

    // Cek apakah sudah melewati batas waktu pelaporan hari ini
    if (currentTimeStr >= deadlineTime) {
      return { reminded: false, reason: "PAST_DEADLINE" };
    }

    // Cek apakah user sudah mengirim laporan reguler hari ini via repository (abaikan clock-in susulan)
    const todayReport = await reportRepository.findTodayRegularReportByAuthor(
      userId,
      startOfToday,
      endOfToday
    );

    if (todayReport) {
      // Jika sudah kirim laporan, tandai hari ini & bersihkan notif pengingat jika ada
      this.remindedDateMap.set(userId, todayWibStr);
      this.lastCheckedMap.set(userId, nowTime + 25 * 60 * 1000);
      await notificationRepository
        .deleteReminderForReportSubmitted(userId, startOfToday)
        .catch(() => {});
      return { reminded: false, reason: "ALREADY_REPORTED" };
    }

    // Cek apakah notifikasi pengingat hari ini sudah pernah dibuat di database
    const existingReminder =
      await notificationRepository.findExistingReminderToday(
        userId,
        startOfToday
      );

    if (existingReminder) {
      // Tandai dan perpanjang throttle 30 menit agar tidak berulang kali query
      this.remindedDateMap.set(userId, todayWibStr);
      this.lastCheckedMap.set(userId, nowTime + 25 * 60 * 1000);
      return { reminded: false, reason: "ALREADY_REMINDED" };
    }

    // Buat notifikasi pengingat baru hari ini
    await notificationRepository.create({
      userId,
      type: "REMINDER",
      title: "Pengingat Batas Laporan",
      message: `Waktu pengisian laporan tersisa! Segera isi dan kirimkan Daily Report Anda sebelum pukul ${deadlineTime} WIB.`,
      link: "/daily-report",
    });

    this.remindedDateMap.set(userId, todayWibStr);
    return { reminded: true };
  }
}

export const checkDailyReminderUseCase = new CheckDailyReminderUseCase();
