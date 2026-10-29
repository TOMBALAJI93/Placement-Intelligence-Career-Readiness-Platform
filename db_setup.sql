-- 1. Create the users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    dbms_completed_levels TEXT,
    dbms_level INT,
    dbms_mastery VARCHAR(50)
);

-- Ensure columns exist in case the table was created previously
ALTER TABLE users ADD COLUMN IF NOT EXISTS dbms_completed_levels TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dbms_level INT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dbms_mastery VARCHAR(50);

-- 2. Insert the student data
INSERT INTO users (id, password, role, name, department) VALUES
('24111001', 'Welcome', 'student', 'ABDUL JABBAR A H', 'Cyber Security'),
('24111003', 'Welcome', 'student', 'ABINAYA A', 'Cyber Security'),
('24111004', 'Welcome', 'student', 'ABISHECK R', 'Cyber Security'),
('24111005', 'Welcome', 'student', 'ADHI A', 'Cyber Security'),
('24111007', 'Welcome', 'student', 'AKASH S', 'Cyber Security'),
('24111008', 'Welcome', 'student', 'AMIRDHA DHARSHINI V T', 'Cyber Security'),
('24111009', 'Welcome', 'student', 'ANISHA S', 'Cyber Security'),
('24111010', 'Welcome', 'student', 'ARULKUMAR P', 'Cyber Security'),
('24111013', 'Welcome', 'student', 'BALA S', 'Cyber Security'),
('24111014', 'Welcome', 'student', 'BALAGUHAN R', 'Cyber Security'),
('24111015', 'Welcome', 'student', 'BALAJI M', 'Cyber Security'),
('24111017', 'Welcome', 'student', 'BALAVENKAT S', 'Cyber Security'),
('24111018', 'Welcome', 'student', 'BHARANITHARAN V', 'Cyber Security'),
('24111019', 'Welcome', 'student', 'BHARATH V K', 'Cyber Security'),
('24111020', 'Welcome', 'student', 'BHARATHRAJ P', 'Cyber Security'),
('24111021', 'Welcome', 'student', 'DAVID PRINSON R', 'Cyber Security'),
('24111022', 'Welcome', 'student', 'DEEPAKRAJ K', 'Cyber Security'),
('24111024', 'Welcome', 'student', 'DHARSHINI K', 'Cyber Security'),
('24111025', 'Welcome', 'student', 'DHARSHINI M', 'Cyber Security'),
('24111027', 'Welcome', 'student', 'DHINESH S', 'Cyber Security'),
('24111028', 'Welcome', 'student', 'ELAKIYA M', 'Cyber Security'),
('24111029', 'Welcome', 'student', 'EVAN PRAISON A', 'Cyber Security'),
('24111030', 'Welcome', 'student', 'GOBINATH N', 'Cyber Security'),
('24111031', 'Welcome', 'student', 'GOGULNATH S', 'Cyber Security'),
('24111032', 'Welcome', 'student', 'GOPU R', 'Cyber Security'),
('24111033', 'Welcome', 'student', 'HARIHARASUDHAN N L', 'Cyber Security'),
('24111034', 'Welcome', 'student', 'HARINITHAA V', 'Cyber Security'),
('24111035', 'Welcome', 'student', 'HARSHAN K', 'Cyber Security'),
('24111036', 'Welcome', 'student', 'HEMAVARSHINI G', 'Cyber Security'),
('24111038', 'Welcome', 'student', 'JEEVANANDAM B', 'Cyber Security'),
('24111039', 'Welcome', 'student', 'JESSYTHERASA B', 'Cyber Security'),
('24111040', 'Welcome', 'student', 'KALYAN KUMARAN I K', 'Cyber Security'),
('24111041', 'Welcome', 'student', 'KARTHIGEYANVAIBHAV T G', 'Cyber Security'),
('24111042', 'Welcome', 'student', 'KAVI PRIYA S', 'Cyber Security'),
('24111043', 'Welcome', 'student', 'KESAVAN M', 'Cyber Security'),
('24111047', 'Welcome', 'student', 'LINU PRIYANKA A', 'Cyber Security'),
('24111048', 'Welcome', 'student', 'MADESH M', 'Cyber Security'),
('24111049', 'Welcome', 'student', 'MADHAN R S', 'Cyber Security'),
('24111050', 'Welcome', 'student', 'MADHUMITHA A', 'Cyber Security'),
('24111051', 'Welcome', 'student', 'MADHUSUDHAN MC', 'Cyber Security'),
('24111052', 'Welcome', 'student', 'MAHIZHAN R S', 'Cyber Security'),
('24111053', 'Welcome', 'student', 'MALATHI K', 'Cyber Security'),
('24111054', 'Welcome', 'student', 'MANIKANDAN B', 'Cyber Security'),
('24111055', 'Welcome', 'student', 'MARIYA LYDIA J', 'Cyber Security'),
('24111056', 'Welcome', 'student', 'MELVIN JASON A', 'Cyber Security'),
('24111057', 'Welcome', 'student', 'MOHAMMED AFSAL M', 'Cyber Security'),
('24111058', 'Welcome', 'student', 'MUGILESH S V', 'Cyber Security'),
('24111059', 'Welcome', 'student', 'MUKUNTHAN S', 'Cyber Security'),
('24111060', 'Welcome', 'student', 'MUTHUKUMARAN A', 'Cyber Security'),
('24111061', 'Welcome', 'student', 'NADHA SHREE R G', 'Cyber Security'),
('24111062', 'Welcome', 'student', 'NAREN M K', 'Cyber Security')
ON CONFLICT (id) DO NOTHING;

-- 3. (Optional) Insert default Faculty and Admin accounts if you want to test those portals
INSERT INTO users (id, password, role, name, department) VALUES
('faculty_cs', 'password123', 'faculty', 'Dr. Sarah Connor', 'Cyber Security'),
('admin_system', 'admin123', 'admin', 'System Admin', 'IT')
ON CONFLICT (id) DO NOTHING;
