export function formatRelativeTime(datePosted: string): string {
  // If the datePosted is already a relative time string (for fallback products), return as is
  if (datePosted.includes('ago') || datePosted.includes('Just now') || datePosted.includes('week') || datePosted.includes('day')) {
    return datePosted;
  }

  try {
    // Try to parse as ISO date string (from server)
    const postDate = new Date(datePosted);
    const now = new Date();
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else if (diffInWeeks < 5) {
      return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
    } else {
      return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
    }
  } catch (error) {
    console.warn('Failed to parse date:', datePosted, error);
    return datePosted; // Return original if parsing fails
  }
}

export function formatPrice(price: string): string {
  // If price already contains rupee symbol, return as is
  if (price.includes('₹')) {
    return price;
  }
  
  // Handle special cases
  if (price.toLowerCase().includes('contact') || price.toLowerCase().includes('price')) {
    return price; // Don't add ₹ to "Contact for price" etc.
  }
  
  // Check if price is a number or contains currency symbols
  const cleanPrice = price.replace(/[₹$€£,]/g, '').trim();
  if (!isNaN(Number(cleanPrice)) && cleanPrice !== '') {
    // It's a number, add rupee symbol
    return `₹${price}`;
  }
  
  // If it's already formatted or contains text, return as is
  return price;
}