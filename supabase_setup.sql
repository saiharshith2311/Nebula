-- ==========================================
-- CAMPUS COMPASS: SUPABASE SETUP & SECURITY SQL
-- ==========================================
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com)
-- to automatically set up your Storage Bucket and Row Level Security (RLS) policies.

-- ----------------------------------------------------
-- SECTION 1: STORAGE BUCKET CONFIGURATION
-- ----------------------------------------------------
-- Enable the storage extension if not enabled (this is usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the public bucket for Campus Compass if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'campus-compass', 
  'campus-compass', 
  true,                  -- Makes the files publicly readable
  10485760,              -- 10MB file size limit (in bytes)
  '{image/png, image/jpeg, image/jpg, image/webp, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document}'
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy 1: Allow anyone to view/download uploaded files (Public Read Access)
CREATE POLICY "Allow public read access to uploaded files" 
  ON storage.objects FOR SELECT 
  TO public 
  USING (bucket_id = 'campus-compass');

-- Storage Policy 2: Allow authenticated users with university emails to upload files
CREATE POLICY "Allow authenticated students to upload files" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (
    bucket_id = 'campus-compass' 
    AND (
      auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
      OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
      -- Fallback for testing/oauth users if you wish to allow standard Google accounts in development
      OR auth.jwt() ->> 'email' NOT LIKE '%@smail.iitm.ac.in'
    )
  );

-- ----------------------------------------------------
-- SECTION 2: ROW LEVEL SECURITY (RLS) FOR TABLES
-- ----------------------------------------------------

-- 1. REVIEWS TABLE POLICIES
-- Add rating column to reviews table if it does not already exist
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS rating integer;

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public (or authenticated) users to read all reviews
CREATE POLICY "Enable read access for all users" 
  ON public.reviews FOR SELECT 
  USING (true);

-- Restrict insertions to authenticated users with a verified smail email address
CREATE POLICY "Enable insert for authenticated university students only" 
  ON public.reviews FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
    OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
    -- Note: If testing with non-smail Google OAuth accounts in dev, you can temporarily comment out the email constraint
  );


-- 2. EVENTS TABLE POLICIES
-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow public (or authenticated) users to read all events
CREATE POLICY "Enable read access for all users" 
  ON public.events FOR SELECT 
  USING (true);

-- Restrict insertions to authenticated users with a verified smail email address
CREATE POLICY "Enable insert for authenticated university students only" 
  ON public.events FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
    OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
  );


-- 3. PLACEMENTS TABLE POLICIES
-- Enable Row Level Security
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;

-- Allow public (or authenticated) users to read all placement resources
CREATE POLICY "Enable read access for all users" 
  ON public.placements FOR SELECT 
  USING (true);

-- Restrict insertions to authenticated users with a verified smail email address
CREATE POLICY "Enable insert for authenticated university students only" 
  ON public.placements FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
    OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
  );


-- ----------------------------------------------------
-- 4. DEPARTMENTS TABLE & RLS POLICIES
-- ----------------------------------------------------

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Allow public (or authenticated) users to read all department resources
CREATE POLICY "Enable read access for all users" 
  ON public.departments FOR SELECT 
  USING (true);
-- Restrict insertions to authenticated users with a verified smail email address
CREATE POLICY "Enable insert for authenticated university students only" 
  ON public.departments FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
    OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
  );

-- ----------------------------------------------------
-- SECTION 3: SEEDING DEFAULT DEPARTMENT DATA
-- ----------------------------------------------------
-- Copy and run this in your Supabase SQL editor to populate default resource folders:

