// Analytics utility functions for GA4 and Meta Pixel

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// Google Analytics 4 Events
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = (action: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, params);
  }
};

// E-commerce specific events
export const trackViewItem = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
}) => {
  event("view_item", {
    currency: "DKK",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
      },
    ],
  });

  // Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "DKK",
    });
  }
};

export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity?: number;
}) => {
  event("add_to_cart", {
    currency: "DKK",
    value: product.price * (product.quantity || 1),
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
        quantity: product.quantity || 1,
      },
    ],
  });

  // Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price * (product.quantity || 1),
      currency: "DKK",
    });
  }
};

export const trackRemoveFromCart = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
}) => {
  event("remove_from_cart", {
    currency: "DKK",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
      },
    ],
  });
};

export const trackBeginCheckout = (items: Array<{
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}>, total: number) => {
  event("begin_checkout", {
    currency: "DKK",
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      item_category: item.category,
      quantity: item.quantity,
    })),
  });

  // Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      content_ids: items.map((item) => item.id),
      value: total,
      currency: "DKK",
      num_items: items.reduce((acc, item) => acc + item.quantity, 0),
    });
  }
};

export const trackPurchase = (
  transactionId: string,
  items: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
    quantity: number;
  }>,
  total: number
) => {
  event("purchase", {
    transaction_id: transactionId,
    currency: "DKK",
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      item_category: item.category,
      quantity: item.quantity,
    })),
  });

  // Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      content_ids: items.map((item) => item.id),
      content_type: "product",
      value: total,
      currency: "DKK",
      num_items: items.reduce((acc, item) => acc + item.quantity, 0),
    });
  }
};

export const trackSearch = (searchTerm: string) => {
  event("search", {
    search_term: searchTerm,
  });

  // Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Search", {
      search_string: searchTerm,
    });
  }
};

export const trackNewsletterSignup = (_email?: string) => {
  void _email;

  event("newsletter_signup", {
    method: "footer_form",
  });

  // Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", {
      content_name: "Newsletter Signup",
    });
  }
};
