import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import HomePage from "./customer/pages/homepage/HomePage";
import Footer from "./customer/footer/Footer";
import Product from "./customer/Product/Product";
import ProductDetails from "./customer/ProductDetails/ProductDetails";
import Cart from "./customer/Cart/Cart";
import CheckOut from "./customer/Checkout/CheckOut";
import Order from "./customer/Order/Order";
import OrderDetails from "./customer/Order/OrderDetails";
import LoginComponent from "./customer/Login/LoginComponent";
import Header from "./customer/Navigation/Header";
import DesignCanvas from "./customer/customization/DesignCanvas";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./customer/Profile/ProfilePage";
import PrivateRoute from "./routes/PrivateRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import About from "./customer/pages/About/About";
import ShippingInfo from "./customer/pages/Shipping_FAQ/ShippingInfo";
import RAE from "./customer/pages/RAE/RAE";
import SizeGuide from "./customer/pages/SizeGuide/SizeGuide";

function App() {
  console.log("App rendering");
  return (
    <>
      <BrowserRouter>
        <GoogleOAuthProvider clientId="your-oauth-client-id">
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginComponent />} />
                  <Route path="/signup" element={<LoginComponent />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/shipping" element={<ShippingInfo />} />
                  <Route path="/returns" element={<RAE />} />
                  <Route path="/size-guide" element={<SizeGuide />} />
                  <Route path="/products" element={<Product />} />
                  <Route path="/products/:category" element={<Product />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route
                    path="/customize/:id"
                    element={
                      <PrivateRoute>
                        <DesignCanvas />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <PrivateRoute>
                        <Cart />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <PrivateRoute>
                        <CheckOut />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <PrivateRoute>
                        <Order />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/orders/:id/:itemIndex"
                    element={
                      <PrivateRoute>
                        <OrderDetails />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/account/profile"
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </AuthProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
