/*
  # Sample B-School Data

  1. Sample Data
    - Popular B-schools with realistic information
    - Programs and cutoffs data
    - Application deadlines
    - Admin user for testing

  2. Features
    - Comprehensive B-school profiles
    - Historical cutoff data
    - Varied program offerings
    - Realistic deadlines and fees
*/

-- Insert sample admin (password should be set via Supabase Auth)
INSERT INTO admins (email, name) VALUES 
('admin@bschoolportal.com', 'Portal Administrator')
ON CONFLICT (email) DO NOTHING;

-- Insert sample B-schools
INSERT INTO bschools (name, short_name, location, city, state, type, website, description, fees_min, fees_max, avg_package, highest_package, placement_rate, nirf_ranking, accepted_exams, total_seats, established_year, accreditation, facilities) VALUES 
('Indian Institute of Management Ahmedabad', 'IIM Ahmedabad', 'Ahmedabad, Gujarat', 'Ahmedabad', 'Gujarat', 'Autonomous', 'https://www.iima.ac.in', 'IIM Ahmedabad is one of the premier management institutes in India, known for its rigorous academic programs and excellent placement records.', 2500000, 2500000, 3400000, 7000000, 100, 1, ARRAY['CAT', 'GMAT'], 395, 1961, ARRAY['AACSB', 'EQUIS'], ARRAY['Library', 'Sports Complex', 'Hostels', 'Computer Labs', 'Case Study Rooms']),

('Indian Institute of Management Bangalore', 'IIM Bangalore', 'Bangalore, Karnataka', 'Bangalore', 'Karnataka', 'Autonomous', 'https://www.iimb.ac.in', 'IIM Bangalore offers world-class management education and is consistently ranked among the top business schools globally.', 2400000, 2400000, 3200000, 6500000, 100, 2, ARRAY['CAT', 'GMAT'], 406, 1973, ARRAY['AACSB', 'EQUIS'], ARRAY['Innovation Lab', 'Library', 'Sports Facilities', 'Residential Campus']),

('Indian Institute of Management Calcutta', 'IIM Calcutta', 'Kolkata, West Bengal', 'Kolkata', 'West Bengal', 'Autonomous', 'https://www.iimcal.ac.in', 'IIM Calcutta is renowned for its strong alumni network and exceptional academic rigor in management education.', 2700000, 2700000, 3100000, 6200000, 98, 3, ARRAY['CAT', 'GMAT'], 462, 1961, ARRAY['AACSB'], ARRAY['Joka Campus', 'Library', 'Computer Center', 'Sports Complex']),

('XLRI Xavier School of Management', 'XLRI', 'Jamshedpur, Jharkhand', 'Jamshedpur', 'Jharkhand', 'Private', 'https://www.xlri.ac.in', 'XLRI is one of the most prestigious private business schools in India, known for its Human Resource Management programs.', 2550000, 2650000, 2800000, 5800000, 95, 8, ARRAY['XAT', 'GMAT'], 378, 1949, ARRAY['AACSB'], ARRAY['Modern Campus', 'Library', 'Sports Facilities', 'Hostels']),

('Indian School of Business', 'ISB', 'Hyderabad, Telangana', 'Hyderabad', 'Telangana', 'Private', 'https://www.isb.edu', 'ISB offers a world-class one-year MBA program designed for working professionals with significant work experience.', 3600000, 3600000, 3400000, 7500000, 97, 4, ARRAY['GMAT', 'GRE'], 917, 2001, ARRAY['AACSB'], ARRAY['Mohali Campus', 'Executive Education', 'Research Centers']),

('Faculty of Management Studies - Delhi University', 'FMS Delhi', 'New Delhi, Delhi', 'New Delhi', 'Delhi', 'Government', 'https://www.fms.edu', 'FMS Delhi offers excellent value for money with low fees and high-quality education, consistently producing top industry leaders.', 19500, 19500, 2600000, 5500000, 100, 12, ARRAY['CAT'], 236, 1954, ARRAY['UGC'], ARRAY['North Campus', 'Library', 'Computer Lab', 'Seminar Halls']),

