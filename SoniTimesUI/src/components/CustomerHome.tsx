import { useState } from "react";
import { Grid2X2, Square, Watch, Clock } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: number;
  image: string;
  brand?: string;
  model?: string;
  datePosted: string;
  price?: string;
  category: 'wrist-watch' | 'wall-clock';
}

interface CustomerHomeProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  isLoading?: boolean;
}

export function CustomerHome({ products, onProductClick, isLoading = false }: CustomerHomeProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [filterCategory, setFilterCategory] = useState<'all' | 'wrist-watch' | 'wall-clock'>('all');

  const filteredProducts = products.filter(product => 
    filterCategory === 'all' || product.category === filterCategory
  );

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl text-gray-900 mb-1">Soni Times</h1>
            <p className="text-sm text-gray-500">Premium Timepieces</p>
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Grid2X2 size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'single' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Square size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1 mt-4">
          <button
            onClick={() => setFilterCategory('all')}
            className={`flex-1 py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2 ${
              filterCategory === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="text-sm">All Items</span>
          </button>
          <button
            onClick={() => setFilterCategory('wrist-watch')}
            className={`flex-1 py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2 ${
              filterCategory === 'wrist-watch' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Watch size={14} />
            <span className="text-sm">Wrist Watches</span>
          </button>
          <button
            onClick={() => setFilterCategory('wall-clock')}
            className={`flex-1 py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2 ${
              filterCategory === 'wall-clock' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Clock size={14} />
            <span className="text-sm">Wall Clocks</span>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-6 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Watch size={24} className="text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {filterCategory === 'all' 
                ? 'No products available at the moment.' 
                : `No ${filterCategory.replace('-', ' ')}s available.`
              }
            </p>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-2 gap-4' 
              : 'space-y-6'
          }`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={viewMode === 'single' ? 'max-w-sm mx-auto' : ''}>
                <ProductCard
                  {...product}
                  onClick={() => onProductClick(product)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}