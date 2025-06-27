import { useAuth } from "@/context/AuthContext";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === "(drawer)";
    const isPublicRoute = segments[0] === "login" || segments[0] === "register";

    if (!user && inAuthGroup) {
      router.replace("/login");
    } else if (user && isPublicRoute) {
      router.replace("/(drawer)");
    }
  }, [user, isInitialized, segments]);

  return children;
};

export default AuthRedirect;
