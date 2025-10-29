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
  if (!token) return [];
  
  const decoded = decodeJWT(token);
  if (!decoded) return [];
  
  // JWT might store roles in different claim names
  const rolesClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
    || decoded['role'] 
    || decoded['roles'];
  
  if (Array.isArray(rolesClaim)) {
    return rolesClaim;
  } else if (typeof rolesClaim === 'string') {
    return [rolesClaim];
  }
  
  return [];
}

/** Check if user has a specific role */
export function hasRole(token: string | null, role: string): boolean {
  const roles = getUserRoles(token);
  return roles.some(r => r.toLowerCase() === role.toLowerCase());
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

