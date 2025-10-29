"use client";

import { useEffect, useState } from "react";
import { useTokenInfoStorage } from "@/store/authStore";
import { decodeJWT, getUserRoles, isTeacher, getUserIdFromToken } from "@/utils/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DebugAuthPage() {
  const { token, userId, refreshToken } = useTokenInfoStorage();
  const [decodedToken, setDecodedToken] = useState<Record<string, unknown> | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [extractedUserId, setExtractedUserId] = useState<string | null>(null);
  const [isTeacherRole, setIsTeacherRole] = useState(false);

  useEffect(() => {
    if (token) {
      setDecodedToken(decodeJWT(token));
      setRoles(getUserRoles(token));
      setExtractedUserId(getUserIdFromToken(token));
      setIsTeacherRole(isTeacher(token));
    }
  }, [token]);

  const clearAuth = () => {
    const { clear } = useTokenInfoStorage.getState();
    clear();
    localStorage.clear();
    window.location.reload();
  };

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This page is only available in development mode</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            🔍 Auth Debug Console
          </h1>
          <Button variant="destructive" onClick={clearAuth}>
            Clear Auth & Reload
          </Button>
        </div>

        {/* Token Status */}
        <Card>
          <CardHeader>
            <CardTitle>Token Status</CardTitle>
            <CardDescription>Current authentication state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="font-semibold">Has Token:</span>
              <span className={token ? "text-green-600" : "text-red-600"}>
                {token ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="font-semibold">Is Teacher:</span>
              <span className={isTeacherRole ? "text-green-600" : "text-gray-600"}>
                {isTeacherRole ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="font-semibold">User ID (Store):</span>
              <span className="font-mono text-sm">{userId || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="font-semibold">User ID (Extracted):</span>
              <span className="font-mono text-sm">{extractedUserId || "N/A"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card>
          <CardHeader>
            <CardTitle>Roles Detected</CardTitle>
            <CardDescription>Roles extracted from JWT token</CardDescription>
          </CardHeader>
          <CardContent>
            {roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {roles.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No roles found</p>
            )}
          </CardContent>
        </Card>

        {/* Decoded Token */}
        <Card>
          <CardHeader>
            <CardTitle>Decoded JWT Token</CardTitle>
            <CardDescription>Raw token claims and payload</CardDescription>
          </CardHeader>
          <CardContent>
            {decodedToken ? (
              <pre className="p-4 bg-muted rounded-lg overflow-auto max-h-96 text-xs">
                {JSON.stringify(decodedToken, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground">No token to decode</p>
            )}
          </CardContent>
        </Card>

        {/* Raw Token */}
        <Card>
          <CardHeader>
            <CardTitle>Raw Tokens</CardTitle>
            <CardDescription>Access and refresh tokens (truncated for security)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold mb-1">Access Token:</p>
              <p className="font-mono text-xs break-all p-2 bg-muted rounded">
                {token ? `${token.substring(0, 50)}...${token.substring(token.length - 20)}` : "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Refresh Token:</p>
              <p className="font-mono text-xs break-all p-2 bg-muted rounded">
                {refreshToken ? `${refreshToken.substring(0, 30)}...` : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* localStorage Data */}
        <Card>
          <CardHeader>
            <CardTitle>LocalStorage Data</CardTitle>
            <CardDescription>User data stored in localStorage</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-lg overflow-auto max-h-96 text-xs">
              {typeof window !== 'undefined' && localStorage.getItem('user')
                ? JSON.stringify(JSON.parse(localStorage.getItem('user')!), null, 2)
                : "No user data in localStorage"}
            </pre>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={() => window.location.href = "/login"}>
            Go to Login
          </Button>
          <Button onClick={() => window.location.href = "/teacher"} variant="secondary">
            Go to Teacher Page
          </Button>
          <Button onClick={() => window.location.href = "/dashboard"} variant="outline">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}



