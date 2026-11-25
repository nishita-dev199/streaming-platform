export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface HealthResponse {
  status: string;
  database: string;
  uptimeSeconds: number;
  timestamp: string;
}

export interface UsersResponse {
  data: User[];
}

export interface UserResponse {
  data: User;
}
