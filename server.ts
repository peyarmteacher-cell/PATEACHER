import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import mysql from 'mysql2/promise';
import {
  registerUser,
  loginUser,
  getTeacherProfile,
  updateTeacherProfile,
  getAgreements,
  getAgreementById,
  createAgreement,
  updateAgreement,
  getIndicators,
  updateIndicator,
  getEvidenceAll,
  addEvidence,
  deleteEvidence,
  generateMySQLDump,
  getAllTeachers,
  approveTeacher,
  deleteTeacherAccount
} from './server_db';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express /api routes FIRST
// Auth Middleware
function checkAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อนทำการทำรายการ' });
  }
  const teacherId = authHeader.substring(7);
  const profile = getTeacherProfile(teacherId);
  if (!profile) {
    return res.status(404).json({ error: 'ไม่พบข้อมูลคุณครูในระบบ' });
  }
  (req as any).teacherId = teacherId;
  next();
}

// Super Admin Authentication Middleware
function checkSuperAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'ต้องการสิทธิ์ผู้ดูแลระบบสูงสุด (Super Admin)' });
  }
  const teacherId = authHeader.substring(7);
  if (teacherId !== 'super_admin') {
    return res.status(403).json({ error: 'คุณไม่มีสิทธิ์เข้าถึงส่วนผู้ดูแลระบบนี้' });
  }
  next();
}

// 1. Auth & Profiles
app.post('/api/auth/register', (req, res) => {
  const { email, username, fullName, position, schoolName, teachingSubject, teachingHours } = req.body;
  
  if (!email || !username || !fullName || !position || !schoolName) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' });
  }

  const profile = registerUser(email, username, fullName, position, schoolName, teachingSubject || 'ไม่ได้ระบุ', teachingHours || '18');
  if (!profile) {
    return res.status(400).json({ error: 'อีเมลนี้ถูกเปิดใช้งานในระบบแล้ว' });
  }

  res.status(201).json({ s: true, profile });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'กรุณาใส่อีเมลและรหัสผ่าน' });
  }

  const profile = loginUser(email, password);
  if (!profile) {
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่าน (ชื่อผู้ใช้) ไม่ถูกต้อง' });
  }

  // Check if profile is approved (only for normal teachers)
  if (profile.id !== 'super_admin' && !profile.isApproved) {
    return res.status(403).json({
      error: 'บัญชีรายชื่อคุณครูของคุณอยู่ระหว่าง "รอการอนุมัติใช้งาน" จากผู้ดูแลระบบ (Super Admin) กรุณาแจ้งผู้ดูแลระบบโรงเรียนเพื่อกดยืนยันบัญชีของคุณผ่านทางแผงควบคุมระบบ'
    });
  }

  res.json({ s: true, profile });
});

app.get('/api/profile', checkAuth, (req, res) => {
  const profile = getTeacherProfile((req as any).teacherId);
  res.json({ profile });
});

app.put('/api/profile', checkAuth, (req, res) => {
  const profile = updateTeacherProfile((req as any).teacherId, req.body);
  if (!profile) return res.status(404).json({ error: 'ไม่สามารถอัปเดตข้อมูลได้' });
  res.json({ s: true, profile });
});

// --- Super Admin Manage APIs ---
app.get('/api/admin/teachers', checkSuperAdmin, (req, res) => {
  const list = getAllTeachers();
  res.json({ list });
});

app.put('/api/admin/teachers/:id/approve', checkSuperAdmin, (req, res) => {
  const { isApproved } = req.body;
  const profile = approveTeacher(req.params.id, !!isApproved);
  if (!profile) {
    return res.status(404).json({ error: 'ไม่พบรายชื่อคุณครูที่ระบุ' });
  }
  res.json({ s: true, profile });
});

app.delete('/api/admin/teachers/:id', checkSuperAdmin, (req, res) => {
  const success = deleteTeacherAccount(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'ไม่พบครูที่รหัสผ่าน/ที่อยู่ระบุไว้' });
  }
  res.json({ s: true });
});

