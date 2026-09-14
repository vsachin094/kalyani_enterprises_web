import { Navigate, Outlet, useLocation } from 'react-router-dom';

function hasValidAdminToken() {
  const token = localStorage.getItem('ke-admin-token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem('ke-admin-token');
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem('ke-admin-token');
    return false;
  }
}

export default function ProtectedAdminRoute() {
  const location = useLocation();

  if (!hasValidAdminToken()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