INSERT INTO public.departments (category, title, description) VALUES
('Aerospace', 'Aerospace Engineering Drive', '[Open Course & Placements Drive](https://drive.google.com/drive/folders/1X9-h5PiDaVL14SUWf4z5uP4dph05j3Rt)'),
('Biotechnology', 'Biotech & Biosciences Drive', '[Open Biotech Academic Drive](https://drive.google.com/folderview?id=1_bS2WpgeFRYFLOA7ErUccq7mR__jJp6i)'),
('Chemical', 'Chemical Engineering Drive', '[Open CH Academic Drive](https://drive.google.com/drive/folders/1JxLrk-8g0IFqJSSrCyw_eGhHZashHrmV)

[View CH Electives Sheet](https://docs.google.com/spreadsheets/d/1QbBlRX8bfRjlJWq71QKAKX_jsNOHMfJyOJMW_QICbxw/edit?usp=drivesdk)'),
('Civil', 'Civil Engineering Drive', '[Open Civil Academic Drive](https://drive.google.com/drive/u/1/folders/1BpH187QdGFyarf173CnKwEw-uiJlTkZi)'),
('Computational Engineering and Mechanics (CEM)', 'Computational Engineering Resources', 'Welcome to the CEM resources hub. Click ''Upload Resource'' to share materials, drives, or slides.'),
('Computer Science', 'CSE Semester Papers & Notes', '[Open CSE Previous Papers](https://drive.google.com/drive/folders/14ySGuB8Tq-yYExVX8oLGkvZRUrMgDJWt)'),
('Data Science and Artificial Intelligence', 'Data Science & AI Resources', 'Welcome to the DSAI resources hub. Click ''Upload Resource'' to share materials, drives, or slides.'),
('Electrical', 'Electrical Engineering Drive', '[Open Electrical 2023 Drive](https://drive.google.com/drive/folders/1Us7SI2eLxUbF-zPi9fgX1I3q3wjR3Vcg)'),
('Engineering Design', 'Engineering Design Drive', '[Open Design ED23 Drive](https://drive.google.com/drive/folders/1FWbDKzhUNTEO0KoC2z9ui4RDULVeVnLM?usp=drive_link)'),
('Instrumentation and Biomedical Engineering (iBME)', 'Instrumentation & Biomedical Resources', 'Welcome to the iBME resources hub. Click ''Upload Resource'' to share materials, drives, or slides.'),
('Mechanical', 'Mechanical Engineering Drive', '[Open Mechanical Core Drive](https://drive.google.com/drive/folders/178uIbQvjF35hEMZZCUyBVFxIhXQ7UzDJ)

[Open Mechanical 2024 Drive](https://drive.google.com/drive/folders/1Us7SI2eLxUbF-zPi9fgX1I3q3wjR3Vcg)'),
('Metallurgy', 'MME Academic Drive', '[Open Metallurgy Drive](https://drive.google.com/drive/folders/1TEYRCZJOoyi2SFP0kWobEe1S-gTGY4YS?usp=sharing)'),
('Naval Architecture', 'Naval Arch & Ocean Engineering', '[Open Naval Academic Drive](https://drive.google.com/drive/folders/1uOsW1wfX_8NU2W7X0jDUqF8Ix4twJKgO?usp=sharing)

[View NAOE Linktree Portal](https://linktr.ee/naoe_iitm)');


-- ----------------------------------------------------
-- SECTION 4: SEEDING DEFAULT REVIEWS DATA
-- ----------------------------------------------------
-- Copy and run this in your Supabase SQL editor to populate elective reviews:

-- Seed new elective reviews
INSERT INTO public.reviews (course, course_id, professor, review) VALUES
('Modern Science in India', 'HS3410', 'John Bosco Lourdusamy', 'Extremely boring, aand absolyoutely youseless'),
('Principles of Economics (Section A)', 'HS3002A', 'Santhosh kumar sahu', 'Jyoust basic, entirely based on Gregory mankiw.'),
('Literature and Life', 'HS4030', 'Dhanvel', 'Peace coyoyourse with great content.'),
('Science Fiction : An appreciation', 'HS2050', 'Mohan', 'Some short stories were too good aand some were boring byout overall the content is good'),
('social psychology', 'HS4370', 'Prema', 'Course is not very interesting, but you can study from the book before exams and score decent grades. Evaluation includes survey, midsem, and endsem, and with some effort getting a B grade is manageable.'),
('Energy Economics', 'ID5070', 'Professor Santosh Kumar', 'Excellent course with online exams and engaging lectures by the professor. Taking notes, focusing on important topics discussed in class, and reading the provided materials helps in scoring well.'),
('Maths in India', 'HS4860', 'Aditya Kochalna', 'Course mainly focuses on old mathematical problem-solving methods, and regular practice is important to score well. Evaluation has 2 quizzes and an endsem, and practicing the methods properly makes scoring good marks easier.'),
('Advanced Topics in Economics', NULL, 'Professor Murahleed', 'Excellent course with sitting exams and very good teaching. Attending lectures, taking notes, participating in discussions, and reading the provided materials helps in scoring well.'),
('Introduction to Contemporary Tibet', 'HS6560', 'Sonika Gupta', 'Peace course with lite attendance and easy evaluation through assignments, book review, and endsem. Even with low effort passing is manageable, and putting proper effort can help you get an S grade.'),
('Astronomy in India', 'HS4850', 'Prof. Aditya Kolachana', 'Great course covering basics of astronomy and advanced techniques used by ancient Indians. Evaluation includes quizzes, project, and endsem, and consistent effort is needed to score good grades.'),
('French I', 'HS1110', 'Jayanthi C', 'Good course if you are genuinely interested in learning French, but beginners may find the pace fast and need to put extra effort. Attendance is strict, and grading can be tough because many students already know French and score high.'),
('Intro to Sociology', 'HS2370', 'Dr. Shakthi (A post-doc at HS dept.)', 'Course content is understandable and well covered, with evaluation based on essay writing in midsem and endsem. No attendance policy, and scoring good grades is quite easy when Dr. Shakthi handles the course.'),
('History of english language and literature', NULL, 'Mr Jyotirmay Tripaathi', 'Take this course only if you are deeply interested in philosophy, as the professor is very strict and grading can be harsh. Evaluation includes 2 quizzes and an endsem, and scoring good grades is quite tough.'),
('Korean 1', 'HS1080', 'Dr. Shim Soo Jin', 'Excellent Korean course with very helpful teaching and strong focus on speaking, writing, listening, and pronunciation practice. Evaluation includes quizzes, presentation, and endsem, and consistent daily practice is necessary to score good grades.'),
('China in contemporary global politics', 'HS3420', 'Joe Thomas', 'Interesting course covering China’s history, politics, global relations, and topics like Tibet, Hong Kong, Taiwan, and the South China Sea. Evaluation includes viva and essay-based exams, attendance is strict, and scoring good grades can be tough.'),
('Social History of Medicine in Colonial India', 'HS3060', 'John Bosco Laudrswamy (JBL)', 'Course is a history-based study of medicine and diseases in colonial India, covering topics like cholera, plague, malaria, and IMS. Prof is strict about attendance and punctuality, but regular reading and class attention can help you get an S grade.'),
('Indian National Movement', 'HS2040', 'Prof. Santosh Abraham', 'Interesting course for students interested in Indian history, British rule, and the independence struggle. Evaluation includes class tests, term paper, and endsem, and studying with genuine interest can help in getting an A or S grade.'),
('Sanskrit For Yoga', NULL, 'Prof. KS Kannan', 'Course focuses on learning Sanskrit and yoga-related texts, with good teaching and a strong theoretical approach. Attendance is strict, and regular study is important for getting good grades, especially for beginners in Sanskrit.'),
('Ancient Civilizations', 'HS4580', 'Santosh Abraham', 'Great course for students interested in ancient global history and mysterious cultures like pyramids. Evaluation is fully descriptive with long essay writing, and scoring is not very easy due to the subjective nature of the course.'),
('Introduction to Linguistics', NULL, 'Rajesh Kumar', 'Interesting course about language structure, language learning, and its relation to society, with very good teaching by the professor. Attendance and regularity are important, evaluation includes write-ups and endsem, and the grading difficulty is moderate.'),
('Principles of Economics (Section C)', 'HS3002C', 'Sandeep kumar', 'Good course for learning economics with an easy textbook and useful concepts, though lectures may feel boring for some. Attendance is fully strict and punctuality matters, but spending decent effort can help you get an A grade.'),
('Principles of Economics (Section D)', 'HS3002D', 'Shalinta Mathews', 'Course is not as easy as it initially seems, with evaluation having both MCQs and subjective exams. Attendance is strict, and grading difficulty depends a lot on the professor handling the course.'),
('Money,banking and financial markets', 'ID5070', 'Pramod naik', 'Good course for students interested in stock markets, banking, and money flow concepts. Evaluation includes surprise tests, midsem, and endsem, attendance is moderately strict, and grading depends a lot on the competition in the class.'),
('Industrial Economics', 'HS5753', 'Sandeep Kumar KUjur', 'Course was expected to focus on macroeconomics and the manufacturing sector, but the teaching mostly felt similar to Principles of Economics. Evaluation includes objective quizzes and an endsem, and although attendance is taken daily, the 75% rule is not very strict.'),
('Developmental Alternatives', 'HS4290', 'Jyothirmaya tripathi', 'Good course overall with quizzes and endsem as evaluation components. Professor is strict, and getting even a B grade requires consistent hard work.'),
('Climate Economics', 'HS5760', 'Santosh Kumar Sahu', 'Covers the relationship between economics, climate change, and environmental policy. Evaluation is usually assignment and exam based, and students who follow the lecture slides and current examples generally find the course manageable. (IIT Madras)'),
('Introduction to International Organisations', 'HS5115', 'Tabraz S. S.', 'Focuses on the United Nations, WTO, IMF, World Bank, and other international institutions. The course is discussion-oriented with analytical writing, and students interested in international relations generally enjoy it.'),
('Introduction to Linguistics', NULL, 'Prof. Anindita Sahoo', 'Introduces language structure, phonetics, syntax, and language acquisition. Regular attendance and completing write-ups help in understanding the concepts, while evaluation is generally based on assignments and exams.'),
('German I', 'HS1090', 'Milind Brahme', 'Beginner-friendly language course focusing on speaking, listening, reading, and writing. Regular practice is important, attendance is usually expected, and students who keep up with weekly exercises generally perform well. (IIT Madras)'),
('Japanese II', 'ED1092', 'Norie Kobayashi', 'Continues Japanese I with more grammar, vocabulary, conversation, and reading practice. Daily revision is recommended, and students with a genuine interest in learning Japanese generally find the course rewarding.'),
('German II', 'HS1100', 'Milind Brahme', 'Continues German I with stronger emphasis on grammar, reading, writing, and conversation. Regular practice is essential, and students interested in learning German generally find it rewarding.'),
('French II', 'HS1120', 'Jayashree C', 'Intermediate French covering communication, grammar, and vocabulary. Best suited for students who enjoyed French I and are willing to practice consistently.'),
('Modern Governments and Comparative Constitutions', 'HS2030', 'Joe Thomas Karackattu', 'Covers political systems and constitutions across countries. Reading-intensive with discussion and analytical writing. Good for students interested in politics and governance.'),
('Women in India: Problems and Prospects', 'HS3007', 'Binitha V. Thampi', 'Focuses on gender, society, development, and public policy in India. Includes case studies and critical discussions with essay-oriented evaluation.'),
('Language and Society in India', 'HS3028', 'Rajesh Kumar', 'Explores multilingualism, language variation, and social aspects of language. Suitable for students interested in linguistics and communication.'),
('Principles and Parameters in Natural Language', 'HS3029', 'Rajesh Kumar', 'Introduces theoretical linguistics and language structure. More conceptual than HS3028 and suited for students interested in language theory.'),
('Technology and Public Policy', 'HS3031', 'Christoph Woiwode', 'Examines the relationship between technology, ethics, governance, and society. Encourages critical thinking through discussions and written assignments.'),
('Short Story Classics', 'HS3090', 'Avishek Parui', 'Covers classic short stories from world literature with emphasis on literary analysis. Ideal for students who enjoy reading and discussions.'),
('Introduction to Cultural Anthropology', 'HS3280', 'Santhosh Abraham', 'Introduces human cultures, traditions, and societies from an anthropological perspective. Reading and descriptive answers are important.'),
('Decision Modelling', 'HS4001', 'Anup Kumar Bhandari', 'Focuses on structured decision-making and analytical reasoning. Includes conceptual and application-oriented problems.'),
('Introduction to Indian Philosophy', 'HS4002', 'Anup Kumar Bhandari', 'Introduces major Indian philosophical traditions and schools of thought. Reading and conceptual understanding are more important than memorization.'),
('Cultural Studies', 'HS4005', 'Avishek Parui', 'Explores media, popular culture, identity, and society. Discussion-based with analytical writing and presentations.'),
('Indian Fiction in English', 'HS4010', 'Aysha Viswamohan', 'Studies novels and short stories by Indian English authors. Suitable for students interested in literature and literary analysis.'),
('Symbolic Logic', 'HS4031', 'Rajesh Kumar', 'Covers formal logic, arguments, proofs, and logical reasoning. More analytical than descriptive and useful for students who enjoy structured thinking.'),
('Humanities in Technological Age', 'HS4060', 'Solomon Benjamin', 'Discusses the interaction between technology, society, ethics, and development. Encourages critical thinking about contemporary issues.'),
('Applied Economics', 'HS4300', 'Sandeep Kumar Kujur', 'Introduces practical applications of economic principles to business and public policy. Includes numerical and conceptual components.'),
('Contemporary Issues in Development', 'HS4350', 'Kalpana K', 'Covers poverty, inequality, sustainability, and development policy using current examples and case studies.'),
('Introduction to European Philosophy', 'HS4450', 'Christoph Woiwode', 'Surveys major European philosophers and philosophical traditions. Reading-intensive with emphasis on interpretation and argument.'),
('Introduction to Chinese Language', 'HS4571', 'Hasiao-Hui Yuvan', 'Beginner-friendly course covering basic Mandarin speaking, listening, reading, and writing. Consistent practice helps throughout the semester.'),
('Contexts, Politics, and Ideas: An Introduction to Ideologies', 'HS5612', 'Joe Thomas Karackattu', 'Introduces political ideologies such as liberalism, socialism, nationalism, and conservatism with emphasis on historical context and debate.'),
('Indian Art', 'HS5920', 'Aditya K', 'Covers Indian art history, architecture, and aesthetics through lectures and visual analysis. Suitable for students interested in history and culture.'),
('History of Science and the Public', 'HS6017', 'John Bosco Lourdusamy', 'Explores the historical development of science and its interaction with society. Reading-based course with emphasis on historical interpretation.'),
('European Union Studies', 'HS6940', 'Christoph Woiwode', 'Covers the history, institutions, policies, and politics of the European Union. Best suited for students interested in international relations and global affairs.');
