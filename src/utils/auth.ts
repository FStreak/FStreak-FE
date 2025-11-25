/** Decode JWT token without verification (client-side only) */
export function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/** Get user roles from JWT token */
export function getUserRoles(token: string | null): string[] {
  if (!token) {
    console.warn('⚠️ getUserRoles: No token provided');
    return [];
  }
  
  const decoded = decodeJWT(token);
  if (!decoded) {
    console.warn('⚠️ getUserRoles: Failed to decode token');
    return [];
  }
  
  // Log decoded token for debugging
  console.log('🔍 getUserRoles: Decoded token payload:', decoded);
  console.log('🔍 getUserRoles: Token keys:', Object.keys(decoded));
  
  // JWT might store roles in different claim names
  // Check all possible claim names (case-insensitive)
  const rolesClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
    || decoded['role'] 
    || decoded['Role']
    || decoded['roles']
    || decoded['Roles']
    || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
  
  if (Array.isArray(rolesClaim)) {
    console.log('✅ Found roles array:', rolesClaim);
    return rolesClaim;
  } else if (typeof rolesClaim === 'string') {
    console.log('✅ Found role string:', rolesClaim);
    return [rolesClaim];
  }
  
  // Debug: Log all keys to help identify role claim
  console.warn('⚠️ No role claim found. Available keys:', Object.keys(decoded));
  console.warn('⚠️ Full decoded payload:', decoded);
  
  return [];
}

/** Check if user has a specific role */
export function hasRole(token: string | null, role: string): boolean {
  const roles = getUserRoles(token);
  return roles.some(r => r.toLowerCase() === role.toLowerCase());
}

/** Check if user is an admin - case-insensitive check for "admin" role */
export function isAdmin(token: string | null): boolean {
  if (!token) {
    console.warn('⚠️ isAdmin: No token provided');
    return false;
  }
  
  const roles = getUserRoles(token);
  console.log('🔍 isAdmin: Extracted roles from token:', roles);
  
  // Check if any role is "admin" (case-insensitive)
  const hasAdminRole = roles.some(r => r.toLowerCase() === 'admin');
  console.log('🔍 isAdmin: Has admin role from token?', hasAdminRole);
  
  // Also check from localStorage user object if available (fallback)
  if (!hasAdminRole) {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('🔍 isAdmin: Checking localStorage user:', user);
        if (user.roles && Array.isArray(user.roles)) {
          const hasAdminInLocalStorage = user.roles.some((r: string) => r.toLowerCase() === 'admin');
          console.log('🔍 isAdmin: Has admin role from localStorage?', hasAdminInLocalStorage);
          return hasAdminInLocalStorage;
        }
      }
    } catch (e) {
      console.error('❌ isAdmin: Error reading localStorage:', e);
    }
  }
  
  console.log('✅ isAdmin: Final result:', hasAdminRole);
  return hasAdminRole;
}

/** Check if user is a teacher */
export function isTeacher(token: string | null): boolean {
  return hasRole(token, 'Teacher');
}

/** Check if user is a student */
export function isStudent(token: string | null): boolean {
  return hasRole(token, 'Student');
}

/** Get user ID from JWT token */
export function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  // Try different possible claim names for user ID
  return (decoded['sub'] 
    || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    || decoded['nameid']  // ASP.NET Core JWT uses 'nameid'
    || decoded['userId'] 
    || decoded['id']) as string | null;
}

