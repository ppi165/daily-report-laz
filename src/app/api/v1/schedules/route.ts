import { NextRequest, NextResponse } from "next/server";
import { getSchedulesUseCase } from "@/src/modules/schedules/use-cases/get-schedules.use-case";
import { createScheduleUseCase } from "@/src/modules/schedules/use-cases/create-schedule.use-case";
import { updateScheduleUseCase } from "@/src/modules/schedules/use-cases/update-schedule.use-case";
import { deleteScheduleUseCase } from "@/src/modules/schedules/use-cases/delete-schedule.use-case";

export async function GET() {
  try {
    const data = await getSchedulesUseCase.execute();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await createScheduleUseCase.execute(body);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Gagal membuat jadwal khusus",
      },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await updateScheduleUseCase.execute(body);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Gagal memperbarui jadwal khusus",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "ID wajib diisi" }, { status: 400 });
    }
    await deleteScheduleUseCase.execute(id);
    return NextResponse.json({ success: true, message: "Jadwal berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Gagal menghapus jadwal",
      },
      { status: 400 }
    );
  }
}
