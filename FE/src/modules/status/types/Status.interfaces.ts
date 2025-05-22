export interface Status {
  id: number;
  name: string;
}

export interface StatusState {
  statuses: Status[];
  loading: boolean;
  error: string | null;
}