export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          company_name: string | null
          status: 'active' | 'pending_payment' | 'pending_review'
          is_admin: boolean
          manager_name: string | null
          siret: string | null
          member_type: string | null
          logo_url: string | null
          sponsor: string | null
          join_reason: string | null
          charter_signed: boolean | null
          phone: string | null
          address: string | null
          tiktok_url: string | null
          instagram_url: string | null
          website_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          company_name?: string | null
          status?: 'active' | 'pending_payment' | 'pending_review'
          is_admin?: boolean
          manager_name?: string | null
          siret?: string | null
          member_type?: string | null
          logo_url?: string | null
          sponsor?: string | null
          join_reason?: string | null
          charter_signed?: boolean | null
          phone?: string | null
          address?: string | null
          tiktok_url?: string | null
          instagram_url?: string | null
          website_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          company_name?: string | null
          status?: 'active' | 'pending_payment' | 'pending_review'
          is_admin?: boolean
          manager_name?: string | null
          siret?: string | null
          member_type?: string | null
          logo_url?: string | null
          sponsor?: string | null
          join_reason?: string | null
          charter_signed?: boolean | null
          phone?: string | null
          address?: string | null
          tiktok_url?: string | null
          instagram_url?: string | null
          website_url?: string | null
        }
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
  }
}