('Jamnalal Bajaj Institute of Management Studies', 'JBIMS', 'Mumbai, Maharashtra', 'Mumbai', 'Maharashtra', 'Government', 'https://jbims.edu', 'JBIMS is one of the oldest business schools in India, known for its strong industry connections and finance specialization.', 680000, 680000, 2400000, 5200000, 98, 15, ARRAY['CAT', 'CET'], 120, 1965, ARRAY['UGC', 'AICTE'], ARRAY['Finance Lab', 'Library', 'Auditorium', 'Computer Center']),

('Management Development Institute', 'MDI Gurgaon', 'Gurgaon, Haryana', 'Gurgaon', 'Haryana', 'Private', 'https://www.mdi.ac.in', 'MDI Gurgaon is known for its rigorous curriculum and strong placement record in consulting and finance sectors.', 2080000, 2080000, 2500000, 5000000, 100, 11, ARRAY['CAT'], 448, 1973, ARRAY['AACSB', 'AICTE'], ARRAY['Residential Campus', 'Library', 'Sports Complex', 'Computer Labs']),

('S.P. Jain Institute of Management and Research', 'SPJIMR', 'Mumbai, Maharashtra', 'Mumbai', 'Maharashtra', 'Private', 'https://www.spjimr.org', 'SPJIMR focuses on developing responsible business leaders through innovative pedagogy and strong industry partnerships.', 2050000, 2050000, 2300000, 4800000, 100, 18, ARRAY['CAT'], 300, 1981, ARRAY['AICTE'], ARRAY['Bharatiya Vidya Bhavan Campus', 'Modern Infrastructure', 'Industry Interface']),

('Indian Institute of Foreign Trade', 'IIFT', 'New Delhi, Delhi', 'New Delhi', 'Delhi', 'Government', 'https://www.iift.ac.in', 'IIFT specializes in international business and trade, offering unique programs in global business management.', 1560000, 1560000, 2100000, 4200000, 95, 25, ARRAY['IIFT Exam'], 420, 1963, ARRAY['UGC'], ARRAY['Delhi Campus', 'Kolkata Campus', 'International Relations']),

('Narsee Monjee Institute of Management Studies', 'NMIMS', 'Mumbai, Maharashtra', 'Mumbai', 'Maharashtra', 'Private', 'https://www.nmims.edu', 'NMIMS offers comprehensive management education with strong industry connections and diverse specialization options.', 2100000, 2100000, 1900000, 4000000, 90, 30, ARRAY['NMAT'], 540, 1981, ARRAY['UGC', 'AICTE'], ARRAY['Multiple Campuses', 'Industry Partnerships', 'Modern Facilities']),

('MICA - The School of Ideas', 'MICA', 'Ahmedabad, Gujarat', 'Ahmedabad', 'Gujarat', 'Private', 'https://www.micaonline.org', 'MICA specializes in strategic marketing and communication, known for its creative and innovative approach to business education.', 2100000, 2100000, 1800000, 3800000, 88, 35, ARRAY['CAT', 'XAT'], 210, 1991, ARRAY['AICTE'], ARRAY['Creative Campus', 'Media Labs', 'Innovation Centers']),

('Great Lakes Institute of Management', 'GLIM', 'Chennai, Tamil Nadu', 'Chennai', 'Tamil Nadu', 'Private', 'https://www.greatlakes.edu.in', 'Great Lakes offers world-class management education with international faculty and global exposure opportunities.', 1750000, 1750000, 1600000, 3500000, 92, 40, ARRAY['CAT', 'XAT', 'GMAT'], 180, 2004, ARRAY['AICTE'], ARRAY['Residential Campus', 'International Partnerships', 'Executive Education']),

