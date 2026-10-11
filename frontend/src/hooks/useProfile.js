import { useEffect, useState } from "react";
import { getProfile } from "../services/profile.service.js";

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProfile();

        if (response.success) {
          setProfile(response.data);
        } else {
          setError(response.message || "Failed to load profile.");
        }
      } catch (error) {
        console.error("Public profile error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return {
    profile,
    loading,
    error,
  };
};

export default useProfile;

