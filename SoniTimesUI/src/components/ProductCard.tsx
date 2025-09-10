import { ImageWithFallback } from "./figma/ImageWithFallback";
import { formatRelativeTime, formatPrice } from "../utils/dateUtils";

interface ProductCardProps {
  id: number;
  image: string;
  brand?: string;
  model?: string;
  datePosted: string;
  price?: string;
  onClick?: () => void;
}

export function ProductCard({ 
  id, 
  image, 
  brand, 
  model, 
  datePosted, 
  price,
  onClick 
}: ProductCardProps) {

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={`${brand} ${model}`.trim() || "Product"}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        {brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {brand}
          </p>
        )}
        {model && (
          <h3 className="text-gray-900 mb-2 line-clamp-2">
            {model}
          </h3>
        )}
        {price && (
          <p className="text-gray-900 mb-2">
            {formatPrice(price)}
          </p>
        )}
        <p className="text-xs text-gray-400">
          {formatRelativeTime(datePosted)}
        </p>
      </div>
    </div>
  );
}