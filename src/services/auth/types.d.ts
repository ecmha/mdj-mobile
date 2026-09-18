export interface AuthUser {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: 'user' | 'author' | 'director' | 'admin';
  status?: 'pending' | 'active' | 'dropped';
}

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupForm extends Credentials {
  firstname: string;
  lastname: string;
}

// Tokens are missing when the account still awaits approval (never the case
// for the `user` role the app signs up with).
export interface AuthResponse {
  user: AuthUser;
  access_token?: string;
  refresh_token?: string;
}
