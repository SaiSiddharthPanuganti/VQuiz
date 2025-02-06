import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // If still loading, you might want to show a loading spinner
  if (loading) {
    return null; // or a loading spinner component
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If user is a teacher trying to access student dashboard or vice versa
  if (currentUser.role === 'teacher' && window.location.pathname === '/dashboard') {
    return <Navigate to="/teacher-dashboard" />;
  }
  if (currentUser.role === 'student' && window.location.pathname === '/teacher-dashboard') {
    return <Navigate to="/dashboard" />;
  }

  // If authenticated and correct role, render the protected component
  return children;
}

export default PrivateRoute; 