// Dynamic Direct MySQL Database Synchronization Route
app.post('/api/admin/mysql-sync', checkSuperAdmin, async (req, res) => {
  const { host, port, user, password, database } = req.body;
  
  if (!host || !user || !database) {
    return res.status(400).json({ error: 'กรุณาระบุข้อมูลการเชื่อมต่อที่จำเป็นให้ครบถ้วน (โฮสท์, ผู้ใช้งาน, ชื่อฐานข้อมูล)' });
  }

  const logs: string[] = [];
  const timeStr = () => new Date().toLocaleTimeString('th-TH');

  logs.push(`[${timeStr()}] 🔮 เริ่มต้นกระบวนการเชื่อมต่อและอัปเดตฐานข้อมูลภายนอกอัตโนมัติ...`);
  logs.push(`[${timeStr()}] ⚙️ กำหนดสเปค: Host=${host}, Port=${port || 3306}, User=${user}, Target DB=${database}`);

  let connection;
  try {
    // Stage 1: Pre-connect without target database to check credentials & auto-create schema if missing
    logs.push(`[${timeStr()}] 🔌 พยายามเชื่อมโยงไปยังโฮสท์เซิร์ฟเวอร์โรงเรียน...`);
    connection = await mysql.createConnection({
      host,
      port: Number(port) || 3306,
      user,
      password: password || '',
      connectTimeout: 8000,
      multipleStatements: true
    });
    logs.push(`[${timeStr()}] 🟢 เชื่อมต่อกับ MySQL Server สำเร็จ`);
  } catch (err: any) {
    logs.push(`[${timeStr()}] 🔴 ขออภัย! การเชื่อมโยงล้มเหลว: ${err.message || err}`);
    return res.status(500).json({ s: false, logs, error: err.message });
  }

  try {
    // Stage 2: Ensure database schema exists
    logs.push(`[${timeStr()}] 📂 ตรวจสอบหรือสร้างฐานข้อมูล \`${database}\` ในเซิร์ฟเวอร์ PHPMyAdmin...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    logs.push(`[${timeStr()}] 🟢 การตรวจสอบ/สร้างฐานข้อมูล \`${database}\` เสร็จสมบูรณ์`);

    // Switch connection context to targeted DB
    await connection.query(`USE \`${database}\`;`);
    logs.push(`[${timeStr()}] 📂 เลือกเปิดใช้ Database: \`${database}\``);

    // Stage 3: Fetch recent data dump and pipe execute
    logs.push(`[${timeStr()}] 📃 กำลังดึงข้อมูลและเตรียม SQL Script จากฐานข้อมูลแอปหลัก...`);
    const sqlDumpCode = generateMySQLDump();
    
    logs.push(`[${timeStr()}] ⚡ เริ่มส่งสคริปต์ SQL และรันระบบย่อยใน PHPMyAdmin แบบ Multi-Statement (DROP/CREATE/INSERT)...`);
    await connection.query(sqlDumpCode);
    logs.push(`[${timeStr()}] 🟢 ทำการรันโครงสร้างตาราง (teachers, pa_agreements, pa_indicators, pa_evidence) สำเร็จ`);
    logs.push(`[${timeStr()}] 🟢 ทำการซิงค์อักขระข้อตกลงและตัวเลขคะแนน PA ลงใน PHPMyAdmin เรียบร้อย`);

    // Complete connection
    await connection.end();
    logs.push(`[${timeStr()}] 🎉 [สำเร็จเสร็จขั้นตอน] อัพเดตฐานข้อมูลเซิร์ฟเวอร์โรงเรียนผ่านแผงควบคุมเรียบร้อยแล้ว โดยไม่จำเป็นต้องพิมพ์คำสั่งใน PHPMyAdmin ด้วยตนเอง!`);
    
    return res.json({ s: true, logs });
  } catch (err: any) {
    logs.push(`[${timeStr()}] 🔴 เกิดข้อผิดพลาดร้ายแรงระหว่างเขียนข้อมูลลง PHPMyAdmin: ${err.message || err}`);
    if (connection) {
      try { await connection.end(); } catch {}
    }
    return res.status(500).json({ s: false, logs, error: err.message });
  }
});

