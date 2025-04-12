import { apiGet, apiPost } from './index';
import { createApiValidator } from './validation';
import { 
  User, 
  UserSchema, 
  UserListSchema, 
  LoginRequestSchema, 
  LoginResponseSchema 
} from './schema/user-schema';

// Example function to fetch a user
export async function fetchUser(userId: number): Promise<User> {
  return apiGet(`/users/${userId}`, UserSchema);
}

// Example function to fetch all users
export async function fetchAllUsers(): Promise<User[]> {
  return apiGet('/users', UserListSchema);
}

// Example function to login
export async function login(email: string, password: string) {
  const loginData = { email, password };
  
  // Validate request data before sending
  const validatedRequest = LoginRequestSchema.parse(loginData);
  
  return apiPost('/auth/login', validatedRequest, LoginResponseSchema);
}

// Alternative approach using a pre-created validator
const validateLoginResponse = createApiValidator(LoginResponseSchema, '/auth/login');

export async function loginAlt(email: string, password: string) {
  const loginData = { email, password };
  const response = await apiPost('/auth/login', loginData, LoginResponseSchema);
  
  // This would be equivalent to the validation already done in apiPost
  // Just shown as an example of using createApiValidator separately
  return validateLoginResponse(response);
} 