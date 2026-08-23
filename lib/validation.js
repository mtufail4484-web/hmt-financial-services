/**
 * Validation utilities for HMT Student Portal
 * Prevents invalid data entry and security issues
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Validate password strength
 * Requirements: Minimum 8 characters, at least 1 uppercase letter, at least 1 number
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z)");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number (0-9)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone (10+ digits)
 */
export const validatePhone = (phone) => {
  const digitsOnly = String(phone).replace(/\D/g, "");
  return digitsOnly.length >= 10;
};

/**
 * Validate name format
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid name (3+ characters)
 */
export const validateName = (name) => {
  return String(name).trim().length >= 3;
};

/**
 * Validate date of birth (must be reasonable age)
 * @param {string} dobString - Date string (ISO format or any parseable format)
 * @returns {boolean} - True if valid (at least 10 years old, not future date)
 */
export const validateDateOfBirth = (dobString) => {
  if (!dobString) return false;

  const dob = new Date(dobString);
  if (Number.isNaN(dob.getTime())) return false;

  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 10;
  }

  return age >= 10;
};

/**
 * Validate registration form data
 * Comprehensive validation for all fields
 * @param {object} formData - Form data to validate
 * @returns {object} - { isValid: boolean, errors: object with field errors }
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  // Email validation
  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Full name validation
  if (!validateName(formData.fullName)) {
    errors.fullName = "Name must be at least 3 characters long";
  }

  // Father name validation
  if (!validateName(formData.fatherName)) {
    errors.fatherName = "Father's name must be at least 3 characters long";
  }

  // Phone validation
  if (!validatePhone(formData.phone)) {
    errors.phone = "Please enter a valid phone number (10+ digits)";
  }

  // City validation
  if (!formData.city || formData.city.trim().length < 2) {
    errors.city = "Please select or enter a valid city";
  }

  // Date of birth validation
  if (formData.dob && !validateDateOfBirth(formData.dob)) {
    errors.dob = "You must be at least 10 years old to register";
  }

  // Education validation
  if (!formData.education || formData.education.trim().length === 0) {
    errors.education = "Please select your education level";
  }

  // Password validation
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors.join("; ");
  }

  // Password confirmation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize user input to prevent XSS attacks
 * Removes dangerous HTML/script tags
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
export const sanitizeInput = (text) => {
  if (typeof text !== "string") return "";

  // Remove script tags and their content
  let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

  // Escape HTML special characters
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  sanitized = sanitized.replace(/[&<>"']/g, (char) => map[char]);

  return sanitized;
};

/**
 * Get password strength indicator
 * @param {string} password - Password to check
 * @returns {object} - { strength: 'weak'|'medium'|'strong', percentage: number }
 */
export const getPasswordStrength = (password) => {
  let strength = 0;
  const maxStrength = 4;

  if (password && password.length >= 8) strength++;
  if (password && password.length >= 12) strength++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;

  const strengthMap = {
    0: { strength: "weak", percentage: 0 },
    1: { strength: "weak", percentage: 25 },
    2: { strength: "medium", percentage: 50 },
    3: { strength: "strong", percentage: 75 },
    4: { strength: "strong", percentage: 100 },
  };

  return strengthMap[strength];
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateDateOfBirth,
  validateRegistrationForm,
  sanitizeInput,
  getPasswordStrength,
};