// 2. Agreements
app.get('/api/agreements', checkAuth, (req, res) => {
  const list = getAgreements((req as any).teacherId);
  res.json({ list });
});

app.post('/api/agreements', checkAuth, (req, res) => {
  const { budgetYear } = req.body;
  if (!budgetYear) {
    return res.status(400).json({ error: 'ต้องการข้อมูลปีงบประมาณ' });
  }

  // Check if year already exists
  const existing = getAgreements((req as any).teacherId).find(a => a.budgetYear === budgetYear);
  if (existing) {
    return res.status(400).json({ error: `มีข้อตกลง PA ปีงบประมาณ ${budgetYear} อยู่แล้ว คุณต้องการแก้ไขแทนหรือไม่?` });
  }

  const agreement = createAgreement((req as any).teacherId, budgetYear);
  res.status(201).json({ s: true, agreement });
});

app.get('/api/agreements/:id', checkAuth, (req, res) => {
  const ag = getAgreementById(req.params.id);
  if (!ag || ag.teacherId !== (req as any).teacherId) {
    return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึงข้อตกลง PA รายการนี้' });
  }
  res.json({ agreement: ag });
});

app.put('/api/agreements/:id', checkAuth, (req, res) => {
  const ag = getAgreementById(req.params.id);
  if (!ag || ag.teacherId !== (req as any).teacherId) {
    return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึงข้อตกลง PA รายการนี้' });
  }

  const updated = updateAgreement(req.params.id, req.body);
  res.json({ s: true, agreement: updated });
});

// 3. Indicators
app.get('/api/agreements/:agreementId/indicators', checkAuth, (req, res) => {
  const ag = getAgreementById(req.params.agreementId);
  if (!ag || ag.teacherId !== (req as any).teacherId) {
    return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึงข้อตกลง PA รายการนี้' });
  }

  const indicators = getIndicators(req.params.agreementId);
  res.json({ list: indicators });
});

app.put('/api/indicators/:indicatorId', checkAuth, (req, res) => {
  const updated = updateIndicator(req.params.indicatorId, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'ไม่พบตัวชี้วัดที่ต้องการแก้ไข' });
  }
  res.json({ s: true, indicator: updated });
});

// 4. Evidence
app.get('/api/agreements/:agreementId/evidence', checkAuth, (req, res) => {
  const ag = getAgreementById(req.params.agreementId);
  if (!ag || ag.teacherId !== (req as any).teacherId) {
    return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึงข้อตกลง PA รายการนี้' });
  }

  const list = getEvidenceAll(req.params.agreementId);
  res.json({ list });
});

app.post('/api/agreements/:agreementId/evidence', checkAuth, (req, res) => {
  const { indicatorNumber, title, linkUrl, evidenceType, description } = req.body;
  if (!indicatorNumber || !title || !linkUrl || !evidenceType) {
    return res.status(400).json({ error: 'กรุณาส่งข้อมูลหลักฐานให้ครบถ้วน (ตัวชี้วัด, ชื่อ, ลิงก์, ประเภท)' });
  }

  const ag = getAgreementById(req.params.agreementId);
  if (!ag || ag.teacherId !== (req as any).teacherId) {
    return res.status(403).json({ error: 'ไม่มีสิทธิ์อัปโหลด' });
  }

  const ev = addEvidence(req.params.agreementId, indicatorNumber, title, linkUrl, evidenceType, description);
  res.status(201).json({ s: true, evidence: ev });
});

