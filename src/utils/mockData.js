// Generate 50,000+ products for testing
// Define tenant-brand map at the module level with logical brand assignments
const tenantBrandMap = {
  "amazon-store": ["Amazon Basics"],
  "apple-store": ["Apple"],
  "samsung-store": ["Samsung"],
  "nike-store": ["Nike", "Adidas"],
  "electronics-hub": ["Sony", "LG", "Logitech"],
};

export const generateMockProducts = (count = 50000) => {
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
    "Toys",
    "Beauty",
    "Sports",
  ];
  const brands = [
    "Amazon Basics",
    "Apple",
    "Samsung",
    "Nike",
    "Adidas",
    "Sony",
    "LG",
    "Logitech",
  ];

  // Real product images by category (using more stable URLs)
  const categoryImages = {
    Electronics: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop", // Macbook
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600&auto=format&fit=crop", // iPhone
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop", // TV
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop", // Headphones
      "https://images.unsplash.com/photo-1589256479046-8a7035f8d531?q=80&w=600&auto=format&fit=crop", // Smart speaker
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop", // Camera
    ],
    Clothing: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop", // T-shirt
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop", // Jeans
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop", // Jacket
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=600&auto=format&fit=crop", // Dress
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop", // Shoes
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600&auto=format&fit=crop", // Watch
    ],
    "Home & Kitchen": [
      "https://images.unsplash.com/photo-1555778586-061e5dee1102?q=80&w=600&auto=format&fit=crop", // Coffee Maker
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=600&auto=format&fit=crop", // Blender
      "https://images.unsplash.com/photo-1585659722983-4b711189717a?q=80&w=600&auto=format&fit=crop", // Toaster
      "https://images.unsplash.com/photo-1648064361917-3909c2c978bf?q=80&w=600&auto=format&fit=crop", // Air Fryer
      "https://images.unsplash.com/photo-1584029595455-c40a9d67d942?q=80&w=600&auto=format&fit=crop", // Cookware
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600&auto=format&fit=crop", // Vacuum
    ],
    Books: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop", // Fiction
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop", // Self-Help
      "https://images.unsplash.com/photo-1512045482940-f37f5216f639?q=80&w=600&auto=format&fit=crop", // Business
      "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=600&auto=format&fit=crop", // Biography
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop", // Science
      "https://images.unsplash.com/photo-1607478900766-efe13248b125?q=80&w=600&auto=format&fit=crop", // Cookbook
    ],
    Toys: [
      "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?q=80&w=600&auto=format&fit=crop", // LEGO
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=600&auto=format&fit=crop", // Action Figure
      "https://images.unsplash.com/photo-1637419450536-378d5457abb8?q=80&w=600&auto=format&fit=crop", // Board Game
      "https://images.unsplash.com/photo-1600218540075-71226a46a10d?q=80&w=600&auto=format&fit=crop", // Puzzle
      "https://images.unsplash.com/photo-1588927500490-4065e639a5b9?q=80&w=600&auto=format&fit=crop", // Stuffed Animal
      "https://images.unsplash.com/photo-1521405617584-1d9867aecad3?q=80&w=600&auto=format&fit=crop", // Drone
    ],
    Beauty: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop", // Skincare
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop", // Makeup
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop", // Hair Care
      "https://images.unsplash.com/photo-1590736969955-71cc94c3b5d6?q=80&w=600&auto=format&fit=crop", // Perfume
      "https://images.unsplash.com/photo-1594386470865-9910c9a56b05?q=80&w=600&auto=format&fit=crop", // Nail Care
      "https://images.unsplash.com/photo-1591375275624-fa9896ea82b7?q=80&w=600&auto=format&fit=crop", // Beauty Tool
    ],
    Sports: [
      "https://images.unsplash.com/photo-1593164842264-854604db2260?q=80&w=600&auto=format&fit=crop", // Yoga Mat
      "https://images.unsplash.com/photo-1590771998996-8589ec9b5ac6?q=80&w=600&auto=format&fit=crop", // Dumbbells
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=600&auto=format&fit=crop", // Basketball
      "https://images.unsplash.com/photo-1622279457486-28f280107458?q=80&w=600&auto=format&fit=crop", // Tennis Racket
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop", // Running Shoes
      "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?q=80&w=600&auto=format&fit=crop", // Fitness Tracker
    ],
  };

  return Array.from({ length: count }, (_, i) => {
    const id = `prod-${i + 1}`;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const price = parseFloat((Math.random() * 1000 + 5).toFixed(2));
    const rating = (Math.random() * 4 + 1).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 5000);
    const stock = Math.floor(Math.random() * 100);

    // Select a random image from the category's image array
    const categoryImagesArray = categoryImages[category];
    const mainImage =
      categoryImagesArray[
        Math.floor(Math.random() * categoryImagesArray.length)
      ];

    // Select 3 random images for the product gallery (might include duplicates for simplicity)
    const imageGallery = [
      categoryImagesArray[
        Math.floor(Math.random() * categoryImagesArray.length)
      ],
      categoryImagesArray[
        Math.floor(Math.random() * categoryImagesArray.length)
      ],
      categoryImagesArray[
        Math.floor(Math.random() * categoryImagesArray.length)
      ],
    ];

    return {
      id,
      name: `${brand} ${category} Product ${i + 1}`,
      description: `This is a high-quality ${category.toLowerCase()} product from ${brand} with premium features and design.`,
      price,
      originalPrice: price * (Math.random() < 0.7 ? 1.2 : 1),
      category,
      brand,
      rating: parseFloat(rating),
      reviewCount,
      image: mainImage,
      images: imageGallery,
      features: [
        "High-quality materials",
        "Durable construction",
        "Easy to use",
        "Perfect for everyday use",
      ],
      inventory: {
        productId: id,
        quantity: stock,
        reserved: Math.floor(Math.random() * 10),
        lowStockThreshold: 5,
      },
      isFeatured: Math.random() < 0.1, // 10% featured
      isPrime: Math.random() < 0.4, // 40% prime
      createdAt: new Date(
        Date.now() - Math.random() * 31536000000
      ).toISOString(), // Random date in last year
    };
  });
};

// Generate mock categories
export const generateMockCategories = () => {
  return [
    { id: "electronics", name: "Electronics", count: 12500 },
    { id: "clothing", name: "Clothing", count: 15000 },
    { id: "home-kitchen", name: "Home & Kitchen", count: 8000 },
    { id: "books", name: "Books", count: 5000 },
    { id: "toys", name: "Toys", count: 3000 },
    { id: "beauty", name: "Beauty", count: 4000 },
    { id: "sports", name: "Sports", count: 2500 },
  ];
};

// Generate mock tenants (sellers) - simplified and more accurate
export const generateMockTenants = () => {
  return [
    { id: "amazon-store", name: "Amazon Basics Store" },
    { id: "apple-store", name: "Apple Store" },
    { id: "samsung-store", name: "Samsung Electronics" },
    { id: "nike-store", name: "Nike & Adidas Sports" },
    { id: "electronics-hub", name: "Electronics Hub (Sony, LG, Logitech)" },
  ];
};

// Export tenantBrandMap to make it available to other modules
export { tenantBrandMap };
