import { useState, useEffect } from "react";
import { Plus, Camera, Upload, Trash2, Edit, LogOut, CheckCircle, Download } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MobileImagePicker } from "./MobileImagePicker";
import { api } from "../utils/api";
import { formatRelativeTime, formatPrice } from "../utils/dateUtils";

interface Product {
  id: number;
  image: string;
  brand?: string;
  model?: string;
  datePosted: string;
  price?: string;
  category: 'wrist-watch' | 'wall-clock';
}

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'datePosted'>) => Promise<{ success: boolean; message?: string; error?: string }>;
  onDeleteProduct: (id: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  onLogout: () => void;
  isLoadingProducts?: boolean;
  isAddingProduct?: boolean;
  isDeletingProduct?: boolean;
}

export function AdminDashboard({ 
  products, 
  onAddProduct, 
  onDeleteProduct, 
  onLogout, 
  isLoadingProducts = false,
  isAddingProduct = false,
  isDeletingProduct = false 
}: AdminDashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newProduct, setNewProduct] = useState({
    image: "",
    brand: "",
    model: "",
    price: "",
    category: "wrist-watch" as 'wrist-watch' | 'wall-clock'
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingImage(true);
        setError("");
        
        // Try uploading to cloud storage first
        const response = await api.uploadImage(file);
        
        if (response.success && response.data?.imageUrl) {
          setNewProduct(prev => ({ ...prev, image: response.data.imageUrl }));
        } else {
          // If cloud upload fails, use local file as fallback for demo
          if (response.error?.includes('Supabase not configured') || response.error?.includes('Unable to connect')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setNewProduct(prev => ({ ...prev, image: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
            
            // Show info message about demo mode
            setError("Using local image (demo mode). Connect to Supabase for cloud storage.");
            setTimeout(() => setError(""), 5000);
          } else {
            setError(`Image upload failed: ${response.error}`);
          }
        }
      } catch (error) {
        setError(`Image upload error: ${error}`);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.image) {
      setError("");
      
      const result = await onAddProduct(newProduct);
      
      if (result.success) {
        setNewProduct({ image: "", brand: "", model: "", price: "", category: "wrist-watch" });
        setShowAddForm(false);
        
        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        setError(result.error || 'Failed to add product');
      }
    }
  };

  // Auto-hide success message after 4 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleExportData = () => {
    const dataToExport = {
      products: products,
      exportDate: new Date().toISOString(),
      totalProducts: products.length
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `soni-times-products-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900 mb-1">Admin Dashboard</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{products.length} total products</span>
              <span>•</span>
              <span>{products.filter(p => p.category === 'wrist-watch').length} watches</span>
              <span>•</span>
              <span>{products.filter(p => p.category === 'wall-clock').length} clocks</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {products.length > 0 && (
              <button
                onClick={handleExportData}
                className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                title="Export product data"
              >
                <Download size={20} />
              </button>
            )}
            <button
              onClick={onLogout}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 pb-24">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={18} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-green-800 font-medium">Product Added Successfully!</p>
              <p className="text-green-600 text-sm">Your product is now visible to all customers and ready for enquiries.</p>
            </div>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-green-600 hover:text-green-800 text-xl"
            >
              ×
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-lg">⚠</span>
            </div>
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800 text-xl"
            >
              ×
            </button>
          </div>
        )}

        {/* Add Product Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-2xl py-4 flex items-center justify-center gap-2 mb-6 transition-colors"
          >
            <Plus size={20} />
            <span>Add New Product</span>
          </button>
        )}

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <h3 className="text-lg text-gray-900 mb-4">Add New Product</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Product Image *</label>
                <MobileImagePicker
                  currentImage={newProduct.image}
                  onImageSelected={(imageData) => {
                    setNewProduct(prev => ({ ...prev, image: imageData }));
                  }}
                  disabled={isUploadingImage}
                />
                {newProduct.image && (
                  <button
                    type="button"
                    onClick={() => setNewProduct(prev => ({ ...prev, image: "" }))}
                    className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    <span>Remove Image</span>
                  </button>
                )}
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Brand Name</label>
                <input
                  type="text"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="e.g., Rolex, Seiko"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Model Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Model Name</label>
                <input
                  type="text"
                  value={newProduct.model}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="e.g., Submariner, Wall Clock Classic"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Category *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value as 'wrist-watch' | 'wall-clock' }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="wrist-watch">Wrist Watch</option>
                  <option value="wall-clock">Wall Clock</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Price</label>
                <input
                  type="text"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., ₹50,000, Contact for price"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={!newProduct.image || isAddingProduct}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl py-3 transition-colors text-center"
                >
                  {isAddingProduct ? 'Adding Product...' : 'Post Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-4">
          <h3 className="text-lg text-gray-900">Uploaded Products</h3>
          
          {products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No products uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <ImageWithFallback
                    src={product.image}
                    alt={`${product.brand} ${product.model}`.trim()}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        {product.brand && (
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {product.brand}
                          </p>
                        )}
                        <h4 className="text-gray-900">
                          {product.model || "Untitled Product"}
                        </h4>
                        <p className="text-xs text-blue-600 capitalize">{product.category.replace('-', ' ')}</p>
                        <p className="text-xs text-gray-400">{formatRelativeTime(product.datePosted)}</p>
                        {product.price && (
                          <p className="text-sm text-gray-600 mt-1">{formatPrice(product.price)}</p>
                        )}
                      </div>
                      
                      <button
                        onClick={async () => {
                          setError("");
                          const result = await onDeleteProduct(product.id);
                          if (!result.success) {
                            setError(result.error || 'Failed to delete product');
                          }
                        }}
                        disabled={isDeletingProduct}
                        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}