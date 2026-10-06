interface UserAddress {
   recipientName?: string;
   phone?: string;
   street?: string;
   subdistrict?: string;
   district?: string;
   province?: string;
   postalCode?: string;
}

interface UserPreferences {
   categories: string[];
   favoriteBooks?: string[];
   onboardingCompleted: boolean;
   skipped?: boolean;
   preferencesUpdatedAt?: string;
   welcomeEmailSentAt?: string | null;
}

export interface User {
   id: string;
   name: string;
   email: string;
   avatar?: string;
   createdAt: string;
   phone?: string;
   bio?: string;
   address?: UserAddress;
   preferences?: UserPreferences;
}

export interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
   isLoading: boolean;
}

interface OrderItem {
   bookId: string;
   title: string;
   author: string;
   price: number;
   originalPrice?: number;
   cover: string;
   quantity: number;
   condition?: string;
}

export interface UserOrder {
   id: string;
   date: string;
   items: OrderItem[];
   subtotal: number;
   shippingFee: number;
   total: number;
   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
   trackingNumber?: string;
   shippingCarrier?: string;
   shippingAddress?: string;
   paymentMethod?: string;
}

export interface UserListedBook {
   id: string;
   title: string;
   author: string;
   price: number;
   originalPrice?: number;
   condition: string;
   category: string;
   cover: string;
   dateListed: string;
   status: 'active' | 'sold' | 'reserved' | 'paused' | 'pending' | 'rejected';
   views: number;
   defects?: string;
   story?: string;
   isbn?: string;
}
