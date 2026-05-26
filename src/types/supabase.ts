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
          description: string | null;
          materials: string | null;
          images: string[];
          featured: boolean;
          new_arrival: boolean;
          one_of_one: boolean;
          stock_quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          slug: string;
          name: string;
          price: number;
          currency?: string;
          category: string;
          metal?: "gold" | "silver";
          description?: string | null;
          materials?: string | null;
          images?: string[];
          featured?: boolean;
          new_arrival?: boolean;
          one_of_one?: boolean;
          stock_quantity?: number;
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
          description?: string | null;
          materials?: string | null;
          images?: string[];
          featured?: boolean;
          new_arrival?: boolean;
          one_of_one?: boolean;
          stock_quantity?: number;
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
          status: string;
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
          status?: string;
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
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
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
