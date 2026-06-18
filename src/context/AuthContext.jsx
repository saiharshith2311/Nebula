import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

          // Get initial session
          const { data: { session } } = await client.auth.getSession();
          if (session && !mockSessionStr) {
            setUser(session.user);
          }

          // Listen for auth state changes
          const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
            console.log("Auth state changed:", event, !!session);
            if (session && !localStorage.getItem("mockSession")) {
              setUser(session.user);
            } else if (!session && !localStorage.getItem("mockSession")) {
              setUser(null);
            }
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
  }, []);

  const loginWithGoogle = async () => {
    if (!supabaseClient) {
      alert("Supabase client is not initialized.");
      return;
    }
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/index.html?view=portal",
      },
    });
    if (error) {
      console.error("Google sign in failed:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem("mockSession");
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setUser(null);
    window.location.href = "/";
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
