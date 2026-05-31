import React, { useState } from 'react';
import { User, Mail, Shield, School, BookOpen, Clock, LogIn, UserPlus } from 'lucide-react';
import { TeacherProfile } from '../types';
import { apiFetch } from '../api';

interface WelcomeAuthProps {
  onSuccess: (profile: TeacherProfile) => void;
}

export default function WelcomeAuth({ onSuccess }: WelcomeAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  
  // Registration States
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState(''); // Initial Password as well for simple setup
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('ครู');
  const [schoolName, setSchoolName] = useState('');
  const [teachingSubject, setTeachingSubject] = useState('');
  const [teachingHours, setTeachingHours] = useState('18');

  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState(''); // equals username

  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState<string | null>(null);

  const fillDemoAccount = () => {
    if (isLogin) {
      setLoginEmail('demo_obec@moe.go.th');
      setLoginPassword('obec2026');
    } else {
      setEmail('demo_obec@moe.go.th');
      setUserName('obec2026');
      setFullName('คุณครูรังสรรค์ สพฐ.พัฒนากุล');
      setPosition('ครูชำนาญการพิเศษ');
      setSchoolName('โรงเรียนอบรมปัญญาประประดิษฐ์วิทยา');
      setTeachingSubject('วิทยาการคำนวณ (คอมพิวเตอร์)');
      setTeachingHours('22');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !userName || !fullName || !schoolName) {
      setErrorStr('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }
    setErrorStr(null);
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          username: userName,
          fullName,
          position,
          schoolName,
          teachingSubject,
          teachingHours
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'สมัครสมาชิกไม่สำเร็จ');
      
      // Instead of logging in automatically, trigger the success pending banner
      setRegisterSuccess(true);
    } catch (err: any) {
      setErrorStr(err.message || 'การเชื่อมต่อขัดข้อง');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorStr('กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ');
      return;
    }
    setErrorStr(null);
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      
      onSuccess(data.profile);
    } catch (err: any) {
      setErrorStr(err.message || 'รหัสผ่านของคุณคือ ชื่อผู้ใช้ตอนสมัครสมาชิก (เช่น obec2026)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth_container" className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Decorative Badge */}
        <div className="flex justify-center flex-col items-center">
          <div className="h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200/50 transform rotate-3">
            <School className="h-9 w-9 transform -rotate-3" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-950">
            ระบบจัดเก็บผลงาน PA ครู
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            วิทยฐานะตามเกณฑ์ วPA สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-100 rounded-3xl border border-slate-100 sm:px-10">
          
          {registerSuccess ? (
            <div id="register_success_panel" className="text-center space-y-5 py-4">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 mb-2">
                <UserPlus className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 leading-tight">ลงทะเบียนคุณครูสมบูรณ์แล้ว!</h3>
              
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-left text-xs text-emerald-950 space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span>สถานะบัญชีครู:</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">รออนุมัติเปิดใช้งาน (Pending)</span>
                </p>
                <p className="leading-relaxed">การสร้างโปรไฟล์บนเซิร์ฟเวอร์เสร็จสมบูรณ์เรียบร้อยแล้ว แต่อยู่ระหว่างรอการกดยืนยันอนุมัติสิทธิ์เข้าใช้งาน วPA โดยผู้ดูแลระบบสูงสุด (Super Admin)</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 text-left text-xs text-slate-600 space-y-2 leading-relaxed">
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <span>💡 คำแนะนำสำหรับผู้ประเมิน/ทดลองระบบ:</span>
                </p>
                <p>ท่านสามารถเข้าสู่ระบบด้วยสิทธิ์บัญชีผู้ดูแลระบบสูงสุด (Super Admin) ของ สพฐ. เพื่อเข้าอนุมัติใช้งานให้กับคุณครูบัญชีนี้ได้ด้วยตนเองทันที:</p>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 font-mono text-[11.5px] text-slate-800 space-y-1 select-all col-span-2">
                  <div><strong>Email:</strong> admin@obec.go.th</div>
                  <div><strong>Password:</strong> admin1234</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRegisterSuccess(false);
                  setIsLogin(true);
                  // Pre-fill the admin credentials for testing ease!
                  setLoginEmail('admin@obec.go.th');
                  setLoginPassword('admin1234');
                }}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
              >
                เข้าสู่ระบบด้วย Super Admin เพื่ออนุมัติทันที
              </button>
            </div>
          ) : (
            <>
              {/* Header Tab selectors */}
              <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
            <button
              id="switch_login_btn"
              onClick={() => { setIsLogin(true); setErrorStr(null); }}
              className={`flex-1 py-2.5 text-center text-sm font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-2 ${
                isLogin ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="h-4 w-4" />
              เข้าสู่ระบบ
            </button>
            <button
              id="switch_register_btn"
              onClick={() => { setIsLogin(false); setErrorStr(null); }}
              className={`flex-1 py-2.5 text-center text-sm font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-2 ${
                !isLogin ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              สมัครบัญชีผู้ใช้ใหม่
            </button>
          </div>

          {errorStr && (
            <div id="auth_error" className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs font-medium mb-6 animate-pulse">
              {errorStr}
            </div>
          )}

          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1">
                  อีเมลคุณครู <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="login_email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="teacher_somchai@moe.go.th"
                    className="block w-full pl-11 pr-4 py-2.5 text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1">
                  รหัสผ่าน (ชื่อผู้ใช้ที่ระบุตอนสมัคร) <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <input
                    id="login_password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="ใส่ชื่อผู้ใช้ที่ลงทะเบียนไว้"
                    className="block w-full pl-11 pr-4 py-2.5 text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500">
                  * จัดเก็บข้อมูลคุณครูและวิทยฐานะปลอดภัยสุทธิ์
                </span>
                <button
                  type="button"
                  id="fill_demo_login"
                  onClick={fillDemoAccount}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 underline active:scale-95 transition-all"
                >
                  ใช้บัญชีทดลอง (Demo) ตัวอย่าง
                </button>
              </div>

              <button
                id="submit_login"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'กำลังตรวจสอบข้อมูล...' : 'เข้าสู่ระบบเริ่มสะสมผลงาน'}
              </button>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex flex-col gap-1 text-[11px] text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700 flex items-center gap-1">🔑 ข้อมูลระบบ Super Admin สพฐ. (ผู้ดูแลระบบกลาง):</span>
                <span>เพื่ออนุมัติคุณครูและซิงค์ PHPMyAdmin ให้เข้าด้วย:</span>
                <span className="font-mono mt-1 font-semibold text-slate-800 bg-white border border-slate-200 p-2 rounded-lg block">
                  Email: admin@obec.go.th <br />
                  Password: admin1234
                </span>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    อีเมลคุณครู <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="reg_email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="somchai@sk.ac.th"
                      className="block w-full pl-9 pr-3 py-2 text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อผู้ใช้ (ใช้สิทธิ์ล็อกอิน) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="reg_username"
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="obec2026"
                      className="block w-full pl-9 pr-3 py-2 text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อ-นามสกุลจริงคุณครู <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg_fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="นางสมใจ ดีเลิศการสอน"
                  className="block w-full px-3 py-2 text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    วิทยฐานะ / ตำแหน่งปัจจุบัน <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="reg_position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="block w-full px-3 py-2 text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
                  >
                    <option value="ครูผู้ช่วย">ครูผู้ช่วย</option>
                    <option value="ครู ค.ศ. 1">ครู (ไม่มีวิทยฐานะ)</option>
                    <option value="ครูชำนาญการ">ครูชำนาญการ (วPA)</option>
                    <option value="ครูชำนาญการพิเศษ">ครูชำนาญการพิเศษ (วPA)</option>
                    <option value="ครูเชี่ยวชาญ">ครูเชี่ยวชาญ (วPA)</option>
                    <option value="ครูเชี่ยวชาญพิเศษ">ครูเชี่ยวชาญพิเศษ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    โรงเรียนที่สังกัดสถานศึกษา <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <School className="h-4 w-4" />
                    </div>
                    <input
                      id="reg_school"
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="โรงเรียนอนุบาลสามเสน"
                      className="block w-full pl-9 px-3 py-2 text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    วิชาเอก / กลุ่มสาระการเรียนรู้ที่สอน
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <input
                      id="reg_subject"
                      type="text"
                      value={teachingSubject}
                      onChange={(e) => setTeachingSubject(e.target.value)}
                      placeholder="ภาษาไทย / วิทยการคำนวณ"
                      className="block w-full pl-9 px-3 py-2 text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชั่วโมงสอนตามสายงาน (ชั่วโมง/สัปดาห์)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <input
                      id="reg_hours"
                      type="number"
                      value={teachingHours}
                      onChange={(e) => setTeachingHours(e.target.value)}
                      placeholder="18"
                      className="block w-full pl-9 px-3 py-2 text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  id="fill_demo_reg"
                  onClick={fillDemoAccount}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 underline active:scale-95 transition-all"
                >
                  กรอกข้อความตัวอย่างสำหรับครู
                </button>
              </div>

              <button
                id="submit_register"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'กำลังบันทึกลงทะเบียน...' : 'ยืนยันสมัครรหัสเพื่อสร้างเล่มเก็บ PA'}
              </button>
            </form>
          )}
          </>
          )}

        </div>
      </div>
    </div>
  );
}
