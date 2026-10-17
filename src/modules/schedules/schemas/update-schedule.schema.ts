import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const UpdateScheduleSchema = z
  .object({
    id: z.string().min(1, "ID Jadwal wajib disertakan"),
    name: z.string().min(3, "Nama jadwal/event minimal 3 karakter"),
    startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
    endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
    deadlineTime: z.string().regex(timeRegex, "Format jam harus HH:mm (cth: 15:30)"),
    reminderTime: z.string().regex(timeRegex, "Format jam harus HH:mm (cth: 14:30)").optional().or(z.literal("")),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate).getTime();
      const end = new Date(data.endDate).getTime();
      return end >= start;
    },
    {
      message: "Tanggal selesai harus sama atau setelah tanggal mulai",
      path: ["endDate"],
    }
  );

export type UpdateScheduleInput = z.infer<typeof UpdateScheduleSchema>;
