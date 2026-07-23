import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import NotFound from '@/pages/not-found';

import Home from './pages/storefront/Home';
import Products from './pages/storefront/Products';
import ProductDetail from './pages/storefront/ProductDetail';
import Collections from './pages/storefront/Collections';
import CollectionDetail from './pages/storefront/CollectionDetail';
import Blog from './pages/storefront/Blog';
import Cart from './pages/storefront/Cart';
import Checkout from './pages/storefront/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AccountDashboard from './pages/account/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/ProductsList';
import AdminProductForm from './pages/admin/ProductForm';
import AdminOrders from './pages/admin/OrdersList';

import Wishlist from './pages/storefront/Wishlist';
import GiftCards from './pages/storefront/GiftCards';
import About from './pages/info/About';
import Contact from './pages/info/Contact';
import Faq from './pages/info/Faq';
import Shipping from './pages/info/Shipping';
import Returns from './pages/info/Returns';
import SizeGuide from './pages/info/SizeGuide';
import TrackOrder from './pages/info/TrackOrder';
import Stores from './pages/info/Stores';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 min
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      {/* Shop */}
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/collections" component={Collections} />
      <Route path="/collections/:slug" component={CollectionDetail} />

      {/* Journal */}
      <Route path="/blog" component={Blog} />

      {/* Cart & Checkout */}
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/gift-cards" component={GiftCards} />

      {/* Auth */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Account */}
      <Route path="/account" component={AccountDashboard} />

      {/* Admin */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/products/new" component={AdminProductForm} />
      <Route path="/admin/orders" component={AdminOrders} />

      {/* Info pages */}
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={Faq} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/returns" component={Returns} />
      <Route path="/size-guide" component={SizeGuide} />
      <Route path="/track" component={TrackOrder} />
      <Route path="/stores" component={Stores} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Loading screen — shows on initial page load, fades out after 1.6s */}
          <LoadingScreen />

          <ErrorBoundary>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
          </ErrorBoundary>

          <Toaster />

          {/* Global overlays — outside the router so they persist across navigation */}
          <ExitIntentPopup />
          <WhatsAppButton />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
