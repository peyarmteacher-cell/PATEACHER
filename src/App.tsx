import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  School, 
  Clock, 
  FileText, 
  Layers, 
  HelpCircle, 
  Plus, 
  Activity, 
  CheckCircle2, 
  Server, 
  ArrowRight, 
  Sparkles, 
  Link as LinkIcon, 
  Trash2, 
  Send, 
  LogOut, 
  Save, 
  Download, 
  ExternalLink, 
  FileCode,
  Calendar,
  DollarSign,
  AlertCircle,
  FileCheck,
  Check,
  BarChart3,
  Edit3,
  Eye,
  X
} from 'lucide-react';
import WelcomeAuth from './components/WelcomeAuth';
import TeacherPortfolioView from './components/TeacherPortfolioView';
import { TeacherProfile, PAAgreement, PAIndicator, PAEvidence, ChatMessage } from './types';

const DEMO_PROFILE: TeacherProfile = {
  id: 'demo_obec_teacher',
  email: 'peyarmteacher@gmail.com',
  fullName: 'คุณครูรังสรรค์ สพฐ.พัฒนากุล',
  position: 'ครูชำนาญการพิเศษ (วPA)',
  schoolName: 'โรงเรียนอบรมปัญญาประมวลผลวิทยา',
  teachingSubject: 'วิทยาการคำนวณ (คอมพิวเตอร์)',
  teachingHours: '22',
  photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
  headerBannerUrl: 'gradient_emerald',
};

