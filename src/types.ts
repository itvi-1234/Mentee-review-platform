export interface Mentee {
  name: string;
  email: string;
  resume: string | null;
  coverLetter: string | null;
  inclusiveCommunity: string | null;
}

export type SortKey = "name" | "email";

export type InterviewFilter = "all" | "called" | "not-called";
