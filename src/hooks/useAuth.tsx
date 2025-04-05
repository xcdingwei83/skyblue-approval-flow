
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface User {
  id: number;
  name: string;
  username: string;
  role: "admin" | "approver" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  checkPermissions: (requiredRole: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "登录失败");
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("登录成功");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "登录失败，请稍后再试");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info("已退出登录");
    navigate("/login");
  };

  const checkPermissions = (requiredRoles: string[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        checkPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock API handlers (to be replaced with actual API calls)
if (import.meta.env.DEV) {
  // This simulates an API endpoint for login
  window.addEventListener("fetch", (event: Event) => {
    const fetchEvent = event as unknown as { request: Request; respondWith: (response: Promise<Response>) => void };
    
    if (fetchEvent.request.url.endsWith("/api/login")) {
      const handle = async () => {
        // Parse the login data
        const body = await fetchEvent.request.clone().json();
        const { username, password } = body;

        // Mock users
        const users = [
          { id: 1, name: "管理员", username: "admin", password: "admin123", role: "admin" },
          { id: 2, name: "审批人", username: "approver", password: "approve123", role: "approver" },
          { id: 3, name: "普通用户", username: "user", password: "user123", role: "user" }
        ];

        // Find the user
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
          // Return user without password
          const { password, ...userWithoutPassword } = user;
          return new Response(JSON.stringify(userWithoutPassword), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } else {
          return new Response(JSON.stringify({ message: "用户名或密码错误" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
      };

      fetchEvent.respondWith(handle());
    }
  });
}
