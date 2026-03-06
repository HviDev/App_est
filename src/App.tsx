import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from './components/layout/theme-provider'
import MainLayout from "./components/layout/MainLayour"
import Home from "@/modules/home/pages/Home"
import Login from "@/modules/auth/pages/Login"
import  Signup  from "@/modules/auth/pages/Signup"
import ProtectedRoute from './modules/auth/components/ProtectedRoute'
import { useEffect } from "react";
import { useAuthStore } from "@/modules/home/store/auth.store";


export function App() {
  const getCurrentUser = useAuthStore(state => state.getCurrentUser);

  
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
