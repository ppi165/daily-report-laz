import { settingRepository } from '../repositories/setting.repository';

export class GetSettingsUseCase {
  async execute() {
    return settingRepository.findDefault();
  }
}

export const getSettingsUseCase = new GetSettingsUseCase();
