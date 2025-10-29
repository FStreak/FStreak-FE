/** Debug utility to test JWT decoding - only for development */
import { decodeJWT, getUserRoles, isTeacher, getUserIdFromToken } from './auth';

export function debugToken(token: string) {
  console.group('🔍 JWT Debug Info');
  
  // Decode full JWT
  const decoded = decodeJWT(token);
  console.log('Full decoded JWT:', decoded);
  
  // Get roles
  const roles = getUserRoles(token);
  console.log('Extracted roles:', roles);
  
  // Check if teacher
  const isTeacherRole = isTeacher(token);
  console.log('Is Teacher?', isTeacherRole);
  
  // Get user ID
  const userId = getUserIdFromToken(token);
  console.log('User ID:', userId);
  
  console.groupEnd();
  
  return {
    decoded,
    roles,
    isTeacher: isTeacherRole,
    userId,
  };
}

// For browser console debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugToken;
}



