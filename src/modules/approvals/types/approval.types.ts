export interface ApprovalItem {
  id: string;
  approverId?: string | null;
  approverMockId: string | null;
  approverName: string;
  approverDivision: string | null;
  status: string; // PENDING, APPROVED, REJECTED
  note: string | null;
  respondedAt: string | null;
  isOverridden?: boolean;
  respondedByName?: string | null;
}

export interface ClockInReport {
  id: string;
  title: string | null;
  content: string;
  division: string;
  attachments: string[];
  status: string; // PUBLISHED, PENDING_APPROVAL, REJECTED
  isClockIn: boolean;
  createdAt: string;
  authorId?: string;
  author: {
    id?: string;
    name: string;
    division: string;
  };
  approvals: ApprovalItem[];
}
