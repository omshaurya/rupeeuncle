import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CalculatorsListPage from "./pages/CalculatorsListPage";
import CalculatorPage from "./pages/CalculatorPage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import AffiliateDisclosurePage from "./pages/AffiliateDisclosurePage";
import DmcaPolicyPage from "./pages/DmcaPolicyPage";
import ApiDocsPage from "./pages/ApiDocsPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminBlogListPage from "./pages/admin/AdminBlogListPage";
import AdminBlogEditorPage from "./pages/admin/AdminBlogEditorPage";
import AdminContactPage from "./pages/admin/AdminContactPage";

/**
 * Routes for financial dictionary, tools, and market pages are intentionally not yet
 * added — they'll be wired in as those modules are built. Calculators (56), Blog CMS,
 * legal pages, the developer API docs, and the admin blog panel are fully wired.
 *
 * Admin routes are OUTSIDE the public <Layout> (no public Header/Footer) and are guarded
 * client-side by AdminLayout's redirect-if-no-key check; real enforcement is server-side
 * in adminAuth.js regardless of what the frontend shows.
 */
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route path="blogs" element={<AdminBlogListPage />} />
          <Route path="blogs/new" element={<AdminBlogEditorPage />} />
          <Route path="blogs/:id/edit" element={<AdminBlogEditorPage />} />
          <Route path="contact" element={<AdminContactPage />} />
        </Route>

        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="calculators" element={<CalculatorsListPage />} />
          <Route path="calculators/:slug" element={<CalculatorPage />} />
          <Route path="blog" element={<BlogListPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="contact-us" element={<ContactUsPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="disclaimer" element={<DisclaimerPage />} />
          <Route path="cookie-policy" element={<CookiePolicyPage />} />
          <Route path="affiliate-disclosure" element={<AffiliateDisclosurePage />} />
          <Route path="dmca-policy" element={<DmcaPolicyPage />} />
          <Route path="api-docs" element={<ApiDocsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
