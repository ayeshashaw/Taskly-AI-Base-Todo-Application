import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTodos } from './context/TodoContext';

const ProtectedRoutes = ({ children }) => {
  const { user, authLoading } = useTodos();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
