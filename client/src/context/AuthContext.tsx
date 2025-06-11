import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import axios from "../AxiosInstance";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingScreen from "../components/LoadingScreen";

interface User {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: {
    role_id: number;
    role_name: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isPublicRoute(path: string) {
  return (
    path === "/login" ||
    path === "/public-feedback" ||
    /^\/feedback(\/.*)?$/.test(path)
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing token and user data on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("AuthProvider: initializeAuth running");
      const token = localStorage.getItem("token");
      const savedUserString = localStorage.getItem("user");
      console.log("AuthProvider: token in localStorage", token);
      console.log("AuthProvider: user in localStorage", savedUserString);
      let currentUser: User | null = null; // Temporary variable to hold the user data

      console.log("Auth Init - Token:", token ? "exists" : "missing");
      console.log("Auth Init - Saved User String:", savedUserString);

      if (token && savedUserString) {
        try {
          const savedUser = JSON.parse(savedUserString);

          // Validate saved user data from localStorage before using it
          if (savedUser && savedUser.role && savedUser.role.role_name) {
            currentUser = savedUser; // Use saved user if complete
            setUser(currentUser); // Immediately update UI if localStorage has full data
            console.log(
              "AuthContext - setUser (from localStorage complete). Role:",
              currentUser?.role?.role_name
            );
          } else {
            console.log(
              "Auth Init: Saved user in localStorage is incomplete. Waiting for API verification."
            );
          }

          // Set the token in axios headers regardless of saved user completeness
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          console.log("Calling /api/user with header:", axios.defaults.headers.common["Authorization"]);

          // Verify token by fetching user data from the API
          const response = await axios.get("/api/user");
          console.log("AuthProvider: /api/user response", response.data);
          const userData = response.data;
          console.log("Auth Init - User Data (from API):", userData);

          // Validate user data from API, especially the role
          if (
            !userData ||
            !userData.user_id ||
            !userData.role ||
            !userData.role.role_name
          ) {
            console.error(
              "Auth Init Error: User data from API is incomplete or missing role information.",
              userData
            );
            throw new Error("Incomplete user data from API."); // Trigger catch block to clear auth
          }

          // Update state with API data if different or if localStorage was incomplete
          // Ensure currentUser is not null for comparison, otherwise treat as a new valid user.
          if (
            JSON.stringify(userData) !== JSON.stringify(currentUser ?? {})
          ) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData)); // Update localStorage with verified data
            console.log(
              "AuthContext - setUser (from API verified). Role:",
              userData.role.role_name
            );
          } else {
            console.log(
              "AuthContext - User data from API is same as current or localStorage. No update needed."
            );
          }
        } catch (error: unknown) {
          console.error("AuthProvider: /api/user error", error);
          // Check if the error is an Axios error and has a response status
          if (isAxiosError(error) && error.response) {
            console.error(
              "Auth Init Error Response Status:",
              error.response.status
            );
            if (
              error.response.status === 401 ||
              error.response.status === 403
            ) {
              console.error(
                "Auth Init: Token invalid or unauthorized. Clearing authentication data."
              );
            }
          }
          // If token is invalid or API call fails, clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
          if (!isPublicRoute(window.location.pathname)) {
            navigate("/login");
          }
        } finally {
          console.log("AuthContext: About to set loading to false");
          setLoading(false);
          console.log("AuthContext: Set loading to false");
        }
      } else {
        // No token found, redirect to login if not already there
        if (!isPublicRoute(window.location.pathname)) {
          navigate("/login");
        }
        console.log("AuthProvider: No token/user, setting loading to false for public route or login");
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("AuthContext - Login: Attempting CSRF cookie fetch.");
      await axios.get("/sanctum/csrf-cookie");
      console.log("AuthContext - Login: CSRF cookie fetched. Sending login request.");
      const response = await axios.post("/api/login", { email, password });
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Set Authorization header:", axios.defaults.headers.common["Authorization"]);

      setUser(user);
      console.log("AuthContext - setUser (login). Role:", user.role?.role_name || "N/A");
      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (error: unknown) {
      const errorMessage =
        (isAxiosError(error) && error.response?.data?.message) ||
        (error as Error).message;
      console.error("AuthContext - Login error:", errorMessage, error);
      toast.error(
        errorMessage || "Login failed. Please check your credentials."
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("AuthContext - Logout: Attempting API logout.");
      await axios.post("/api/logout");
      // Clear all auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      navigate("/login");
      toast.success("Logged out successfully!");
      console.log("AuthContext - Logout: Successful.");
    } catch (error: unknown) {
      const errorMessage =
        (isAxiosError(error) && error.response?.data?.message) ||
        (error as Error).message;
      console.error("AuthContext - Logout error:", errorMessage, error);
      // Even if the API call fails, clear local data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      navigate("/login");
      toast.error("Error logging out");
    }
  };

  if (loading) {
    console.log("AuthContext: Rendering LoadingScreen.");
    return <LoadingScreen />;
  }

  console.log(
    "AuthContext: Rendering children. User role:",
    user?.role?.role_name || "N/A",
    "isAuthenticated:",
    !!user
  );

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
