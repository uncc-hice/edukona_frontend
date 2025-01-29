export interface Recording {
  id: string;
  title: string;
  s3_path: string;
  uploaded_at: string;
  instructor: string;
  transcript: string;
}

export interface Course {
  id: string;
  instructor: string;
  title: string;
  description: string;
  code: string;
  created_at: string;
  allow_joining_until: string;
  start_date: string;
  end_date: string;
}
