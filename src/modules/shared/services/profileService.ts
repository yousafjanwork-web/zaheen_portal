import axios from "axios";

const BASE_URL = "https://api.zaheen.com.pk/v2";

export interface UserProfile {
  id: number;
  sub_id?: number | null;
  name: string;
  username: string;
  email: string;
  password?: string | null;
  msisdn: string;
   is_kid?: boolean | number | null;
  create_at?: string;
  update_at?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

export interface UsernameLoginPayload {
  username: string;
  password: string;
}

/**
 * GET /api/users?msisdn=XXXX
 * Returns the full user object (including id) or null if not found.
 */
export const getUserProfile = async (msisdn: string): Promise<UserProfile | null> => {
  try {
    const res = await axios.get(`${BASE_URL}/api/users`, { params: { msisdn } });
    if (res.data?.success && res.data?.data) {
      return res.data.data as UserProfile;
    }

    // User not found — auto-create for new subscribers
    if (!res.data?.success) {
      const createRes = await axios.post(`${BASE_URL}/api/users`, { msisdn });
      if (createRes.data?.success && createRes.data?.data) {
        return createRes.data.data as UserProfile;
      }
    }

    return null;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // 404 also means not found — try to create
      try {
        const createRes = await axios.post(`${BASE_URL}/api/users`, { msisdn });
        if (createRes.data?.success && createRes.data?.data) {
          return createRes.data.data as UserProfile;
        }
      } catch {
        // creation also failed — user genuinely can't be resolved
      }
      return null;
    }
    throw err;
  }
};

/**
 * PUT /api/users/:id
 * Update an existing user's profile fields.
 * msisdn cannot be updated — do not include it in the payload.
 */
export const updateUserProfile = async (
  id: number,
  payload: UpdateProfilePayload
): Promise<UserProfile> => {
  const res = await axios.put(`${BASE_URL}/api/users/${id}`, payload);
  if (res.data?.success && res.data?.data) {
    return res.data.data as UserProfile;
  }
  throw new Error(res.data?.message || "Failed to update profile");
};

/**
 * POST /api/users/login
 * Login with username + password.
 * Returns the full user object on success.
 */
export interface LoginResult {
  user: UserProfile;
  token: string | null;
}

export const loginWithCredentials = async (
  payload: UsernameLoginPayload
): Promise<LoginResult> => {
  const res = await axios.post(`${BASE_URL}/api/users/login`, payload);
  if (res.data?.success && res.data?.data?.user) {
    return {
      user:  res.data.data.user  as UserProfile,
      token: res.data.data.token ?? res.data.data.access_token ?? null,
    };
  }
  throw new Error(res.data?.message || "Invalid username or password");
};