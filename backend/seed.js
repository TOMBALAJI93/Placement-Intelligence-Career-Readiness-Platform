const { Pool } = require('pg'); 
const pool = new Pool({ user: 'postgres', host: 'localhost', database: 'placementai', password: '123', port: 5432 }); 

const dbmsData = {
  "24111001": [0,1],
  "24111003": [0,1],
  "24111004": [0,1,2],
  "24111005": [0],
  "24111007": [0,1,2],
  "24111008": [0,1,2,3,4,5],
  "24111009": [0,1],
  "24111010": [0],
  "24111013": [0],
  "24111014": [0,1],
  "24111015": [0,1,2,3,4,5,6],
  "24111017": [0],
  "24111018": [0],
  "24111019": [0,1],
  "24111020": [0],
  "24111021": [0,1,2,3],
  "24111022": [0,1],
  "24111024": [0,1],
  "24111025": [0,1,2],
  "24111027": [0,1],
  "24111028": [0,1],
  "24111029": [0],
  "24111030": [0,1,2],
  "24111031": [0,1],
  "24111032": [0,1],
  "24111033": [0,1,2],
  "24111034": [0,1],
  "24111035": [0],
  "24111036": [0,1,2,3,4,5],
  "24111038": [0,1,2],
  "24111039": [0,1,2],
  "24111040": [0,1],
  "24111041": [0,1],
  "24111042": [0,1,2],
  "24111043": [0,1],
  "24111047": [0],
  "24111048": [0],
  "24111049": [0,1,2],
  "24111050": [0,1,2,3,4],
  "24111051": [0],
  "24111052": [0,1,2],
  "24111053": [0,1],
  "24111054": [0,1],
  "24111055": [0,1],
  "24111056": [0],
  "24111057": [0],
  "24111058": [0,1,2],
  "24111059": [0,1,2,3,4],
  "24111060": [0],
  "24111061": [0,1],
  "24111062": [0,1,2]
};

async function seed() {
  try {
    // 1. Add columns to users table if they don't exist
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS dbms_completed_levels TEXT;");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS dbms_level INT;");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS dbms_mastery VARCHAR(50);");
    console.log('Columns verified/added successfully.');

    // 2. Insert admin/faculty
    await pool.query("INSERT INTO users (id, password, role, name, department) VALUES ('faculty_cs', 'password123', 'faculty', 'Dr. Sarah Connor', 'Cyber Security'), ('admin_system', 'admin123', 'admin', 'System Admin', 'IT') ON CONFLICT (id) DO NOTHING;");
    console.log('Faculty and Admin seeded.');

    // 3. Update student tracks
    for (const [studentId, levels] of Object.entries(dbmsData)) {
      const level = Math.max(...levels);
      let mastery = 'Beginner';
      if (level >= 3 && level <= 4) mastery = 'Intermediate';
      if (level >= 5) mastery = 'Advanced';
      
      const levelsStr = JSON.stringify(levels);
      
      await pool.query(
        "UPDATE users SET dbms_completed_levels = $1, dbms_level = $2, dbms_mastery = $3 WHERE id = $4",
        [levelsStr, level, mastery, studentId]
      );
    }
    console.log('DBMS Track data seeded for all students.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
