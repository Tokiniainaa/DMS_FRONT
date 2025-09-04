// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function ProtectedRoute({ children }) {
  const access = localStorage.getItem(ACCESS_TOKEN);
  const refresh = localStorage.getItem(REFRESH_TOKEN);

  // Si aucun token → pas connecté
  if (!access || !refresh) {
    return <Navigate to="/login" />;
  }

  // Si les tokens existent, on laisse passer.
  // Si jamais le access token est expiré, l'interceptor dans api.js gérera le refresh automatiquement.
  return children;
}

export default ProtectedRoute;
