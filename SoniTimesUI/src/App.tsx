import { useState, useEffect } from "react";
import { CustomerHome } from "./components/CustomerHome";
import { CustomerProfile } from "./components/CustomerProfile";
import { ProductDetail } from "./components/ProductDetail";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { ContactSupport } from "./components/ContactSupport";
import { BottomNavigation } from "./components/BottomNavigation";
import { api } from "./utils/api";
import { supabase } from "./utils/supabase/client";

interface Product {
  id: number;
  image: string;
  brand?: string;
  model?: string;
  datePosted: string;
  price?: string;
  category: 'wrist-watch' | 'wall-clock';
}

type Screen = 'home' | 'profile' | 'product-detail' | 'admin-login' | 'admin-dashboard' | 'contact-support';

export default function App() {
  // PWA state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  
  // Loading states
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // Check PWA installation status and handle deep links
  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone;
    setIsInstalled(isStandalone);

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Handle PWA deep links
    const params = (window as any).pwaParams;
    if (params) {
      if (params.category) {
        // Handle category filter deep link
        setCurrentScreen('home');
        setActiveTab('home');
        // The category filter will be handled by CustomerHome component
      } else if (params.screen === 'contact') {
        setCurrentScreen('contact-support');
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Products state - now loaded from cloud
  const [products, setProducts] = useState<Product[]>([]);

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load products from cloud on app start
  useEffect(() => {
    loadProductsFromCloud();
  }, []);

  // Default/fallback products for when cloud is not available
  const fallbackProducts: Product[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1664437235473-65aaf8912d20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMHRpbWVwaWVjZXxlbnwxfHx8fDE3NTcyNDM2NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      brand: "Omega",
      model: "Speedmaster Professional",
      datePosted: "3 days ago",
      price: "₹4,50,000",
      category: "wrist-watch"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1752986722286-cf4974d6c376?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YWxsJTIwY2xvY2t8ZW58MXx8fHwxNzU3MjUxNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      brand: "Seiko",
      model: "Modern Wall Clock",
      datePosted: "1 week ago",
      price: "₹15,000",
      category: "wall-clock"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1667375565651-b660b574d1a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwd3Jpc3R3YXRjaHxlbnwxfHx8fDE3NTcyNTE1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      brand: "Tag Heuer",
      model: "Carrera Calibre",
      datePosted: "5 days ago",
      price: "₹2,80,000",
      category: "wrist-watch"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1730757679771-b53e798846cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwd2F0Y2glMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc1NzI1MTU1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      brand: "Rolex",
      model: "Datejust Collection",
      datePosted: "2 days ago",
      price: "Contact for price",
      category: "wrist-watch"
    }
  ];

  const loadProductsFromCloud = async () => {
    try {
      setIsLoadingProducts(true);
      console.log('Loading products from cloud...');
      const response = await api.getProducts();
      
      if (response.success && response.data) {
        setProducts(response.data);
        setIsCloudConnected(true);
        console.log(`Loaded ${response.data.length} products from cloud`);
      } else {
        console.error('Failed to load products from cloud:', response.error);
        // Use fallback products when cloud is not available
        console.log('Using fallback products...');
        setProducts(fallbackProducts);
        setIsCloudConnected(false);
      }
    } catch (error) {
      console.error('Error loading products from cloud:', error);
      // Use fallback products when there's an error
      console.log('Using fallback products due to error...');
      setProducts(fallbackProducts);
      setIsCloudConnected(false);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleTabChange = (tab: 'home' | 'profile' | 'admin') => {
    setActiveTab(tab);
    if (tab === 'admin') {
      setCurrentScreen('admin-dashboard');
    } else {
      setCurrentScreen(tab);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('product-detail');
  };

  const handleBackFromDetail = () => {
    setCurrentScreen(activeTab);
    setSelectedProduct(null);
  };

  const handleAdminLogin = () => {
    setCurrentScreen('admin-login');
  };

  const handleAdminLoginSuccess = (accessToken: string) => {
    // Store the access token for API requests
    localStorage.setItem('supabase_auth_token', accessToken);
    setIsAdmin(true);
    setActiveTab('admin');
    setCurrentScreen('admin-dashboard');
  };

  const handleAdminLogout = async () => {
    // Clear auth token and sign out from Supabase
    localStorage.removeItem('supabase_auth_token');
    await supabase.auth.signOut();
    setIsAdmin(false);
    setActiveTab('home');
    setCurrentScreen('home');
  };

  const handleBackFromLogin = () => {
    setCurrentScreen('profile');
  };

  const handleContactSupport = () => {
    setCurrentScreen('contact-support');
  };

  const handleBackFromContact = () => {
    setCurrentScreen('profile');
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id' | 'datePosted'>) => {
    try {
      setIsAddingProduct(true);
      console.log('Adding product to cloud...', newProduct);
      
      const response = await api.addProduct(newProduct);
      
      if (response.success && response.data) {
        // Add the new product to the local state
        setProducts(prev => [response.data, ...prev]);
        console.log('Product added successfully:', response.data);
        return { success: true, message: response.message };
      } else {
        console.error('Failed to add product:', response.error);
        
        // If cloud is not available, add locally for demo purposes
        if (response.error?.includes('Supabase not configured') || response.error?.includes('Unable to connect')) {
          const localProduct: Product = {
            ...newProduct,
            id: Date.now(),
            datePosted: new Date().toISOString()
          };
          setProducts(prev => [localProduct, ...prev]);
          return { 
            success: true, 
            message: 'Product added locally (demo mode). Connect to Supabase for cross-device sync.' 
          };
        }
        
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, error: `Failed to add product: ${error}` };
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      setIsDeletingProduct(true);
      console.log('Deleting product from cloud...', id);
      
      const response = await api.deleteProduct(id);
      
      if (response.success) {
        // Remove the product from local state
        setProducts(prev => prev.filter(p => p.id !== id));
        
        console.log('Product deleted successfully');
        return { success: true, message: response.message };
      } else {
        console.error('Failed to delete product:', response.error);
        
        // If cloud is not available, delete locally for demo purposes
        if (response.error?.includes('Supabase not configured') || response.error?.includes('Unable to connect')) {
          setProducts(prev => prev.filter(p => p.id !== id));
          return { 
            success: true, 
            message: 'Product deleted locally (demo mode). Connect to Supabase for cross-device sync.' 
          };
        }
        
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: `Failed to delete product: ${error}` };
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <CustomerHome
            products={products}
            onProductClick={handleProductClick}
            isLoading={isLoadingProducts}
          />
        );
      case 'profile':
        return <CustomerProfile onAdminLogin={handleAdminLogin} onContactSupport={handleContactSupport} />;
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackFromDetail}
          />
        ) : null;
      case 'admin-login':
        return (
          <AdminLogin
            onLogin={handleAdminLoginSuccess}
            onBack={handleBackFromLogin}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboard
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onLogout={handleAdminLogout}
            isLoadingProducts={isLoadingProducts}
            isAddingProduct={isAddingProduct}
            isDeletingProduct={isDeletingProduct}
          />
        );
      case 'contact-support':
        return <ContactSupport onBack={handleBackFromContact} />;
      default:
        return null;
    }
  };

  const showBottomNav = !['product-detail', 'admin-login', 'contact-support'].includes(currentScreen);

  return (
    <div className="h-screen bg-white flex flex-col max-w-md mx-auto border-x border-gray-200 relative">
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 z-50">
          <span className="text-sm">You're offline. Some features may be limited.</span>
        </div>
      )}
      
      {/* Cloud Connection Status */}
      {isOnline && !isCloudConnected && !isLoadingProducts && (
        <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-50">
          <span className="text-sm">Demo mode - Products are local only. Supabase server not available.</span>
        </div>
      )}
      
      {/* Main Content */}
      <div className={(!isOnline || (!isCloudConnected && !isLoadingProducts)) ? 'pt-12' : ''}>
        {renderScreen()}
      </div>
      
      {showBottomNav && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}