('Symbiosis Institute of Business Management', 'SIBM Pune', 'Pune, Maharashtra', 'Pune', 'Maharashtra', 'Private', 'https://www.sibmpune.edu.in', 'SIBM Pune is known for its holistic development approach and strong emphasis on personality development alongside academics.', 1900000, 1900000, 1700000, 3600000, 94, 28, ARRAY['SNAP'], 300, 1978, ARRAY['UGC', 'AICTE'], ARRAY['Green Campus', 'Sports Facilities', 'Cultural Activities']),

('Institute of Management Technology', 'IMT Ghaziabad', 'Ghaziabad, Uttar Pradesh', 'Ghaziabad', 'Uttar Pradesh', 'Private', 'https://www.imt.edu', 'IMT Ghaziabad offers rigorous management education with strong focus on leadership development and industry readiness.', 1950000, 1950000, 1650000, 3400000, 96, 32, ARRAY['CAT', 'XAT'], 360, 1980, ARRAY['AICTE'], ARRAY['Modern Infrastructure', 'Industry Connect', 'Leadership Development'])

ON CONFLICT (name) DO NOTHING;

-- Insert sample programs
WITH bschool_ids AS (
  SELECT id, short_name FROM bschools WHERE short_name IN ('IIM Ahmedabad', 'IIM Bangalore', 'XLRI', 'FMS Delhi', 'JBIMS')
)
INSERT INTO programs (bschool_id, name, duration, fees, seats, specializations) 
SELECT 
  b.id,
  program_data.name,
  program_data.duration,
  program_data.fees,
  program_data.seats,
  program_data.specializations
FROM bschool_ids b
CROSS JOIN (
  VALUES 
    ('Post Graduate Programme in Management', '2 years', 2500000, 395, ARRAY['General Management', 'Finance', 'Marketing', 'Operations']),
    ('Post Graduate Programme in Management for Executives', '1 year', 3200000, 140, ARRAY['General Management', 'Leadership'])
) AS program_data(name, duration, fees, seats, specializations)
WHERE b.short_name = 'IIM Ahmedabad'

UNION ALL

SELECT 
  b.id,
  'Post Graduate Programme in Management',
  '2 years',
  2400000,
  406,
  ARRAY['Finance', 'Marketing', 'Operations', 'Strategy']
FROM bschool_ids b WHERE b.short_name = 'IIM Bangalore'

UNION ALL

SELECT 
  b.id,
  program_data.name,
  program_data.duration,
  program_data.fees,
  program_data.seats,
  program_data.specializations
FROM bschool_ids b
CROSS JOIN (
  VALUES 
    ('Post Graduate Diploma in Management (Business Management)', '2 years', 2550000, 180, ARRAY['General Management', 'Finance', 'Marketing']),
    ('Post Graduate Diploma in Management (Human Resource Management)', '2 years', 2650000, 198, ARRAY['Human Resources', 'Organizational Behavior'])
) AS program_data(name, duration, fees, seats, specializations)
WHERE b.short_name = 'XLRI'

UNION ALL

SELECT 
  b.id,
  'Master of Business Administration',
  '2 years',
  19500,
  236,
  ARRAY['Finance', 'Marketing', 'Operations', 'Strategy']
FROM bschool_ids b WHERE b.short_name = 'FMS Delhi'

UNION ALL

SELECT 
  b.id,
  'Master of Management Studies',
  '2 years',
  680000,
  120,
  ARRAY['Finance', 'Marketing', 'Operations', 'Systems']
FROM bschool_ids b WHERE b.short_name = 'JBIMS';

-- Insert sample cutoffs
WITH bschool_data AS (
  SELECT id, short_name FROM bschools WHERE short_name IN ('IIM Ahmedabad', 'IIM Bangalore', 'XLRI', 'FMS Delhi', 'JBIMS')
)
INSERT INTO cutoffs (bschool_id, exam_name, year, general, obc, sc, st, ews) 
SELECT 
  b.id,
  cutoff_data.exam_name,
  cutoff_data.year,
  cutoff_data.general,
  cutoff_data.obc,
  cutoff_data.sc,
  cutoff_data.st,
  cutoff_data.ews
