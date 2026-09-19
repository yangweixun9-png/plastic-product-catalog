import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { LanguageProvider } from "./context/LanguageContext"
import { AuthProvider } from "./context/AuthContext"
import { CatalogProvider } from "./context/CatalogContext"
import { QuoteCartProvider } from "./context/QuoteCartContext"
import CustomerLayout from "./components/layout/CustomerLayout"
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetail from "./pages/ProductDetail"
import Categories from "./pages/Categories"
import NewProducts from "./pages/NewProducts"
import About from "./pages/About"
import Contact from "./pages/Contact"
import QuotePage from "./pages/Quote"
import AdminRoute from "./components/auth/AdminRoute"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminLogin from "./pages/admin/AdminLogin"
import Dashboard from "./pages/admin/Dashboard"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminProductEdit from "./pages/admin/AdminProductEdit"
import AdminCategories from "./pages/admin/AdminCategories"
import AdminInquiries from "./pages/admin/AdminInquiries"
import AdminCustomers from "./pages/admin/AdminCustomers"
import AdminImport from "./pages/admin/AdminImport"
import AdminSettings from "./pages/admin/AdminSettings"
import ScrollToTop from "./components/layout/ScrollToTop"

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CatalogProvider>
          <QuoteCartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:sku" element={<ProductDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/new" element={<NewProducts />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/quote" element={<QuotePage />} />
                </Route>

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductEdit />} />
                  <Route path="products/:id/edit" element={<AdminProductEdit />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="inquiries" element={<AdminInquiries />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="import" element={<AdminImport />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </QuoteCartProvider>
        </CatalogProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
