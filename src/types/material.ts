
export type MaterialStatus = "pending" | "approved" | "rejected" | "published";

export interface Material {
  id: number;
  title: string;
  description: string;
  previewUrl: string;
  originalUrl: string;
  uploadDate: string;
  uploader: string;
  approver?: string;
  status: MaterialStatus;
  approvalDate?: string;
}
