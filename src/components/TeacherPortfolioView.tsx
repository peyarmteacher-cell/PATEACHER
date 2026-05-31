import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  ExternalLink, 
  FileText, 
  Filter, 
  Heart, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Sparkles, 
  User, 
  Users, 
  Video,
  Database
} from 'lucide-react';
import { TeacherProfile, PAAgreement, PAIndicator, PAEvidence } from '../types';

interface TeacherPortfolioViewProps {
  activeProfile: TeacherProfile;
  activeAgreements: PAAgreement[];
  activeSelectedAgreement: PAAgreement | null;
  activeIndicators: PAIndicator[];
  activeEvidenceList: PAEvidence[];
  completedCount: number;
  averageScore: number;
  totalEvidence: number;
  isDemoMode: boolean;
  onOpenAuth: () => void;
}

export default function TeacherPortfolioView({
  activeProfile,
  activeAgreements,
  activeSelectedAgreement,
  activeIndicators,
  activeEvidenceList,
  completedCount,
  averageScore,
  totalEvidence,
  isDemoMode,
  onOpenAuth
}: TeacherPortfolioViewProps) {
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'learning' | 'support' | 'development'>('all');
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);

  // Filter indicators by category
  const filteredIndicators = activeIndicators.filter(ind => {
    if (selectedCategory === 'all') return true;
    return ind.category === selectedCategory;
  });

  // Render header banner based on configuration (gradient preset or custom background image URL)
  const renderBannerBackground = () => {
    const url = activeProfile.headerBannerUrl || 'gradient_emerald';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={url} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              // Fallback on load failure
              (e.target as HTMLElement).style.display = 'none';
            }}
            alt="Teacher Banner Decor" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
      );
    }

    // Default or chosen styled gradient presets
    let gradientClasses = 'from-emerald-950 via-emerald-800 to-teal-900'; // emerald default
    if (url === 'gradient_navy') gradientClasses = 'from-slate-950 via-slate-800 to-indigo-950';
    if (url === 'gradient_amber') gradientClasses = 'from-amber-950 via-amber-800 to-rose-950';
    if (url === 'gradient_purple') gradientClasses = 'from-violet-950 via-purple-900 to-indigo-950';
    if (url === 'gradient_rose') gradientClasses = 'from-rose-950 via-rose-800 to-slate-900';

    return (
      <div className={`absolute inset-0 w-full h-full bg-gradient-to-r ${gradientClasses}`}>
        {/* Fine overlay styling */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-300 via-emerald-500 to-teal-950"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"></div>
        
        {/* Absolute design aesthetic circles */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-16 right-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl"></div>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800 select-none pb-20">
      
      {/* 1. MAIN GRAND HEADER */}
      <section className="relative h-[320px] md:h-[380px] flex items-end pb-8 z-0 overflow-hidden">
        {renderBannerBackground()}
        
        <div className="max-w-6xl w-full mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Avatar Profile Frame */}
          <div className="md:col-span-3 flex justify-center md:justify-start">
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-400 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition-all duration-300"></div>
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl border-4 border-white/90 bg-white overflow-hidden shadow-2xl shrink-0">
                <img 
                  src={activeProfile.photoUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(activeProfile.fullName)}`}
                  className="w-full h-full object-cover"
                  alt={activeProfile.fullName}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-slate-950 font-extrabold text-[10px] md:text-xs px-3 py-1 rounded-full shadow-lg border border-white tracking-wide uppercase flex items-center gap-1">
                <Award className="h-3 w-3 shrink-0" />
                <span>วPA ครูไทย</span>
              </div>
            </div>
          </div>

          {/* Teacher metadata in header representation */}
          <div className="md:col-span-9 text-center md:text-left text-white space-y-2 md:space-y-3">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center">
              <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                สพฐ. กระทรวงศึกษาธิการ
              </span>
              <span className="bg-white/10 backdrop-blur text-white font-medium text-xs px-2.5 py-0.5 rounded-full border border-white/20">
                วิทยฐานะประเมินปีงบ {activeSelectedAgreement?.budgetYear || '2569'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight drop-shadow-md">
              {activeProfile.fullName}
            </h1>

            <p className="text-emerald-300 font-bold text-sm md:text-base tracking-wide flex flex-wrap gap-x-2 justify-center md:justify-start items-center">
              <span>{activeProfile.position || 'คุณครู'}</span>
              <span className="text-white/30">•</span>
              <span>โรงเรียน{activeProfile.schoolName}</span>
            </p>

            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start text-xs text-white/80">
              <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-white/5">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span>กลุ่มสาระ: <strong className="text-white font-semibold">{activeProfile.teachingSubject}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-white/5">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span>ภาระสอน: <strong className="text-white font-semibold">{activeProfile.teachingHours} ชม./สัปดาห์</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-white/5">
                <Users className="h-4 w-4 text-emerald-400" />
                <span>เครือข่ายสถานศึกษาพร้อมรับประเมิน</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CORE BRIEF HIGHLIGHT COUNTERS */}
      <section className="bg-white border-b border-slate-200 py-6 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 transition-all hover:bg-emerald-500/10">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">ความคืบหน้า 15 ตัวชี้วัด</p>
              <h4 className="text-2xl font-bold text-slate-900">
                {completedCount} / 15 <span className="text-xs text-slate-400 font-normal">ส่วนเสร็จสมบูรณ์</span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 transition-all hover:bg-yellow-500/10">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-700 font-bold shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">อัตราประเมินเฉลี่ยตนเอง</p>
              <h4 className="text-2xl font-bold text-slate-900 text-yellow-600">
                {averageScore.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 4.00 คะแนนเต็ม</span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 transition-all hover:bg-indigo-500/10">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">หลักฐานและชิ้นงานสะสม</p>
              <h4 className="text-2xl font-bold text-slate-900">
                {totalEvidence} <span className="text-xs text-slate-400 font-normal">ไฟล์เชื่อมโยงอ้างอิง</span>
              </h4>
            </div>
          </div>

        </div>
      </section>

      {/* 3. BENTO GRID PORTFOLIO CONTENT */}
      <main className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: 1/3 - TEACHER CONTRACT SUMMARY */}
        <section className="lg:col-span-4 space-y-6">
          
          {/* Welcome Alert to Guests */}
          {isDemoMode && (
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-5 rounded-2xl text-white shadow-md relative overflow-hidden">
              <div className="absolute right-2 bottom-2 text-white/10">
                <Sparkles className="w-24 h-24 stroke-[1]" />
              </div>
              <h5 className="font-extrabold text-sm mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                ระบบบันทึกผลงานคุณครู วPA
              </h5>
              <p className="text-xs leading-relaxed text-slate-100 mb-4">
                หน้านี้คือหน้า Portfolio แสดงผลงานสำหรับให้คณะกรรมการตรวจสอบงานอ้างอิงออนไลน์ คุณครูสามารถปรับแต่งรูปภาพ Header และเขียนคำอธิบายตามกลุ่มสาระด้วยผู้ช่วย AI ในระบบหลังบ้านได้ทันที
              </p>
              <button
                onClick={onOpenAuth}
                className="w-full bg-slate-950/30 hover:bg-slate-950/50 border border-white/20 transition-all text-white font-extrabold text-xs py-2.5 rounded-xl shadow cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <Database className="h-4 w-4" />
                สมัครสมาชิก / เข้าสู่ระบบ เพื่อแก้ไข
              </button>
            </div>
          )}

          {/* Teacher Official Bio Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-800 pb-2.5 border-b border-slate-100 flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600" />
              ข้อมูลประกอบประเมิน
            </h3>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">สังกัดหน่วยงาน</span>
                <strong className="text-slate-800 text-right">สำนักงานเขตพื้นที่การศึกษา (สพฐ.)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">ตำแหน่งตำแหน่งครู</span>
                <strong className="text-slate-800 text-right">{activeProfile.fullName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">วิทยฐานะปัจจุบัน</span>
                <strong className="text-emerald-700 text-right font-bold">{activeProfile.position}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">กลุ่มวิชาหลัก</span>
                <strong className="text-slate-800 text-right">{activeProfile.teachingSubject}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">สังกัดสถาบันศึกษา</span>
                <strong className="text-slate-800 text-right">{activeProfile.schoolName}</strong>
              </div>
            </div>
          </div>

          {/* PART 2 CHALLENGE DETAILS */}
          {activeSelectedAgreement && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-indigo-950">ข้อตกลงประเด็นท้าทาย (Part 2)</h3>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">ข้อตกลงเพื่อยกระดับสัมฤทธิผล</p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div>
                  <h5 className="text-xs font-bold text-slate-700 mb-1">หัวข้อประเด็นท้าทาย</h5>
                  <div className="p-3 bg-indigo-50/50 rounded-xl text-xs text-indigo-950 font-medium leading-relaxed border border-indigo-100">
                    {activeSelectedAgreement.part2Title || 'ยังไม่กำหนดข้อความข้อมูล'}
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-700 mb-1">สภาพปัญหาผู้เรียน</h5>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap pl-1 font-medium">
                    {activeSelectedAgreement.part2Problem || 'ยังไม่ได้เขียนอภิบายข้อมูล'}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-700 mb-1">ผลลัพธ์เชิงปริมาณ</h5>
                  <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-emerald-500 pl-2 whitespace-pre-wrap font-medium">
                    {activeSelectedAgreement.part2OutcomeQty || 'ยังไม่ได้บันทึก'}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-700 mb-1">ผลลัพธ์เชิงคุณภาพ</h5>
                  <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-indigo-500 pl-2 whitespace-pre-wrap font-medium">
                    {activeSelectedAgreement.part2OutcomeQly || 'ยังไม่ได้บันทึก'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </section>

        {/* RIGHT COLUMN: 2/3 - 15 INDICATORS COMPENDIUM */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* Tabs header selector */}
          <div className="bg-white border border-slate-200 p-2 rounded-2xl flex flex-wrap gap-1 shadow-sm">
            {[
              { id: 'all', name: 'ทั้งหมด 15 ตัวชี้วัด' },
              { id: 'learning', name: 'ด้านที่ 1 จัดการเรียนรู้' },
              { id: 'support', name: 'ด้านที่ 2 ระบบสนับสนุน' },
              { id: 'development', name: 'ด้านที่ 3 พัฒนาวิชาชีพ' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  selectedCategory === tab.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* List of filtered indicators */}
          <div className="space-y-4">
            {filteredIndicators.map((ind) => {
              const isOpen = expandedIndicator === ind.id;
              const hasWorkPlan = ind.workPlan && ind.workPlan.trim().length > 10;
              const hasScore = ind.score && ind.score > 0;
              
              // Find evidence associated with this indicators number (e.g. 1.1)
              const indEvidence = activeEvidenceList.filter(ev => ev.indicatorNumber === ind.number);

              return (
                <div 
                  key={ind.id}
                  id={`ind_list_item_${ind.number}`}
                  className={`bg-white border rounded-2xl transition-all shadow-sm overflow-hidden ${
                    isOpen ? 'border-emerald-500/50 ring-2 ring-emerald-500/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Accordion Trigger Card */}
                  <div 
                    onClick={() => setExpandedIndicator(isOpen ? null : ind.id)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-all select-none"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-sm ${
                        hasWorkPlan 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {ind.number}
                      </div>

                      <div className="leading-tight flex-1 min-w-0">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none block mb-1">
                          {ind.category === 'learning' ? 'ด้านที่ 1 การจัดการเรียนรู้' :
                           ind.category === 'support' ? 'ด้านที่ 2 การส่งเสริมสนับสนุน' :
                           'ด้านที่ 3 การพัฒนาวิชาชีพต่อเนื่อง'}
                        </span>
                        <h4 className="font-bold text-sm text-slate-800 truncate">
                          {ind.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {hasScore ? (
                        <span className="text-xs bg-yellow-50 text-yellow-700 font-extrabold px-2.5 py-1 rounded-lg border border-yellow-200/50 flex items-center gap-1">
                          ★ <strong>{ind.score}</strong>
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">ยังไม่ระบุ</span>
                      )}

                      <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-emerald-500' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Detail Workspace Accordion */}
                  {isOpen && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 anim-slide-down">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 border-b border-slate-50 pb-1">
                            1. โครงการ/พฤติกรรมการปฏิบัติงาน (Work Plan)
                          </h5>
                          <p className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap">
                            {ind.workPlan || 'ไม่มีข้อความอธิบายความก้าวหน้ารายตัวประดับ'}
                          </p>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 border-b border-slate-50 pb-1">
                            2. ผลลัพธ์ตัวชี้วัดความน่าพึงพอใจประเมิน
                          </h5>
                          <p className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap border-l-2 border-emerald-500 pl-2">
                            {ind.indicators || 'ไม่มีรายละเอียดระบุ'}
                          </p>
                        </div>
                      </div>

                      {/* Self Assessment block */}
                      <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/60 text-xs">
                        <h5 className="font-bold text-emerald-800 mb-1 flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 shrink-0" />
                          บันทึกการสังเคราะห์สรุปผลตามบริบทจริง (Self-Evaluation Report)
                        </h5>
                        <p className="leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
                          {ind.selfEvaluationText || 'ยังไม่ได้กรอกข้อมูลผลการปฏิบัติงานตนเองในตัวชี้วัดนี้'}
                        </p>
                      </div>

                      {/* Evidence attached panel */}
                      <div className="pt-2">
                        <h5 className="text-xs font-bold text-slate-700 mb-2">
                          เอกสารและหลักฐานอ้างอิงอัปลิงก์ ({indEvidence.length})
                        </h5>

                        {indEvidence.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {indEvidence.map((ev) => (
                              <div 
                                key={ev.id}
                                className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-3 hover:shadow-md transition-all whitespace-nowrap overflow-hidden"
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <div className="p-2 bg-slate-100 text-slate-600 rounded-lg shrink-0">
                                    {ev.evidenceType === 'image' && <ImageIcon className="h-4 w-4" />}
                                    {ev.evidenceType === 'video' && <Video className="h-4 w-4" />}
                                    {ev.evidenceType === 'document' && <FileText className="h-4 w-4" />}
                                    {ev.evidenceType === 'link' && <LinkIcon className="h-4 w-4" />}
                                  </div>
                                  <div className="overflow-hidden">
                                    <p className="text-xs font-bold text-slate-800 truncate" title={ev.title}>{ev.title}</p>
                                    <p className="text-[10px] text-slate-400 truncate" title={ev.description}>{ev.description || 'ไม่มีคำอธิบาย'}</p>
                                  </div>
                                </div>

                                <a 
                                  href={ev.linkUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[10px] uppercase font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0 bg-emerald-50 px-2 py-1 rounded-md"
                                >
                                  <span>เปิด</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-4 rounded-xl bg-slate-100/50 border border-slate-100 text-xs text-slate-400 font-semibold italic">
                            ⚠️ ยังไม่มีการอัปโหลดไฟล์หรือเชื่อมโยงชิ้นงานสะสมอ้างอิงของหัวข้อประเมินนี้
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </section>

      </main>

    </div>
  );
}
