import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { TeacherProfile, PAAgreement, PAIndicator, PAEvidence } from './src/types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Helper to hash passwords using native Node crypto SHA256
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial default JSON structure
interface DatabaseStructure {
  users: Array<TeacherProfile & { passwordHash: string }>;
  agreements: Array<PAAgreement>;
  indicators: Array<PAIndicator>;
  evidence: Array<PAEvidence>;
}

const DEFAULT_DB: DatabaseStructure = {
  users: [],
  agreements: [],
  indicators: [],
  evidence: [],
};

// Check and load database
function loadDb(): DatabaseStructure {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
    return DEFAULT_DB;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse database file, resetting to empty', e);
    return DEFAULT_DB;
  }
}

function saveDb(db: DatabaseStructure) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write database file', e);
  }
}

// Teacher Core Methods
export function registerUser(
  email: string,
  userName: string,
  fullName: string,
  position: string,
  schoolName: string,
  teachingSubject: string,
  teachingHours: string
): TeacherProfile | null {
  const db = loadDb();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return null; // Email taken
  }

  const id = 'teacher_' + Math.random().toString(36).substr(2, 9);
  const passwordHash = hashPassword(userName); // password defaults to same value initially if simplified, but let's offer standard parameter
  
  const newUser = {
    id,
    email,
    fullName,
    position,
    schoolName,
    teachingSubject,
    teachingHours,
    passwordHash: hashPassword(userName), // We default the password to what they specify
    photoUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fullName)}`
  };

  db.users.push(newUser);
  saveDb(db);

  const { passwordHash: _, ...profile } = newUser;
  return profile;
}

export function loginUser(email: string, userNameInput: string): TeacherProfile | null {
  const db = loadDb();
  const user = db.users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hashPassword(userNameInput)
  );

  if (!user) return null;

  const { passwordHash: _, ...profile } = user;
  return profile;
}

export function updateTeacherProfile(id: string, updates: Partial<TeacherProfile>): TeacherProfile | null {
  const db = loadDb();
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return null;

  db.users[index] = {
    ...db.users[index],
    ...updates,
    id // keep id absolute
  };

  saveDb(db);
  const { passwordHash: _, ...profile } = db.users[index];
  return profile;
}

export function getTeacherProfile(id: string): TeacherProfile | null {
  const db = loadDb();
  const user = db.users.find(u => u.id === id);
  if (!user) return null;
  const { passwordHash: _, ...profile } = user;
  return profile;
}

// 15 Indicators Template aligned with OBEC (สพฐ.) Standards
const INDICATOR_TEMPLATES: Array<{
  category: 'learning' | 'support' | 'development';
  number: string;
  title: string;
  description: string;
  workPlan: string;
  indicators: string;
  evaluationTimes: string;
}> = [
  // ด้านที่ 1 การจัดการเรียนรู้ (8 ตัวชี้วัด)
  {
    category: 'learning',
    number: '1.1',
    title: 'สร้างและหรือพัฒนาหลักสูตร',
    description: 'จัดทำรายวิชาและหน่วยการเรียนรู้ให้สอดคล้องกับมาตรฐานการเรียนรู้ และตัวชี้วัดหรือผลการเรียนรู้ตามหลักสูตร',
    workPlan: 'วิเคราะห์หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน และหลักสูตรสถานศึกษา นำมาจัดทำหน่วยการเรียนรู้ แผนการจัดการเรียนรู้ รายวิชาที่สอน เพื่อให้สอดคล้องกับมาตรฐานและบริบทของผู้เรียน',
    indicators: 'ผู้เรียนร้อยละ 70 มีระดับผลการเรียนผ่านเกณฑ์ที่สถานศึกษากำหนด สอดคล้องกับมาตรฐานการเรียนรู้ของหลักสูตร',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '1.2',
    title: 'ออกแบบการจัดการเรียนรู้',
    description: 'เน้นผู้เรียนเป็นสำคัญ เพื่อให้ผู้เรียนมีความรู้ ทักษะ คุณลักษณะประจำวิชา คุณลักษณะอันพึงประสงค์ และสมรรถนะที่สำคัญตามหลักสูตร',
    workPlan: 'จัดทำแผนการจัดการเรียนรู้สอดคล้องกับการจัดการเรียนรู้แบบ Active Learning เน้นกระบวนการคิดวิเคราะห์ และการปฏิบัติจริง',
    indicators: 'ผู้เรียนร้อยละ 75 ได้รับการพัฒนาทักษะกระบวนการคิดตามสมรรถนะสำคัญของผู้เรียนผ่านกิจกรรมการเรียนรู้',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '1.3',
    title: 'จัดกิจกรรมการเรียนรู้',
    description: 'อำนวยความสะดวกในการเรียนรู้ และส่งเสริมผู้เรียนได้พัฒนาเต็มตามศักยภาพ เรียนรู้และทำงานร่วมกัน',
    workPlan: 'จัดกระบวนการเรียนรู้ด้วยรูปแบบ Active Learning เช่น Problem-based, Project-based หรือ Game-based ร่วมกับการใช้ชุดกิจกรรมส่งเสริมการมีส่วนร่วม',
    indicators: 'ผู้เรียนร้อยละ 80 มีความพึงพอใจและมีส่วนร่วมในกิจกรรมการเรียนรู้อย่างมีความสุข',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '1.4',
    title: 'สร้างและหรือพัฒนาสื่อ นวัตกรรม เทคโนโลยี และแหล่งเรียนรู้',
    description: 'สอดคล้องกับกิจกรรมการเรียนรู้ แก้ไขปัญหาผู้เรียน และการทำงานวิจัยพัฒนาสิ่งใหม่',
    workPlan: 'สร้างและวิจัยสื่อดิจิทัล เช่น บทเรียนออนไลน์ สื่อมัลติมีเดีย ใบงานอิเล็กทรอนิกส์ (LiveWorksheet) หรือแอพพลิเคชั่นการเรียนรู้มาช่วยแก้ปัญหาทักษะผู้เรียน',
    indicators: 'ผู้เรียนร้อยละ 70 สามารถเข้าถึงสื่อ นวัตกรรม และใช้ในการเรียนรู้ด้วยตนเองเพื่อยกระดับผลสัมฤทธิ์',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '1.5',
    title: 'วัดและประเมินผลการเรียนรู้',
    description: 'ด้วยวิธีการที่หลากหลาย เหมาะสม และสอดคล้องกับมาตรฐานการเรียนรู้ นำผลไปปรับปรุงพัฒนาผู้เรียน',
    workPlan: 'จัดทำเครื่องมือวัดผลสัมฤทธิ์ที่มีประสิทธิภาพ เช่น เกณฑ์ Rubrics แบบสังเกตพฤติกรรม และแบบทดสอบออนไลน์ พร้อมให้ข้อมูลสะท้อนกลับ (Feedback) เพื่อพัฒนาการเรียนรู้',
    indicators: 'เครื่องมือวัดผลได้รับการตรวจสอบค่าความเที่ยงตรง และผู้เรียนร้อยละ 100 ได้รับการประเมินรอบด้านตามบริบทจริง',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '1.6',
    title: 'ศึกษา วิเคราะห์ และสังเคราะห์ เพื่อแก้ไขปัญหาหรือพัฒนาการเรียนรู้',
    description: 'แก้ไขปัญหาหรือพัฒนาการเรียนรู้ที่ส่งผลต่อคุณภาพผู้เรียน',
    workPlan: 'ดำเนินงานกระบวนการวิจัยในชั้นเรียน (In-classroom Research) เพื่อแก้ปัญหาผู้เรียนที่อ่อนวิชาเรียน และส่งเสริมทักษะเฉพาะด้าน',
    indicators: 'ผลงานวิจัยในชั้นเรียนจำนวน 1 เรื่อง ที่สามารถนำมาแก้ปัญหากลุ่มเป้าหมายได้อย่างเห็นผลเชิงประจักษ์',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '1.7',
    title: 'จัดบรรยากาศที่ส่งเสริมและพัฒนาผู้เรียน',
    description: 'กระตุ้นให้ผู้เรียนเกิดกระบวนการคิด ทักษะชีวิต ทักษะการทำงาน ทักษะการเรียนรู้และนวัตกรรม',
    workPlan: 'จัดสภาพแวดล้อมห้องเรียนในรูปแบบที่มีความสุข ปลอดภัย กระตุ้นการเรียนรู้ด้วยมุมเทคโนโลยี บอร์ดแสดงผลงาน และเสริมแรงบวกในการจัดกิจกรรม',
    indicators: 'ผู้เรียนร้อยละ 85 รู้สึกอบอุ่น ปลอดภัย และมีความสุขในการเรียนภายใต้บรรยากาศเชิงบวก',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '1.8',
    title: 'อบรมและพัฒนาคุณลักษณะที่ดีของผู้เรียน',
    description: 'ปลูกฝังค่านิยม คุณธรรม จริยธรรม และคุณลักษณะอันพึงประสงค์ โดยคำนึงถึงความแตกต่างรายบุคคล',
    workPlan: 'ประสานบูรณาการการอบรมคุณธรรม จริยธรรม ผ่านกิจกรรมการเรียนรู้ หน้าเสาธง กิจกรรมโฮมรูม และกิจกรรมแนะแนว',
    indicators: 'ผู้เรียนร้อยละ 90 มีผลการประเมินคุณลักษณะอันพึงประสงค์ระดับดีขึ้นไปตามเกณฑ์โรงเรียน',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },

  // ด้านที่ 2 ด้านการส่งเสริมและสนับสนุนการจัดการเรียนรู้ (4 ตัวชี้วัด)
  {
    category: 'learning', // using database category grouping
    number: '2.1',
    title: 'จัดทำข้อมูลสารสนเทศของผู้เรียนและรายวิชา',
    description: 'มีข้อมูลสารสนเทศเพื่อสนับสนุนการจัดการเรียนรู้และพัฒนาคุณภาพผู้เรียน',
    workPlan: 'จัดทำระบบบันทึกผลการพัฒนาผู้เรียน (ปพ.5) ในรูปไฟล์สารสนเทศออนไลน์ รายงานคะแนน และความก้าวหน้าแก่ผู้เรียนอย่างสม่ำเสมอ',
    indicators: 'ผู้เรียนและผู้เกี่ยวข้องร้อยละ 100 มีการรับรู้และได้รับรายงานสารสนเทศเพื่อการวางแผนการเรียนอย่างมีคุณภาพ',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '2.2',
    title: 'ดำเนินการตามระบบดูแลช่วยเหลือผู้เรียน',
    description: 'คัดกรอง ค้นพบ ช่วยเหลือ ป้องกันผู้เรียนอย่างเป็นระบบ',
    workPlan: 'คัดกรองผู้เรียนผ่านระบบเยี่ยมบ้าน 100% จัดทำแบบบันทึก SDQ ประสานจัดหาสวัสดิการ ทุนการศึกษา และดูแลช่วยเหลือช่วยเหลือด้านจิตใจเชิงรุก',
    indicators: 'ผู้เรียนในความดูแลร้อยละ 100 ได้รับการสำรวจเยียวยาแก้ไขพฤติกรรมหรือได้รับความสงเคราะห์ตามสิทธิ์อย่างทันท่วงที',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '2.3',
    title: 'ปฏิบัติงานวิชาการ และงานอื่นๆ ของสถานศึกษา',
    description: 'ร่วมงานหลักเพื่อวางแผนงานส่วนกลาง ยกระดับคุณภาพการจัดการศึกษา',
    workPlan: 'ปฏิบัติงานพิเศษตามคำสั่งโรงเรียน เช่น กลุ่มงานพัสดุ งานทะเบียนวัดผล หัวหน้าสายชั้น หรือคณะทำงานประกันคุณภาพการศึกษา',
    indicators: 'ได้รับมอบหมายงานตามโครงสร้างบริหารและมีผลการปฏิบัติงานบรรลุเป้าหมายของโรงเรียนระดับดีเยี่ยม',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '2.4',
    title: 'ประสานความร่วมมือกับผู้ปกครอง ภาคีเครือข่าย และหรือสถานประกอบการ',
    description: 'ร่วมกันแก้ไขปัญหาและพัฒนาผู้เรียนอย่างร่วมมือร่วมใจ',
    workPlan: 'จัดกิจกรรมประชุมผู้ปกครองในชั้นเรียน (Classroom Meeting) สร้างกลุ่มเครือข่ายสื่อสารความปลอดภัยเด็ก และร่วมงานภาคประชาสังคม',
    indicators: 'ผู้ปกครองร้อยละ 90 มีส่วนร่วมในการรับฟัง ชื่นชม และช่วยเหลือดูแลการจัดการเรียนรู้วิถีใหม่ของบุตรหลาน',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },

  // ด้านที่ 3 ด้านการพัฒนาตนเองและวิชาชีพ (3 ตัวชี้วัด)
  {
    category: 'learning',
    number: '3.1',
    title: 'พัฒนาตนเองอย่างเป็นระบบและต่อเนื่อง',
    description: 'เพื่อให้มีความรู้ ความสามารถ ทักษะเฉพาะ สมรรถนะวิชาชีพครู และการก้าวทันการเปลี่ยนแปลงทางดิจิทัล',
    workPlan: 'เข้ารับการเข้าร่วมประชุมทางวิชาการ อบรมสัมมนาออนไลน์ผ่านระบบต่างๆ เสริมสร้างทักษะภาษาอังกฤษ เทคโนโลยีดิจิทัล และสะสมชั่วโมงพัฒนา',
    indicators: 'ได้รับการอบรมสะสมชั่วโมงวิชาชีพไม่ต่ำกว่า 20 ชั่วโมงต่อปี และมีวุฒิบัตรแสดงผลงานทางวิชาการ',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '3.2',
    title: 'มีส่วนร่วมในการแลกเปลี่ยนเรียนรู้ทางวิชาชีพเพื่อแก้ปัญหาและพัฒนา',
    description: 'วิญญาณแห่งเพื่อนช่วยเพื่อน แลกเปลี่ยน PLC เพื่อพัฒนาพฤติกรรมการจัดการเรียนรู้',
    workPlan: 'ร่วมในกลุ่มชุมชนแห่งการเรียนรู้ทางวิชาชีพ (PLC) ของกลุ่มสาระการเรียนรู้ ค้นหาประเด็นเพื่อนำมาพัฒนาสื่อช่วยสะท้อนแก่นการประเมิน PA',
    indicators: 'เข้าร่วมกลุ่ม PLC รวมกลุ่มพูดคุยปัญหาและกำหนดกลุ่มเป้าหมายแก้ไขเด็กเรียนอย่างน้อย 40 ชั่วโมงต่อปีการศึกษา',
    evaluationTimes: 'ตลอดปีการศึกษา'
  },
  {
    category: 'learning',
    number: '3.3',
    title: 'นำความรู้ ความสามารถ ทักษะที่ได้จากการพัฒนาวิชาชีพมาใช้',
    description: 'สร้างสรรค์นวัตกรรมใหม่ๆ ส่งผลลัพธ์โดยตรงต่อคุณภาพเด็กรุ่นต่อไป',
    workPlan: 'นำประเด็น PLC และข้อสรุปจากการอบรมมาผลิตนวัตกรรมบทเรียนชุดทักษะ เพื่อขยายผลพัฒนาผลสัมฤทธิ์เด็กได้อย่างประสบความสำเร็จ',
    indicators: 'ผู้เรียนกลุ่มปัญหาโรงเรียนร้อยละ 80 บรรลุการประเมินทักษะที่สูงขึ้นหลังครูนำหลักสูตรพัฒนาตนเองมาต่อยอดใช้',
    evaluationTimes: 'ตลอดปีการศึกษา'
  }
];

// PA Agreement Management
export function getAgreements(teacherId: string): PAAgreement[] {
  const db = loadDb();
  return db.agreements.filter(a => a.teacherId === teacherId);
}

export function getAgreementById(agreementId: string): PAAgreement | null {
  const db = loadDb();
  return db.agreements.find(a => a.id === agreementId) || null;
}

export function createAgreement(teacherId: string, budgetYear: string): PAAgreement {
  const db = loadDb();
  const agreementId = 'pa_' + Math.random().toString(36).substr(2, 9);
  
  // Create PAAgreement
  const newAgreement: PAAgreement = {
    id: agreementId,
    teacherId,
    budgetYear,
    status: 'draft',
    salary: '25,000',
    workloadLessons: '18',
    workloadSupport: '4',
    workloadSchool: '3',
    workloadLife: '2',
    part2Title: 'การแก้ปัญหาการอ่านออกเขียนไม่ได้และการคิดวิเคราะห์ผลการเรียนของผู้เรียน',
    part2Problem: 'ในยุคปัจจุบันพบปัญหาผู้เรียนขาดการจดจ่อ มีสมาธิสั้น และไม่ได้รับการกระตุ้นด้านภาษาและการคำนวณพื้นฐานอย่างเหมาะสม...',
    part2Process: '1. ศึกษาสภาพปัญหาและหลักสูตรวิเคราะห์ผู้เรียนรายบุคคล\n2. ออกแบบหน่วยและสื่อที่เพิ่มส่วนร่วม Active Learning\n3. จัดกิจกรรมเชิงบวก ประเมินความก้าวหน้าอย่างกัลยาณมิตร',
    part2OutcomeQty: 'ผู้เรียนร้อยละ 80 มีคะแนนทักษะวิชาชีพหรือเนื้อหาผ่านเกณฑ์ประเมินประเด็นท้าทายเฉลี่ยสูงขึ้น',
    part2OutcomeQly: 'ผู้เรียนสามารถจดบันทึกวิเคราะห์ สรุปประเด็น สื่อสารภาษาไทยและคณิตศาสตร์อย่างเข้าใจและมั่นใจเพิ่มขึ้น',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.agreements.push(newAgreement);

  // Initialize the 15 standard OBEC indicators for this agreement
  INDICATOR_TEMPLATES.forEach(t => {
    const indicatorId = `${agreementId}_ind_${t.number.replace('.', '_')}`;
    const newIndicator: PAIndicator = {
      id: indicatorId,
      agreementId,
      category: t.category,
      number: t.number,
      title: t.title,
      description: t.description,
      workPlan: t.workPlan,
      indicators: t.indicators,
      evaluationTimes: t.evaluationTimes,
      score: 3, // Auto pre-fill with score 3 (มาตรฐาน/ดี)
      selfEvaluationText: 'ได้ดำเนินการจัดทำโครงการ ออกแบบสื่อ และเก็บประเมินวิเคราะห์ผลผู้เรียนอย่างต่อเนื่อง สอดคล้องกับตัวชี้วัดที่เป็นข้อตกลง',
      updatedAt: new Date().toISOString(),
    };
    db.indicators.push(newIndicator);
  });

  saveDb(db);
  return newAgreement;
}

export function updateAgreement(id: string, updates: Partial<PAAgreement>): PAAgreement | null {
  const db = loadDb();
  const index = db.agreements.findIndex(a => a.id === id);
  if (index === -1) return null;

  db.agreements[index] = {
    ...db.agreements[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString()
  };

  saveDb(db);
  return db.agreements[index];
}

// PA Indicators Management
export function getIndicators(agreementId: string): PAIndicator[] {
  const db = loadDb();
  const list = db.indicators.filter(i => i.agreementId === agreementId);
  // Sort in numeric order e.g. 1.1, 1.2, ..., 3.3
  return list.sort((a, b) => {
    const aVals = a.number.split('.').map(Number);
    const bVals = b.number.split('.').map(Number);
    if (aVals[0] !== bVals[0]) return aVals[0] - bVals[0];
    return aVals[1] - bVals[1];
  });
}

export function updateIndicator(indicatorId: string, updates: Partial<PAIndicator>): PAIndicator | null {
  const db = loadDb();
  const index = db.indicators.findIndex(i => i.id === indicatorId);
  if (index === -1) return null;

  db.indicators[index] = {
    ...db.indicators[index],
    ...updates,
    id: indicatorId, // absolute
    updatedAt: new Date().toISOString()
  };

  saveDb(db);
  return db.indicators[index];
}

// PA Evidence Management
export function getEvidenceAll(agreementId: string): PAEvidence[] {
  const db = loadDb();
  return db.evidence.filter(e => e.agreementId === agreementId);
}

export function getEvidenceForIndicator(agreementId: string, indicatorNumber: string): PAEvidence[] {
  const db = loadDb();
  return db.evidence.filter(e => e.agreementId === agreementId && e.indicatorNumber === indicatorNumber);
}

export function addEvidence(
  agreementId: string,
  indicatorNumber: string,
  title: string,
  linkUrl: string,
  evidenceType: 'link' | 'image' | 'video' | 'document',
  description?: string
): PAEvidence {
  const db = loadDb();
  const id = 'ev_' + Math.random().toString(36).substr(2, 9);
  const newEv: PAEvidence = {
    id,
    agreementId,
    indicatorNumber,
    title,
    linkUrl,
    evidenceType,
    description,
    addedAt: new Date().toISOString()
  };

  db.evidence.push(newEv);
  saveDb(db);
  return newEv;
}

export function deleteEvidence(id: string): boolean {
  const db = loadDb();
  const initialLen = db.evidence.length;
  db.evidence = db.evidence.filter(e => e.id !== id);
  if (db.evidence.length < initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// MySQL SQL Dump Generator helper
export function generateMySQLDump(): string {
  const db = loadDb();
  let sql = `-- ========================================================\n`;
  sql += `-- MySQL / MariaDB Database Dump\n`;
  sql += `-- PA Teacher Portfolio & Performance Agreement System (ระบบ PA ครู สพฐ.)\n`;
  sql += `-- Generated on ${new Date().toISOString()}\n`;
  sql += `-- ========================================================\n\n`;

  sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
  sql += `DROP TABLE IF EXISTS \`pa_evidence\`;\n`;
  sql += `DROP TABLE IF EXISTS \`pa_indicators\`;\n`;
  sql += `DROP TABLE IF EXISTS \`pa_agreements\`;\n`;
  sql += `DROP TABLE IF EXISTS \`teachers\`;\n`;
  sql += `SET FOREIGN_KEY_CHECKS = 1;\n\n`;

  // Teachers Table
  sql += `-- --------------------------------------------------------\n`;
  sql += `-- Table Structure for \`teachers\`\n`;
  sql += `-- --------------------------------------------------------\n`;
  sql += `CREATE TABLE \`teachers\` (\n`;
  sql += `  \`id\` VARCHAR(50) NOT NULL,\n`;
  sql += `  \`email\` VARCHAR(100) NOT NULL UNIQUE,\n`;
  sql += `  \`passwordHash\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`fullName\` VARCHAR(150) NOT NULL,\n`;
  sql += `  \`position\` VARCHAR(100) NOT NULL,\n`;
  sql += `  \`schoolName\` VARCHAR(150) NOT NULL,\n`;
  sql += `  \`teachingSubject\` VARCHAR(150) DEFAULT NULL,\n`;
  sql += `  \`teachingHours\` VARCHAR(50) DEFAULT NULL,\n`;
  sql += `  \`photoUrl\` TEXT DEFAULT NULL,\n`;
  sql += `  \`headerBannerUrl\` TEXT DEFAULT NULL,\n`;
  sql += `  PRIMARY KEY (\`id\`)\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  // Agreements Table
  sql += `-- --------------------------------------------------------\n`;
  sql += `-- Table Structure for \`pa_agreements\`\n`;
  sql += `-- --------------------------------------------------------\n`;
  sql += `CREATE TABLE \`pa_agreements\` (\n`;
  sql += `  \`id\` VARCHAR(50) NOT NULL,\n`;
  sql += `  \`teacherId\` VARCHAR(50) NOT NULL,\n`;
  sql += `  \`budgetYear\` VARCHAR(10) NOT NULL,\n`;
  sql += `  \`status\` VARCHAR(20) NOT NULL DEFAULT 'draft',\n`;
  sql += `  \`salary\` VARCHAR(50) DEFAULT NULL,\n`;
  sql += `  \`workloadLessons\` VARCHAR(50) DEFAULT NULL,\n`;
  sql += `  \`workloadSupport\` VARCHAR(50) DEFAULT NULL,\n`;
  sql += `  \`workloadSchool\` VARCHAR(50) DEFAULT NULL,\n`;
  sql += `  \`workloadLife\` VARCHAR(50) DEFAULT NULL,\n`;
  sql += `  \`part2Title\` TEXT DEFAULT NULL,\n`;
  sql += `  \`part2Problem\` TEXT DEFAULT NULL,\n`;
  sql += `  \`part2Process\` TEXT DEFAULT NULL,\n`;
  sql += `  \`part2OutcomeQty\` TEXT DEFAULT NULL,\n`;
  sql += `  \`part2OutcomeQly\` TEXT DEFAULT NULL,\n`;
  sql += `  \`createdAt\` VARCHAR(50) NOT NULL,\n`;
  sql += `  \`updatedAt\` VARCHAR(50) NOT NULL,\n`;
  sql += `  PRIMARY KEY (\`id\`),\n`;
  sql += `  KEY \`fk_teacher_idx\` (\`teacherId\`),\n`;
  sql += `  CONSTRAINT \`fk_teacher\` FOREIGN KEY (\`teacherId\`) REFERENCES \`teachers\` (\`id\`) ON DELETE CASCADE\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  // Indicators Table
  sql += `-- --------------------------------------------------------\n`;
  sql += `-- Table Structure for \`pa_indicators\`\n`;
  sql += `-- --------------------------------------------------------\n`;
  sql += `CREATE TABLE \`pa_indicators\` (\n`;
  sql += `  \`id\` VARCHAR(50) NOT NULL,\n`;
  sql += `  \`agreementId\` VARCHAR(50) NOT NULL,\n`;
  sql += `  \`category\` VARCHAR(50) NOT NULL,\n`;
  sql += `  \`number\` VARCHAR(10) NOT NULL,\n`;
  sql += `  \`title\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`description\` TEXT DEFAULT NULL,\n`;
  sql += `  \`workPlan\` TEXT DEFAULT NULL,\n`;
  sql += `  \`indicators\` TEXT DEFAULT NULL,\n`;
  sql += `  \`evaluationTimes\` TEXT DEFAULT NULL,\n`;
  sql += `  \`score\` INT DEFAULT 0,\n`;
  sql += `  \`selfEvaluationText\` TEXT DEFAULT NULL,\n`;
  sql += `  \`updatedAt\` VARCHAR(50) NOT NULL,\n`;
  sql += `  PRIMARY KEY (\`id\`),\n`;
  sql += `  KEY \`fk_agreement_idx\` (\`agreementId\`),\n`;
  sql += `  CONSTRAINT \`fk_agreement\` FOREIGN KEY (\`agreementId\`) REFERENCES \`pa_agreements\` (\`id\`) ON DELETE CASCADE\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  // Evidence Table
  sql += `-- --------------------------------------------------------\n`;
  sql += `-- Table Structure for \`pa_evidence\`\n`;
  sql += `-- --------------------------------------------------------\n`;
  sql += `CREATE TABLE \`pa_evidence\` (\n`;
  sql += `  \`id\` VARCHAR(50) NOT NULL,\n`;
  sql += `  \`agreementId\` VARCHAR(50) NOT NULL,\n`;
  sql += `  \`indicatorNumber\` VARCHAR(10) NOT NULL,\n`;
  sql += `  \`title\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`description\` TEXT DEFAULT NULL,\n`;
  sql += `  \`linkUrl\` TEXT NOT NULL,\n`;
  sql += `  \`evidenceType\` VARCHAR(20) NOT NULL,\n`;
  sql += `  \`addedAt\` VARCHAR(50) NOT NULL,\n`;
  sql += `  PRIMARY KEY (\`id\`),\n`;
  sql += `  KEY \`fk_evidence_agreement_idx\` (\`agreementId\`),\n`;
  sql += `  CONSTRAINT \`fk_evidence_agreement\` FOREIGN KEY (\`agreementId\`) REFERENCES \`pa_agreements\` (\`id\`) ON DELETE CASCADE\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  // INSERTS GENERATION
  const escapeString = (str: string | undefined): string => {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''").replace(/\\/g, "\\\\")}'`;
  };

  sql += `-- ========================================================\n`;
  sql += `-- Injecting Active Storage Data\n`;
  sql += `-- ========================================================\n\n`;

  // Insert Users (Teachers)
  if (db.users.length > 0) {
    sql += `-- Data for Table \`teachers\`\n`;
    db.users.forEach(u => {
      sql += `INSERT INTO \`teachers\` (\`id\`, \`email\`, \`passwordHash\`, \`fullName\`, \`position\`, \`schoolName\`, \`teachingSubject\`, \`teachingHours\`, \`photoUrl\`, \`headerBannerUrl\`) VALUES (\n`;
      sql += `  ${escapeString(u.id)},\n`;
      sql += `  ${escapeString(u.email)},\n`;
      sql += `  ${escapeString(u.passwordHash)},\n`;
      sql += `  ${escapeString(u.fullName)},\n`;
      sql += `  ${escapeString(u.position)},\n`;
      sql += `  ${escapeString(u.schoolName)},\n`;
      sql += `  ${escapeString(u.teachingSubject)},\n`;
      sql += `  ${escapeString(u.teachingHours)},\n`;
      sql += `  ${escapeString(u.photoUrl)},\n`;
      sql += `  ${escapeString(u.headerBannerUrl)}\n`;
      sql += `);\n`;
    });
    sql += `\n`;
  }

  // Insert Agreements
  if (db.agreements.length > 0) {
    sql += `-- Data for Table \`pa_agreements\`\n`;
    db.agreements.forEach(a => {
      sql += `INSERT INTO \`pa_agreements\` (\`id\`, \`teacherId\`, \`budgetYear\`, \`status\`, \`salary\`, \`workloadLessons\`, \`workloadSupport\`, \`workloadSchool\`, \`workloadLife\`, \`part2Title\`, \`part2Problem\`, \`part2Process\`, \`part2OutcomeQty\`, \`part2OutcomeQly\`, \`createdAt\`, \`updatedAt\`) VALUES (\n`;
      sql += `  ${escapeString(a.id)},\n`;
      sql += `  ${escapeString(a.teacherId)},\n`;
      sql += `  ${escapeString(a.budgetYear)},\n`;
      sql += `  ${escapeString(a.status)},\n`;
      sql += `  ${escapeString(a.salary)},\n`;
      sql += `  ${escapeString(a.workloadLessons)},\n`;
      sql += `  ${escapeString(a.workloadSupport)},\n`;
      sql += `  ${escapeString(a.workloadSchool)},\n`;
      sql += `  ${escapeString(a.workloadLife)},\n`;
      sql += `  ${escapeString(a.part2Title)},\n`;
      sql += `  ${escapeString(a.part2Problem)},\n`;
      sql += `  ${escapeString(a.part2Process)},\n`;
      sql += `  ${escapeString(a.part2OutcomeQty)},\n`;
      sql += `  ${escapeString(a.part2OutcomeQly)},\n`;
      sql += `  ${escapeString(a.createdAt)},\n`;
      sql += `  ${escapeString(a.updatedAt)}\n`;
      sql += `);\n`;
    });
    sql += `\n`;
  }

  // Insert Indicators
  if (db.indicators.length > 0) {
    sql += `-- Data for Table \`pa_indicators\`\n`;
    db.indicators.forEach(i => {
      sql += `INSERT INTO \`pa_indicators\` (\`id\`, \`agreementId\`, \`category\`, \`number\`, \`title\`, \`description\`, \`workPlan\`, \`indicators\`, \`evaluationTimes\`, \`score\`, \`selfEvaluationText\`, \`updatedAt\`) VALUES (\n`;
      sql += `  ${escapeString(i.id)},\n`;
      sql += `  ${escapeString(i.agreementId)},\n`;
      sql += `  ${escapeString(i.category)},\n`;
      sql += `  ${escapeString(i.number)},\n`;
      sql += `  ${escapeString(i.title)},\n`;
      sql += `  ${escapeString(i.description)},\n`;
      sql += `  ${escapeString(i.workPlan)},\n`;
      sql += `  ${escapeString(i.indicators)},\n`;
      sql += `  ${escapeString(i.evaluationTimes)},\n`;
      sql += `  ${i.score || 0},\n`;
      sql += `  ${escapeString(i.selfEvaluationText)},\n`;
      sql += `  ${escapeString(i.updatedAt)}\n`;
      sql += `);\n`;
    });
    sql += `\n`;
  }

  // Insert Evidence
  if (db.evidence.length > 0) {
    sql += `-- Data for Table \`pa_evidence\`\n`;
    db.evidence.forEach(e => {
      sql += `INSERT INTO \`pa_evidence\` (\`id\`, \`agreementId\`, \`indicatorNumber\`, \`title\`, \`description\`, \`linkUrl\`, \`evidenceType\`, \`addedAt\`) VALUES (\n`;
      sql += `  ${escapeString(e.id)},\n`;
      sql += `  ${escapeString(e.agreementId)},\n`;
      sql += `  ${escapeString(e.indicatorNumber)},\n`;
      sql += `  ${escapeString(e.title)},\n`;
      sql += `  ${escapeString(e.description)},\n`;
      sql += `  ${escapeString(e.linkUrl)},\n`;
      sql += `  ${escapeString(e.evidenceType)},\n`;
      sql += `  ${escapeString(e.addedAt)}\n`;
      sql += `);\n`;
    });
    sql += `\n`;
  }

  sql += `-- ========================================================\n`;
  sql += `-- End of MySQL Script\n`;
  sql += `-- ========================================================\n`;

  return sql;
}
