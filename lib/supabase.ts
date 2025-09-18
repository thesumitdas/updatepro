import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
        }
      }
      bschools: {
        Row: {
          id: string
          name: string
          short_name: string
          logo_url: string
          location: string
          city: string
          state: string
          type: 'Government' | 'Private' | 'Autonomous'
          website: string
          description: string
          fees_min: number
          fees_max: number
          avg_package: number
          highest_package: number
          placement_rate: number
          nirf_ranking: number
          accepted_exams: string[]
          total_seats: number
          established_year: number
          accreditation: string[]
          facilities: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name?: string
          logo_url?: string
          location?: string
          city?: string
          state?: string
          type?: 'Government' | 'Private' | 'Autonomous'
          website?: string
          description?: string
          fees_min?: number
          fees_max?: number
          avg_package?: number
          highest_package?: number
          placement_rate?: number
          nirf_ranking?: number
          accepted_exams?: string[]
          total_seats?: number
          established_year?: number
          accreditation?: string[]
          facilities?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_name?: string
          logo_url?: string
          location?: string
          city?: string
          state?: string
          type?: 'Government' | 'Private' | 'Autonomous'
          website?: string
          description?: string
          fees_min?: number
          fees_max?: number
          avg_package?: number
          highest_package?: number
          placement_rate?: number
          nirf_ranking?: number
          accepted_exams?: string[]
          total_seats?: number
          established_year?: number
          accreditation?: string[]
          facilities?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          bschool_id: string
          name: string
          duration: string
          fees: number
          seats: number
          specializations: string[]
          created_at: string
        }
        Insert: {
          id?: string
          bschool_id: string
          name: string
          duration?: string
          fees?: number
          seats?: number
          specializations?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          bschool_id?: string
          name?: string
          duration?: string
          fees?: number
          seats?: number
          specializations?: string[]
          created_at?: string
        }
      }
      cutoffs: {
        Row: {
          id: string
          bschool_id: string
          exam_name: string
          year: number
          general: number
          obc: number
          sc: number
          st: number
          ews: number
          pwd: number
          created_at: string
        }
        Insert: {
          id?: string
          bschool_id: string
          exam_name: string
          year: number
          general?: number
          obc?: number
          sc?: number
          st?: number
          ews?: number
          pwd?: number
          created_at?: string
        }
        Update: {
          id?: string
          bschool_id?: string
          exam_name?: string
          year?: number
          general?: number
          obc?: number
          sc?: number
          st?: number
          ews?: number
          pwd?: number
          created_at?: string
        }
      }
      application_deadlines: {
        Row: {
          id: string
          bschool_id: string
          title: string
          deadline_date: string
          description: string
          type: 'Application' | 'Exam' | 'Interview' | 'Result'
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          bschool_id: string
          title: string
          deadline_date: string
          description?: string
          type?: 'Application' | 'Exam' | 'Interview' | 'Result'
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          bschool_id?: string
          title?: string
          deadline_date?: string
          description?: string
          type?: 'Application' | 'Exam' | 'Interview' | 'Result'
          is_active?: boolean
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          name: string
          phone: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string
          phone?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          is_active?: boolean
          subscribed_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          is_read: boolean
          admin_response: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          is_read?: boolean
          admin_response?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          is_read?: boolean
          admin_response?: string
          created_at?: string
        }
      }
    }
  }
}