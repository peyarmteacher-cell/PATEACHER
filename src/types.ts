/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TeacherProfile {
  id: string;
  email: string;
  fullName: string;
  position: string; // e.g. ครูผู้ช่วย, ครู, ครูชำนาญการ, ครูชำนาญการพิเศษ, ครูเชี่ยวชาญ, ครูเชี่ยวชาญพิเศษ
  academicRank?: string; // วิทยฐานะ
  schoolName: string;
  affiliation?: string; // สังกัด (e.g., สพม., สพป.)
  photoUrl?: string;
  headerBannerUrl?: string; // รููปภาพหรือแบบเทมเพลตสำหรับหน้าเว็บ Portfolio เสนอกรรมการ
  teachingSubject: string; // กลุ่มสาระการเรียนรู้/วิชาที่สอน
  teachingHours: string; // ชั่วโมงการปฏิบัติงาน (ชั่วโมง/สัปดาห์)
}

export interface PAAgreement {
  id: string;
  teacherId: string;
  budgetYear: string; // ปีงบประมาณ (e.g., 2569)
  status: 'draft' | 'submitted' | 'approved';
  
  // Salary and Workload Info
  salary: string; // เงินเดือนปัจจุบัน
  workloadLessons: string; // ชั่วโมงสอนตามตารางเรียน
  workloadSupport: string; // งานส่งเสริมและสนับสนุน
  workloadSchool: string; // งานพัฒนาคุณภาพสถานศึกษา
  workloadLife: string; // งานตอบสนองนโยบาย/จุดเน้น

  // Part 2: Challenge Topic (ประเด็นท้าทาย)
  part2Title: string; // ชื่อประเด็นท้าทาย
  part2Problem: string; // สภาพปัญหาการจัดการเรียนรู้และคุณภาพการเรียนรู้ของผู้เรียน
  part2Process: string; // วิธีการดำเนินการให้บรรลุผล
  part2OutcomeQty: string; // ผลลัพธ์เชิงปริมาณ
  part2OutcomeQly: string; // ผลลัพธ์เชิงคุณภาพ
  
  createdAt: string;
  updatedAt: string;
}

export interface PAIndicator {
  id: string; // e.g., agreementId-indicatorNum (e.g. pa-123-1.1)
  agreementId: string;
  category: 'learning' | 'support' | 'development'; // ด้านที่ 1, ด้านที่ 2, ด้านที่ 3
  number: string; // e.g., "1.1", "1.2", ..., "3.3"
  title: string; // ชื่อตัวชี้วัด
  description: string; // รายละเอียดตัวชี้วัด
  
  // Teacher inputs for agreement
  workPlan: string; // งาน (Tasks) ที่จะดำเนินการพัฒนาตามข้อตกลงใน 1 รอบการประเมิน
  indicators: string; // ตัวชี้วัด (Indicators) ของผลลัพธ์การเรียนรู้ของผู้เรียน
  evaluationTimes: string; // ระยะเวลาที่ใช้ในการดำเนินการ
  
  // Progress & Evidence
  score: number; // คะแนนประเมินตนเอง (1-4)
  selfEvaluationText: string; // บันทึกผลการปฏิบัติงานตนเอง
  
  updatedAt: string;
}

export interface PAEvidence {
  id: string;
  agreementId: string;
  indicatorNumber: string; // e.g. "1.1"
  title: string; // ชื่อหลักฐาน/ผลงาน
  description?: string; // รายละเอียดเพิ่มเติม
  linkUrl: string; // ลิงก์แนบผลงาน (เช่น Google Drive, YouTube, ลิงก์เว็บไซต์)
  evidenceType: 'link' | 'image' | 'video' | 'document';
  addedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
}