const DEMO_AGREEMENT: PAAgreement = {
  id: 'dep_pa_demo',
  teacherId: 'demo_obec_teacher',
  budgetYear: '2569',
  status: 'submitted',
  salary: '34,200',
  workloadLessons: '22',
  workloadSupport: '4',
  workloadSchool: '3',
  workloadLife: '2',
  part2Title: 'การแก้ปัญหากระบวนการคิดและทักษะการเขียนโปรแกรมเชิงตรรกะเบื้องต้นด้วยชุดสื่อ Active Learning ในรายวิชาวิทยาการคำนวณ',
  part2Problem: 'กระแสสังคมและการพัฒนาทางดิจิทัลสูงขึ้น แต่ผู้เรียนขาดการจดจ่อ มีสมาธิสั้น และไม่ได้รับการกระตุ้นด้านตรรกศาสตร์และการแก้ไขความน่าจะเป็นอย่างเหมาะสม...',
  part2Process: '1. จัดสรรวิเคราะห์ความต่างรายบุคคลของผู้เรียนและจัดกลุ่มปฏิบัติ\n2. พัฒนาร่วมกับชุดนวัตกรรมแบบบูรณาการเกมโค้ดดิ้งแบบลอจิก Unplugged Coding\n3. จัดกิจกรรมให้ข้อมูลผลลัพธ์ย้อนกลับทันทีแก่นักเรียนเพื่อกระตุ้นจิตวิทยาส่วนร่วมเชิงบวก',
  part2OutcomeQty: 'ผู้เรียนรายวิชาคอมพิวเตอร์และวิทยาการคำนวณร้อยละ 82.5 มีคะแนนเฉลี่ยทักษะเขียนโปรแกรมผ่านเกณฑ์วัดระดับสูงขึ้น',
  part2OutcomeQly: 'ผู้เรียนสามารถแจกแจงเงื่อนไขอย่างเป็นระบบวิเคราะห์แผนผังความคิด (Mind Map) และมีความรับผิดชอบต่อชิ้นงานกลุ่มอย่างงดงาม',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_INDICATORS: PAIndicator[] = [
  {
    id: 'demo_ind_11', agreementId: 'dep_pa_demo', category: 'learning', number: '1.1',
    title: 'สร้างและหรือพัฒนาหลักสูตร',
    description: 'จัดทำรายวิชาและหน่วยการเรียนรู้ให้สอดคล้องกับมาตรฐานการเรียนรู้ และตัวชี้วัดหรือผลการเรียนรู้ตามหลักสูตร',
    workPlan: 'วิเคราะห์โครงสร้างหลักสูตรวิชาวิทยาการคำนวณและคอมพิวเตอร์ระดับชั้นประถมศึกษา จัดทำหน่วยวิชาโค้ดดิ้งตอบรับปีงบประมาณ',
    indicators: 'ผู้เรียนร้อยละ 80 มีทักษะสอดคล้องระบบระเบียบการแก้ปัญหาและระดับคะแนนประเมินอยู่ในเกณฑ์น่าพึงพอใจสูงส่ง',
    evaluationTimes: 'ตลอดปีการศึกษา', score: 4,
    selfEvaluationText: 'จัดทำหลักสูตรกลุ่มสาระเทคโนโลยีที่นำเสนอบริบทจริงของผู้เรียน ส่งเสริมทักษะเชิงสร้างสรรค์ได้อย่างมีประสิทธิภาพ คณะกรรมการเขตพื้นที่เข้าเยี่ยมชมความก้าวหน้า',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_12', agreementId: 'dep_pa_demo', category: 'learning', number: '1.2',
    title: 'ออกแบบการจัดการเรียนรู้',
    description: 'เน้นผู้เรียนเป็นสำคัญ เพื่อให้ผู้เรียนมีความรู้ ทักษะ คุณลักษณะประจำวิชา คุณลักษณะอันพึงประสงค์ และสมรรถนะที่สำคัญตามหลักสูตร',
    workPlan: 'ดำเนินการจัดกิจกรรมที่เน้นส่งเสริมผู้เรียนเป็นรายกลุ่มแบบเป็นระบบ (Active Learning) ออกแบบบอร์ดเกม "ลอจิกทาวน์" เพื่อขยายความเข้าใจทางตรรกะแบบไม่ต้องใช้หน้าจอ',
    indicators: 'ผู้เรียนมากกว่าร้อยละ 80 มีความประพฤติพึงพอใจและผ่านเกณฑ์ระดับสมรรถนะสำคัญของการคิดวิเคราะห์',
    evaluationTimes: 'ภาคเรียนที่ 1-2', score: 4,
    selfEvaluationText: 'พัฒนาผู้เรียนรายหน่วยผ่านหน่วยการคิดเชิงวิเคราะห์ บูรณาการความคิดแก้ปัญหาตามเกณฑ์กระทรวงศึกษาธิการอย่างเห็นประจักษ์',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_13', agreementId: 'dep_pa_demo', category: 'learning', number: '1.3',
    title: 'จัดกิจกรรมการเรียนรู้',
    description: 'อำนวยความสะดวกในการเรียนรู้ และส่งเสริมผู้เรียนได้พัฒนาเต็มตามศักยภาพ เรียนรู้และทำงานร่วมกัน',
    workPlan: 'จัดกิจกรรมโค้ดดิ้ง Unplugged ร่วมกับการประยุกต์บอร์ดเกมรักษ์โลก สร้างความคิดยืดหยุ่นในชั้นเรียนจริง',
    indicators: 'ผู้เรียนร้อยละ 90 เข้าร่วมทำงานเป็นแกนนำการประเมินวิชาวิทยาการเรียนรู้',
    evaluationTimes: '1 ภาคการศึกษา', score: 3,
    selfEvaluationText: 'ได้อำนวยการเชิงวิชาการให้แก่นักเรียนอย่างกัลยาณมิตร ได้ผลตอบรับสูงจากการสุ่มสำรวจความสุขผู้เรียน',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_14', agreementId: 'dep_pa_demo', category: 'learning', number: '1.4',
    title: 'สร้างและหรือพัฒนาสื่อ นวัตกรรม เทคโนโลยี และแหล่งเรียนรู้',
    description: 'สอดคล้องกับกิจกรรมการเรียนรู้ แก้ไขปัญหาผู้เรียน และการทำงานวิจัยพัฒนาสิ่งใหม่',
    workPlan: 'จัดทำโปรแกรมจัดคลังความรู้ออนไลน์ "PA-SmartLab" เพื่อให้นักเรียนสามารถทบทวนบทเรียนและทำใบงานจำลองผ่านสมาร์ทโฟนได้จากทุกสถานที่',
    indicators: 'นักเรียนร้อยละ 85 เข้าสืบค้นข้อมูลทำแบบทดสอบผ่านระบบคลาวด์และยกระดับผลสอบกลางภาคขึ้นเฉลี่ยร้อยละ 15',
    evaluationTimes: 'ภาคเรียนที่ 1', score: 4,
    selfEvaluationText: 'พอร์ตระบบเรียนรู้ออนไลน์มีความยืดหยุ่น ย่อยเข้าใจง่าย เป็นโครงงานดีเด่นด้านนวัตกรรมระดับศูนย์เครือข่าย',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_15', agreementId: 'dep_pa_demo', category: 'learning', number: '1.5',
    title: 'วัดและประเมินผลการเรียนรู้',
    description: 'ด้วยวิธีการที่หลากหลาย เหมาะสม และสอดคล้องกับมาตรฐานการเรียนรู้ นำผลไปปรับปรุงพัฒนาผู้เรียน',
    workPlan: 'ประเมินผลลัพธ์ผ่านเกณฑ์แบบรูบริกส์ (Self & Peer Assessment Rubrics) ร่วมกับการเก็บคะแนนย่อยเชิงปฏิบัติการทดสอบเขียนโค้ด',
    indicators: 'ผู้เรียนสะสมผลสัมฤทธิ์ผ่านเป้าหมายคะแนนวิชาคิดวิเคราะห์ตามระดับวิทยฐานะชำนาญการขึ้นไป',
    evaluationTimes: 'ตลอดปีงบประมาณ', score: 3,
    selfEvaluationText: 'จัดเกณฑ์การวัดผลรอบด้านทั้งทฤษฎีและปฏิบัติ มอบเกียรติบัตรแสดงความคืบหน้าให้เด็กทุกคนเพื่อสร้างกำลังใจและลดความเหลื่อมล้ำ',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_16', agreementId: 'dep_pa_demo', category: 'learning', number: '1.6',
    title: 'ศึกษา วิเคราะห์ และสังเคราะห์ เพื่อแก้ไขปัญหาหรือพัฒนาการเรียนรู้',
    description: 'แก้ไขปัญหาหรือพัฒนาการเรียนรู้ที่ส่งผลต่อคุณภาพผู้เรียน',
    workPlan: 'จัดทำวิจัยฉบับย่อเพื่อวิเคราะห์ปัญหานักเรียนที่มีภาวะกลัวการคำนวณ (Math/Code Anxiety) โดยใช้สื่อจำลองกระตุ้นเป้าหมายความล้มเหลวที่สนุก',
    indicators: 'โครงงานวิจัยในชั้นเรียนระดับวิชาการจำนวน 1 เล่มที่สามารถเผยแพร่ลงบล็อกชุมชนครูประถมได้',
    evaluationTimes: 'ตลอดภาคเรียน', score: 4,
    selfEvaluationText: 'ผลงานวิจัยระบุว่าการเรียนรู้ผ่านเกมนวัตกรรมสามารถช่วยคืนความสนใจและลดอัตราความกลัวการบวกสัญลักษณ์โปรแกรมได้สำเร็จ',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_17', agreementId: 'dep_pa_demo', category: 'learning', number: '1.7',
    title: 'จัดบรรยากาศที่ส่งเสริมและพัฒนาผู้เรียน',
    description: 'กระตุ้นให้ผู้เรียนเกิดกระบวนการคิด ทักษะชีวิต ทักษะการทำงาน ทักษะการเรียนรู้และนวัตกรรม',
    workPlan: 'ออกแบบห้องคอมพิวเตอร์เชิงแล็บ (Creative Logic Lab) ให้รื่นเริง มีมุมนิทรรศการแสดงผลงานตัวอย่าง มีบอร์ดแสดงความก้าวหน้ารายบุคคล',
    indicators: 'นักเรียนร้อยละ 90 มีความยินดีพึงพอใจต่อสภาพแวดล้อมห้องเรียนในระดับดีมาก',
    evaluationTimes: 'ประเมินเป็นรายเดือน', score: 4,
    selfEvaluationText: 'บรรยากาศสนุกสนานทำให้ดึงดูดใจนักเรียนเข้ามาซ้อมเขียนโปรแกรมในเวลาพักกลางวันเพิ่มขึ้น',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_18', agreementId: 'dep_pa_demo', category: 'learning', number: '1.8',
    title: 'อบรมและพัฒนาคุณลักษณะที่ดีของผู้เรียน',
    description: 'ปลูกฝังค่านิยม คุณธรรม จริยธรรม และคุณลักษณะอันพึงประสงค์ โดยคำนึงถึงความแตกต่างรายบุคคล',
    workPlan: 'บูรณาการเรื่องการใช้ไอทีอย่างสร้างสรรค์และรับผิดชอบ (Digital Citizenship) เสริมคติคุณธรรมความซื่อสัตย์ของการละเมิดสิทธิ์โปรแกรมผู้อื่น',
    indicators: 'ผู้เรียนร้อยละ 95 ผ่านเกณฑ์คุณลักษณะศีลธรรมและความรับผิดชอบต่อพลเมืองยุคดิจิทัล',
    evaluationTimes: 'ปีการศึกษา 2569', score: 4,
    selfEvaluationText: 'นักเรียนไม่มีรายงานการใช้งานอุปกรณ์เครือข่ายอย่างผิดข้อตกลงและรู้จักใช้คอมพิวเตอร์ทางบวก',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_21', agreementId: 'dep_pa_demo', category: 'support', number: '2.1',
    title: 'จัดทำข้อมูลสารสนเทศของผู้เรียนและรายวิชา',
    description: 'มีข้อมูลสารสนเทศเพื่อสนับสนุนการจัดการเรียนรู้และพัฒนาคุณภาพผู้เรียน',
    workPlan: 'จัดทำโปรแกรมข้อมูลเชิงสถิติคะแนนและจุดอ่อนรายวิชา เพื่อติดตามความเหลื่อมล้ำและรายงานตรงไปยังผู้ปกครอง',
    indicators: 'ระบบคลังรายงานผลการพัฒนาผู้เรียนมีความสมบูรณ์เป็น 100% สรุปผลผ่านบดวิเคราะห์ชี้นำ',
    evaluationTimes: 'ตลอดปีงบประมาณ', score: 4,
    selfEvaluationText: 'จัดทำฐานข้อมูลอย่างต่อเนื่อง รวดเร็ว ทันสถานการณ์ สามารถเรียกตรวจสอบคะแนนและจุดประสงค์ที่ต้องปรับปรุงได้ในคลิกเดียว',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_22', agreementId: 'dep_pa_demo', category: 'support', number: '2.2',
    title: 'ดำเนินการตามระบบดูแลช่วยเหลือผู้เรียน',
    description: 'คัดกรอง ค้นพบ ช่วยเหลือ ป้องกันผู้เรียนอย่างเป็นระบบ',
    workPlan: 'เยี่ยมบ้านนักเรียนครบถ้วน และประสานจัดหาทุนการศึกษาสำหรับครอบครัวที่ขาดแคลนเพื่อความอุ่นใจในการเรียนต่ออย่างเหมาะสม',
    indicators: 'ผู้เรียนในความดูแลร้อยละ 100 ได้รับการสำรวจคัดกรองช่วยเหลือเชิงจิตบำบัดหรือทุนส่งเสริมการเรียนรู้',
    evaluationTimes: 'ตลอดปีการศึกษา', score: 4,
    selfEvaluationText: 'ช่วยเหลือเด็กกลุ่มเสี่ยงด้วยการสืบสานความร่วมมือกับผู้เกี่ยวข้องและส่งต่อพัฒนาการผู้เรียนได้อย่างไม่มีรอยต่อ',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_23', agreementId: 'dep_pa_demo', category: 'support', number: '2.3',
    title: 'ปฏิบัติงานวิชาการ และงานอื่นๆ ของสถานศึกษา',
    description: 'ร่วมงานหลักเพื่อวางแผนงานส่วนกลาง ยกระดับคุณภาพการจัดการศึกษา',
    workPlan: 'รับผิดชอบหัวหน้ากลุ่มงานข้อมูลสารสนเทศและเทคโนโลยีสารสนเทศของโรงเรียน (ICT Coordinator) ประกันคุณภาพสารสนเทศส่งตรง สพฐ.',
    indicators: 'การส่งรายงานข้อมูลรวดเร็ว ทันตามเวลา และได้รับคำชื่นชมการปฏิบัติหน้าที่ระดับดีเด่นจากผู้บริหารโรงเรียน',
    evaluationTimes: 'ตลอดปีงบประมาณ', score: 4,
    selfEvaluationText: 'ร่วมผลักดันระบบดิจิทัลของโรงเรียน ส่งเสริมภาพรวมและงานธุรการการบริหารเชิงโครงสร้างของเครือข่ายสถานศึกษา',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_24', agreementId: 'dep_pa_demo', category: 'support', number: '2.4',
    title: 'ประสานความร่วมมือกับผู้ปกครอง ภาคีเครือข่าย และหรือสถานประกอบการ',
    description: 'ร่วมกันแก้ไขปัญหาและพัฒนาผู้เรียนอย่างร่วมมือร่วมใจ',
    workPlan: 'จัดทำกลุ่มติดต่อสื่อสาร Line OA "PA-ParentCare" เพื่อร่วมหารือการเสพติดหน้าจอของนักเรียนและวิธีจัดพฤติกรรมเชิงบวกที่บ้าน',
    indicators: 'มีผู้ปกครองจำนวนร้อยละ 90 เข้ากลุ่มแชทร่วมระบายปัญหาหารือแนวทางร่วมคิดกับจิตวิทยาครู',
    evaluationTimes: 'ตลอดปีงบประมาณ', score: 3,
    selfEvaluationText: 'ประสานงานเครือข่ายร่วมพัฒนาช่วยให้ผู้ปกครองควบคุมพฤติกรรมหลังเวลาเรียนและกระชับสัมพันธไมตรีอันดี',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_31', agreementId: 'dep_pa_demo', category: 'development', number: '3.1',
    title: 'พัฒนาตนเองอย่างเป็นระบบและต่อเนื่อง',
    description: 'เพื่อให้มีความรู้ ความสามารถ ทักษะเฉพาะ สมรรถนะวิชาชีพครู และการก้าวทันการเปลี่ยนแปลงทางดิจิทัล',
    workPlan: 'เข้ารับการอบรมหลักสูตร AI for Education และ Coding Advance รวมระยะเวลาอบรมไม่ต่ำกว่า 20 ชั่วโมงสะสม',
    indicators: 'วุฒิบัตรวารสารทางวิชาชีพแสดงการอบรมเชิงลึกร่วมพัฒนาศักยภาพผู้สอน',
    evaluationTimes: 'ตลอดปีประเมิน', score: 4,
    selfEvaluationText: 'ผ่านการทดสอบหลักสูตรและการสร้างสื่อประเมินผลระดับกระทรวง ตอบสนองคุณสมบัติความก้าวหน้าแบบยืดหยุ่น',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_32', agreementId: 'dep_pa_demo', category: 'development', number: '3.2',
    title: 'มีส่วนร่วมในการแลกเปลี่ยนเรียนรู้ทางวิชาชีพเพื่อแก้ปัญหาและพัฒนา',
    description: 'วิญญาณแห่งเพื่อนช่วยเพื่อน แลกเปลี่ยน PLC เพื่อพัฒนาพฤติกรรมการจัดการเรียนรู้',
    workPlan: 'ร่วมเปิดบ้านชั้นเรียนและก่อตั้งกลุ่ม PLC โรงเรียน แลกเปลี่ยนเทคนิคการรับมือกับภาวะสมาธิสั้นของนักเรียนในวิชาไอที',
    indicators: 'มีชั่วโมงแลกเปลี่ยนเรียนรู้ PLC สะสมที่บันทึกร่วมกับสถานศึกษามากว่า 40 ชั่วโมงต่อปีการศึกษา',
    evaluationTimes: 'ตลอดปีการศึกษา', score: 4,
    selfEvaluationText: 'กลุ่มแกนนำ PLC สรุปโมเดลนวัตกรรมขยายผลไปใช้ทั้งสายชั้น มีผู้เชี่ยวชาญร่วมตรวจสอบความเที่ยงตรงสำเร็จ',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_ind_33', agreementId: 'dep_pa_demo', category: 'development', number: '3.3',
    title: 'นำความรู้ ความสามารถ ทักษะที่ได้จากการพัฒนาวิชาชีพมาใช้',
    description: 'สร้างสรรค์นวัตกรรมใหม่ๆ ส่งผลลัพธ์โดยตรงต่อคุณภาพเด็กรุ่นต่อไป',
    workPlan: 'ถอดบทเรียนจากการรวมกลุ่ม PLC และการอบรมสมาร์ททีชเชอร์ มาประมวลเป็นสื่อโมเดล "โค้ดแอนด์เพลย์" (Code & Play Model)',
    indicators: 'ผลลัพธ์เชิงประจักษ์ในความสามารถการคิดสร้างสรรค์ของเด็กเฉลี่ยสูงขึ้นอย่างยั่งยืน',
    evaluationTimes: 'ปีการศึกษา 2569', score: 4,
    selfEvaluationText: 'นวัตกรรมได้รับการยอมรับระดับเครือข่ายขจัดอุปสรรคการเรียนภาษาจำลองได้อย่างมีประสิทธิภาพ ยินดีต้อนรับคณะผู้นำเสนอทั้งประเทศ',
    updatedAt: new Date().toISOString()
  }
];

const DEMO_EVIDENCE: PAEvidence[] = [
  {
    id: 'ev_demo_1', agreementId: 'dep_pa_demo', indicatorNumber: '1.1',
    title: 'หลักสูตรกลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี ปีการศึกษา 2568',
    description: 'เอกสารแสดงการวิเคราะห์และพัฒนาหลักสูตรร่วมกับหัวหน้าวิชาการ',
    linkUrl: 'https://docs.google.com/document/d/demo1', evidenceType: 'document',
    addedAt: new Date().toISOString()
  },
  {
    id: 'ev_demo_2', agreementId: 'dep_pa_demo', indicatorNumber: '1.1',
    title: 'ภาพกิจกรรมเวิร์กชอปร่วมกับครูประถม',
    description: 'บันทึกภาพถ่ายการร่วมแลกเปลี่ยนความรู้ในฐานกิจกรรมพัฒนาศึกษา',
    linkUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800', evidenceType: 'image',
    addedAt: new Date().toISOString()
  },
  {
    id: 'ev_demo_3', agreementId: 'dep_pa_demo', indicatorNumber: '1.2',
    title: 'ภาพสไลด์แนะแนวเทคโนโลยี Unplugged Coding',
    description: 'สไลด์ประกอบจัดกิจกรรมเรียนสอน แนะนำความสวยงามโค้ดเชิงตรรกะ',
    linkUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800', evidenceType: 'image',
    addedAt: new Date().toISOString()
  },
  {
    id: 'ev_demo_4', agreementId: 'dep_pa_demo', indicatorNumber: '1.4',
    title: 'วิดีโอสาธิตการทำงานห้องเรียนแฮกกาธอนจิ๋ว',
    description: 'คลิปบรรยายเบื้องต้นอัดเพื่อแลกเปลี่ยนในกลุ่ม PLC',
    linkUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', evidenceType: 'video',
    addedAt: new Date().toISOString()
  }
];

export default function App() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // App navigation
  const [viewMode, setViewMode] = useState<'portfolio' | 'admin'>('portfolio');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'indicators' | 'challenge' | 'mysql' | 'copilot'>('dashboard');
  const [mysqlExportFormat, setMysqlExportFormat] = useState<'php' | 'sql'>('php');

  // --- Super Admin Manage States ---
  const isSuperAdmin = profile?.id === 'super_admin';
  const [adminActiveTab, setAdminActiveTab] = useState<'teachers' | 'sync' | 'dump'>('teachers');
  const [adminTeachers, setAdminTeachers] = useState<TeacherProfile[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // MySQL Connection states
  const [mysqlHost, setMysqlHost] = useState('localhost');
  const [mysqlPort, setMysqlPort] = useState('3306');
  const [mysqlUser, setMysqlUser] = useState('root');
  const [mysqlPassword, setMysqlPassword] = useState('');
  const [mysqlDatabase, setMysqlDatabase] = useState('obec_pa');

  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch all registered teachers for admin
  const fetchAdminTeachers = async () => {
    if (!profile || !isSuperAdmin) return;
    setLoadingTeachers(true);
    try {
      const res = await fetch('/api/admin/teachers', {
        headers: { 'Authorization': `Bearer ${profile.id}` }
      });
      const data = await res.json();
      if (res.ok && data.list) {
        setAdminTeachers(data.list);
      }
    } catch (err) {
      console.error('Failed to load teachers', err);
    } finally {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdminTeachers();
      
      const savedConfig = localStorage.getItem('mysql_connection_config');
      if (savedConfig) {
        try {
          const cfg = JSON.parse(savedConfig);
          if (cfg.host) setMysqlHost(cfg.host);
          if (cfg.port) setMysqlPort(cfg.port);
          if (cfg.user) setMysqlUser(cfg.user);
          if (cfg.password) setMysqlPassword(cfg.password);
          if (cfg.database) setMysqlDatabase(cfg.database);
        } catch {}
      }
    }
  }, [profile, isSuperAdmin]);

  const handleApproveTeacher = async (teacherId: string, approveStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/teachers/${teacherId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${profile?.id}`
        },
        body: JSON.stringify({ isApproved: approveStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setAdminTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, isApproved: approveStatus } : t));
      } else {
        alert(data.error || 'อนุมัติไม่สำเร็จ');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการเชื่อมโยง');
    }
  };

  const handleDeleteTeacherAccount = async (teacherId: string) => {
    if (!confirm('🚨 ยืนยันสิทธิ์ลบข้อมูลคุณครูและพอร์ตโฟลิโอ วPA ทั้งระบบใช่หรือไม่? สื่อและประเด็นท้าทายทุกประเภทของคุณครูท่านนี้จะถูกถอนออกถาวร!')) return;
    try {
      const res = await fetch(`/api/admin/teachers/${teacherId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${profile?.id}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setAdminTeachers(prev => prev.filter(t => t.id !== teacherId));
      } else {
        alert(data.error || 'ลบข้อมูลคุณครูไม่สำเร็จ');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการเชื่อมโยง');
    }
  };

  const handleSyncToSchoolMySQL = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncLogs([]);
    setSyncError(null);
    setIsSyncing(true);

    const config = {
      host: mysqlHost,
      port: mysqlPort,
      user: mysqlUser,
      password: mysqlPassword,
      database: mysqlDatabase
    };

    localStorage.setItem('mysql_connection_config', JSON.stringify(config));

    try {
      const res = await fetch('/api/admin/mysql-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${profile?.id}`
        },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      
      if (data.logs) {
        setSyncLogs(data.logs);
      }
      
      if (!res.ok) {
        setSyncError(data.error || 'ไม่สามารถซิงค์โครงสร้างฐานข้อมูล PHPMyAdmin ได้สำเร็จ');
      }
    } catch (err: any) {
      setSyncError(err.message || 'การเชื่อมโยงขัดข้อง');
      setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString('th-TH')}] 🔴 ระบบซิงก์ออฟไลน์: ${err.message}`]);
    } finally {
      setIsSyncing(false);
    }
  };

  // PA States
  const [agreements, setAgreements] = useState<PAAgreement[]>([]);
  const [selectedAgreement, setSelectedAgreement] = useState<PAAgreement | null>(null);
  const [newYearInput, setNewYearInput] = useState('2569');
  
  // Indicators and active indicator detail
  const [indicators, setIndicators] = useState<PAIndicator[]>([]);
  const [selectedIndicator, setSelectedIndicator] = useState<PAIndicator | null>(null);
  const [evidenceList, setEvidenceList] = useState<PAEvidence[]>([]);

  // Editing forms state
  const [savingIndicatorId, setSavingIndicatorId] = useState<string | null>(null);
  const [isSavingAgreement, setIsSavingAgreement] = useState(false);

  // New Evidence link inputs
  const [newEvTitle, setNewEvTitle] = useState('');
  const [newEvLinkUrl, setNewEvLinkUrl] = useState('');
  const [newEvType, setNewEvType] = useState<'link' | 'image' | 'video' | 'document'>('link');
  const [newEvDesc, setNewEvDesc] = useState('');
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);

  // Copilot messages state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: 'สวัสดีครับคุณครู! ผมคือผู้ช่วยอัจฉริยะ วPA ยินดีต้อนรับสู่ระบบสะสมผลงานครับ ผมสามารถช่วยคุณครูร่างคำเขียนให้สอดคล้องตามตัวชี้วัด สพฐ. รวมถึงเขียนประเด็นท้าทายให้ออกมาเป็นระเบียบตามเกณฑ์กพค. เพื่อความพร้อมสูงสุดในการประเมินวิทยฐานะครับ คุณครูอยากปรึกษาเรื่องอะไรแจ้งได้เลยครับ',
      createdAt: new Date().toISOString()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAskingCopilot, setIsAskingCopilot] = useState(false);

  // Check login on startup
  useEffect(() => {
    const cached = localStorage.getItem('pa_teacher_profile');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProfile(parsed);
      } catch (e) {
        localStorage.removeItem('pa_teacher_profile');
      }
    }
    setAuthChecked(true);
  }, []);

  // Fetch Agreements when profile changes
  useEffect(() => {
    if (profile) {
      fetchAgreements();
    }
  }, [profile]);

  // Fetch Indicators & Evidence when selectedAgreement changes
  useEffect(() => {
    if (selectedAgreement) {
      fetchIndicatorsAndEvidence(selectedAgreement.id);
    } else {
      setIndicators([]);
      setSelectedIndicator(null);
      setEvidenceList([]);
    }
  }, [selectedAgreement]);

  const fetchAgreements = async () => {
    if (!profile) return;
    try {
      const res = await fetch('/api/agreements', {
        headers: {
          'Authorization': `Bearer ${profile.id}`
        }
      });
      const data = await res.json();
      if (res.ok && data.list) {
        setAgreements(data.list);
        if (data.list.length > 0) {
          // Default to first or latest
          const latest = data.list[data.list.length - 1];
          setSelectedAgreement(latest);
        } else {
          // Auto-create a default agreement for 2569 to onboard the user smoothly
          handleCreateAgreement('2569');
        }
      }
    } catch (err) {
      console.error('Failed to load agreements', err);
    }
  };

  const fetchIndicatorsAndEvidence = async (agreementId: string) => {
    if (!profile) return;
    try {
      // Parallel fetch
      const [resInd, resEv] = await Promise.all([
        fetch(`/api/agreements/${agreementId}/indicators`, {
          headers: { 'Authorization': `Bearer ${profile.id}` }
        }),
        fetch(`/api/agreements/${agreementId}/evidence`, {
          headers: { 'Authorization': `Bearer ${profile.id}` }
        })
      ]);

      const dataInd = await resInd.json();
      const dataEv = await resEv.json();

      if (resInd.ok && dataInd.list) {
        setIndicators(dataInd.list);
        // Default select first indicator
        if (dataInd.list.length > 0) {
          setSelectedIndicator(dataInd.list[0]);
        }
      }
      if (resEv.ok && dataEv.list) {
        setEvidenceList(dataEv.list);
      }
    } catch (err) {
      console.error('Failed to load indicators/evidence', err);
    }
  };

  const handleCreateAgreement = async (year: string) => {
    if (!profile || !year) return;
    try {
      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${profile.id}`
        },
        body: JSON.stringify({ budgetYear: year })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'ไม่สามารถสร้างข้อตกลง PA ใหม่ได้');
        return;
      }
      // Re-fetch
      const updatedRes = await fetch('/api/agreements', {
        headers: { 'Authorization': `Bearer ${profile.id}` }
      });
      const updatedData = await updatedRes.json();
      if (updatedRes.ok && updatedData.list) {
        setAgreements(updatedData.list);
        const newlyCreated = updatedData.list.find((a: PAAgreement) => a.budgetYear === year);
        if (newlyCreated) {
          setSelectedAgreement(newlyCreated);
        }
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการสร้างรายการ');
    }
  };

  const handleUpdateAgreementField = async (fields: Partial<PAAgreement>) => {
    if (!profile || !selectedAgreement) return;
    setIsSavingAgreement(true);
    try {
      const res = await fetch(`/api/agreements/${selectedAgreement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${profile.id}`
        },
        body: JSON.stringify(fields)
      });
      const data = await res.json();
      if (res.ok && data.agreement) {
        setSelectedAgreement(data.agreement);
        setAgreements(prev => prev.map(a => a.id === data.agreement.id ? data.agreement : a));
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingAgreement(false);
    }
  };

  const handleUpdateProfile = async (fields: Partial<TeacherProfile>) => {
    if (!profile) return;
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${profile.id}`
        },
        body: JSON.stringify(fields)
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        const updated = { ...profile, ...data.profile };
        setProfile(updated);
        localStorage.setItem('pa_teacher_profile', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Failed to update profile via API', err);
    }
  };

  const handleUpdateIndicator = async (indicatorId: string, fields: Partial<PAIndicator>) => {
    if (!profile || !selectedIndicator) return;
    setSavingIndicatorId(indicatorId);
    try {
      const res = await fetch(`/api/indicators/${indicatorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${profile.id}`
        },
        body: JSON.stringify(fields)
      });
      const data = await res.json();
      if (res.ok && data.indicator) {
        setIndicators(prev => prev.map(i => i.id === indicatorId ? data.indicator : i));
        setSelectedIndicator(data.indicator);
      } else {
        alert(data.error || 'ไม่สามารถบันทึกข้อมูลตัวชี้วัดได้');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingIndicatorId(null);
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedAgreement || !selectedIndicator || !newEvTitle || !newEvLinkUrl) {
      alert('กรุณากรอกชื่อเรื่องและระบุลิงก์ผลงาน');
      return;
    }
    setIsAddingEvidence(true);
    try {
      const res = await fetch(`/api/agreements/${selectedAgreement.id}/evidence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${profile.id}`
        },
        body: JSON.stringify({
          indicatorNumber: selectedIndicator.number,
          title: newEvTitle,
          linkUrl: newEvLinkUrl,
          evidenceType: newEvType,
          description: newEvDesc
        })
      });
      const data = await res.json();
      if (res.ok && data.evidence) {
        setEvidenceList(prev => [...prev, data.evidence]);
        // Reset Inputs
        setNewEvTitle('');
        setNewEvLinkUrl('');
        setNewEvDesc('');
      } else {
        alert(data.error || 'ไม่สามารถบันทึกข้อมูลได้');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingEvidence(false);
    }
  };

  const handleDeleteEvidence = async (evidenceId: string) => {
    if (!profile || !confirm('ยืนยันประสงค์ต้องการลบเอกสารหลักฐานชิ้นนี้?')) return;
    try {
      const res = await fetch(`/api/evidence/${evidenceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${profile.id}`
        }
      });
      if (res.ok) {
        setEvidenceList(prev => prev.filter(e => e.id !== evidenceId));
      } else {
        alert('ไม่สามารถลบชิ้นงานได้');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAskCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAskingCopilot) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text: chatInput,
      createdAt: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAskingCopilot(true);

    try {
      const contextInfo = {
        teacherName: profile?.fullName,
        teacherPosition: profile?.position,
        teachingSubject: profile?.teachingSubject,
        currentIndicatorNum: selectedIndicator?.number,
        currentIndicatorTitle: selectedIndicator?.title
      };

      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(({ role, text }) => ({ role, text })),
          contextInfo
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI ไม่ตอบสนองชั่วคราว');

      setChatMessages(prev => [...prev, {
        id: 'reply_' + Date.now(),
        role: 'model',
        text: data.text,
        createdAt: new Date().toISOString()
      }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, {
        id: 'reply_error_' + Date.now(),
        role: 'model',
        text: `⚠️ เกิดเหตุขัดข้องทางเทคนิค: ${err.message || 'กรุณาลองใหม่อีกครั้ง คีย์ Gemini อาจยังไม่ได้เชื่อมโยงหรือไม่มีอินเทอร์เน็ต'}`,
        createdAt: new Date().toISOString()
      }]);
    } finally {
      setIsAskingCopilot(false);
    }
  };

  const handleLogout = () => {
    if (confirm('คุณต้องการออกจากระบบหรือไม่? มั่นใจได้ว่าข้อมูลข้อตกลงของคุณจะคงอยู่ใน database อย่างปลอดภัย')) {
      localStorage.removeItem('pa_teacher_profile');
      setProfile(null);
      setSelectedAgreement(null);
      setViewMode('portfolio');
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600">กำลังตรวจสอบสิทธิ์โครงสร้างผู้ใช้ยึดโยง...</p>
        </div>
      </div>
    );
  }

  const isDemoMode = !profile;
  const activeProfile = profile || DEMO_PROFILE;

  // Active dataset depending on mode (demo vs registered user)
  const activeAgreements = isDemoMode ? [DEMO_AGREEMENT] : agreements;
  const activeSelectedAgreement = isDemoMode ? DEMO_AGREEMENT : selectedAgreement;
  const activeIndicators = isDemoMode ? DEMO_INDICATORS : indicators;
  const activeEvidenceList = isDemoMode ? DEMO_EVIDENCE : evidenceList;

  // Metric computations
  const countedIndicators = activeIndicators.length;
  const completedCount = activeIndicators.filter(i => (i.workPlan || '').trim().length > 10).length;
  const averageScore = activeIndicators.reduce((sum, item) => sum + (item.score || 0), 0) / (activeIndicators.length || 1);
  const totalEvidence = activeEvidenceList.length;

  if (viewMode === 'portfolio') {
    return (
      <div className="relative w-full min-h-screen bg-slate-100 flex flex-col text-slate-850">
        
        {/* Top Floating Nav Bar */}
        <div className="fixed top-0 left-0 right-0 h-14 bg-slate-900/95 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 z-40 text-white shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm ring-1 ring-emerald-400/20">
              PA
            </div>
            <span className="text-sm font-bold tracking-tight hidden sm:inline">OBEC PA-Portfolio</span>
            <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium">
              โหมดนำเสนอ วPA (พอร์ตโฟลิโอ)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isDemoMode) {
                  setShowAuthModal(true);
                } else {
                  setViewMode('admin');
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isDemoMode ? 'เข้าสู่ระบบเริ่มทำรายงานตนเอง' : '⚙️ แผงควบคุมระบบ (Admin)'}</span>
            </button>
          </div>
        </div>

        <div className="pt-14 w-full">
          <TeacherPortfolioView
            activeProfile={activeProfile}
            activeAgreements={activeAgreements}
            activeSelectedAgreement={activeSelectedAgreement}
            activeIndicators={activeIndicators}
            activeEvidenceList={activeEvidenceList}
            completedCount={completedCount}
            averageScore={averageScore}
            totalEvidence={totalEvidence}
            isDemoMode={isDemoMode}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        </div>

        {/* Auth modal display */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative border border-slate-100">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all z-10 cursor-pointer"
                title="ปิดหน้าต่าง"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="p-6 md:p-10">
                <WelcomeAuth onSuccess={(p) => {
                  localStorage.setItem('pa_teacher_profile', JSON.stringify(p));
                  setProfile(p);
                  setShowAuthModal(false);
                  setViewMode('admin');
                }} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden relative">
      
      {/* Floating Eye toggle for Admin back to portfolio */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setViewMode('portfolio')}
          className="bg-slate-900 hover:bg-slate-800 shadow-xl text-yellow-350 font-extrabold text-xs px-4.5 py-3 rounded-2xl border-2 border-yellow-300/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap scroll-smooth"
        >
          <Eye className="h-4 w-4 text-yellow-400" />
          <span>👁️ ดูหน้าเว็บเสนอกรรมการ (View Portfolio)</span>
        </button>
      </div>
      
      {/* SIDEBAR NAVIGATION - Styled based on "Professional Polish" */}
      <aside className="w-72 bg-slate-900 flex flex-col border-r border-slate-800 shadow-xl shrink-0">
        <div className="p-5 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-md ring-2 ring-emerald-400/20">
            PA
          </div>
          <div className="leading-tight">
            <h1 className="text-white font-bold text-base tracking-tight">OBEC-PA System</h1>
            <p className="text-slate-400 text-xs">ระบบจัดการข้อมูลประเมินครู</p>
          </div>
        </div>

        {/* Dynamic Budget Year Selector */}
        <div className="px-4 pt-4">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
              ปีงบประมาณที่ประเมิน
            </label>
            <div className="flex gap-1">
              <select
                id="agreement_selector"
                value={selectedAgreement?.id || ''}
                onChange={(e) => {
                  const found = agreements.find(a => a.id === e.target.value);
                  if (found) setSelectedAgreement(found);
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-semibold text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {agreements.map(a => (
                  <option key={a.id} value={a.id}>ปีงบประมาณ {a.budgetYear}</option>
                ))}
              </select>
              <button
                id="add_year_btn"
                onClick={() => {
                  const yr = prompt('กรอกปีงบประมาณใหม่ เช่น 2570');
                  if (yr) handleCreateAgreement(yr);
                }}
                title="สร้างข้อตกลงปีงบประมาณถัดไป"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded p-1 shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto">
          <button
            id="tab_dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border text-left ${
              activeTab === 'dashboard' 
                ? 'bg-emerald-600/10 text-emerald-400 font-semibold border-emerald-600/20 shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent'
            }`}
          >
            <Activity className="h-5 w-5 shrink-0" />
            <span className="text-sm">ภาพรวม & ภาระงานครู</span>
          </button>

          <button
            id="tab_indicators"
            onClick={() => setActiveTab('indicators')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border text-left ${
              activeTab === 'indicators' 
                ? 'bg-emerald-600/10 text-emerald-400 font-semibold border-emerald-600/20 shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent'
            }`}
          >
            <Layers className="h-5 w-5 shrink-0" />
            <span className="text-sm flex-1">สมุดผลงาน 15 ตัวชี้วัด</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {completedCount}/{countedIndicators}
            </span>
          </button>

          <button
            id="tab_challenge"
            onClick={() => setActiveTab('challenge')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border text-left ${
              activeTab === 'challenge' 
                ? 'bg-emerald-600/10 text-emerald-400 font-semibold border-emerald-600/20 shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileText className="h-5 w-5 shrink-0" />
            <span className="text-sm">ประเด็นท้าทาย (Part 2)</span>
          </button>

          <button
            id="tab_copilot"
            onClick={() => setActiveTab('copilot')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border text-left ${
              activeTab === 'copilot' 
                ? 'bg-emerald-600/10 text-emerald-400 font-semibold border-emerald-600/20 shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent'
            }`}
          >
            <Sparkles className="h-5 w-5 shrink-0 text-amber-400" />
            <span className="text-sm">แชทบอท ผู้ช่วย AI วPA</span>
          </button>

          <button
            id="tab_mysql"
            onClick={() => setActiveTab('mysql')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border text-left ${
              activeTab === 'mysql' 
                ? 'bg-emerald-600/10 text-emerald-400 font-semibold border-emerald-600/20 shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent'
            }`}
          >
            <Server className="h-5 w-5 shrink-0" />
            <span className="text-sm">เชื่อมต่อ PHP + MySQL</span>
          </button>
        </nav>

        {/* Indicator Stats in Sidebar */}
        <div className="p-4 mt-auto mb-2">
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/60 shadow-lg">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">
              ความสมบูรณ์รวม (วPA สพฐ.)
            </p>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-white font-bold">
                {countedIndicators > 0 ? Math.round((completedCount / countedIndicators) * 100) : 0}% 
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                คะแนนเฉลี่ย: {averageScore.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${countedIndicators > 0 ? (completedCount / countedIndicators) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              หลักฐานสะสมแล้ว <strong className="text-slate-200">{totalEvidence} ชิ้นงาน</strong>
            </p>
          </div>
        </div>

        {/* Bottom User Info of Sidebar */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <img 
              src={profile.photoUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(profile.fullName)}`} 
              className="w-10 h-10 rounded-full border border-slate-700 shrink-0" 
              alt="Avatar" 
              referrerPolicy="no-referrer"
            />
            <div className="leading-tight overflow-hidden">
              <p className="text-xs text-white font-semibold truncate">{profile.fullName}</p>
              <p className="text-[10px] text-emerald-400 truncate">{profile.position}</p>
            </div>
          </div>
          <button
            id="logout_btn"
            onClick={handleLogout}
            title="ออกจากระบบ"
            className="p-1 px-2 text-slate-400 hover:text-rose-400 transition-colors bg-slate-900 rounded"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header - "Professional Polish" */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="overflow-hidden mr-4">
            <h2 className="text-xl font-bold text-slate-900 truncate">
              ยินดีต้อนรับ, {profile.fullName}
            </h2>
            <p className="text-slate-500 text-xs truncate">
              {profile.schoolName} • กลุ่มสาระ{profile.teachingSubject} • บันทึกข้อตกลง วPA 
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">สถานะฐานข้อมูลจำลอง</p>
              <div className="flex items-center justify-end gap-1.5 text-sm font-semibold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                MySQL Local Ready
              </div>
            </div>
            
            <button
              id="header_dump_mysql"
              onClick={() => window.open('/api/db/mysql-dump', '_blank')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow transition-all duration-150 flex items-center gap-1.5 active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>ดาวน์โหลด SQL</span>
            </button>
          </div>
        </header>

        {/* Tab-driven Content Grid */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">

          {/* TAB 1: DASHBOARD & WORKLOAD */}
          {activeTab === 'dashboard' && (
            <div id="view_dashboard" className="space-y-6">
              
              {/* Profile Overview Card & Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ชั่วโมงสอน</p>
                    <p className="text-2xl font-bold text-slate-900">{profile.teachingHours || '18'} <span className="text-xs text-slate-400 font-normal">ชม./สัปดาห์</span></p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ปีงบประมาณ</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedAgreement?.budgetYear || '2569'}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">เกณฑ์ประเมินปีนี้</p>
                    <p className="text-2xl font-bold text-slate-900">15 <span className="text-xs text-slate-400 font-normal">ตัวชี้วัด สพฐ</span></p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ความคืบหน้าเขียน</p>
                    <p className="text-2xl font-bold text-emerald-600">{completedCount} <span className="text-xs text-slate-400 font-normal">/15 หัวข้อ</span></p>
                  </div>
                </div>
              </div>

              {/* Main Profile Editor & Workload Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Edit profile of Teacher */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <User className="h-5 w-5 text-emerald-600" />
                      ทะเบียนข้อมูลผู้ลงทะเบียนฐานข้อมูล
                    </h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                      ข้อมูลพนักงานเจ้าหน้าที่
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">ชื่อ-สกุล คุณครู</label>
                      <input
                        id="profile_fullname"
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => {
                          const updated = { ...profile, fullName: e.target.value };
                          setProfile(updated);
                          handleUpdateProfile({ fullName: e.target.value });
                        }}
                        className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">ตำแหน่ง/วิทยฐานะ</label>
                      <select
                        id="profile_position"
                        value={profile.position}
                        onChange={(e) => {
                          const updated = { ...profile, position: e.target.value };
                          setProfile(updated);
                          handleUpdateProfile({ position: e.target.value });
                        }}
                        className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 bg-white"
                      >
                        <option value="ครูผู้ช่วย">ครูผู้ช่วย</option>
                        <option value="ครู ค.ศ. 1">ครู (ไม่มีวิทยฐานะ)</option>
                        <option value="ครูชำนาญการ">ครูชำนาญการ (วPA)</option>
                        <option value="ครูชำนาญการพิเศษ">ครูชำนาญการพิเศษ (วPA)</option>
                        <option value="ครูเชี่ยวชาญ">ครูเชี่ยวชาญ (วPA)</option>
                        <option value="ครูเชี่ยวชาญพิเศษ">ครูเชี่ยวชาญพิเศษ</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">กลุ่มสาระการเรียนรู้/วิชาที่สอน</label>
                      <input
                        id="profile_subject"
                        type="text"
                        value={profile.teachingSubject}
                        onChange={(e) => {
                          const updated = { ...profile, teachingSubject: e.target.value };
                          setProfile(updated);
                          handleUpdateProfile({ teachingSubject: e.target.value });
                        }}
                        className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">ชั่วโมงการปฏิบัติงาน (สอนตามตาราง)</label>
                      <input
                        id="profile_hours"
                        type="text"
                        value={profile.teachingHours}
                        onChange={(e) => {
                          const updated = { ...profile, teachingHours: e.target.value };
                          setProfile(updated);
                          handleUpdateProfile({ teachingHours: e.target.value });
                        }}
                        className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">สถานศึกษา</label>
                      <input
                        id="profile_school"
                        type="text"
                        value={profile.schoolName}
                        onChange={(e) => {
                          const updated = { ...profile, schoolName: e.target.value };
                          setProfile(updated);
                          handleUpdateProfile({ schoolName: e.target.value });
                        }}
                        className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">การเปลี่ยนรูป Avatar (จากคีย์เวิร์ด)</label>
                      <input
                        id="profile_photo"
                        type="text"
                        value={profile.photoUrl || ''}
                        placeholder="https://api.dicebear.com/..."
                        onChange={(e) => {
                          const updated = { ...profile, photoUrl: e.target.value };
                          setProfile(updated);
                          handleUpdateProfile({ photoUrl: e.target.value });
                        }}
                        className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    * เมื่อคุณครูแก้ไขกล่องฟอร์มด้านบน ระบบจะเรียกเชื่อมโยงอัปเดตลงฐานข้อมูล MySQL จำลองทันที
                  </p>
                </div>

                {/* CUSTOM DECORATED HEADER BANNER COMPONENT */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="h-5 w-5 text-amber-500 animate-pulse shrink-0" />
                      ตกแต่งส่วนหัวเว็บไซต์นำเสนอ (Header Banner Customization)
                    </h3>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold shrink-0">
                      พรีวิวด้านหน้าพอร์ตโฟลิโอเสนอกรรมการ
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    คุณครูสามารถเลือกแบบเทมเพลตที่ระบบตกแต่งสำเร็จรูปให้งดงามทันที (เช่น สีเขียว สีกรม สีส้มทอง) หรือป้อนลิงก์รูปภาพภายนอกที่ตนเองตกแต่งมาแทนที่ได้ เพื่อเพิ่มความน่าสนใจสูงสุดต่อหน้าคณะกรรมการประเมิน วPA!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Preset Selectors */}
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-600">เลือกเทมเพลตสำเร็จรูปที่ต้องการ</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: 'gradient_emerald', name: 'เขียวประกายทอง (สพฐ.)', style: 'bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 border-emerald-500' },
                          { id: 'gradient_navy', name: 'กรมท่าวิชาการสุขุม', style: 'bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-950 border-indigo-500' },
                          { id: 'gradient_amber', name: 'ส้มอรุณเทคโนโลยี', style: 'bg-gradient-to-r from-amber-950 via-amber-800 to-rose-950 border-amber-500' },
                          { id: 'gradient_purple', name: 'ม่วงปราชญ์วิจิตร', style: 'bg-gradient-to-r from-violet-950 via-purple-900 to-indigo-950 border-purple-500' },
                          { id: 'gradient_rose', name: 'ชมพูกลีบบัวพุทธรักษา', style: 'bg-gradient-to-r from-rose-950 via-rose-800 to-slate-900 border-rose-500' },
                        ].map((item) => {
                          const isActive = profile.headerBannerUrl === item.id || (!profile.headerBannerUrl && item.id === 'gradient_emerald');
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                const updated = { ...profile, headerBannerUrl: item.id };
                                setProfile(updated);
                                handleUpdateProfile({ headerBannerUrl: item.id });
                              }}
                              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                                isActive ? 'ring-2 ring-emerald-500 border-transparent shadow-sm transform scale-[1.01]' : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div className={`w-full h-4 rounded ${item.style}`}></div>
                              <span className="text-[10px] font-bold text-slate-600 leading-tight block mt-1">{item.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Custom URL Input & Realtime Preview */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          หรือป้อนลิงก์รูปภาพส่วนหัวจาก Canva / ภายนอก (Custom Banner URL)
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="custom_banner_input"
                            type="text"
                            placeholder="ตัวอย่าง https://images.unsplash.com/... หรือ ลิงก์รูปจาก Canva"
                            value={profile.headerBannerUrl && !profile.headerBannerUrl.startsWith('gradient_') ? profile.headerBannerUrl : ''}
                            onChange={(e) => {
                              const updated = { ...profile, headerBannerUrl: e.target.value };
                              setProfile(updated);
                              handleUpdateProfile({ headerBannerUrl: e.target.value });
                            }}
                            className="flex-1 text-xs p-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-emerald-500 font-semibold"
                          />
                          {profile.headerBannerUrl && !profile.headerBannerUrl.startsWith('gradient_') && (
                            <button
                              onClick={() => {
                                const updated = { ...profile, headerBannerUrl: 'gradient_emerald' };
                                setProfile(updated);
                                handleUpdateProfile({ headerBannerUrl: 'gradient_emerald' });
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[11px] font-bold transition-all shrink-0"
                            >
                              ล้างค่า
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Realtime Banner Preview panel */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-50">
                        <div className="h-16 rounded-lg relative overflow-hidden flex items-center justify-center">
                          {profile.headerBannerUrl && !profile.headerBannerUrl.startsWith('gradient_') ? (
                            <img
                              src={profile.headerBannerUrl}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600";
                              }}
                              alt="Banner Preview"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className={`absolute inset-0 w-full h-full ${
                              profile.headerBannerUrl === 'gradient_navy' ? 'bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-950' :
                              profile.headerBannerUrl === 'gradient_amber' ? 'bg-gradient-to-r from-amber-950 via-amber-800 to-rose-950' :
                              profile.headerBannerUrl === 'gradient_purple' ? 'bg-gradient-to-r from-violet-950 via-purple-900 to-indigo-950' :
                              profile.headerBannerUrl === 'gradient_rose' ? 'bg-gradient-to-r from-rose-950 via-rose-800 to-slate-900' :
                              'bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900'
                            }`}></div>
                          )}
                          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-2">
                            <span className="text-[9px] font-bold text-yellow-300 uppercase leading-none tracking-widest">LIVE BANNER PREVIEW</span>
                            <span className="text-white text-xs font-bold leading-tight truncate">{profile.fullName || 'ชื่อคุณครู'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Workload Breakdown (ภาระงานประเมิน) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                        <BarChart3 className="h-5 w-5 text-emerald-600" />
                        ภาระงานตามกำหนด (ก.ค.ศ.)
                      </h3>
                    </div>

                    {selectedAgreement && (
                      <div className="space-y-3.5">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600 font-medium">1. ชั่วโมงสอนวิชาสามัญ/ตามตารางเรียน</span>
                            <span className="font-bold text-slate-900">{selectedAgreement.workloadLessons} ชม.</span>
                          </div>
                          <input
                            type="range" min="1" max="40"
                            value={selectedAgreement.workloadLessons}
                            onChange={(e) => handleUpdateAgreementValue('workloadLessons', e.target.value)}
                            className="w-full accent-emerald-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600 font-medium">2. งานส่งเสริมและสนับสนุนการเรียน</span>
                            <span className="font-bold text-slate-900">{selectedAgreement.workloadSupport} ชม.</span>
                          </div>
                          <input
                            type="range" min="0" max="25"
                            value={selectedAgreement.workloadSupport}
                            onChange={(e) => handleUpdateAgreementValue('workloadSupport', e.target.value)}
                            className="w-full accent-emerald-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600 font-medium">3. งานพัฒนาคุณภาพจัดการศึกษา</span>
                            <span className="font-bold text-slate-900">{selectedAgreement.workloadSchool} ชม.</span>
                          </div>
                          <input
                            type="range" min="0" max="25"
                            value={selectedAgreement.workloadSchool}
                            onChange={(e) => handleUpdateAgreementValue('workloadSchool', e.target.value)}
                            className="w-full accent-emerald-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600 font-medium">4. งานตอบสนองนโยบายรัฐ/จุดเน้น สพฐ.</span>
                            <span className="font-bold text-slate-900">{selectedAgreement.workloadLife} ชม.</span>
                          </div>
                          <input
                            type="range" min="0" max="25"
                            value={selectedAgreement.workloadLife}
                            onChange={(e) => handleUpdateAgreementValue('workloadLife', e.target.value)}
                            className="w-full accent-emerald-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 text-xs">
                      <p className="font-semibold mb-0.5">💡 เกร็ดความรู้วPA สพฐ</p>
                      <p className="opacity-90">ชั่วโมงเพื่อสังคมและภาระงานครูทุกส่วนรวมกัน ไม่ควรต่ำกว่า 20 ชั่วโมง/สัปดาห์ เพื่อความสมบูรณ์ในการประเมินระดับเลื่อนขั้นวิทยฐานะ</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Instructions and Flow for Teacher PA */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 relative overflow-hidden shadow-md">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-700/20 rounded-full blur-2xl"></div>
                
                <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                  แนวทางการเขียนข้อตกลงและดาวน์โหลดเพื่อบันทึกใน MySQL
                </h3>
                <p className="text-slate-300 text-xs max-w-2xl leading-relaxed mb-4">
                  ระบบนี้จัดทำขึ้นตามกรอบตัวชี้วัดของสำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.) ทั้ง 3 ด้าน 15 ตัวชี้วัด 
                  เพื่อความสบายของผู้ใช้ ระบบช่วยให้คุณบันทึกข้อมูลทุกขั้นตอน ไม่สูญหาย 
                  รวมถึงยังสามารถดาวน์โหลดปุ่ม <strong>"ส่งออกฐานข้อมูลคัดลอกลง MySQL"</strong> ด้านขวาของเมนู เพื่อสร้างเทเบิลสตรีมและรันบนเซิร์ฟเวอร์หน่วยงานได้ทันที!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                    <p className="text-xs font-bold text-amber-400 mb-1">ขั้นตอนที่ 1</p>
                    <p className="text-xs text-slate-300">กรอกหัวข้อและชิ้นงานความดีงามสะสมของคุณลงในแผน 15 ตัวชี้วัด</p>
                  </div>
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                    <p className="text-xs font-bold text-amber-400 mb-1">ขั้นตอนที่ 2</p>
                    <p className="text-xs text-slate-300">ปรึกษา AI ผู้ช่วยส่วนตัวเพื่อให้ช่วยเกลาหนังสือและตรวจสอบว่าเข้าเกณฑ์ สพฐ. หรือไม่</p>
                  </div>
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                    <p className="text-xs font-bold text-amber-400 mb-1">ขั้นตอนที่ 3</p>
                    <p className="text-xs text-slate-300">กดปุ่มส่งออกสคริปต์ MySQL เพื่อดาวน์โหลดรหัส SQL ดัมพ์ไปจัดเก็บเป็นฐานข้อมูลถาวร</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: 15 INDICATORS PORTFOLIO LIST & DETAIL */}
          {activeTab === 'indicators' && (
            <div id="view_indicators" className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left side: List of 15 indicators ordered */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[80vh]">
                  <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800">
                      ดัชนีชี้วัด 3 ด้านตามข้อกำหนด สพฐ. (15 ตัวชี้วัด)
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      คลิกเลือกตัวชี้วัดทางเพื่อบันทึกงาน สะสมลิงก์หลักฐาน และให้คะแนนตนเอง
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
                    {indicators.map((ind) => {
                      const isCompleted = (ind.workPlan || '').trim().length > 10;
                      const hasEv = evidenceList.filter(e => e.indicatorNumber === ind.number).length;
                      const isSelected = selectedIndicator?.id === ind.id;

                      let sideBadgeColor = 'bg-slate-300';
                      if (ind.number.startsWith('2.')) sideBadgeColor = 'bg-blue-600';
                      else if (ind.number.startsWith('3.')) sideBadgeColor = 'bg-amber-500';
                      else sideBadgeColor = 'bg-emerald-600';

                      return (
                        <button
                          key={ind.id}
                          id={`indicator_item_${ind.number.replace('.', '_')}`}
                          onClick={() => setSelectedIndicator(ind)}
                          className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                            isSelected ? 'bg-slate-100 font-semibold border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg ${sideBadgeColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                            {ind.number}
                          </div>
                          
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs text-slate-900 truncate font-semibold block">{ind.title}</span>
                              {isCompleted && (
                                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{ind.description}</p>
                            
                            {/* Evidence tag counts */}
                            <div className="flex gap-1.5 mt-2">
                              {hasEv > 0 && (
                                <span className="bg-emerald-50 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded border border-emerald-200/50">
                                  แนบหลักฐาน {hasEv} รายการ
                                </span>
                              )}
                              <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded">
                                ระดับตนเอง: {ind.score} / 4
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right side: Active Indicator Form & Link Evidence portfolio */}
                <div className="lg:col-span-7 space-y-6">
                  {selectedIndicator ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                      
                      {/* Indicator Header */}
                      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            ตัวชี้วัด สพฐ. ที่ {selectedIndicator.number}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedIndicator.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">{selectedIndicator.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">คะแนนผลการสอน</label>
                          <select
                            id="indicator_score_select"
                            value={selectedIndicator.score}
                            onChange={(e) => handleUpdateIndicator(selectedIndicator.id, { score: Number(e.target.value) })}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 p-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1"
                          >
                            <option value="1">ระดับ 1 (ปรับปรุง)</option>
                            <option value="2">ระดับ 2 (พอใช้)</option>
                            <option value="3">ระดับ 3 (ดี/ตามเกณฑ์)</option>
                            <option value="4">ระดับ 4 (ดีเลิศ)</option>
                          </select>
                        </div>
                      </div>

                      {/* Main Written Text areas */}
                      <div className="space-y-4">
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="inline-flex items-center text-xs font-bold text-slate-700">
                              1) งานที่ดำเนินการ (Tasks) ตามข้อตกลงวิชาชีพ
                            </label>
                            <button
                              onClick={() => {
                                setChatInput(`ช่วยแนะนำตัวอย่างในการเขียนรายงาน วPA สพฐ. สำหรับ "ตัวชี้วัดที่ ${selectedIndicator.number} ${selectedIndicator.title}" ของกลุ่มสาระ ${profile.teachingSubject} ให้สอดคล้องกับวิทยฐานะ ${profile.position} หน่อยครับ`);
                                setActiveTab('copilot');
                              }}
                              className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-0.5"
                            >
                              <Sparkles className="h-3 w-3" />
                              ให้ AI วPA ช่วยแนะนำการเขียน
                            </button>
                          </div>
                          <textarea
                            id="field_workplan"
                            rows={3}
                            value={selectedIndicator.workPlan || ''}
                            onChange={(e) => handleFieldChange('workPlan', e.target.value)}
                            placeholder="ระบุงานที่จะปฎิบัติ เช่น ปรับกระบวนการสอนวิชาวิทยาการคำนวณ จัดทำห้องเรียน Active learning..."
                            className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            2) ตัวชี้วัดผลสัมฤทธิ์ปลายทาง (Indicators) ของผู้เรียน
                          </label>
                          <textarea
                            id="field_indicators"
                            rows={2}
                            value={selectedIndicator.indicators || ''}
                            onChange={(e) => handleFieldChange('indicators', e.target.value)}
                            placeholder="ระบุตัววัดความสำเร็จผู้เรียน เช่น นักเรียนร้อยละ 80 มีคะแนนผ่านเกณฑ์ประเมินที่กำหนด..."
                            className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              3) ระยะเวลาดำเนินการ (Evaluation Times)
                            </label>
                            <input
                              id="field_times"
                              type="text"
                              value={selectedIndicator.evaluationTimes || ''}
                              onChange={(e) => handleFieldChange('evaluationTimes', e.target.value)}
                              placeholder="เช่น ตลอดปีการศึกษา / ภาคเรียนที่ 1"
                              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              4) บันทึกผลลัพธ์ประเมินตนเอง (Performance Report)
                            </label>
                            <input
                              id="field_self_report"
                              type="text"
                              value={selectedIndicator.selfEvaluationText || ''}
                              onChange={(e) => handleFieldChange('selfEvaluationText', e.target.value)}
                              placeholder="ผลการขัดเกลาและรวบรวมชิ้นงานชี้วัดเด่น"
                              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Save Action indicators */}
                        <div className="flex justify-end pt-1">
                          <button
                            id="save_indicator_btn"
                            onClick={() => handleUpdateIndicator(selectedIndicator.id, selectedIndicator)}
                            disabled={savingIndicatorId === selectedIndicator.id}
                            className="bg-slate-900 border border-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-slate-800"
                          >
                            <Save className="h-4 w-4" />
                            {savingIndicatorId === selectedIndicator.id ? 'กำลังบันทึกลงฐานข้อมูล...' : 'บันทึกตัวชี้วัดนี้'}
                          </button>
                        </div>

                      </div>

                      {/* Evidence List for active indicator */}
                      <div className="border-t border-slate-100 pt-5 space-y-4">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                          <span>ลิ้งค์แนบหลักฐานชิ้นงานและเอกสารประกอบ (สำหรับตัวชี้วัดนี้)</span>
                          <span className="text-[10px] text-slate-400 normal-case font-normal">เช่น ลิงก์เก็บแผนบทเรียนใน Google Drive, รูปภาพกิจกรรม</span>
                        </h4>

                        {/* Existing Evidence List */}
                        <div className="space-y-2">
                          {evidenceList.filter(e => e.indicatorNumber === selectedIndicator.number).length === 0 ? (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400">
                              ยังไม่ได้แนบหลักฐานเชิงประจักษ์ ให้ใช้กล่องด้านล่างเพิ่มแผนงาน ภาพประกอบ หรือวิดีโอสัมภาษณ์
                            </div>
                          ) : (
                            evidenceList.filter(e => e.indicatorNumber === selectedIndicator.number).map((ev) => (
                              <div key={ev.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-800 truncate block">{ev.title}</span>
                                    <span className="bg-blue-100 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                                      {ev.evidenceType}
                                    </span>
                                  </div>
                                  {ev.description && <p className="text-[10px] text-slate-500 truncate mt-0.5">{ev.description}</p>}
                                  <a 
                                    href={ev.linkUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[10px] text-emerald-600 font-semibold hover:underline inline-flex items-center gap-0.5 mt-1"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    เปิดลิงก์หลักฐานภายนอก
                                  </a>
                                </div>
                                <button
                                  onClick={() => handleDeleteEvidence(ev.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                                  title="ลบออก"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add New Evidence link form */}
                        <form onSubmit={handleAddEvidence} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">เพิ่มหลักฐานใหม่</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2">
                              <input
                                id="ev_title_input"
                                type="text"
                                required
                                value={newEvTitle}
                                onChange={(e) => setNewEvTitle(e.target.value)}
                                placeholder="ชื่อหลักฐาน (เช่น แผนจัดกิจกรรม Active Learning หรือรูปเด็กทำโครงการ)"
                                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                              />
                            </div>
                            <div>
                              <select
                                id="ev_type_select"
                                value={newEvType}
                                onChange={(e) => setNewEvType(e.target.value as any)}
                                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                              >
                                <option value="link">ลิงก์เว็บทั่วไป</option>
                                <option value="image">รูปภาพประกอบ</option>
                                <option value="video">คลิปวิดีโอ YouTube/Drive</option>
                                <option value="document">ไฟล์ PDF/Word ในคลาวด์</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <input
                              id="ev_url_input"
                              type="url"
                              required
                              value={newEvLinkUrl}
                              onChange={(e) => setNewEvLinkUrl(e.target.value)}
                              placeholder="ระบุลิงก์แบบสมบูรณ์ เช่น https://drive.google.com/... หรือ https://youtube.com/..."
                              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white text-emerald-700 font-mono"
                            />
                            
                            <input
                              id="ev_desc_input"
                              type="text"
                              value={newEvDesc}
                              onChange={(e) => setNewEvDesc(e.target.value)}
                              placeholder="คำอธิบายเพิ่มเติมสั้นๆ (ถ้ามี)"
                              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              id="submit_evidence_btn"
                              type="submit"
                              disabled={isAddingEvidence}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              {isAddingEvidence ? 'กำลังบันทึก...' : 'เพิ่มลงบันทึกหลักฐาน'}
                            </button>
                          </div>
                        </form>

                      </div>

                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-slate-400">
                      กรุณาเลือกตัวชี้วัดที่ต้องการเพิ่มเติมข้อมูลจากดัชนีด้านซ้ายมือ
                    </div>
                  )}
                </div>

              </div>
              
            </div>
          )}

          {/* TAB 3: CHALLENGE TOPIC (PART 2) */}
          {activeTab === 'challenge' && selectedAgreement && (
            <div id="view_challenge" className="space-y-6 max-w-4xl mx-auto">
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                
                {/* Header info layout */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
                      ข้อตกลงส่วนที่ 2 (ข้อตกลงฉบับท้าทาย)
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1.5 flex items-center gap-1.5">
                      <FileCheck className="h-5.5 w-5.5 text-blue-600" />
                      ประเด็นท้าทายในการพัฒนาผลผลลัพธ์การเรียนรู้ของผู้เรียน
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      เป็นข้อตกลงเชิงลึกในการพัฒนาที่มีผลลัพธ์เชิงปริมาณและเชิงคุณภาพเพื่อประโยชน์โดยตรงต่อนักเรียน ตามข้อเสนอแนะของ ก.ค.ศ.
                    </p>
                  </div>
                  
                  <button
                    id="save_challenge_btn"
                    onClick={() => handleUpdateAgreementField({
                      part2Title: selectedAgreement.part2Title,
                      part2Problem: selectedAgreement.part2Problem,
                      part2Process: selectedAgreement.part2Process,
                      part2OutcomeQty: selectedAgreement.part2OutcomeQty,
                      part2OutcomeQly: selectedAgreement.part2OutcomeQly
                    })}
                    disabled={isSavingAgreement}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
                  >
                    <Save className="h-4 w-4" />
                    {isSavingAgreement ? 'กำลังจัดเก็บ...' : 'บันทึกประเด็นท้าทายนี้'}
                  </button>
                </div>

                <div className="space-y-5">
                  
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        1. ชื่อประเด็นท้าทาย (Challenge Title) <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setChatInput(`ช่วยเกลากลุ่มคำ "ชื่อประเด็นท้าทายในสพฐ." ข้อมูลคือ สอนวิชา ${profile.teachingSubject} วิทยฐานะ ${profile.position} ให้ดูเป็นภาษารายการทางศึกษาและน่าเชื่อถือ`);
                          setActiveTab('copilot');
                        }}
                        className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-0.5"
                      >
                        <Sparkles className="h-3 w-3" /> Rework ด้วย AI วPA
                      </button>
                    </div>
                    <input
                      id="challenge_title"
                      type="text"
                      value={selectedAgreement.part2Title || ''}
                      onChange={(e) => handleAgreementFieldChange('part2Title', e.target.value)}
                      placeholder="เช่น การพัฒนาทักษะการรู้เท่าทันสื่อดิจิทัลโดยการจัดการเรียนรู้แบบ Active Learning ร่วมกับชุดเกมสถานการณ์..."
                      className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        2. สภาพปัญหาการจัดการเรียนรู้ของผู้เรียน
                      </label>
                      <textarea
                        id="challenge_problem"
                        rows={4}
                        value={selectedAgreement.part2Problem || ''}
                        onChange={(e) => handleAgreementFieldChange('part2Problem', e.target.value)}
                        placeholder="วิเคราะห์สถานการณ์ปัญหาผู้เรียน เช่น ขาดคุณธรรมในการวิเคราะห์ข้อมูล ขาดการวิเคราะห์ทางคำนวณขั้นสูง..."
                        className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        3. วิธีดำเนินการแก้ไขและงานวิจัย
                      </label>
                      <textarea
                        id="challenge_process"
                        rows={4}
                        value={selectedAgreement.part2Process || ''}
                        onChange={(e) => handleAgreementFieldChange('part2Process', e.target.value)}
                        placeholder="เช่น 1. วิเคราะห์ผู้เรียน\n2. ออกแบบนวัตกรรมการสอนแบบเกมมิฟิเคชัน\n3. โฮมรูมติวพิเศษเป็นกัลยาณมิตร..."
                        className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-100 pt-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                        4. ผลลัพธ์คาดหวังเชิงปริมาณ (Quantitative Outcome)
                        <span className="text-[10px] text-slate-400 font-normal">(ระบุเป็นตัวเลข/ร้อยละ)</span>
                      </label>
                      <textarea
                        id="challenge_qty"
                        rows={3}
                        value={selectedAgreement.part2OutcomeQty || ''}
                        onChange={(e) => handleAgreementFieldChange('part2OutcomeQty', e.target.value)}
                        placeholder="เช่น นักเรียนร้อยละ 80 มีคะแนนผลสัมฤทธิ์ปลายปีสูงขึ้นกว่าเป้าชี้วัดเดิมปีที่แล้วอย่างน้อยร้อยละ 10"
                        className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                        5. ผลลัพธ์คาดหวังเชิงคุณภาพ (Qualitative Outcome)
                        <span className="text-[10px] text-slate-400 font-normal">(คำอธิบายความมีทักษะทึ่ง)</span>
                      </label>
                      <textarea
                        id="challenge_qly"
                        rows={3}
                        value={selectedAgreement.part2OutcomeQly || ''}
                        onChange={(e) => handleAgreementFieldChange('part2OutcomeQly', e.target.value)}
                        placeholder="เช่น ผู้เรียนสามารถประยุกต์ใช้องค์ความรู้การประพันธ์วิเคราะห์ สรุปเชื่อมโยงเหตุการณ์ และตรรกะในชีวิตจริงได้ดีขึ้น"
                        className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-500 flex gap-3">
                  <span className="text-xl">💡</span>
                  <p className="leading-relaxed">
                    <strong>ข้อควรระวัง:</strong> ผลประเมินประเด็นท้าทายนี้ถือเป็นตัวตัดสินหลักในการประเมินเลื่อนวิทยฐานะชำนาญการ/ชำนาญการพิเศษ/เชี่ยวชาญ 
                     คุณครูสามารถใช้แผง 'AI Copilot' เพื่อวิเคราะห์คำศัพท์ราชการและปรับปรุงตามศาสตร์วิชาเด่นได้ทันที
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: MYSQL & PHP DATABASE SERVICE CONNECTOR */}
          {activeTab === 'mysql' && (
            <div id="view_mysql" className="space-y-6 max-w-4xl mx-auto">
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-5 gap-4">
                  <div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-850 px-2.5 py-0.5 rounded-full font-bold">
                      PHP & MySQL Integration (สพฐ.)
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1.5 flex items-center gap-1.5">
                      <Server className="h-6 w-6 text-emerald-600" />
                      ระบบเชื่อมโยงข้อมูลเซิร์ฟเวอร์โรงเรียนด้วย PHP & MySQL
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      ช่วยจัดเตรียมโค้ดเชื่อมต่อกับระบบฐานข้อมูลของโรงเรียน (ที่รันบน PHP / phpMyAdmin) เพื่ออำนวยความสะดวกให้งานประเด็นท้าทายและพอร์ตโฟลิโอเก็บไว้ถาวร
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {mysqlExportFormat === 'php' ? (
                      <a
                        id="php_export_button"
                        href="/api/db/php-backend"
                        target="_blank"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-200 flex items-center gap-2 active:scale-95 transition-all whitespace-nowrap"
                      >
                        <Download className="h-4 w-4" />
                        ดาวน์โหลดไฟล์ PHP
                      </a>
                    ) : (
                      <a
                        id="sql_export_button_tab"
                        href="/api/db/mysql-dump"
                        target="_blank"
                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-slate-200 flex items-center gap-2 active:scale-95 transition-all whitespace-nowrap"
                      >
                        <Download className="h-4 w-4" />
                        ดาวน์โหลดสคริปต์ SQL
                      </a>
                    )}
                  </div>
                </div>

                {/* Sub Tab selection to switch formats */}
                <div className="flex bg-slate-100 p-1.5 rounded-xl max-w-lg">
                  <button
                    onClick={() => setMysqlExportFormat('php')}
                    className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                      mysqlExportFormat === 'php'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🚀 ไฟล์เชื่อมต่อเซิร์ฟเวอร์ PHP และคำสั่งต่อ SQL
                  </button>
                  <button
                    onClick={() => setMysqlExportFormat('sql')}
                    className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                      mysqlExportFormat === 'sql'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    📦 ไฟล์สคริปต์ SQL เปล่า (.sql)
                  </button>
                </div>

                {/* Dynamic Display depending on format option chosen */}
                {mysqlExportFormat === 'php' ? (
                  <div className="space-y-6">
                    <div className="bg-slate-900 text-slate-200 rounded-xl p-5 font-mono text-xs space-y-4 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-slate-400">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <FileCode className="h-4 w-4" /> obec_pa_connector.php
                        </span>
                        <span className="text-[10px]">PHP Data Objects (PDO) • UTF-8 Unicode</span>
                      </div>

                      {/* Display PHP connection instructions */}
                      <pre className="overflow-x-auto text-[11px] leading-relaxed max-h-72 scrollbar bg-slate-950/60 p-3 rounded text-slate-300">
{`<?php
// 1. กำหนดตัวแปรติดตั้งค่าเชื่อมโยงฐานข้อมูล MySQL
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_USER', 'root');
define('DB_PASS', ''); 
define('DB_NAME', 'obec_pa');

try {
    // 2. คำสั่งสร้างการเชื่อมต่อฐานข้อมูล SQL คราส PDO ปลอดภัยสูง
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    
    // 3. ตรวจจับและกวดวิชาสร้างฐานข้อมูลอัตโนมัติหากไม่มีอยู่ในระบบโรงเรียน
    $pdo->exec("CREATE DATABASE IF NOT EXISTS \`" . DB_NAME . "\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE \`" . DB_NAME . "\`;");
    
    // 4. สั่งสร้างตารางแบบ Relational (teachers, agreements, indicators, evidence) ...
} catch (\\PDOException $e) {
    die("เชื่อมขั้ว MySQL ล้มเหลว: " . $e->getMessage());
}`}
                      </pre>
                      
                      <div className="text-[10px] text-slate-400 space-y-1">
                        <p>✓ รองรับระบบจัดสร้างตารางโดยอัตโนมัติ (Auto-Initialization Scheme) เมื่อเรียกใช้งานครั้งแรก</p>
                        <p>✓ มาพร้อม API สำหรับการควบคุมระบบ อนุมัติ บัญชีคุณครูผ่าน PHP PDO ไปยังฐานข้อมูลสพฐ.</p>
                      </div>
                    </div>

                    {/* How to deploy instructions */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800">วิธีการติดตั้งบน Server โรงเรียนของคุณครู (PHP/PDO Deployment Guide):</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-600">
                        <div className="border border-slate-200 rounded-xl p-4 bg-emerald-50/20 border-emerald-100">
                          <p className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                            <span>📂 ขั้นตอนที่ 1: บันทึกและวางไฟล์</span>
                          </p>
                          <p className="text-slate-600">
                            ดาวน์โหลดไฟล์ <code className="bg-slate-100 text-emerald-700 font-mono px-1 py-0.5 rounded">obec_pa_connector.php</code> โดยกดปุ่มด้านบน จากนั้นนำไปอัปโหลดขึ้นเครื่องเซิร์ฟเวอร์โรงเรียนของคุณครูที่รองรับ PHP ในโฟลเดอร์รันเว็บหลัก (เช่นโฟลเดอร์ <code className="bg-slate-100 font-mono px-1">htdocs</code> ใน XAMPP หรือโฟลเดอร์ Apache แดชบอร์ดทั่วไป)
                          </p>
                        </div>

                        <div className="border border-slate-200 rounded-xl p-4 bg-emerald-50/20 border-emerald-100">
                          <p className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                            <span>⚙️ ขั้นตอนที่ 2: ปรับแต่งรหัสผ่านฐานข้อมูล</span>
                          </p>
                          <p className="text-slate-600">
                            เปิดแก้ไขไฟล์ผ่าน Text Editor ทั่วไปและกำหนดชื่อ Host, User (<code className="bg-slate-100 font-mono px-1">root</code>) และรหัสผ่านเข้า phpMyAdmin ของโรงเรียน จากนั้นเมื่อเรียกไฟลนี้บนเบราว์เซอร์ครั้งแรก ระบบจะทำการ <strong>สร้างตารางข้อมูล ครู, ประเด็นท้าทาย, 15 ตัวชี้วัด</strong> เข้าสู่ phpMyAdmin ให้อย่างสมบูรณ์แบบโดยไม่ต้องพิมพ์ SQL เปล่าเอง!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-slate-900 text-slate-200 rounded-xl p-5 font-mono text-xs space-y-4 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-slate-400">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <FileCode className="h-4 w-4" /> schema_obec_pa.sql
                        </span>
                        <span className="text-[10px]">InnoDB | UTF-8 unicode_ci</span>
                      </div>

                      <pre className="overflow-x-auto text-[11px] leading-relaxed max-h-56 scrollbar bg-slate-950/60 p-3 rounded">
{`-- ========================================================
-- PA Teacher Portfolio & Performance Agreement Tables
-- ========================================================

CREATE TABLE \`teachers\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`passwordHash\` VARCHAR(255) NOT NULL,
  \`fullName\` VARCHAR(150) NOT NULL,
  \`position\` VARCHAR(100) NOT NULL,
  \`schoolName\` VARCHAR(150) NOT NULL,
  ...
);

CREATE TABLE \`pa_agreements\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`teacherId\` VARCHAR(50) NOT NULL,
  \`budgetYear\` VARCHAR(10) NOT NULL,
  ...
  FOREIGN KEY (\`teacherId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE CASCADE
);`}
                      </pre>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800">วิธีการรันโครงสร้างฐานข้อมูล MySQL (ผ่านไฟล์ SQL แบบดั้งเดิม):</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-600">
                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                          <p className="font-bold text-slate-800 mb-1">🛠️ ผ่านแอป phpMyAdmin:</p>
                          <ol className="list-decimal list-inside space-y-1 text-slate-600">
                            <li>เข้าสู่ระบบหน้าหลัก phpMyAdmin ของคุณครู</li>
                            <li>กดสร้างฐานข้อมูลอันใหม่ชื่อ <code className="bg-slate-100 font-mono px-1">obec_pa</code></li>
                            <li>คลิกที่เมนูแถบ <strong>"Import"</strong> (นำเข้า) ด้านบน</li>
                            <li>แนบไฟล์สคริปต์ SQL ที่ท่านพกพาดาวน์โหลดลงไป และกดคลิกยืนยันการนำโครงข่ายตารางได้ทันที</li>
                          </ol>
                        </div>

                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                          <p className="font-bold text-slate-800 mb-1">💻 ผ่าน Docker หรือ Command Line Terminal:</p>
                          <pre className="font-mono text-[10px] bg-slate-100 p-2 rounded text-slate-700">
mysql -u root -p obec_pa &lt; backup.sql
                          </pre>
                          <p className="mt-2 text-slate-500">
                            สคริปต์จะครอบคลุมโครงตารางทั้งหมดเรียบร้อยแล้ว ได้คะแนนโครงสร้างความสัมพันธ์ที่ถูกต้องตามระบบวPA สพฐ.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 5: AI COPILOT COACH */}
          {activeTab === 'copilot' && (
            <div id="view_copilot" className="space-y-6 max-w-4xl mx-auto flex flex-col h-[70vh]">
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                
                {/* Header of Coach */}
                <div className="p-4 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500 rounded-xl text-slate-950">
                      <Sparkles className="h-5 w-5 text-yellow-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">ผู้ช่วยปัญญาประดิษฐ์แนะนำ วPA สพฐ.</h3>
                      <p className="text-[10px] text-emerald-300">
                        วิเคราะห์ตามตำแหน่งวิทยฐานะ: <strong className="text-white">{profile.position}</strong> (วิชาสอน: {profile.teachingSubject})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                    model: gemini-3.5-flash
                  </span>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {chatMessages.map((m) => {
                    const isModel = m.role === 'model';
                    return (
                      <div key={m.id} className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                          isModel 
                            ? 'bg-white text-slate-800 border border-slate-200 shadow-sm' 
                            : 'bg-emerald-600 text-white shadow-sm'
                        }`}>
                          <p className="font-bold mb-1 text-[10px] opacity-75">
                            {isModel ? '🤖 ผู้ช่วยประเมิน วPA (สพฐ.)' : `คุณครู ${profile.fullName}`}
                          </p>
                          <div className="whitespace-pre-line">{m.text}</div>
                        </div>
                      </div>
                    );
                  })}
                  {isAskingCopilot && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 text-slate-600 rounded-2xl p-4 text-xs flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-300"></span>
                        </div>
                        กำลังวิเคราะห์ข้อมูล วPA ของคุณครูตามพจนานุกรม สพฐ...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleAskCopilot} className="p-4 border-t border-slate-200 bg-white shrink-0 flex gap-2">
                  <input
                    id="copilot_chat_input"
                    type="text"
                    required
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="ถาม AI เช่น 'อยากทราบโครงสร้างเขียนตัวชี้วัดที่ 1.1 ที่ดี' หรือ 'ช่วยร่างคำพูดเขียนผลเชิงปริมาณในประเด็นท้าทายวิชาเอกนี้'"
                    className="flex-1 text-xs px-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 mr-2"
                  />
                  <button
                    id="send_chat_btn"
                    type="submit"
                    disabled={isAskingCopilot || !chatInput.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 shrink-0 active:scale-95 disabled:opacity-50"
                  >
                    <span>ส่งคำขอ</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>

              </div>
            </div>
          )}

        </div>

        {/* Bottom Status bar - "Professional Polish" */}
        <footer className="h-12 bg-slate-900 border-t border-slate-800 px-8 flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider shrink-0 font-semibold z-10">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow shadow-emerald-500"></span>
            สิทธิ์การใช้: คุณครูสังกัด สพฐ. ทั่วประเทศ (โหมดทดแทน MySQL เอนจิ้นแบบรวดเร็ว)
          </div>
          <div className="flex gap-4">
            <span>ฐานข้อมูล MySQL v8.0 • วPA สพฐ</span>
            <span>ความช่วยเหลือและแนะนำการประเมิน</span>
          </div>
        </footer>

      </main>

    </div>
  );

  // Helper inside Component for nested updates
  function handleFieldChange(field: keyof PAIndicator, val: string) {
    if (!selectedIndicator) return;
    const updated = { ...selectedIndicator, [field]: val };
    setSelectedIndicator(updated);
  }

  function handleAgreementFieldChange(field: keyof PAAgreement, val: string) {
    if (!selectedAgreement) return;
    setSelectedAgreement({ ...selectedAgreement, [field]: val });
  }

  function handleUpdateAgreementValue(field: keyof PAAgreement, val: string) {
    if (!selectedAgreement) return;
    const updated = { ...selectedAgreement, [field]: val };
    setSelectedAgreement(updated);
    // Debounce/push the update to DB
    handleUpdateAgreementField({ [field]: val });
  }
}