app.delete('/api/evidence/:id', checkAuth, (req, res) => {
  const success = deleteEvidence(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'ไม่พบลายแทงหลักฐานที่ระบุ' });
  }
  res.json({ s: true });
});

// 5. Database MySQL Dump Export
app.get('/api/db/mysql-dump', (req, res) => {
  try {
    const dump = generateMySQLDump();
    res.setHeader('Content-disposition', `attachment; filename=pa_teacher_mysql_backup_${new Date().toISOString().split('T')[0]}.sql`);
    res.setHeader('Content-type', 'application/sql');
    res.write(dump);
    res.end();
  } catch (error) {
    console.error('MySQL database generation error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสร้างสคริปต์ส่งออก MySQL' });
  }
});

// 6. AI PA Copilot proxy using modern SDK
app.post('/api/copilot/chat', async (req, res) => {
  const { messages, contextInfo } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'กรุณาส่งประวัติการคุยกับระบบ' });
  }

  try {
    // Lazy Initialize Gemini API safely
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'ระบบผู้ช่วยเขียน PA ยังไม่ได้ตั้งค่าคีย์ความปลอดภัยจาก Settings > Secrets หรือระบบคลาวด์ยังไม่ได้ส่งมอบคีย์กรุณาตรวจสอบ'
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = `คุณคือ "ผู้เชี่ยวชาญคณะกรรมการประเมินวิทยฐานะและกรอบแนวคิดวPA สพฐ." 
ทำหน้าที่ให้คำแนะนำ ปรับปรุง และช่วยคุณครูเขียนหลักฐาน 'ข้อตกลงในการพัฒนางาน (Performance Agreement: PA)' และสลับมาช่วยแก้ไของค์กร 'ประเด็นท้าทาย' ให้ถูกต้องตามหลักเกณฑ์ วPA ครอบคลุมบริบทวิทยฐานะของครู ได้แก่ ครูผู้ช่วย / ครู / ชำนาญการ / ชำนาญการพิเศษ / เชี่ยวชาญ / เชี่ยวชาญพิเศษ

กรุณาเขียนตอบให้กระชับ ชัดเจน เข้าใจง่าย เป็นทางราชการแต่เข้าถึงได้ (Tone: Professional, Helpful, encouraging). 
ข้อมูลประกอบสถานการณ์ปัจจุบันของคุณครูมีดังนี้:
- ชื่อนามสกุลครู: ${contextInfo?.teacherName || 'ไม่ระบุ'}
- ตำแหน่งปัจจุบัน: ${contextInfo?.teacherPosition || 'ไม่ระบุครูผู้สอน'}
- วิชาสอนเด่น: ${contextInfo?.teachingSubject || 'ไม่ระบุวิชาหลัก'}
- ตัวชี้วัดที่กำลังกรอกข้อมูลชิ้นงาน: ${contextInfo?.currentIndicatorNum ? `ตัวชี้วัดที่ ${contextInfo.currentIndicatorNum} ${contextInfo.currentIndicatorTitle || ''}` : 'หัวข้อหลักภาพรวม'}

หากครูถามหาวิธีการเขียนหรือขอให้เรียบเรียง ให้เสนอแนวการเขียนที่มี 3 ประเด็นหลักสอดคล้องกับพจนานุกรม สพฐ. โดยเขียนเป็นจุดไข่ปลาชี้ชัดให้เขานำไปคัดลอกใส่ระบบ PA ได้ทันที!`;

    // Map messages history to SDK structure
    // Translate standard roles 'user' -> 'user' and 'model' -> 'model'
    const sdkContents = messages.map((m: any) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    // Generate output with gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: sdkContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini Copilot Error:', error);
    res.status(500).json({ error: `เกิดความขัดข้องทางเทคนิคของระบบปัญญาประดิษฐ์: ${error.message || error}` });
  }
});

// Integration with Vite development middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Express development environment with Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up Express production static serving...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PA Teacher Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
