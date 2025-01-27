export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      bottle_sessions: {
        Row: {
          amount_ml: number
          amount_oz: number | null
          created_at: string | null
          feeding_duration: number | null
          id: string
          session_id: string
          updated_at: string | null
        }
        Insert: {
          amount_ml: number
          amount_oz?: number | null
          created_at?: string | null
          feeding_duration?: number | null
          id?: string
          session_id: string
          updated_at?: string | null
        }
        Update: {
          amount_ml?: number
          amount_oz?: number | null
          created_at?: string | null
          feeding_duration?: number | null
          id?: string
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bottle_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "feeding_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      breastfeeding_sessions: {
        Row: {
          created_at: string | null
          feeding_order: string[]
          id: string
          latch_quality: string | null
          left_duration: number
          pain_reported: boolean | null
          right_duration: number
          session_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          feeding_order: string[]
          id?: string
          latch_quality?: string | null
          left_duration: number
          pain_reported?: boolean | null
          right_duration: number
          session_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          feeding_order?: string[]
          id?: string
          latch_quality?: string | null
          left_duration?: number
          pain_reported?: boolean | null
          right_duration?: number
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "breastfeeding_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "feeding_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      caregiver_invitations: {
        Row: {
          caregiver_id: string | null
          created_at: string | null
          email: string
          error: string | null
          expires_at: string | null
          id: string
          last_resent_at: string | null
          name: string
          resend_count: number | null
          specialist_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          caregiver_id?: string | null
          created_at?: string | null
          email: string
          error?: string | null
          expires_at?: string | null
          id?: string
          last_resent_at?: string | null
          name: string
          resend_count?: number | null
          specialist_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          caregiver_id?: string | null
          created_at?: string | null
          email?: string
          error?: string | null
          expires_at?: string | null
          id?: string
          last_resent_at?: string | null
          name?: string
          resend_count?: number | null
          specialist_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caregiver_invitations_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caregiver_invitations_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "specialists"
            referencedColumns: ["id"]
          },
        ]
      }
      caregivers: {
        Row: {
          active: boolean
          auth_user_id: string
          created_at: string | null
          id: string
          last_activity: string | null
          last_activity_type: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          auth_user_id: string
          created_at?: string | null
          id?: string
          last_activity?: string | null
          last_activity_type?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          auth_user_id?: string
          created_at?: string | null
          id?: string
          last_activity?: string | null
          last_activity_type?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_rooms: {
        Row: {
          caregiver_id: string
          created_at: string | null
          id: string
          specialist_id: string
          updated_at: string | null
        }
        Insert: {
          caregiver_id: string
          created_at?: string | null
          id?: string
          specialist_id: string
          updated_at?: string | null
        }
        Update: {
          caregiver_id?: string
          created_at?: string | null
          id?: string
          specialist_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          caregiver_id: string
          created_at: string | null
          date_of_birth: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          caregiver_id: string
          created_at?: string | null
          date_of_birth: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          caregiver_id?: string
          created_at?: string | null
          date_of_birth?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding_sessions: {
        Row: {
          caregiver_id: string
          child_id: string
          created_at: string | null
          end_time: string
          id: string
          notes: string | null
          start_time: string
          type: Database["public"]["Enums"]["feeding_type_enum"]
          updated_at: string | null
        }
        Insert: {
          caregiver_id: string
          child_id: string
          created_at?: string | null
          end_time: string
          id?: string
          notes?: string | null
          start_time: string
          type: Database["public"]["Enums"]["feeding_type_enum"]
          updated_at?: string | null
        }
        Update: {
          caregiver_id?: string
          child_id?: string
          created_at?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          start_time?: string
          type?: Database["public"]["Enums"]["feeding_type_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feeding_sessions_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeding_sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding_types: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      formula_sessions: {
        Row: {
          amount_ml: number
          amount_oz: number | null
          brand: string
          created_at: string | null
          id: string
          prepared_by: string | null
          session_id: string
          updated_at: string | null
        }
        Insert: {
          amount_ml: number
          amount_oz?: number | null
          brand: string
          created_at?: string | null
          id?: string
          prepared_by?: string | null
          session_id: string
          updated_at?: string | null
        }
        Update: {
          amount_ml?: number
          amount_oz?: number | null
          brand?: string
          created_at?: string | null
          id?: string
          prepared_by?: string | null
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "formula_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "feeding_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          deleted: boolean | null
          edited: boolean | null
          id: string
          read: boolean | null
          room_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted?: boolean | null
          edited?: boolean | null
          id?: string
          read?: boolean | null
          room_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted?: boolean | null
          edited?: boolean | null
          id?: string
          read?: boolean | null
          room_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      sleep_sessions: {
        Row: {
          child_id: string
          created_at: string | null
          end_time: string
          id: string
          notes: string | null
          quality: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          child_id: string
          created_at?: string | null
          end_time: string
          id?: string
          notes?: string | null
          quality?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          quality?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sleep_sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      solids_sessions: {
        Row: {
          amount_eaten: string | null
          created_at: string | null
          foods: string[]
          id: string
          reaction: string | null
          session_id: string
          texture_preference: string | null
          timing_relative_to_sleep: string | null
          updated_at: string | null
        }
        Insert: {
          amount_eaten?: string | null
          created_at?: string | null
          foods: string[]
          id?: string
          reaction?: string | null
          session_id: string
          texture_preference?: string | null
          timing_relative_to_sleep?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_eaten?: string | null
          created_at?: string | null
          foods?: string[]
          id?: string
          reaction?: string | null
          session_id?: string
          texture_preference?: string | null
          timing_relative_to_sleep?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solids_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "feeding_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      specialist_caregiver: {
        Row: {
          archived: boolean
          caregiver_id: string
          created_at: string | null
          id: string
          specialist_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          archived?: boolean
          caregiver_id: string
          created_at?: string | null
          id?: string
          specialist_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          archived?: boolean
          caregiver_id?: string
          created_at?: string | null
          id?: string
          specialist_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specialist_caregiver_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specialist_caregiver_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "specialists"
            referencedColumns: ["id"]
          },
        ]
      }
      specialists: {
        Row: {
          active: boolean | null
          auth_user_id: string
          business_name: string | null
          created_at: string | null
          email: string | null
          id: string
          last_sign_in_at: string | null
          name: string
          phone: string | null
          school: string | null
          school_email: string | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          active?: boolean | null
          auth_user_id: string
          business_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_sign_in_at?: string | null
          name: string
          phone?: string | null
          school?: string | null
          school_email?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          active?: boolean | null
          auth_user_id?: string
          business_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_sign_in_at?: string | null
          name?: string
          phone?: string | null
          school?: string | null
          school_email?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      summary_metrics: {
        Row: {
          child_id: string
          created_at: string | null
          date: string
          id: string
          total_bottle_amount_ml: number | null
          total_breastfeeding_time: number | null
          total_formula_amount_ml: number | null
          total_sleep_duration: number | null
          total_solid_foods: string[] | null
          updated_at: string | null
        }
        Insert: {
          child_id: string
          created_at?: string | null
          date: string
          id?: string
          total_bottle_amount_ml?: number | null
          total_breastfeeding_time?: number | null
          total_formula_amount_ml?: number | null
          total_sleep_duration?: number | null
          total_solid_foods?: string[] | null
          updated_at?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string | null
          date?: string
          id?: string
          total_bottle_amount_ml?: number | null
          total_breastfeeding_time?: number | null
          total_formula_amount_ml?: number | null
          total_sleep_duration?: number | null
          total_solid_foods?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "summary_metrics_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_caregiver_invitation: {
        Args: {
          invitation_id: string
          caregiver_id: string
        }
        Returns: boolean
      }
      accept_invitation: {
        Args: {
          invitation_id: string
          caregiver_id: string
        }
        Returns: boolean
      }
      assign_specialist: {
        Args: {
          p_caregiver_id: string
          p_specialist_id: string
        }
        Returns: boolean
      }
      assign_specialist_to_caregiver: {
        Args: {
          p_specialist_id: string
          p_caregiver_id: string
        }
        Returns: string
      }
      assign_specialist_to_caregiver_20250109: {
        Args: {
          p_specialist_id: string
          p_caregiver_id: string
          p_relationship_type?: string
        }
        Returns: string
      }
      change_user_role: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
      chat_get_messages: {
        Args: {
          p_room_id: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          message_id: string
          room_id: string
          sender_id: string
          content: string
          created_at: string
          updated_at: string
          edited: boolean
          deleted: boolean
          read: boolean
        }[]
      }
      chat_get_unread_count: {
        Args: {
          p_room_id: string
        }
        Returns: number
      }
      chat_mark_messages_read: {
        Args: {
          p_room_id: string
        }
        Returns: boolean
      }
      chat_save_message: {
        Args: {
          p_room_id: string
          p_content: string
        }
        Returns: string
      }
      check_caregiver_specialist: {
        Args: {
          p_user_id: string
        }
        Returns: {
          has_specialist: boolean
          specialist_id: string
          specialist_name: string
        }[]
      }
      check_user_exists: {
        Args: {
          p_email: string
        }
        Returns: boolean
      }
      complete_caregiver_signup: {
        Args: {
          p_invitation_id: string
          p_caregiver_id: string
        }
        Returns: boolean
      }
      create_specialist: {
        Args: {
          p_email: string
          p_name: string
          p_business_name: string
          p_phone: string
          p_school: string
          p_password: string
        }
        Returns: string
      }
      deactivate_specialist_assignment: {
        Args: {
          p_specialist_id: string
          p_caregiver_id: string
        }
        Returns: boolean
      }
      ensure_caregiver_exists: {
        Args: {
          p_user_id: string
        }
        Returns: string
      }
      ensure_specialist_record_exists: {
        Args: {
          p_user_id: string
        }
        Returns: string
      }
      get_active_caregivers: {
        Args: {
          p_specialist_id: string
          p_hours?: number
        }
        Returns: {
          caregiver_id: string
          name: string
          email: string
          last_activity: string
          last_activity_type: string
        }[]
      }
      get_caregiver_invitations: {
        Args: {
          p_specialist_id: string
        }
        Returns: {
          id: string
          email: string
          name: string
          status: string
          created_at: string
          caregiver_id: string
          chat_room_id: string
        }[]
      }
      get_caregiver_specialist_list: {
        Args: {
          p_caregiver_id: string
        }
        Returns: {
          specialist_id: string
          name: string
          email: string
          status: string
          created_at: string
        }[]
      }
      get_caregiver_specialists_20250109: {
        Args: {
          p_caregiver_id: string
        }
        Returns: {
          specialist_id: string
          specialist_name: string
          relationship_type: string
          status: string
          created_at: string
        }[]
      }
      get_or_create_chat_room: {
        Args: {
          p_specialist_id: string
          p_caregiver_id: string
        }
        Returns: string
      }
      get_specialist_by_email: {
        Args: {
          p_email: string
        }
        Returns: {
          id: string
          auth_user_id: string
          name: string
          email: string
          active: boolean
        }[]
      }
      get_specialist_caregivers: {
        Args: {
          p_specialist_id: string
          p_sort_field?: string
          p_sort_order?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          caregiver_id: string
          user_id: string
          caregiver_name: string
          caregiver_email: string
          last_activity: string
          status: string
        }[]
      }
      get_specialist_caregivers_with_archive: {
        Args: {
          p_specialist_id: string
          p_sort_field?: string
          p_sort_order?: string
          p_limit?: number
          p_offset?: number
          p_include_archived?: boolean
          p_archived_only?: boolean
        }
        Returns: {
          caregiver_id: string
          user_id: string
          caregiver_name: string
          caregiver_email: string
          last_activity: string
          status: string
          archived: boolean
        }[]
      }
      get_specialist_status: {
        Args: {
          user_id: string
        }
        Returns: {
          active: boolean
        }[]
      }
      handle_caregiver_signup: {
        Args: {
          p_user_id: string
          p_invitation_id: string
        }
        Returns: string
      }
      invite_caregiver: {
        Args: {
          caregiver_email: string
          caregiver_name: string
          resend?: boolean
        }
        Returns: string
      }
      list_specialists: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          email: string
          active: boolean
          created_at: string
        }[]
      }
      mark_invitation_email_failed: {
        Args: {
          p_invitation_id: string
          p_error: string
        }
        Returns: boolean
      }
      mark_invitation_email_sent: {
        Args: {
          p_invitation_id: string
        }
        Returns: boolean
      }
      remove_specialist_assignment: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
      save_message: {
        Args: {
          p_room_id: string
          p_content: string
          p_message_id?: string
        }
        Returns: string
      }
      search_specialists: {
        Args: {
          search_query?: string
          page_number?: number
          page_size?: number
          sort_column?: string
          sort_order?: string
        }
        Returns: {
          id: string
          name: string
          email: string
          active: boolean
          created_at: string
          total_count: number
        }[]
      }
      toggle_caregiver_archive: {
        Args: {
          p_specialist_id: string
          p_caregiver_id: string
        }
        Returns: boolean
      }
      toggle_specialist_status: {
        Args: {
          specialist_id: string
        }
        Returns: boolean
      }
      update_caregiver_activity: {
        Args: {
          p_caregiver_id: string
          p_activity_type?: string
        }
        Returns: boolean
      }
      update_invitation_email_status: {
        Args: {
          p_invitation_id: string
          p_success: boolean
          p_error?: string
        }
        Returns: boolean
      }
      update_invitation_status: {
        Args: {
          p_invitation_id: string
          p_status: string
        }
        Returns: boolean
      }
      verify_admin_login: {
        Args: {
          p_username: string
          p_password: string
        }
        Returns: boolean
      }
      verify_specialist_access: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      feeding_type_enum: "breastfeeding" | "bottle" | "formula" | "solids"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never