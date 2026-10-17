import { prisma } from "@/src/infrastructure/prisma";
import { notificationRepository } from "../repositories/notification.repository";
import { scheduleRepository } from "@/src/modules/schedules/repositories/schedule.repository";

export class CheckDailyReminderUseCase {
  async execute(userId: string) {
    if (!userId) return { reminded: false };

    const now = new Date();

    // 1. Cek apakah ada jadwal khusus (SpecialSchedule) aktif hari ini
    const activeSchedule = await scheduleRepository.findActiveForDate(now);

    // 2. Ambil pengaturan sistem reguler
    const settings = await prisma.systemSetting.findUnique({
      where: { id: "default" },
    });

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

    // 3. Konversi waktu dan tanggal ke zona waktu WIB (Asia/Jakarta, UTC+7) secara akurat
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
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";
    const year = getPart("year");
    const month = getPart("month");
    const day = getPart("day");
    const hour = getPart("hour");
    const minute = getPart("minute");

    const currentTimeStr = `${hour}:${minute}`;
    const todayWibStr = `${year}-${month}-${day}`;

    // Awal hari WIB yang valid di zona waktu Asia/Jakarta (+07:00)
    const startOfToday = new Date(`${todayWibStr}T00:00:00.000+07:00`);

    const dayFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
    });
    const currentDay = dayFormatter.format(now).toUpperCase();

    // Cek apakah hari ini termasuk hari kerja (jadwal khusus mengesampingkan pengecekan jika diatur)
    if (!activeSchedule && !workDays.includes(currentDay)) {
      return { reminded: false, reason: "NOT_WORK_DAY" };
    }

    // Cek apakah sudah memasuki waktu pengingat
    if (currentTimeStr < reminderTime) {
      return { reminded: false, reason: "BEFORE_REMINDER_TIME" };
    }

    // Cek apakah user sudah mengirim laporan hari ini
    const todayReport = await prisma.report.findFirst({
      where: {
        authorId: userId,
        createdAt: { gte: startOfToday },
      },
    });

    if (todayReport) {
      // Jika sudah kirim laporan, bersihkan notif pengingat hari ini jika sebelumnya ada
      await notificationRepository.deleteReminderForReportSubmitted(
        userId,
        startOfToday
      );
      return { reminded: false, reason: "ALREADY_REPORTED" };
    }

    // Cek apakah notifikasi pengingat hari ini sudah pernah dibuat
    const existingReminder =
      await notificationRepository.findExistingReminderToday(
        userId,
        startOfToday
      );

    if (existingReminder) {
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

    return { reminded: true };
  }
}

export const checkDailyReminderUseCase = new CheckDailyReminderUseCase();
