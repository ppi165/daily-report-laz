import { NextRequest, NextResponse } from "next/server";
import { getSchedulesUseCase } from "@/src/modules/schedules/use-cases/get-schedules.use-case";
import { createScheduleUseCase } from "@/src/modules/schedules/use-cases/create-schedule.use-case";
import { updateScheduleUseCase } from "@/src/modules/schedules/use-cases/update-schedule.use-case";
import { deleteScheduleUseCase } from "@/src/modules/schedules/use-cases/delete-schedule.use-case";
import { verifyJWT } from "@/src/infrastructure/auth";

async function verifyAdminAuth(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return { authorized: false, response: NextResponse.json({ success: false, message: "Unauthorized: Sesi tidak ditemukan." }, { status: 401 }) };
  }
  const payload = await verifyJWT(token);
  if (!payload) {
    return { authorized: false, response: NextResponse.json({ success: false, message: "Unauthorized: Sesi tidak valid." }, { status: 401 }) };
  }
  if (payload.role !== "SUPERADMIN" && payload.role !== "ADMIN") {
    return { authorized: false, response: NextResponse.json({ success: false, message: "Forbidden: Hanya Administrator yang diizinkan mengelola jadwal khusus." }, { status: 403 }) };
  }
  return { authorized: true, payload };
}

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
    const auth = await verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

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
    const auth = await verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

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
    const auth = await verifyAdminAuth(request);
    if (!auth.authorized) return auth.response;

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
