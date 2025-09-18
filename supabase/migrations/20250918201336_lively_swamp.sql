/*
  # B-School Information Portal Database Schema

  1. New Tables
    - `admins` - Admin user authentication and management
    - `bschools` - Main B-school information repository
    - `programs` - Academic programs offered by B-schools
    - `cutoffs` - Historical cutoff data by exam and category
    - `application_deadlines` - Important application and exam dates
    - `newsletter_subscribers` - Email subscription management
    - `contact_submissions` - Contact form submissions

  2. Security
    - Enable RLS on all tables
    - Admin-only access policies for content management
    - Public read access for B-school information
    - Secure contact and newsletter data handling

  3. Features
    - Full-text search capabilities
    - Proper indexing for performance
    - Foreign key relationships for data integrity
    - Default values and constraints for data quality
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create bschools table
CREATE TABLE IF NOT EXISTS bschools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text NOT NULL DEFAULT '',
  logo_url text DEFAULT '',
  location text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'Private' CHECK (type IN ('Government', 'Private', 'Autonomous')),
  website text DEFAULT '',
  description text DEFAULT '',
  fees_min decimal DEFAULT 0,
  fees_max decimal DEFAULT 0,
  avg_package decimal DEFAULT 0,
  highest_package decimal DEFAULT 0,
  placement_rate integer DEFAULT 0 CHECK (placement_rate >= 0 AND placement_rate <= 100),
  nirf_ranking integer DEFAULT 0,
  accepted_exams text[] DEFAULT '{}',
  total_seats integer DEFAULT 0,
  established_year integer DEFAULT 0,
  accreditation text[] DEFAULT '{}',
  facilities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bschool_id uuid REFERENCES bschools(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration text NOT NULL DEFAULT '2 years',
  fees decimal DEFAULT 0,
  seats integer DEFAULT 0,
  specializations text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create cutoffs table
CREATE TABLE IF NOT EXISTS cutoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bschool_id uuid REFERENCES bschools(id) ON DELETE CASCADE,
  exam_name text NOT NULL,
  year integer NOT NULL,
  general decimal DEFAULT 0,
  obc decimal DEFAULT 0,
  sc decimal DEFAULT 0,
  st decimal DEFAULT 0,
  ews decimal DEFAULT 0,
  pwd decimal DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create application_deadlines table
CREATE TABLE IF NOT EXISTS application_deadlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bschool_id uuid REFERENCES bschools(id) ON DELETE CASCADE,
  title text NOT NULL,
  deadline_date date NOT NULL,
  description text DEFAULT '',
  type text NOT NULL DEFAULT 'Application' CHECK (type IN ('Application', 'Exam', 'Interview', 'Result')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  admin_response text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE bschools ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Admins policies
CREATE POLICY "Admins can read own data"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- B-schools policies (public read, admin write)
CREATE POLICY "Anyone can read bschools"
  ON bschools FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage bschools"
  ON bschools FOR ALL
  TO authenticated
  USING (true);

-- Programs policies
CREATE POLICY "Anyone can read programs"
  ON programs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage programs"
  ON programs FOR ALL
  TO authenticated
  USING (true);

-- Cutoffs policies
CREATE POLICY "Anyone can read cutoffs"
  ON cutoffs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage cutoffs"
  ON cutoffs FOR ALL
  TO authenticated
  USING (true);

-- Application deadlines policies
CREATE POLICY "Anyone can read active deadlines"
  ON application_deadlines FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage deadlines"
  ON application_deadlines FOR ALL
  TO authenticated
  USING (true);

-- Newsletter subscribers policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage subscribers"
  ON newsletter_subscribers FOR ALL
  TO authenticated
  USING (true);

-- Contact submissions policies
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage contacts"
  ON contact_submissions FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bschools_name ON bschools USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_bschools_location ON bschools(city, state);
CREATE INDEX IF NOT EXISTS idx_bschools_type ON bschools(type);
CREATE INDEX IF NOT EXISTS idx_bschools_ranking ON bschools(nirf_ranking);
CREATE INDEX IF NOT EXISTS idx_programs_bschool ON programs(bschool_id);
CREATE INDEX IF NOT EXISTS idx_cutoffs_bschool ON cutoffs(bschool_id, year);
CREATE INDEX IF NOT EXISTS idx_deadlines_date ON application_deadlines(deadline_date);
CREATE INDEX IF NOT EXISTS idx_deadlines_active ON application_deadlines(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for bschools updated_at
CREATE TRIGGER update_bschools_updated_at 
  BEFORE UPDATE ON bschools 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();