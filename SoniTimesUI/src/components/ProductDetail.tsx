import { useState } from "react";
import { ArrowLeft, MessageCircle, Minus, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { formatRelativeTime, formatPrice } from "../utils/dateUtils";
import { CONTACT_INFO, WHATSAPP_TEMPLATES } from "../utils/constants";

interface Product {
  id: number;
  image: string;
  brand?: string;
  model?: string;
  datePosted: string;
  price?: string;
  category: 'wrist-watch' | 'wall-clock';
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 1));
  
  const handleWhatsAppEnquiry = () => {
    // Create a comprehensive enquiry message with product details
    const productName = `${product.brand || ''} ${product.model || ''}`.trim() || 'Timepiece';
    const categoryName = product.category === 'wrist-watch' ? 'Wrist Watch' : 'Wall Clock';
    const priceInfo = product.price ? formatPrice(product.price) : 'Please provide pricing';
    
    const message = encodeURIComponent(WHATSAPP_TEMPLATES.PRODUCT_ENQUIRY({
      image: product.image,
      name: productName,
      category: categoryName,
      price: priceInfo,
      postedTime: formatRelativeTime(product.datePosted)
    }));

    window.open(`https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        
        <h1 className="text-lg text-gray-900">Product Details</h1>
        
        <div className="w-10 h-10"></div>
      </div>

      {/* Product Image */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        <div 
          className="absolute inset-0 flex items-center justify-center p-4 transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <ImageWithFallback
            src={product.image}
            alt={`${product.brand} ${product.model}`.trim() || "Product"}
            className="w-full h-full object-contain rounded-lg shadow-lg"
          />
        </div>
        
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col bg-white/90 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden z-10">
          <button
            onClick={handleZoomIn}
            className="p-3 hover:bg-gray-100 transition-colors border-b border-gray-200"
            disabled={zoomLevel >= 2.5}
          >
            <Plus size={18} className={zoomLevel >= 2.5 ? "text-gray-400" : "text-gray-700"} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-3 hover:bg-gray-100 transition-colors"
            disabled={zoomLevel <= 1}
          >
            <Minus size={18} className={zoomLevel <= 1 ? "text-gray-400" : "text-gray-700"} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 space-y-6">
        <div>
          {product.brand && (
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              {product.brand}
            </p>
          )}
          {product.model && (
            <h2 className="text-xl text-gray-900 mb-3">
              {product.model}
            </h2>
          )}
          {product.price && (
            <p className="text-lg text-gray-900 mb-3">
              {formatPrice(product.price)}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Posted {formatRelativeTime(product.datePosted)}
          </p>
        </div>

        {/* WhatsApp Enquiry Button */}
        <div className="space-y-3">
          <button
            onClick={handleWhatsAppEnquiry}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle size={20} />
            <span className="font-medium">Enquire via WhatsApp</span>
          </button>
          
          <p className="text-xs text-center text-gray-500 px-4">
            📱 Get instant response with product details, pricing, and availability
          </p>
        </div>
      </div>
    </div>
  );
}