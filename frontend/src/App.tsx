import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Login from "./components/login";
import Register from "./components/register";
import Header from "./components/header";
import Footer from "./components/footer";

import Home from "./components/user/home";
import News from "./components/user/news";
import About from "./components/user/about";
import Cart from "./components/user/cart";
import Product from "./components/user/product";
import Order from "./components/user/order";
import Profile from "./components/user/profile";

import Dashboard from "./components/admin/dashboard";
import AdminHome from "./components/admin/home";
import AdminOrder from "./components/admin/order";
import AdminProducts from "./components/admin/product";
import AdminReports from "./components/admin/report";
import AdminUsers from "./components/admin/user";
import AdminTables from "./components/admin/table";

import "./App.css";
import UserChatWidget from "./components/chat/UserChatWidget";

function AppContent() {
    const location = useLocation();

    const noHeaderFooterPaths = ["/login", "/register"];

    const hideHeaderFooter = noHeaderFooterPaths.includes(location.pathname);

    return (
        <div className="App">
            {!hideHeaderFooter && <Header />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Product />} />
                <Route path="/about" element={<About />} />
                <Route path="/news" element={<News />} />
                <Route path="/carts" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Order />} />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin */}
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/admin/dashborads" element={<Dashboard />} />
                <Route path="/admin/orders" element={<AdminOrder />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/tables" element={<AdminTables />} />
            </Routes>

            {!hideHeaderFooter && <Footer />}{!hideHeaderFooter && <UserChatWidget />}
            
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;