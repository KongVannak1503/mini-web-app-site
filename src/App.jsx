import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/default/Dashboard';
import ProductPage from './pages/product/ProductPage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './hooks/ProtectedRoute';
import CategoryPage from './pages/category/CategoryPage';
import UserPage from './pages/User/UserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/settings/user" element={<UserPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
