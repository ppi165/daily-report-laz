export interface MockApprover {
  id: string;
  name: string;
  role: string;
  division: string;
}

export const MOCK_APPROVERS: MockApprover[] = [
  {
    id: "mock-approver-1",
    name: "Siti Rahma",
    role: "Staf Bidang Program",
    division: "Program",
  },
  {
    id: "mock-approver-2",
    name: "Dedi Kurniawan",
    role: "Koordinator Keuangan & Akuntansi",
    division: "Keuangan",
  },
  {
    id: "mock-approver-3",
    name: "Nabila Putri",
    role: "Staf Humas & Media Publikasi",
    division: "Humas",
  },
  {
    id: "mock-approver-4",
    name: "Ridwan Fauzi",
    role: "Sekretariat & Administrasi Amil",
    division: "Sekretariat",
  },
  {
    id: "mock-approver-5",
    name: "Fajar Nugraha",
    role: "IT & Transformasi Digital",
    division: "IT",
  },
  {
    id: "mock-approver-6",
    name: "Ustadz H. Ahmad",
    role: "Kepala Bidang Operasional Lazis",
    division: "Pusat",
  },
];
