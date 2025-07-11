// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token"); // ✅ Check if token exists

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // ✅ Allow access if authenticated
}
