"use client";

import { useEffect, useState } from "react";
import { privateApiService } from "@/services/ApiPrivate";
import type { UserProfile } from "@/model/authModel/authDataType";

export const useUserProfile = () => {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await privateApiService.getMyProfile();
      setData(res);
      return res;
    } catch (e) {
      console.error("useUserProfile: fetchProfile error", e);
      setError("Không thể tải hồ sơ người dùng");
      setData(null);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (!mounted) return;
    fetchProfile().catch(() => {
      /* handled in fetchProfile */
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error, refetch: fetchProfile };
};

export default useUserProfile;