FROM bschool_data b
CROSS JOIN (
  VALUES 
    ('CAT', 2024, 99.5, 96.5, 85.0, 85.0, 99.0),
    ('CAT', 2023, 99.2, 96.0, 84.5, 84.5, 98.8)
) AS cutoff_data(exam_name, year, general, obc, sc, st, ews)
WHERE b.short_name = 'IIM Ahmedabad'

UNION ALL

SELECT 
  b.id,
  cutoff_data.exam_name,
  cutoff_data.year,
  cutoff_data.general,
  cutoff_data.obc,
  cutoff_data.sc,
  cutoff_data.st,
  cutoff_data.ews
FROM bschool_data b
CROSS JOIN (
  VALUES 
    ('CAT', 2024, 99.0, 95.5, 82.0, 82.0, 98.5),
    ('CAT', 2023, 98.8, 95.0, 81.5, 81.5, 98.2)
) AS cutoff_data(exam_name, year, general, obc, sc, st, ews)
WHERE b.short_name = 'IIM Bangalore'

UNION ALL

SELECT 
  b.id,
  cutoff_data.exam_name,
  cutoff_data.year,
  cutoff_data.general,
  cutoff_data.obc,
  cutoff_data.sc,
  cutoff_data.st,
  cutoff_data.ews
FROM bschool_data b
CROSS JOIN (
  VALUES 
    ('XAT', 2024, 95.0, 90.0, 78.0, 78.0, 94.0),
    ('XAT', 2023, 94.5, 89.5, 77.5, 77.5, 93.5)
) AS cutoff_data(exam_name, year, general, obc, sc, st, ews)
WHERE b.short_name = 'XLRI'

UNION ALL

SELECT 
  b.id,
  cutoff_data.exam_name,
  cutoff_data.year,
  cutoff_data.general,
  cutoff_data.obc,
  cutoff_data.sc,
  cutoff_data.st,
  cutoff_data.ews
FROM bschool_data b
CROSS JOIN (
  VALUES 
    ('CAT', 2024, 98.5, 93.0, 75.0, 75.0, 97.0),
    ('CAT', 2023, 98.2, 92.5, 74.5, 74.5, 96.5)
) AS cutoff_data(exam_name, year, general, obc, sc, st, ews)
WHERE b.short_name = 'FMS Delhi'

UNION ALL

SELECT 
  b.id,
  cutoff_data.exam_name,
  cutoff_data.year,
  cutoff_data.general,
  cutoff_data.obc,
  cutoff_data.sc,
  cutoff_data.st,
  cutoff_data.ews
FROM bschool_data b
CROSS JOIN (
  VALUES 
    ('CAT', 2024, 97.0, 90.0, 70.0, 70.0, 95.0),
    ('CET', 2024, 99.8, 95.0, 85.0, 85.0, 99.5)
) AS cutoff_data(exam_name, year, general, obc, sc, st, ews)
WHERE b.short_name = 'JBIMS';

-- Insert sample application deadlines
WITH bschool_data AS (
  SELECT id, short_name FROM bschools LIMIT 5
)
INSERT INTO application_deadlines (bschool_id, title, deadline_date, description, type)
SELECT 
  b.id,
  deadline_data.title,
  deadline_data.deadline_date,
  deadline_data.description,
  deadline_data.type
FROM bschool_data b
CROSS JOIN (
  VALUES 
    ('CAT 2024 Registration', '2024-09-15', 'Last date for CAT registration', 'Exam'),
    ('Application Deadline - Round 1', '2024-11-29', 'First round application deadline', 'Application'),
    ('Application Deadline - Round 2', '2025-01-15', 'Second round application deadline', 'Application'),
    ('Interview Results', '2025-04-30', 'Final admission results declaration', 'Result')
) AS deadline_data(title, deadline_date, description, type);