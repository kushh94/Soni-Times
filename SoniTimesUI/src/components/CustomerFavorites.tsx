import { ProductCard } from "./ProductCard";

interface Product {
  id: number;
  image: string;
  brand?: string;
  model?: string;
  datePosted: string;
  category: 'wrist-watch' | 'wall-clock';
}

interface CustomerFavoritesProps {
  products: Product[];
  likedProducts: Set<number>;
  onToggleLike: (id: number) => void;
  onProductClick: (product: Product) => void;
  isLoading?: boolean;
}

export function CustomerFavorites({ products, likedProducts, onToggleLike, onProductClick, isLoading = false }: CustomerFavoritesProps) {
  const favoriteProducts = products.filter(product => likedProducts.has(product.id));

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <h1 className="text-2xl text-gray-900 mb-1">Saved Items</h1>
        <p className="text-sm text-gray-500">
          {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Favorites Grid */}
      <div className="p-6 pb-24">
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isLiked={true}
                onToggleLike={onToggleLike}
                onClick={() => onProductClick(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">♡</span>
            </div>
            <h3 className="text-lg text-gray-900 mb-2">No saved items yet</h3>
            <p className="text-gray-500">Start exploring to save items you love</p>
          </div>
        )}
      </div>
    </div>
  );
}