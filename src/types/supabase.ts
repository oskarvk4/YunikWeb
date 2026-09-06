export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          price: number;
          currency: string;
          category: string;
          metal: "gold" | "silver";
          ring_size: number | null;
          description: string | null;
          materials: string | null;
          images: string[];
          featured: boolean;
          new_arrival: boolean;
          one_of_one: boolean;
          stock_quantity: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          price: number;
          currency?: string;
          category: string;
          metal?: "gold" | "silver";
          ring_size?: number | null;
          description?: string | null;
          materials?: string | null;
          images?: string[];
          featured?: boolean;
          new_arrival?: boolean;
          one_of_one?: boolean;
          stock_quantity?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          price?: number;
          currency?: string;
          category?: string;
          metal?: "gold" | "silver";
          ring_size?: number | null;
          description?: string | null;
          materials?: string | null;
          images?: string[];
          featured?: boolean;
          new_arrival?: boolean;
          one_of_one?: boolean;
          stock_quantity?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          stripe_session_id: string | null;
          customer_email: string;
          items: Json;
          total_amount: number;
          currency: string;
          shipping_address: Json | null;
          billing_address: Json | null;
          shipping_option: string | null;
          pickup_point_id: string | null;
          pickup_point: Json | null;
          status: string;
          fulfillment_status: string;
          carrier: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          shipped_at: string | null;
          needs_attention: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          stripe_session_id?: string | null;
          customer_email: string;
          items: Json;
          total_amount: number;
          currency?: string;
          shipping_address?: Json | null;
          billing_address?: Json | null;
          shipping_option?: string | null;
          pickup_point_id?: string | null;
          pickup_point?: Json | null;
          status?: string;
          fulfillment_status?: string;
          carrier?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          shipped_at?: string | null;
          needs_attention?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          stripe_session_id?: string | null;
          customer_email?: string;
          items?: Json;
          total_amount?: number;
          currency?: string;
          shipping_address?: Json | null;
          billing_address?: Json | null;
          shipping_option?: string | null;
          pickup_point_id?: string | null;
          pickup_point?: Json | null;
          status?: string;
          fulfillment_status?: string;
          carrier?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          shipped_at?: string | null;
          needs_attention?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_copy: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          key?: string;
          value?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      early_access_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string;
          notified_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string;
          notified_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string;
          notified_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      /**
       * Atomic inventory decrement, clamped at zero. Returns null when no
       * product matched, otherwise the stock left and how many units were sold
       * beyond what existed (0 in the normal case).
       */
      decrement_product_stock: {
        Args: { p_product_id: string; p_quantity: number };
        Returns: { remaining: number; shortfall: number } | null;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper types
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type DbProduct = Database["public"]["Tables"]["products"]["Row"];
