import axios from "axios";

const BASE = "https://api.zaheen.com.pk/v2/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SetupStatus {
  has_role: boolean;
  has_grade: boolean;
  has_course: boolean;
  is_profile_complete: boolean;
  role: "learner" | "parent" | "both" | null;
  selected_class_id: number | null;
  selected_course_id: number | null;
}

export interface Grade {
  id: number;
  name: string;
  urdu_name: string;
  thumbnail: string;
}

export interface Course {
  id: number;
  title_en: string;
  title_ur: string;
  category_name: string;
  thumbnail_url: string;
}

export interface Child {
  id: number;
  name: string;
  username: string;
  email: string | null;
  msisdn: string | null;
  selected_class_id: number;
  selected_course_id: number | null;
  class_name: string;
  class_thumbnail: string;
  course_name: string | null;
}

export interface AddChildPayload {
  parent_id: number;
  name: string;
  username: string;
  password: string;
  class_id: number;
  course_id?: number | null;
}

export interface DashboardData {
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    msisdn: string;
    role: string;
    is_kid: number;
  };
  grade: { id: number; name: string; thumbnail: string; urdu_name: string } | null;
  course: { id: number; title_en: string; title_ur: string } | null;
  video_summary: {
    total_videos: number;
    completed_videos: number;
    avg_percentage: number;
  };
  quiz_summary: {
    total_skills: number;
    avg_mastery: number;
    mastered_skills: number;
  };
  recent_videos: {
    video_id: number;
    title_en: string;
    percentage_watched: number;
    completed: number;
    updated_at: string;
  }[];
}

export interface ChildDashboardData extends DashboardData {}

// ─── Setup ───────────────────────────────────────────────────────────────────

/**
 * GET /lms/users/:id/setup-status
 * Call this after every login to decide which screen to show.
 */
export const getSetupStatus = async (userId: number): Promise<SetupStatus> => {
  const EMPTY: SetupStatus = {
    has_role: false,
    has_grade: false,
    has_course: false,
    is_profile_complete: false,
    role: null,
    selected_class_id: null,
    selected_course_id: null,
  };

  try {
    const res = await axios.get(`${BASE}/lms/users/${userId}/setup-status`);

    if (res.data?.success) {
      const d = res.data.data;
      // Normalize: backend may return 0/1 integers instead of true/false
      return {
        has_role:            !!d.has_role,
        has_grade:           !!d.has_grade,
        has_course:          !!d.has_course,
        is_profile_complete: !!d.is_profile_complete,
        role:                d.role ?? null,
        selected_class_id:   d.selected_class_id ?? null,
        selected_course_id:  d.selected_course_id ?? null,
      };
    }

    // success: false = new user with no LMS record yet
    console.warn(`[getSetupStatus] success:false for userId=${userId}`, res.data);
    return EMPTY;

  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 404 || status === 400) {
        // Expected — new user with no LMS record yet
        return EMPTY;
      }
      // Real error (500, timeout) — do NOT silently return EMPTY,
      // that would wrongly send a returning user back to profile setup
      console.error(`[getSetupStatus] HTTP ${status} for userId=${userId}`, err.response?.data);
    }
    throw err;
  }
};
/**
 * PUT /lms/users/:id/role
 * role: "learner" | "parent" | "both"
 */
export const setUserRole = async (
  userId: number,
  role: "learner" | "parent" | "both"
): Promise<void> => {
  const res = await axios.put(`${BASE}/lms/users/${userId}/role`, { role });
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to set role");
};

/**
 * PUT /lms/users/:id/grade-course
 * class_id is required, course_id is optional.
 * Sets is_profile_complete = 1 automatically.
 */
export const setGradeAndCourse = async (
  userId: number,
  classId: number | null,
  courseId?: number | null
): Promise<void> => {
  const body: any = {};
  if (classId)  body.class_id  = classId;
  if (courseId) body.course_id = courseId;
  const res = await axios.put(`${BASE}/lms/users/${userId}/grade-course`, body);
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to save grade/course");
};

// ─── Grades & Courses ─────────────────────────────────────────────────────────

/** GET /lms/classes */
export const getGrades = async (): Promise<Grade[]> => {
  const res = await axios.get(`${BASE}/lms/classes`);
  if (res.data?.success) return res.data.data as Grade[];
  throw new Error("Failed to fetch grades");
};

/** GET /lms/courses */
export const getCourses = async (): Promise<Course[]> => {
  const res = await axios.get(`${BASE}/lms/courses`);
  if (res.data?.success) return res.data.data as Course[];
  throw new Error("Failed to fetch courses");
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

/** GET /lms/dashboard/:id */
export const getDashboard = async (userId: number): Promise<DashboardData | null> => {
  try {
    const res = await axios.get(`${BASE}/lms/dashboard/${userId}`);
    if (res.data?.success) return res.data.data as DashboardData;
    return null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 404 || status === 400) {
        // New user — no LMS record yet, return null so ProfilePage shows empty form
        return null;
      }
    }
    throw err;
  }
};

// ─── Parent ──────────────────────────────────────────────────────────────────

/** POST /lms/parent/add-child */
export const addChild = async (payload: AddChildPayload): Promise<number> => {
  const res = await axios.post(`${BASE}/lms/parent/add-child`, payload);
  if (res.data?.success) return res.data.data.child_id as number;
  throw new Error(res.data?.message || "Failed to add child");
};

/** GET /lms/parent/:id/children */
export const getChildren = async (parentId: number): Promise<Child[]> => {
  const res = await axios.get(`${BASE}/lms/parent/${parentId}/children`);
  if (res.data?.success) return res.data.data as Child[];
  throw new Error("Failed to fetch children");
};

/** PUT /lms/parent/child/:childId */
export const updateChild = async (
  childId: number,
  parentId: number,
  payload: Partial<AddChildPayload>
): Promise<void> => {
  const res = await axios.put(`${BASE}/lms/parent/child/${childId}`, {
    parent_id: parentId,
    ...payload,
  });
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to update child");
};

/** DELETE /lms/parent/child/:childId */
export const removeChild = async (childId: number, parentId: number): Promise<void> => {
  const res = await axios.delete(`${BASE}/lms/parent/child/${childId}`, {
    data: { parent_id: parentId },
  });
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to remove child");
};

/** GET /lms/parent/child/:childId/dashboard */
export const getChildDashboard = async (childId: number): Promise<ChildDashboardData> => {
  const res = await axios.get(`${BASE}/lms/parent/child/${childId}/dashboard`);
  if (res.data?.success) return res.data.data as ChildDashboardData;
  throw new Error("Failed to fetch child dashboard");
};