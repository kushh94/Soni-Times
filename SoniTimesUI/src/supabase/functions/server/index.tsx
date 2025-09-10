import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS and logging
app.use('*', cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Create storage bucket for product images
const initializeStorage = async () => {
  const bucketName = 'make-5f14f8f9-product-images';
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880 // 5MB limit
      });
      if (error) {
        console.error('Failed to create storage bucket:', error);
      } else {
        console.log('Storage bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Initialize storage on startup
initializeStorage();

// Product interface
interface Product {
  id: number;
  image: string;
  brand?: string;
  model?: string;
  datePosted: string;
  price?: string;
  category: 'wrist-watch' | 'wall-clock';
}

// Default products for initial setup
const defaultProducts: Product[] = [
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

// Initialize default products if not exists
const initializeProducts = async () => {
  try {
    const existingProducts = await kv.get('soniTimes_products');
    if (!existingProducts) {
      await kv.set('soniTimes_products', defaultProducts);
      console.log('Default products initialized');
    }
  } catch (error) {
    console.error('Error initializing products:', error);
  }
};

// Initialize products on startup
initializeProducts();

// Admin authentication helper
const authenticateAdmin = async (request: Request) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { authorized: false, error: 'No authorization token provided' };
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      return { authorized: false, error: 'Invalid or expired token' };
    }
    
    return { authorized: true, userId: user.id };
  } catch (error) {
    return { authorized: false, error: `Authentication error: ${error}` };
  }
};

// Routes

// Get all products (public)
app.get('/make-server-5f14f8f9/products', async (c) => {
  try {
    const products = await kv.get('soniTimes_products') || [];
    return c.json({ 
      success: true, 
      data: products,
      count: products.length 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ 
      success: false, 
      error: `Failed to fetch products: ${error}` 
    }, 500);
  }
});

// Add a new product (admin only)
app.post('/make-server-5f14f8f9/products', async (c) => {
  try {
    const auth = await authenticateAdmin(c.req.raw);
    if (!auth.authorized) {
      return c.json({ 
        success: false, 
        error: `Unauthorized: ${auth.error}` 
      }, 401);
    }

    const body = await c.req.json();
    const { brand, model, price, category, image } = body;

    // Validate required fields
    if (!category || !['wrist-watch', 'wall-clock'].includes(category)) {
      return c.json({ 
        success: false, 
        error: 'Valid category is required (wrist-watch or wall-clock)' 
      }, 400);
    }

    if (!image) {
      return c.json({ 
        success: false, 
        error: 'Product image is required' 
      }, 400);
    }

    // Create new product
    const newProduct: Product = {
      id: Date.now(),
      image,
      brand: brand || undefined,
      model: model || undefined,
      price: price || undefined,
      category,
      datePosted: new Date().toISOString()
    };

    // Get existing products and add new one
    const existingProducts = await kv.get('soniTimes_products') || [];
    const updatedProducts = [newProduct, ...existingProducts];
    
    // Save to database
    await kv.set('soniTimes_products', updatedProducts);

    return c.json({ 
      success: true, 
      data: newProduct,
      message: 'Product added successfully' 
    });

  } catch (error) {
    console.error('Error adding product:', error);
    return c.json({ 
      success: false, 
      error: `Failed to add product: ${error}` 
    }, 500);
  }
});

// Delete a product (admin only)
app.delete('/make-server-5f14f8f9/products/:id', async (c) => {
  try {
    const auth = await authenticateAdmin(c.req.raw);
    if (!auth.authorized) {
      return c.json({ 
        success: false, 
        error: `Unauthorized: ${auth.error}` 
      }, 401);
    }

    const productId = parseInt(c.req.param('id'));
    if (isNaN(productId)) {
      return c.json({ 
        success: false, 
        error: 'Invalid product ID' 
      }, 400);
    }

    // Get existing products
    const existingProducts = await kv.get('soniTimes_products') || [];
    
    // Find and remove the product
    const productIndex = existingProducts.findIndex((p: Product) => p.id === productId);
    if (productIndex === -1) {
      return c.json({ 
        success: false, 
        error: 'Product not found' 
      }, 404);
    }

    const updatedProducts = existingProducts.filter((p: Product) => p.id !== productId);
    
    // Save updated products
    await kv.set('soniTimes_products', updatedProducts);

    return c.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ 
      success: false, 
      error: `Failed to delete product: ${error}` 
    }, 500);
  }
});

// Admin signup
app.post('/make-server-5f14f8f9/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || 'Admin' },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      return c.json({ 
        success: false, 
        error: `Signup failed: ${error.message}` 
      }, 400);
    }

    return c.json({ 
      success: true, 
      data: { user: data.user },
      message: 'Admin account created successfully' 
    });

  } catch (error) {
    console.error('Error during admin signup:', error);
    return c.json({ 
      success: false, 
      error: `Signup error: ${error}` 
    }, 500);
  }
});

// Upload image for product
app.post('/make-server-5f14f8f9/upload-image', async (c) => {
  try {
    const auth = await authenticateAdmin(c.req.raw);
    if (!auth.authorized) {
      return c.json({ 
        success: false, 
        error: `Unauthorized: ${auth.error}` 
      }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return c.json({ 
        success: false, 
        error: 'No image file provided' 
      }, 400);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ 
        success: false, 
        error: 'File must be an image' 
      }, 400);
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `product_${Date.now()}.${fileExtension}`;
    
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('make-5f14f8f9-product-images')
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return c.json({ 
        success: false, 
        error: `Image upload failed: ${error.message}` 
      }, 500);
    }

    // Create signed URL for the uploaded image
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('make-5f14f8f9-product-images')
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry

    if (signedUrlError) {
      console.error('Signed URL error:', signedUrlError);
      return c.json({ 
        success: false, 
        error: `Failed to generate image URL: ${signedUrlError.message}` 
      }, 500);
    }

    return c.json({ 
      success: true, 
      data: { 
        imageUrl: signedUrlData.signedUrl,
        fileName: fileName 
      },
      message: 'Image uploaded successfully' 
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return c.json({ 
      success: false, 
      error: `Image upload error: ${error}` 
    }, 500);
  }
});

// Health check
app.get('/make-server-5f14f8f9/health', (c) => {
  return c.json({ 
    success: true, 
    message: 'Soni Times server is running',
    timestamp: new Date().toISOString() 
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ 
    success: false, 
    error: 'Endpoint not found' 
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ 
    success: false, 
    error: 'Internal server error' 
  }, 500);
});

console.log('Soni Times server starting...');
Deno.serve(app.fetch);