export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      evaluations: {
        Row: {
          created_at: string
          date: string | null
          id: string
          name: string
          score: number | null
          subject_id: string
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          date?: string | null
          id?: string
          name: string
          score?: number | null
          subject_id: string
          user_id: string
          weight?: number
        }
        Update: {
          created_at?: string
          date?: string | null
          id?: string
          name?: string
          score?: number | null
          subject_id?: string
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string
          end_recur_date: string | null
          end_time: string
          frequency: string | null
          id: string
          link: string
          priority: string
          recurring: boolean
          reminder: string | null
          start_time: string
          subject_id: string | null
          subject_week_id: string | null
          title: string
          type: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string
          end_recur_date?: string | null
          end_time?: string
          frequency?: string | null
          id?: string
          link?: string
          priority?: string
          recurring?: boolean
          reminder?: string | null
          start_time?: string
          subject_id?: string | null
          subject_week_id?: string | null
          title: string
          type?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          end_recur_date?: string | null
          end_time?: string
          frequency?: string | null
          id?: string
          link?: string
          priority?: string
          recurring?: boolean
          reminder?: string | null
          start_time?: string
          subject_id?: string | null
          subject_week_id?: string | null
          title?: string
          type?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_subject_week_id_fkey"
            columns: ["subject_week_id"]
            isOneToOne: false
            referencedRelation: "subject_weeks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string
          description: string
          file_type: string
          folder: string
          id: string
          name: string
          size: string
          subject_id: string | null
          tags: Json
          url: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          file_type?: string
          folder?: string
          id?: string
          name?: string
          size?: string
          subject_id?: string | null
          tags?: Json
          url?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          description?: string
          file_type?: string
          folder?: string
          id?: string
          name?: string
          size?: string
          subject_id?: string | null
          tags?: Json
          url?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      kanban_columns: {
        Row: {
          created_at: string
          id: string
          order: number
          title: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order?: number
          title: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order?: number
          title?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kanban_columns_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          category: string
          created_at: string
          description: string
          favicon: string
          favorite: boolean
          id: string
          subject_id: string | null
          title: string
          url: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          favicon?: string
          favorite?: boolean
          id?: string
          subject_id?: string | null
          title?: string
          url?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          favicon?: string
          favorite?: boolean
          id?: string
          subject_id?: string | null
          title?: string
          url?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "links_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          id: string
          starred: boolean
          subject_id: string | null
          tags: Json
          title: string
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          starred?: boolean
          subject_id?: string | null
          tags?: Json
          title?: string
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          starred?: boolean
          subject_id?: string | null
          tags?: Json
          title?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_color: string
          course: string
          created_at: string
          default_task_view: string
          id: string
          modality: string
          name: string
          onboarding_done: boolean
          university: string
          updated_at: string
          week_starts_on_monday: boolean
        }
        Insert: {
          avatar_color?: string
          course?: string
          created_at?: string
          default_task_view?: string
          id: string
          modality?: string
          name?: string
          onboarding_done?: boolean
          university?: string
          updated_at?: string
          week_starts_on_monday?: boolean
        }
        Update: {
          avatar_color?: string
          course?: string
          created_at?: string
          default_task_view?: string
          id?: string
          modality?: string
          name?: string
          onboarding_done?: boolean
          university?: string
          updated_at?: string
          week_starts_on_monday?: boolean
        }
        Relationships: []
      }
      subject_weeks: {
        Row: {
          created_at: string
          date_end: string | null
          date_start: string | null
          id: string
          objectives: string
          status: string
          subject_id: string
          title: string
          user_id: string
          week_number: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          id?: string
          objectives?: string
          status?: string
          subject_id: string
          title?: string
          user_id: string
          week_number: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          id?: string
          objectives?: string
          status?: string
          subject_id?: string
          title?: string
          user_id?: string
          week_number?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subject_weeks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subject_weeks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          ava_link: string
          code: string
          color: string
          created_at: string
          credit_hours: number
          credits: number
          description: string
          id: string
          name: string
          professor: string
          schedule: Json
          status: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          ava_link?: string
          code?: string
          color?: string
          created_at?: string
          credit_hours?: number
          credits?: number
          description?: string
          id?: string
          name: string
          professor?: string
          schedule?: Json
          status?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          ava_link?: string
          code?: string
          color?: string
          created_at?: string
          credit_hours?: number
          credits?: number
          description?: string
          id?: string
          name?: string
          professor?: string
          schedule?: Json
          status?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          checklist: Json
          created_at: string
          description: string
          due_date: string | null
          estimated_minutes: number
          id: string
          kanban_column: string
          link: string
          priority: string
          status: string
          subject_id: string | null
          subject_week_id: string | null
          title: string
          type: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          checklist?: Json
          created_at?: string
          description?: string
          due_date?: string | null
          estimated_minutes?: number
          id?: string
          kanban_column?: string
          link?: string
          priority?: string
          status?: string
          subject_id?: string | null
          subject_week_id?: string | null
          title: string
          type?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          checklist?: Json
          created_at?: string
          description?: string
          due_date?: string | null
          estimated_minutes?: number
          id?: string
          kanban_column?: string
          link?: string
          priority?: string
          status?: string
          subject_id?: string | null
          subject_week_id?: string | null
          title?: string
          type?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_subject_week_id_fkey"
            columns: ["subject_week_id"]
            isOneToOne: false
            referencedRelation: "subject_weeks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      week_files: {
        Row: {
          created_at: string
          description: string
          file_type: string
          id: string
          name: string
          subject_week_id: string
          tags: Json
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          file_type?: string
          id?: string
          name?: string
          subject_week_id: string
          tags?: Json
          url?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          file_type?: string
          id?: string
          name?: string
          subject_week_id?: string
          tags?: Json
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "week_files_subject_week_id_fkey"
            columns: ["subject_week_id"]
            isOneToOne: false
            referencedRelation: "subject_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      week_links: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          subject_week_id: string
          title: string
          url: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          subject_week_id: string
          title?: string
          url?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          subject_week_id?: string
          title?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "week_links_subject_week_id_fkey"
            columns: ["subject_week_id"]
            isOneToOne: false
            referencedRelation: "subject_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      week_notes: {
        Row: {
          content: string
          id: string
          subject_week_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          id?: string
          subject_week_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          subject_week_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "week_notes_subject_week_id_fkey"
            columns: ["subject_week_id"]
            isOneToOne: false
            referencedRelation: "subject_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          course: string
          created_at: string
          description: string
          end_date: string
          id: string
          is_active: boolean
          name: string
          start_date: string
          status: string
          total_weeks: number
          university: string
          user_id: string
        }
        Insert: {
          course?: string
          created_at?: string
          description?: string
          end_date: string
          id?: string
          is_active?: boolean
          name: string
          start_date: string
          status?: string
          total_weeks?: number
          university?: string
          user_id: string
        }
        Update: {
          course?: string
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string
          status?: string
          total_weeks?: number
          university?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
