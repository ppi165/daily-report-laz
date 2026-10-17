import { feedRepository, FeedRepository } from "../repositories/feed.repository";

export interface ParsedFeedReport {
  id: string;
  title: string | null;
  tasks: string;
  results: string;
  division: string;
  attachments: string[];
  createdAt: Date;
  isClockIn?: boolean;
  status?: string;
  approvals?: Array<{
    id: string;
    approverName: string;
    approverDivision: string | null;
    status: string;
    respondedAt?: Date | null;
  }>;
  author: {
    id: string;
    name: string;
    email: string;
    division: string;
    position: string | null;
    role: string;
    avatar?: string | null;
  };
  appreciationsCount: number;
  hasLiked: boolean;
  commentsCount: number;
  comments: Array<{
    id: string;
    content: string;
    parentId?: string | null;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      division: string;
      role: string;
      position: string | null;
      avatar?: string | null;
    };
  }>;
}

export interface GetFeedReportsOptions {
  cursor?: string;
  limit?: number;
  division?: string;
  search?: string;
}

export interface GetFeedReportsResult {
  reports: ParsedFeedReport[];
  nextCursor: string | null;
}

export class GetFeedReportsUseCase {
  constructor(private readonly repo: FeedRepository = feedRepository) {}

  async execute(
    currentUserId: string,
    options?: GetFeedReportsOptions
  ): Promise<GetFeedReportsResult> {
    const { reports: rawReports, nextCursor } = await this.repo.getFeedReports(options);

    const reports = rawReports.map((report) => {
      let tasks = report.content;
      let results = "";

      const pekerjaanMatch = report.content.match(/\[PEKERJAAN\]([\s\S]*?)(?=\[HASIL \/ OUTPUT\]|$)/i);
      const outputMatch = report.content.match(/\[HASIL \/ OUTPUT\]([\s\S]*)$/i);

      if (pekerjaanMatch && outputMatch) {
        tasks = pekerjaanMatch[1].trim();
        results = outputMatch[1].trim();
      } else {
        // Fallback jika laporan format lama
        results = "Tidak ada rincian hasil pekerjaan terpisah pada laporan ini.";
      }

      const hasLiked = report.likes.some((l) => l.userId === currentUserId);

      return {
        id: report.id,
        title: report.title,
        tasks,
        results,
        division: report.division,
        attachments: report.attachments,
        createdAt: report.createdAt,
        author: report.author,
        isClockIn: Boolean(report.isClockIn),
        status: report.status,
        approvals: report.approvals,
        appreciationsCount: report.likes.length > 0 ? report.likes.length : report.appreciations,
        hasLiked,
        commentsCount: report.comments.length,
        comments: report.comments,
      };
    });

    return {
      reports,
      nextCursor,
    };
  }
}

export const getFeedReportsUseCase = new GetFeedReportsUseCase();
