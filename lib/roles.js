// lib/roles.js

export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
};

export const ROLE_HIERARCHY = {
  [ROLES.OWNER]: 4,
  [ROLES.ADMIN]: 3,
  [ROLES.TEACHER]: 2,
  [ROLES.STUDENT]: 1,
};

export const OWNER_UID = "fSJ0jUBCONXGJA7H41ChRq2ERLs1";
export const OWNER_EMAIL = "m.tufailkhan12335@gmail.com";

/**
 * Determine effective role of a user record.
 */
export function getEffectiveRole(user) {
  if (!user) return ROLES.STUDENT;

  // Master owner overrides
  if (
    user.uid === OWNER_UID ||
    user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
  ) {
    return ROLES.OWNER;
  }

  const roleStr = String(user.role || user.accountType || "").toLowerCase();
  if (roleStr === ROLES.OWNER) return ROLES.OWNER;
  if (roleStr === ROLES.ADMIN || user.isAdmin === true) return ROLES.ADMIN;
  if (roleStr === ROLES.TEACHER || user.isTeacher === true) return ROLES.TEACHER;

  return ROLES.STUDENT;
}

/**
 * Check if active role satisfies required role level.
 */
export function isAtLeastRole(userRole, requiredRole) {
  const activeLevel = ROLE_HIERARCHY[userRole] || 1;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 1;
  return activeLevel >= requiredLevel;
}

/**
 * Helper permission checks
 */
export function canManageStaff(user) {
  return getEffectiveRole(user) === ROLES.OWNER;
}

export function canDownloadBackups(user) {
  return getEffectiveRole(user) === ROLES.OWNER;
}

export function canManageLectures(user) {
  return isAtLeastRole(getEffectiveRole(user), ROLES.ADMIN);
}

export function canPostAnnouncements(user) {
  return isAtLeastRole(getEffectiveRole(user), ROLES.ADMIN);
}

export function canReviewAssignments(user) {
  return isAtLeastRole(getEffectiveRole(user), ROLES.TEACHER);
}

export function canReplyQuestions(user) {
  return isAtLeastRole(getEffectiveRole(user), ROLES.TEACHER);
}
