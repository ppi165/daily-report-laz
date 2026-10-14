import { reportRepository } from '../repositories/report.repository';
import { CreateReportInput, CreateReportSchema } from '../schemas/create-report.schema';

export class CreateReportUseCase {
  async execute(input: CreateReportInput, authorId: string) {
    const validated = CreateReportSchema.parse(input);

    if (!authorId) {
      throw new Error('Unauthorized: Author ID wajib ada');
    }

    return reportRepository.create({
      title: validated.title || '',
      content: validated.content,
      division: validated.division,
      attachments: validated.attachments || [],
      authorId,
      status: 'PUBLISHED',
      appreciations: 0,
    });
  }
}

export const createReportUseCase = new CreateReportUseCase();
