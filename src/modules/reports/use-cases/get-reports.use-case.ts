import { reportRepository } from '../repositories/report.repository';
import { GetReportsInput, GetReportsSchema } from '../schemas/get-reports.schema';

export class GetReportsUseCase {
  async execute(input?: GetReportsInput) {
    const validated = input ? GetReportsSchema.parse(input) : undefined;

    return reportRepository.findMany({
      where: {
        ...(validated?.division ? { division: validated.division } : {}),
        ...(validated?.authorId ? { authorId: validated.authorId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: validated?.limit || 50,
      skip: validated?.offset || 0,
    });
  }
}

export const getReportsUseCase = new GetReportsUseCase();
