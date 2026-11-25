import { useCallback, useEffect, useState } from "react";
import { getProfile } from "../services/profile.service.js";

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setError("");
    setReloadCount((count) => count + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const response = await getProfile();

        if (!isMounted) return;

        if (response.success) {
          setProfile(response.data);
          setError("");
        } else {
          setError(response.message || "Failed to load profile.");
        }
      } catch (err) {
        if (!isMounted) return;

        console.error("Public profile error:", err);

        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.code === "ECONNABORTED") {
          setError("Request timed out while connecting to the server.");
        } else {
          setError(
            "Unable to connect to the portfolio server. Please check your connection or try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [reloadCount]);

  return {
    profile,
    loading,
    error,
    refetch,
  };
};

export default useProfile;

