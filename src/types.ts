export interface QueryResult {
  id: string | number;
  score: number;
  payload: {
    content: string;
    url?: string;
    [key: string]: unknown;
  };
}