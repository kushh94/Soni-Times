/**
 * Soni Times App Constants
 * 
 * This file contains all app-wide constants including contact information,
 * store details, and other configuration values.
 */

// Contact Information
export const CONTACT_INFO = {
  // Main contact number for WhatsApp and calls
  PHONE_NUMBER: '9825548898',
  
  // Formatted phone number with country code for WhatsApp links
  WHATSAPP_NUMBER: '+919825548898',
  
  // Owner details
  OWNER_NAME: 'Hitesh Soni',
  OWNER_TITLE: 'Owner',
  OWNER_INITIALS: 'HS',
  
  // Store information
  STORE_NAME: 'Soni Times',
  STORE_ADDRESS: {
    line1: 'Gayatrinagar Main Road,',
    line2: 'Near Bhaktinagar Circle,',
    city: 'Rajkot'
  },
  
  // Store hours
  STORE_HOURS: {
    weekdays: '10:00 AM - 9:00 PM',
    weekend: '11:00 AM - 3:00 PM',
    weekdaysLabel: 'Monday - Saturday',
    weekendLabel: 'Sunday'
  },
  
  // Google Maps link for store location
  STORE_LOCATION_URL: 'https://share.google/rOextLnrzqYxEPuVN'
};

// App Information
export const APP_INFO = {
  NAME: 'Soni Times',
  VERSION: '1.0.0',
  DESCRIPTION: 'Premium watches and wall clocks'
};

// WhatsApp Message Templates
export const WHATSAPP_TEMPLATES = {
  PRODUCT_ENQUIRY: (productDetails: {
    image: string;
    name: string;
    category: string;
    price: string;
    postedTime: string;
  }) => `🕐 *PRODUCT ENQUIRY *

📸 *Product Image:* ${productDetails.image}

🏷️ *Product Details:*
• Name: ${productDetails.name}
• Category: ${productDetails.category}
• Price: ${productDetails.price}
• Posted: ${productDetails.postedTime}

💬 *Message:*
Hi! I'm interested in this ${productDetails.category.toLowerCase()}. Could you please provide more details about:
- Availability
- Best pricing

Looking forward to your response! 

Thank you,
Customer via Soni Times App`,

  GENERAL_INQUIRY: () => `🕐 *GENERAL INQUIRY - SONI TIMES*

Hello ${CONTACT_INFO.OWNER_NAME}!

I need assistance with the Soni Times app. Please help me with:
• General product information
• Store policies and services  
• Technical support
• Any other queries

Thank you for your time!

Best regards,
Customer via Soni Times App`
};