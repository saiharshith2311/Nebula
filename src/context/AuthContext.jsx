import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function initAuth() {
      try {
        const res = await fetch("/api/config");
        const config = await res.json();
        
        // Setup mock session override if present
        const mockSessionStr = localStorage.getItem("mockSession");
        if (mockSessionStr) {
          try {
            const mockUser = JSON.parse(mockSessionStr);
            setUser(mockUser);
          } catch (e) {
            console.error("Failed to parse mock session", e);
          }
        }

        const supabaseLib = window.Supabase || window.supabase;
        if (supabaseLib && config.supabaseUrl && config.supabaseAnonKey) {
          const client = supabaseLib.createClient(config.supabaseUrl, config.supabaseAnonKey);
          setSupabaseClient(client);

          // Domain validation helper
          const checkEmailAndSetUser = async (session, clientInstance, isInitial = false, event = "") => {
            if (session && !localStorage.getItem("mockSession")) {
              const email = session.user?.email || "";
              if (!email.endsWith("iitm.ac.in")) {
                console.warn("Unauthorized domain login attempt:", email);
                addToast("Use IIT Madras email only!", "error", 5000);
                await clientInstance.auth.signOut();
                setUser(null);
                return false;
              }
              setUser(session.user);
              if (!isInitial && event === "SIGNED_IN") {
                if (sessionStorage.getItem("explicitLoginPending") === "true") {
                  addToast("Logged in successfully!", "success");
                  sessionStorage.removeItem("explicitLoginPending");
                }
              }
              return true;
            } else if (!session && !localStorage.getItem("mockSession")) {
              setUser(null);
              return false;
            }
            return true;
          };

          // Get initial session
          const { data: { session } } = await client.auth.getSession();
          if (session && !mockSessionStr) {
            await checkEmailAndSetUser(session, client, true);
          }

          // Listen for auth state changes
          const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", event, !!session);
            await checkEmailAndSetUser(session, client, false, event);
          });

          return () => {
            subscription.unsubscribe();
          };
        } else {
          console.warn("Supabase library not loaded or configuration missing.");
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [addToast]);

  const loginWithGoogle = async () => {
    if (!supabaseClient) {
      const mockUser = {
        id: "demo-local",
        email: "demo@smail.iitm.ac.in",
        user_metadata: {
          full_name: "Demo Student",
          avatar_url: "",
        },
      };
      localStorage.setItem("mockSession", JSON.stringify(mockUser));
      setUser(mockUser);
      addToast("Logged in locally (Supabase is not configured).", "success");
      return;
    }
    sessionStorage.setItem("explicitLoginPending", "true"); // Track explicit login attempt
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/index.html?view=portal",
      },
    });
    if (error) {
      console.error("Google sign in failed:", error.message);
      addToast(`Login failed: ${error.message}`, "error");
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem("mockSession");
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (err) {
        console.error("Error signing out from Supabase:", err);
      }
    }
    setUser(null);
    addToast("Logged out successfully.", "info");
    // Small delay to let the toast display before hard-redirect
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  const value = {
    supabaseClient,
    user,
    loading,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
