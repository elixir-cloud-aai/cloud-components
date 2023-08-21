export default interface ApiResponse {
  next_page_token: string;
  runs: Run[];
}

interface Run {
  run_id: string;
  state: string;
}
