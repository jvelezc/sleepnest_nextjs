export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          created_at?: string | null;
        };
      };
      caregivers: {
        Row: {
          id: string;
          auth_user_id: string;
          name: string;
          created_at: string | null;
          updated_at: string | null;
          active: boolean;
          last_activity: string | null;
          last_activity_type: string | null;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          name: string;
          created_at?: string | null;
          updated_at?: string | null;
          active?: boolean;
          last_activity?: string | null;
          last_activity_type?: string | null;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          name?: string;
          created_at?: string | null;
          updated_at?: string | null;
          active?: boolean;
          last_activity?: string | null;
          last_activity_type?: string | null;
        };
      };
      caregiver_invitations: {
        Row: {
          id: string;
          specialist_id: string;
          email: string;
          name: string;
          status: string;
          created_at: string | null;
          expires_at: string | null;
          resend_count: number | null;
          last_resent_at: string | null;
          error: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          specialist_id: string;
          email: string;
          name: string;
          status?: string;
          created_at?: string | null;
          expires_at?: string | null;
          resend_count?: number | null;
          last_resent_at?: string | null;
          error?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          specialist_id?: string;
          email?: string;
          name?: string;
          status?: string;
          created_at?: string | null;
          expires_at?: string | null;
          resend_count?: number | null;
          last_resent_at?: string | null;
          error?: string | null;
          updated_at?: string | null;
        };
      };
      chat_rooms: {
        Row: {
          id: string;
          specialist_id: string;
          caregiver_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          specialist_id: string;
          caregiver_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          specialist_id?: string;
          caregiver_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          room_id: string;
          sender_id: string;
          content: string;
          created_at: string | null;
          read: boolean | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          sender_id: string;
          content: string;
          created_at?: string | null;
          read?: boolean | null;
        };
        Update: {
          id?: string;
          room_id?: string;
          sender_id?: string;
          content?: string;
          created_at?: string | null;
          read?: boolean | null;
        };
      };
      specialist_caregiver: {
        Row: {
          id: string;
          specialist_id: string;
          caregiver_id: string;
          status: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          specialist_id: string;
          caregiver_id: string;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          specialist_id?: string;
          caregiver_id?: string;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      specialists: {
        Row: {
          id: string;
          auth_user_id: string;
          name: string;
          email: string | null;
          active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          business_name: string | null;
          phone: string | null;
          school: string | null;
          school_email: string | null;
          verification_status: string | null;
          last_sign_in_at: string | null;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          name: string;
          email?: string | null;
          active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          business_name?: string | null;
          phone?: string | null;
          school?: string | null;
          school_email?: string | null;
          verification_status?: string | null;
          last_sign_in_at?: string | null;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          name?: string;
          email?: string | null;
          active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          business_name?: string | null;
          phone?: string | null;
          school?: string | null;
          school_email?: string | null;
          verification_status?: string | null;
          last_sign_in_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_active_caregivers: {
        Args: {
          p_specialist_id: string;
          p_hours?: number;
        };
        Returns: {
          caregiver_id: string;
          name: string;
          email: string;
          last_activity: string;
          last_activity_type: string;
        }[];
      };
      get_caregiver_status: {
        Args: {
          p_specialist_id: string;
          p_caregiver_id: string;
        };
        Returns: string;
      };
      get_specialist_caregivers: {
        Args: {
          p_specialist_id: string;
          p_sort_field?: string;
          p_sort_order?: string;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: {
          caregiver_id: string;
          user_id: string;
          caregiver_name: string;
          caregiver_email: string;
          last_activity: string;
          status: string;
        }[];
      };
      invite_caregiver: {
        Args: {
          caregiver_email: string;
          caregiver_name: string;
          resend?: boolean;
        };
        Returns: string;
      };
      update_caregiver_activity: {
        Args: {
          p_caregiver_id: string;
          p_activity_type?: string;
        };
        Returns: boolean;
      };
      update_caregiver_status: {
        Args: {
          p_specialist_id: string;
          p_caregiver_id: string;
          p_status: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}