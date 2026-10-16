import { NextRequest, NextResponse } from 'next/server';
import { getSettingsUseCase } from '@/src/modules/settings/use-cases/get-settings.use-case';
import { updateSettingsUseCase } from '@/src/modules/settings/use-cases/update-settings.use-case';

export async function GET() {
  try {
    const data = await getSettingsUseCase.execute();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await updateSettingsUseCase.execute(body);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Gagal memperbarui pengaturan sistem',
      },
      { status: 400 }
    );
  }
}
