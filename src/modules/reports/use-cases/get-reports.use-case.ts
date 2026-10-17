import { Prisma } from '@prisma/client';
import { reportRepository } from '../repositories/report.repository';
import { GetReportsInput, GetReportsSchema } from '../schemas/get-reports.schema';

export class GetReportsUseCase {
  async execute(input?: GetReportsInput) {
    const validated = input ? GetReportsSchema.parse(input) : undefined;

    const dateFilter: Prisma.DateTimeFilter = {};
    if (validated?.startDate) {
      dateFilter.gte = new Date(`${validated.startDate}T00:00:00.000+07:00`);
    }
    if (validated?.endDate) {
      dateFilter.lte = new Date(`${validated.endDate}T23:59:59.999+07:00`);
    }

    return reportRepository.findMany({
      where: {
        ...(validated?.division && validated.division !== 'ALL' ? { division: validated.division } : {}),
        ...(validated?.authorId ? { authorId: validated.authorId } : {}),
        ...(validated?.startDate || validated?.endDate ? { createdAt: dateFilter } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: validated?.limit ?? 100,
      skip: validated?.offset || 0,
    });
  }
}

export const getReportsUseCase = new GetReportsUseCase();
