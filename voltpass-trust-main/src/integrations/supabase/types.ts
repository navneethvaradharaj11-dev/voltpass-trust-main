export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          entity: string | null;
          entity_id: string | null;
          id: string;
          metadata: Json | null;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          entity?: string | null;
          entity_id?: string | null;
          id?: string;
          metadata?: Json | null;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          entity?: string | null;
          entity_id?: string | null;
          id?: string;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      batteries: {
        Row: {
          avg_operating_temp_c: number;
          battery_code: string;
          charge_cycles: number;
          chemistry: Database["public"]["Enums"]["battery_chemistry"];
          created_at: string;
          current_a: number;
          current_capacity_kwh: number;
          fast_charging_freq_pct: number;
          fault_count: number;
          fault_records: string | null;
          id: string;
          inspection_notes: string | null;
          lifecycle_status: Database["public"]["Enums"]["lifecycle_status"];
          maintenance_notes: string | null;
          manufacturer: string;
          manufacturing_date: string;
          model: string | null;
          original_capacity_kwh: number;
          owner_id: string | null;
          trust_score: number | null;
          updated_at: string;
          voltage_v: number;
        };
        Insert: {
          avg_operating_temp_c: number;
          battery_code: string;
          charge_cycles?: number;
          chemistry: Database["public"]["Enums"]["battery_chemistry"];
          created_at?: string;
          current_a: number;
          current_capacity_kwh: number;
          fast_charging_freq_pct?: number;
          fault_count?: number;
          fault_records?: string | null;
          id?: string;
          inspection_notes?: string | null;
          lifecycle_status?: Database["public"]["Enums"]["lifecycle_status"];
          maintenance_notes?: string | null;
          manufacturer: string;
          manufacturing_date: string;
          model?: string | null;
          original_capacity_kwh: number;
          owner_id?: string | null;
          trust_score?: number | null;
          updated_at?: string;
          voltage_v: number;
        };
        Update: {
          avg_operating_temp_c?: number;
          battery_code?: string;
          charge_cycles?: number;
          chemistry?: Database["public"]["Enums"]["battery_chemistry"];
          created_at?: string;
          current_a?: number;
          current_capacity_kwh?: number;
          fast_charging_freq_pct?: number;
          fault_count?: number;
          fault_records?: string | null;
          id?: string;
          inspection_notes?: string | null;
          lifecycle_status?: Database["public"]["Enums"]["lifecycle_status"];
          maintenance_notes?: string | null;
          manufacturer?: string;
          manufacturing_date?: string;
          model?: string | null;
          original_capacity_kwh?: number;
          owner_id?: string | null;
          trust_score?: number | null;
          updated_at?: string;
          voltage_v?: number;
        };
        Relationships: [];
      };
      inspections: {
        Row: {
          battery_id: string;
          id: string;
          inspected_at: string;
          inspector_id: string | null;
          inspector_name: string | null;
          notes: string | null;
          result: string | null;
          soh_pct: number | null;
        };
        Insert: {
          battery_id: string;
          id?: string;
          inspected_at?: string;
          inspector_id?: string | null;
          inspector_name?: string | null;
          notes?: string | null;
          result?: string | null;
          soh_pct?: number | null;
        };
        Update: {
          battery_id?: string;
          id?: string;
          inspected_at?: string;
          inspector_id?: string | null;
          inspector_name?: string | null;
          notes?: string | null;
          result?: string | null;
          soh_pct?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "inspections_battery_id_fkey";
            columns: ["battery_id"];
            isOneToOne: false;
            referencedRelation: "batteries";
            referencedColumns: ["id"];
          },
        ];
      };
      maintenance_records: {
        Row: {
          battery_id: string;
          description: string;
          id: string;
          performed_at: string;
          technician: string | null;
        };
        Insert: {
          battery_id: string;
          description: string;
          id?: string;
          performed_at?: string;
          technician?: string | null;
        };
        Update: {
          battery_id?: string;
          description?: string;
          id?: string;
          performed_at?: string;
          technician?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "maintenance_records_battery_id_fkey";
            columns: ["battery_id"];
            isOneToOne: false;
            referencedRelation: "batteries";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string;
          email: string | null;
          id: string;
          organization: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name: string;
          email?: string | null;
          id: string;
          organization?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          email?: string | null;
          id?: string;
          organization?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "inspector" | "owner" | "buyer";
      battery_chemistry: "NMC" | "LFP" | "NCA" | "LTO" | "LMO";
      lifecycle_status:
        | "first_life"
        | "inspection"
        | "second_life_ready"
        | "commercial_use"
        | "stationary_storage"
        | "recycling";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "inspector", "owner", "buyer"],
      battery_chemistry: ["NMC", "LFP", "NCA", "LTO", "LMO"],
      lifecycle_status: [
        "first_life",
        "inspection",
        "second_life_ready",
        "commercial_use",
        "stationary_storage",
        "recycling",
      ],
    },
  },
} as const;
