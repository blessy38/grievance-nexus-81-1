export interface ComplaintTimelineItem {
  status: string;
  date: string; // ISO string
  description: string;
}

export interface Complaint {
  complaintId: string;
  userName: string;
  address: string;
  issue: string;
  department: string;
  status: string;
  submissionDate: string; // ISO string
  lastUpdated: string; // ISO string
  timeline: ComplaintTimelineItem[];
}



