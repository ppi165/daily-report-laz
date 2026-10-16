export interface ApprovalItem {
  id: string;
  approverMockId: string | null;
  approverName: string;
  approverDivision: string | null;
  status: string; // PENDING, APPROVED, REJECTED
  note: string | null;
  respondedAt: string | null;
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
  author: {
    name: string;
    division: string;
  };
  approvals: ApprovalItem[];
}
