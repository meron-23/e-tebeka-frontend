"use client";

export interface SessionUser {
  id?: string;
  email?: string;
  full_name?: string;
  tier?: string;
  status?: string;
  is_admin?: boolean;
  verification_status?: string;
  profile?: {
    verification_status?: string;
  };
}

export const SESSION_TOKEN_KEY = "token";
export const SESSION_USER_KEY = "user";
export const SESSION_CHANGED_EVENT = "etebeka:session-changed";

export function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(SESSION_TOKEN_KEY);
}

export function getStoredUser(): SessionUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(SESSION_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    localStorage.removeItem(SESSION_USER_KEY);
    return null;
  }
}

export function dispatchSessionChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
  }
}

export function persistSession(token: string, user: SessionUser) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  dispatchSessionChanged();
}

export function updateStoredUser(user: SessionUser) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  dispatchSessionChanged();
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_USER_KEY);
  dispatchSessionChanged();
}

export function getStudentApprovalStatus(user: SessionUser | null) {
  return user?.profile?.verification_status ?? user?.verification_status ?? user?.status ?? "";
}

export function isApprovedStudent(user: SessionUser | null) {
  if (!user || user.tier !== "B") {
    return true;
  }

  const approvalStatus = getStudentApprovalStatus(user).toLowerCase();
  return approvalStatus === "verified" || approvalStatus === "approved" || approvalStatus === "active";
}

export function getDashboardPath(user: SessionUser | null) {
  if (!user) {
    return "/login";
  }

  if (user.is_admin) {
    return "/admin";
  }

  if (user.tier === "A") {
    return "/dashboard/lawyer";
  }

  if (user.tier === "B") {
    return "/dashboard/student";
  }

  return "/dashboard/general";
}

export function getUserRoleLabel(user: SessionUser | null) {
  if (!user) {
    return "Guest";
  }

  if (user.is_admin) {
    return "Admin";
  }

  if (user.tier === "A") {
    return "Lawyer";
  }

  if (user.tier === "B") {
    return "Student";
  }

  return "Public";
}

export function getWelcomeName(user: SessionUser | null) {
  if (!user) {
    return "";
  }

  const fullName = user.full_name?.trim();
  if (fullName) {
    // Extract first name from full name
    const firstName = fullName.split(" ")[0];
    return firstName;
  }

  return user.email?.split("@")[0] ?? "User";
}

export function canAccessPath(pathname: string, user: SessionUser | null) {
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/dashboard")) {
    return true;
  }

  if (!user) {
    return false;
  }

  if (pathname.startsWith("/admin")) {
    return Boolean(user.is_admin);
  }

  if (pathname.startsWith("/dashboard/student")) {
    return user.tier === "B" && isApprovedStudent(user);
  }

  if (pathname.startsWith("/dashboard/lawyer")) {
    return user.tier === "A";
  }

  if (pathname.startsWith("/dashboard/general")) {
    return user.tier === "C";
  }

  return true;
}
