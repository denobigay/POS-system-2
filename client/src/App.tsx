import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/pages/Dashboard";
import Products from "./components/pages/Products";
import Users from "./components/pages/Users";
import Roles from "./components/pages/role/Roles";
import POS from "./components/pages/POS";
import Login from "./components/pages/Login";
import FeedbackForm from "./components/pages/FeedbackForm";
import FeedbackSuccess from "./components/pages/FeedbackSuccess";
import FeedbackList from "./components/pages/FeedbackList";
import PublicFeedback from "./pages/PublicFeedback";
import {
  Route,
  Routes,
  Link,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./style/sidebar.css";
import Orders from "./components/pages/Orders";
import ReceiptView from "./components/pages/ReceiptView";
import LoadingScreen from "./components/LoadingScreen";
import { ToastContainer } from "react-toastify";

// Sidebar specific imports (moved from Sidebar.tsx)
import { BiSolidDashboard } from "react-icons/bi";
import { FaStore } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { FaCashRegister } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { MdFeedback } from "react-icons/md";
import logo from "./assets/logo.png";
import logoSnack from "./assets/SnackHub v2.png";

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer />
    </AuthProvider>
  );
}

// New Layout component to handle authenticated layout
const AuthenticatedLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const allMenuItems = [
    {
      title: "Dashboard",
      icon: <BiSolidDashboard className="me-2" />,
      path: "/dashboard", // Absolute path for sidebar links
    },
    { title: "Roles", icon: <FaUserGear className="me-2" />, path: "/roles" },
    { title: "Users", icon: <FaUser className="me-2" />, path: "/users" },
    {
      title: "Products",
      icon: <FaStore className="me-2" />,
      path: "/products",
    },
    {
      title: "POS",
      icon: <FaCashRegister className="me-2" />,
      path: "/pos",
    },
    {
      title: "Feedbacks",
      icon: <MdFeedback className="me-2" />,
      path: "/feedbacks",
    },
  ];

  const menuItems = allMenuItems.filter((menuItem) => {
    if (!user?.role?.role_name) {
      const defaultVisibleItems = ["Dashboard", "POS"];
      return defaultVisibleItems.includes(menuItem.title);
    }

    const roleName = user.role.role_name;

    const roleAccess = {
      Admin: ["Dashboard", "Roles", "Users", "Products", "POS", "Feedbacks"],
      Cashier: ["Dashboard", "POS"],
      Manager: ["Dashboard", "Products", "POS", "Feedbacks"],
    };

    const allowedItems = roleAccess[roleName as keyof typeof roleAccess] || [];

    return allowedItems.includes(menuItem.title);
  });

  return (
    <div className="app-body d-flex">
      <div className="logo sidebar fixed-sidebar d-flex flex-column p-3 text-white">
        <img src={logoSnack} alt="SnackHub Logo" className="logo2" />
        <img src={logo} alt="Logo" className="logo" />
        <ul className="nav nav-pills flex-column mb-auto">
          {menuItems.map((menuItem, index) => (
            <li className="nav-item mb-2" key={index}>
              <Link
                to={menuItem.path}
                className={`nav-link text-white ${
                  location.pathname === menuItem.path ? "active" : ""
                }`}
              >
                {menuItem.icon}
                {menuItem.title}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="btn btn-outline-light mt-auto d-flex align-items-center"
          onClick={logout}
          style={{ border: "none", background: "none", color: "#fff" }}
        >
          <FiLogOut className="me-2" /> Logout
        </button>
      </div>
      <main className="main-content flex-grow-1">
        <Outlet /> {/* Renders the matched child route */}
      </main>
    </div>
  );
};

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // List of public routes
  const publicRoutes = [
    "/login",
    "/public-feedback",
  ];
  const isFeedbackRoute = /^\/feedback(\/.*)?$/.test(location.pathname);
  const isPublic = publicRoutes.includes(location.pathname) || isFeedbackRoute;

  console.log("AppContent: isAuthenticated", isAuthenticated, "loading", loading, "location", location.pathname);

  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isPublic && loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-layout">
      <Routes>
        {/* Public Routes - explicitly defined and always accessible */}
        <Route path="/login" element={<Login />} />
        <Route path="/feedback/:orderId" element={<FeedbackForm />} />
        <Route path="/feedback-success" element={<FeedbackSuccess />} />
        <Route path="/public-feedback" element={<PublicFeedback />} />

        {/* Catch-all route that handles authentication for all other paths */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <AuthenticatedLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* Nested Protected Routes under AuthenticatedLayout */}
          <Route index element={<Dashboard />} />{" "}
          {/* Default route for / when authenticated */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="roles"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Roles />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="products"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route path="pos" element={<POS />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId/receipt" element={<ReceiptView />} />
          <Route
            path="feedbacks"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <FeedbackList />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="dashboard" replace />} />{" "}
          {/* Catch-all for any other authenticated paths */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
