import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import Connect from './pages/user/Connect';
import PrivateRoute from './components/PrivateRoute';
import SuccessPage from './pages/user/SuccessPage';
import CreatePost from './pages/user/CreatePost';
import SidebarLayout from './components/layouts/SidebarLayout';
import Dashboard from './pages/user/Dashboard';
import Planner from './pages/user/Planner';
import Analytics from './pages/user/Analytics';
import InstagramCallback from './components/InstagramCallback';
import Error404 from './pages/user/error404';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/404" element={<Error404 />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/connect" element={<Connect />} />
                    <Route
                        path="/connect/instagram/callback"
                        element={<InstagramCallback />}
                    />
                    <Route path="/success" element={<SuccessPage />} />

                    <Route element={<SidebarLayout />}>
                        <Route path='/create' element={<CreatePost />} />
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/planner' element={<Planner />} />
                        <Route path='/analytics' element={<Analytics />} />
                    </Route>
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </Router>
    );
};

export default App;