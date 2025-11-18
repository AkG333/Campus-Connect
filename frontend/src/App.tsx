import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QuestionProvider } from './contexts/QuestionContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AskQuestionPage from './pages/AskQuestionPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <QuestionProvider>
        <Routes>
          <Route element={
            <Layout>
              <Outlet />
            </Layout>
          }>
            <Route path="/" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="ask"
              element={
                <ProtectedRoute>
                  <AskQuestionPage />
                </ProtectedRoute>
              }
            />
            <Route path="questions/:id" element={<QuestionDetailPage />} />
            <Route path="users/:id" element={<UserProfilePage />} />
          </Route>
        </Routes>
        </QuestionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;