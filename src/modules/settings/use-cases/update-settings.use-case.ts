import { settingRepository } from '../repositories/setting.repository';
import { UpdateSettingsInput, UpdateSettingsSchema } from '../schemas/update-settings.schema';

export class UpdateSettingsUseCase {
  async execute(input: UpdateSettingsInput) {
    const validated = UpdateSettingsSchema.parse(input);
    return settingRepository.update(validated);
  }
}

export const updateSettingsUseCase = new UpdateSettingsUseCase();
