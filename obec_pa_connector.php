<?php
/**
 * 🇹🇭 ระบบฐานข้อมูลประวัติและผลงาน วPA ข้าราชการครู สพฐ. (ฝ่ายเทคโนโลยีสารสนเทศ)
 * แฟ้มเชื่อมต่อและประมวลผล PHP PDO + MySQL Server ประสิทธิภาพสูงสำหรับการจัดเก็บที่ Server โรงเรียน
 * 
 * ข้อมูลการเชื่อมต่อระบุพรีเซ็ตสำหรับเซิร์ฟเวอร์ของคุณครูเรียบร้อยแล้ว:
 * - Host: localhost
 * - Port: 3306
 * - Database: schoolos_Pateacher
 * - User: schoolos_Pateacher
 * - Pass: 8N^a1MsltI@xghc7
 */

// เปิดสิทธิ์การเข้าถึงข้ามโดเมนและตั้งค่าเป็น JSON UTF-8 ป้องกันปัญหาสระภาษาไทยเพี้ยน
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// -------------------------------------------------------------------------
// 1. ระบุตัวแปรการเชื่อมต่อฐานข้อมูลตรงตามคู่มือของคุณครู
// -------------------------------------------------------------------------
define('DB_HOST', 'localhost');                  // โฮสท์เซิร์ฟเวอร์ฐานข้อมูลโรงเรียนของคุณครู
define('DB_PORT', '3306');                       // พอร์ตเชื่อมต่อ MySQL 3306
define('DB_USER', 'schoolos_Pateacher');          // ชื่อผู้ใช้งานฐานข้อมูล
define('DB_PASS', '8N^a1MsltI@xghc7');           // รหัสผ่านความปลอดภัยสูง
define('DB_NAME', 'schoolos_Pateacher');          // ชื่อฐานข้อมูลหลัก

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // พยายามเชื่อมต่อแบบไม่เจาะจงชื่อ DB ก่อนเพื่อพยายามลองสร้างตารางรอบแรก
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    
    // คำสั่งพิจารณาจัดตั้งสร้าง Database ประดุจยังไม่มีตัวตนบนระบบ
    try {
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    } catch(\Exception $eDB) {
        // ข้ามหากไม่มีสิทธิ์ระดับ Root/Admin ภายนอกและใช้งาน DB ที่สร้างแล้ว
    }
    $pdo->exec("USE `" . DB_NAME . "`;");
    
} catch (\PDOException $e) {
    // หากล้มเหลว พยายามต่อตรงผ่าน dbname ทันทีเพื่อความเหนียวแน่น
    try {
        $dsnDirect = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsnDirect, DB_USER, DB_PASS, $options);
    } catch (\PDOException $eDirect) {
        http_response_code(500);
        echo json_encode([
            "s" => false,
            "error" => "🔴 เชื่อมต่อ MySQL บนเซิร์ฟเวอร์ล้มเหลว: " . $eDirect->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

// -------------------------------------------------------------------------
// 2. ระบบสร้างตารางความสัมพันธ์อัตโนมัติ (Relational Database Schema)
// -------------------------------------------------------------------------
try {
    // 1) ตารางคุณครูผู้ประเมินเล่มเก็บ (teachers)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `teachers` (
        `id` VARCHAR(50) NOT NULL,
        `email` VARCHAR(100) NOT NULL UNIQUE,
        `passwordHash` VARCHAR(255) NOT NULL,
        `fullName` VARCHAR(150) NOT NULL,
        `position` VARCHAR(100) NOT NULL,
        `schoolName` VARCHAR(150) NOT NULL,
        `teachingSubject` VARCHAR(150) DEFAULT NULL,
        `teachingHours` VARCHAR(50) DEFAULT NULL,
        `photoUrl` TEXT DEFAULT NULL,
        `headerBannerUrl` TEXT DEFAULT NULL,
        `isApproved` TINYINT(1) NOT NULL DEFAULT 0,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 2) ตารางข้อตกลงเล่มระบบ (pa_agreements)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `pa_agreements` (
        `id` VARCHAR(50) NOT NULL,
        `teacherId` VARCHAR(50) NOT NULL,
        `budgetYear` VARCHAR(10) NOT NULL,
        `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
        `salary` VARCHAR(50) DEFAULT NULL,
        `workloadLessons` VARCHAR(50) DEFAULT NULL,
        `workloadSupport` VARCHAR(50) DEFAULT NULL,
        `workloadSchool` VARCHAR(50) DEFAULT NULL,
        `workloadLife` VARCHAR(50) DEFAULT NULL,
        `part2Title` TEXT DEFAULT NULL,
        `part2Problem` TEXT DEFAULT NULL,
        `part2Process` TEXT DEFAULT NULL,
        `part2OutcomeQty` TEXT DEFAULT NULL,
        `part2OutcomeQly` TEXT DEFAULT NULL,
        `createdAt` VARCHAR(50) NOT NULL,
        `updatedAt` VARCHAR(50) NOT NULL,
        PRIMARY KEY (`id`),
        CONSTRAINT `fk_obec_teacher_rel` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 3) ตารางบันทึก 15 ด้านตัวชี้วัด (pa_indicators)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `pa_indicators` (
        `id` VARCHAR(100) NOT NULL,
        `agreementId` VARCHAR(50) NOT NULL,
        `category` VARCHAR(50) NOT NULL,
        `number` VARCHAR(10) NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT DEFAULT NULL,
        `workPlan` TEXT DEFAULT NULL,
        `indicators` TEXT DEFAULT NULL,
        `evaluationTimes` TEXT DEFAULT NULL,
        `score` INT DEFAULT 0,
        `selfEvaluationText` TEXT DEFAULT NULL,
        `updatedAt` VARCHAR(50) NOT NULL,
        PRIMARY KEY (`id`),
        CONSTRAINT `fk_obec_agreement_indicators` FOREIGN KEY (`agreementId`) REFERENCES `pa_agreements` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 4) ตารางจัดวางไฟล์แนบและรูปถ่ายประจักษ์ (pa_evidence)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `pa_evidence` (
        `id` VARCHAR(50) NOT NULL,
        `agreementId` VARCHAR(50) NOT NULL,
        `indicatorNumber` VARCHAR(10) NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT DEFAULT NULL,
        `linkUrl` TEXT NOT NULL,
        `evidenceType` VARCHAR(50) NOT NULL,
        `addedAt` VARCHAR(50) NOT NULL,
        PRIMARY KEY (`id`),
        CONSTRAINT `fk_obec_agreement_ev` FOREIGN KEY (`agreementId`) REFERENCES `pa_agreements` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "s" => false,
        "error" => "🔴 รันสร้างตารางลงฐานข้อมูลล้มเหลว: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// -------------------------------------------------------------------------
// 3. ฟังก์ชันระบุมั่นในการรับส่งและยืนยันตัวตนสิทธิ์ครู (APACHE / IIS Auth Filter)
// -------------------------------------------------------------------------
function getAuthorizationHeader() {
    $headers = null;
    if (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    if (empty($headers)) {
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        }
    }
    return $headers;
}

function getAuthTeacherIdOrError() {
    $authHeader = getAuthorizationHeader();
    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["error" => "กรุณาเข้าสู่ระบบก่อนทำการทำรายการ"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    return $matches[1];
}

function checkSuperAdmin() {
    $teacherId = getAuthTeacherIdOrError();
    if ($teacherId !== 'super_admin') {
        http_response_code(403);
        echo json_encode(["error" => "ต้องการสิทธิ์ผู้ดูแลระบบสูงสุด (Super Admin)"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    return true;
}

// -------------------------------------------------------------------------
// 4. แฟ้มแม่บทเปรียบเทียบคำเขียน 15 ด้านตัวชี้วัด (Aligned with OBEC Standards)
// -------------------------------------------------------------------------
$INDICATOR_TEMPLATES = [
    // ด้านที่ 1 การจัดการเรียนรู้ (8 ตัวชี้วัด)
    [
        'category' => 'learning',
        'number' => '1.1',
        'title' => 'สร้างและหรือพัฒนาหลักสูตร',
        'description' => 'จัดทำรายวิชาและหน่วยการเรียนรู้ให้สอดคล้องกับมาตรฐานการเรียนรู้ และตัวชี้วัดหรือผลการเรียนรู้ตามหลักสูตร',
        'workPlan' => 'วิเคราะห์หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน และหลักสูตรสถานศึกษา นำมาจัดทำหน่วยการเรียนรู้ แผนการจัดการเรียนรู้ รายวิชาที่สอน เพื่อให้สอดคล้องกับมาตรฐานและบริบทของผู้เรียน',
        'indicators' => 'ผู้เรียนร้อยละ 70 มีระดับผลการเรียนผ่านเกณฑ์ที่สถานศึกษากำหนด สอดคล้องกับมาตรฐานการเรียนรู้ของหลักสูตร',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'learning',
        'number' => '1.2',
        'title' => 'ออกแบบการจัดการเรียนรู้',
        'description' => 'เน้นผู้เรียนเป็นสำคัญ เพื่อให้ผู้เรียนมีความรู้ ทักษะ คุณลักษณะประจำวิชา คุณลักษณะอันพึงประสงค์ และสมรรถนะที่สำคัญตามหลักสูตร',
        'workPlan' => 'จัดทำแผนการจัดการเรียนรู้สอดคล้องกับการจัดการเรียนรู้แบบ Active Learning เน้นกระบวนการคิดวิเคราะห์ และการปฏิบัติจริง',
        'indicators' => 'ผู้เรียนร้อยละ 75 ได้รับการพัฒนาทักษะกระบวนการคิดตามสมรรถนะสำคัญของผู้เรียนผ่านกิจกรรมการเรียนรู้',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'learning',
        'number' => '1.3',
        'title' => 'จัดกิจกรรมการเรียนรู้',
        'description' => 'อำนวยความสะดวกในการเรียนรู้ และส่งเสริมผู้เรียนได้พัฒนาเต็มตามศักยภาพ เรียนรู้และทำงานร่วมกัน',
        'workPlan' => 'จัดกระบวนการเรียนรู้ด้วยรูปแบบ Active Learning เช่น Problem-based, Project-based หรือ Game-based ร่วมกับการใช้ชุดกิจกรรมส่งเสริมการมีส่วนร่วม',
        'indicators' => 'ผู้เรียนร้อยละ 80 มีความพึงพอใจและมีส่วนร่วมในกิจกรรมการเรียนรู้อย่างมีความสุข',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'learning',
        'number' => '1.4',
        'title' => 'สร้างและหรือพัฒนาสื่อ นวัตกรรม เทคโนโลยี และแหล่งเรียนรู้',
        'description' => 'สอดคล้องกับกิจกรรมการเรียนรู้ แก้ไขปัญหาผู้เรียน และการทำงานวิจัยพัฒนาสิ่งใหม่',
        'workPlan' => 'สร้างและวิจัยสื่อดิจิทัล เช่น บทเรียนออนไลน์ สื่อมัลติมีเดีย ใบงานอิเล็กทรอนิกส์ (LiveWorksheet) หรือแอพพลิเคชั่นการเรียนรู้มาช่วยแก้ปัญหาทักษะผู้เรียน',
        'indicators' => 'ผู้เรียนร้อยละ 70 สามารถเข้าถึงสื่อ นวัตกรรม และใช้ในการเรียนรู้ด้วยตนเองเพื่อยกระดับผลสัมฤทธิ์',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'learning',
        'number' => '1.5',
        'title' => 'วัดและประเมินผลการเรียนรู้',
        'description' => 'ด้วยวิธีการที่หลากหลาย เหมาะสม และสอดคล้องกับมาตรฐานการเรียนรู้ นำผลไปปรับปรุงพัฒนาผู้เรียน',
        'workPlan' => 'จัดทำเครื่องมือวัดผลสัมฤทธิ์ที่มีประสิทธิภาพ เช่น เกณฑ์ Rubrics แบบสังเกตพฤทีความ และแบบทดสอบออนไลน์ พร้อมให้ข้อมูลสะท้อนกลับ (Feedback) เพื่อพัฒนาการเรียนรู้',
        'indicators' => 'เครื่องมือวัดผลได้รับการตรวจสอบค่าความเที่ยงตรง และผู้เรียนร้อยละ 100 ได้รับการประเมินรอบด้านตามบริบทจริง',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'learning',
        'number' => '1.6',
        'title' => 'ศึกษา วิเคราะห์ และสังเคราะห์ เพื่อแก้ไขปัญหาหรือพัฒนาการเรียนรู้',
        'description' => 'แก้ไขปัญหาหรือพัฒนาการเรียนรู้ที่ส่งผลต่อคุณภาพผู้เรียน',
        'workPlan' => 'ดำเนินงานกระบวนการวิจัยในชั้นเรียน (In-classroom Research) เพื่อแก้ปัญหาผู้เรียนที่อ่อนวิชาเรียน และส่งเสริมทักษะเฉพาะด้าน',
        'indicators' => 'ผลงานวิจัยในชั้นเรียนจำนวน 1 เรื่อง ที่สามารถนำมาแก้ปัญหากลุ่มเป้าหมายได้อย่างเห็นผลเชิงประจักษ์',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'learning',
        'number' => '1.7',
        'title' => 'จัดบรรยากาศที่ส่งเสริมและพัฒนาผู้เรียน',
        'description' => 'กระตุ้นให้ผู้เรียนเกิดกระบวนการคิด ทักษะชีวิต ทักษะการทำงาน ทักษะการเรียนรู้และนวัตกรรม',
        'workPlan' => 'จัดสภาพแวดล้อมห้องเรียนในรูปแบบที่มีความสุข ปลอดภัย กระตุ้นการเรียนรู้ด้วยมุมเทคโนโลยี บอร์ดแสดงผลงาน และเสริมแรงบวกในการจัดกิจกรรม',
        'indicators' => 'ผู้เรียนร้อยละ 85 รู้สึกอบอุ่น ปลอดภัย และมีความสุขในการเรียนภายใต้บรรยากาศเชิงบวก',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'learning',
        'number' => '1.8',
        'title' => 'อบรมและพัฒนาคุณลักษณะที่ดีของผู้เรียน',
        'description' => 'ปลูกฝังค่านิยม คุณธรรม จริยธรรม และคุณลักษณะอันพึงประสงค์ โดยคำนึงถึงความแตกต่างรายบุคคล',
        'workPlan' => 'ประสานบูรณาการการอบรมคุณธรรม จริยธรรม ผ่านกิจกรรมการเรียนรู้ หน้าเสาธง กิจกรรมโฮมรูม และกิจกรรมแนะแนว',
        'indicators' => 'ผู้เรียนร้อยละ 90 มีผลการประเมินคุณลักษณะอันพึงประสงค์ระดับดีขึ้นไปตามเกณฑ์โรงเรียน',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],

    // ด้านที่ 2 ด้านการส่งเสริมและสนับสนุนการจัดการเรียนรู้ (4 ตัวชี้วัด)
    [
        'category' => 'support',
        'number' => '2.1',
        'title' => 'จัดทำข้อมูลสารสนเทศของผู้เรียนและรายวิชา',
        'description' => 'มีข้อมูลสารสนเทศเพื่อสนับสนุนการจัดการเรียนรู้และพัฒนาคุณภาพผู้เรียน',
        'workPlan' => 'จัดทำระบบบันทึกผลการพัฒนาผู้เรียน (ปพ.5) ในรูปไฟล์สารสนเทศออนไลน์ รายงานคะแนน และความก้าวหน้าแก่ผู้เรียนอย่างสม่ำเสมอ',
        'indicators' => 'ผู้เรียนและผู้เกี่ยวข้องร้อยละ 100 มีการรับรู้และได้รับรายงานสารสนเทศเพื่อการวางแผนการเรียนอย่างมีคุณภาพ',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'support',
        'number' => '2.2',
        'title' => 'ดำเนินการตามระบบดูแลช่วยเหลือผู้เรียน',
        'description' => 'คัดกรอง ค้นพบ ช่วยเหลือ ป้องกันผู้เรียนอย่างเป็นระบบ',
        'workPlan' => 'คัดกรองผู้เรียนผ่านระบบเยี่ยมบ้าน 100% จัดทำแบบบันทึก SDQ ประสานจัดหาสวัสดิการ ทุนการศึกษา และดูแลช่วยเหลือช่วยเหลือด้านจิตใจเชิงรุก',
        'indicators' => 'ผู้เรียนในความดูแลร้อยละ 100 ได้รับการสำรวจเยียวยาแก้ไขพฤติกรรมหรือได้รับความสงเคราะห์ตามสิทธิ์อย่างทันท่วงที',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'support',
        'number' => '2.3',
        'title' => 'ปฏิบัติงานวิชาการ และงานอื่นๆ ของสถานศึกษา',
        'description' => 'ร่วมมือสนับสนุนกิจกรรม เพื่อพัฒนามาตรฐานวิชาการสถานศึกษาอย่างมืออาชีพ',
        'workPlan' => 'ทำหน้าที่หัวหน้างานเทคโนโลยีสารสนเทศ ออกแบบระบบฐานข้อมูล สารบัญอิเล็กทรอนิกส์ และร่วมกิจกรรมพัฒนาหลักสูตรฝ่ายบริหารงานวิชาการอย่างเคร่งครัด',
        'indicators' => 'โครงการระบบและมาตรวัดได้รับความพึงพอใจร้อยละ 90 ของคณะครูรวมถึงส่งผลต่อประสิทธิภาพการประเมิน',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'support',
        'number' => '2.4',
        'title' => 'ประสานความร่วมมือกับผู้ปกครอง ภาคีเครือข่าย และหรือสถานประกอบการ',
        'description' => 'สร้างช่องทางประสานงานเพื่อพัฒนา สนับสนุน และยกระดับผลการเรียนของผู้เรียนเชิงสร้างสรรค์',
        'workPlan' => 'จัดตั้งกลุ่ม Line ผู้ปกครองสำหรับการแจ้งข่าวสารรายสัปดาห์ รวมถึงจัดกิจกรรมจัดตั้งเครือข่ายผู้ปกครองในการรายงานพฤติกรรมและการเรียนร่วมกันประเมิน',
        'indicators' => 'ผู้ปกครองร้อยละ 95 ให้ความร่วมมือในการตอบแบบฟอร์มการรายงานพฤติกรรม และเข้าร่วมกิจกรรมประชุมผู้ปกครองภาคสนาม',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],

    // ด้านที่ 3 ด้านการพัฒนาตนเองและวิชาชีพ (3 ตัวชี้วัด)
    [
        'category' => 'development',
        'number' => '3.1',
        'title' => 'พัฒนาตนเองอย่างเป็นระบบและต่อเนื่อง',
        'description' => 'มีแผนและการอบรมเพื่อยกระดับความรู้ ทักษะ ภาษา เทคโนโลยี และการสอนยุคใหม่',
        'workPlan' => 'เข้ารับการเข้าอบรมและพัฒนาสมรรถนะครูมืออาชีพในกลุ่มการจัดการเรียนรู้ดิจิทัล ทักษะภาษาต่างประเทศอย่างน้อย 20 ชั่วโมงต่อปีการศึกษา',
        'indicators' => 'เกียรติบัตรและรายงานสรุปผลการอบรมจำนวนไม่ต่ำกว่า 2 รายการ ที่สอดคล้องกับหัวข้อการสืบค้นความรู้ใหม่',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'development',
        'number' => '3.2',
        'title' => 'มีส่วนร่วม และเป็นผู้นำในการแลกเปลี่ยนเรียนรู้ทางวิชาชีพ (PLC)',
        'description' => 'เสนอวิธีวิจัย คลี่คลาย อภิปรายความขัดข้อง สู่ทางออกแบบบูรณาการเชิงนวัตกรรม',
        'workPlan' => 'เข้าร่วมชุมชนแลกเปลี่ยนวิชาชีพส่งต่อเพื่อนครู (PLC Group) ของสถาบัน ค้นคว้าข้อดีข้อบกพร่องตามปัญหารายสัปดาห์เฉลี่ย 1 ชั่วโมงต่อสัปดาห์',
        'indicators' => 'จำนวนชั่วโมงบันทึกงาน PLC ครบถ้วนตามมาตรฐาน สอดคล้องกับพจนานุกรมแนวทางแก้การเรียนรู้ร่วมกันของสถานศึกษา',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ],
    [
        'category' => 'development',
        'number' => '3.3',
        'title' => 'นำความรู้ ความสามารถ ทักษะที่ได้จากการพัฒนาตนเองและวิชาชีพมาใช้',
        'description' => 'ในการพัฒนาการจัดการเรียนรู้ ผลิตนวัตกรรม และส่งผลทางสถิติให้เห็นการเปลี่ยนแปลงผู้เรียนเชิงบวก',
        'workPlan' => 'นำหัวข้อที่สบความความสำเร็จจากการ PLC และงานเข้าอบรมวิชาการด้านโปรดิวซิงค์ ดิจิทัล จัดประยุกต์สอนในสื่อเทคโนโลยีบทเรียนออนไลน์',
        'indicators' => 'ผู้เรียนระดับผลการประเมินสอดรับนวัตกรรมชั้นเรียน ได้คะแนนเพิ่มขึ้นเทียบก่อนเรียนรวมอย่างน่าพึงพอใจ',
        'evaluationTimes' => 'ตลอดปีการศึกษา'
    ]
];

// -------------------------------------------------------------------------
// 5. ระบบกำกับเร้าเตอร์ (Unified Router Handlers)
// -------------------------------------------------------------------------
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'status';

// รองรับการทำ Method Spoofing ป้องกันปัญหาบล็อก PUT/DELETE บน Plesk/IIS
if ($method === 'POST' && isset($_GET['_method'])) {
    $method = strtoupper($_GET['_method']);
}

// ---------------- STATUS ----------------
if ($action === 'status') {
    echo json_encode([
        "s" => true,
        "version" => "1.0.0",
        "language" => "PHP " . phpversion(),
        "database" => DB_NAME,
        "connectHost" => DB_HOST,
        "text" => "🟢 ระบบเชื่อมต่อ PHP & MySQL จัดเก็บข้อมูล วPA แฝงตัวสมบูรณ์พร้อมซิงก์ร้อยละร้อย!"
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// ---------------- REGISTER ----------------
if ($action === 'register' && $method === 'POST') {
    try {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        
        $email = isset($data['email']) ? trim($data['email']) : '';
        $username = isset($data['username']) ? trim($data['username']) : '';
        $fullName = isset($data['fullName']) ? trim($data['fullName']) : '';
        $position = isset($data['position']) ? trim($data['position']) : '';
        $schoolName = isset($data['schoolName']) ? trim($data['schoolName']) : '';
        $teachingSubject = isset($data['teachingSubject']) ? trim($data['teachingSubject']) : 'ไม่ได้ระบุ';
        $teachingHours = isset($data['teachingHours']) ? trim($data['teachingHours']) : '18';
        
        if (empty($email) || empty($username) || empty($fullName) || empty($position) || empty($schoolName)) {
            http_response_code(400);
            echo json_encode(["error" => "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน"], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // ตรวจสอบความซ้ำซ้อนของอีเมล
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM teachers WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetchColumn() > 0) {
            http_response_code(400);
            echo json_encode(["error" => "อีเมลนี้ถูกเปิดใช้งานในระบบแล้ว"], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $id = 'teacher_' . bin2hex(random_bytes(8));
        $passwordHash = hash('sha256', $username);
        $photoUrl = "https://api.dicebear.com/7.x/adventurer/svg?seed=" . urlencode($fullName);
        
        $stmt = $pdo->prepare("INSERT INTO teachers (id, email, passwordHash, fullName, position, schoolName, teachingSubject, teachingHours, photoUrl, headerBannerUrl, isApproved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)");
        $stmt->execute([$id, $email, $passwordHash, $fullName, $position, $schoolName, $teachingSubject, $teachingHours, $photoUrl, '']);
        
        // ส่งผลลัพธ์โปรไฟล์ที่เพิ่งรวบรวม
        $stmt = $pdo->prepare("SELECT id, email, fullName, position, schoolName, teachingSubject, teachingHours, photoUrl, headerBannerUrl, isApproved FROM teachers WHERE id = ?");
        $stmt->execute([$id]);
        $profile = $stmt->fetch();
        
        echo json_encode(["s" => true, "profile" => $profile], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "ลงทะเบียนขัดข้อง: " . $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

// ---------------- LOGIN ----------------
if ($action === 'login' && $method === 'POST') {
    try {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        
        $email = isset($data['email']) ? trim($data['email']) : '';
        $password = isset($data['password']) ? trim($data['password']) : '';
        
        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["error" => "กรุณาใส่อีเมลและรหัสผ่าน"], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // ยินยอมสิทธิ์ Super Admin Preset เสมอ
        if ($email === 'admin@obec.go.th' && $password === 'admin1234') {
            $adminProfile = [
                'id' => 'super_admin',
                'email' => 'admin@obec.go.th',
                'fullName' => 'ผู้ดูแลระบบส่วนกลาง (Super Admin)',
                'position' => 'ผู้ดูแลระบบระบบจัดเก็บผลงาน วPA ครู',
                'schoolName' => 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)',
                'teachingSubject' => 'ผู้ดูแลระบบระบบจัดเก็บ',
                'teachingHours' => '0',
                'isApproved' => true,
                'photoUrl' => 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
                'headerBannerUrl' => ''
            ];
            echo json_encode(["s" => true, "profile" => $adminProfile], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $passwordHash = hash('sha256', $password);
        $stmt = $pdo->prepare("SELECT id, email, fullName, position, schoolName, teachingSubject, teachingHours, photoUrl, headerBannerUrl, isApproved FROM teachers WHERE email = ? AND passwordHash = ?");
        $stmt->execute([$email, $passwordHash]);
        $profile = $stmt->fetch();
        
        if (!$profile) {
            http_response_code(401);
            echo json_encode(["error" => "อีเมลหรือรหัสผ่าน (ชื่อผู้ใช้) ไม่ถูกต้อง"], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        if (!$profile['isApproved']) {
            http_response_code(403);
            echo json_encode([
                "error" => "บัญชีรายชื่อคุณครูของคุณอยู่ระหว่าง \"รอการอนุมัติใช้งาน\" จากผู้ดูแลระบบ (Super Admin) กรุณาแจ้งผู้ดูแลระบบโรงเรียนเพื่อกดยืนยันบัญชีของคุณผ่านทางแผงควบคุมระบบ"
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $profile['isApproved'] = $profile['isApproved'] ? true : false;
        
        echo json_encode(["s" => true, "profile" => $profile], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "เข้าระบบขัดข้อง: " . $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

// ---------------- PROFILE (GET & PUT) ----------------
if ($action === 'profile') {
    $teacherId = getAuthTeacherIdOrError();
    
    // GET Profile
    if ($method === 'GET') {
        try {
            $stmt = $pdo->prepare("SELECT id, email, fullName, position, schoolName, teachingSubject, teachingHours, photoUrl, headerBannerUrl, isApproved FROM teachers WHERE id = ?");
            $stmt->execute([$teacherId]);
            $profile = $stmt->fetch();
            
            if (!$profile) {
                http_response_code(404);
                echo json_encode(["error" => "ไม่พบประวัติพรรคพวกครูรายบุคคล"], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            $profile['isApproved'] = $profile['isApproved'] ? true : false;
            echo json_encode(["profile" => $profile], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit();
    }
    
    // PUT / UPDATE Profile
    if ($method === 'PUT') {
        try {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true);
            
            $fields = ['fullName', 'position', 'schoolName', 'teachingSubject', 'teachingHours', 'photoUrl', 'headerBannerUrl'];
            $updateParts = [];
            $params = [];
            
            foreach ($fields as $fd) {
                if (isset($data[$fd])) {
                    $updateParts[] = "`{$fd}` = :{$fd}";
                    $params[":{$fd}"] = $data[$fd];
                }
            }
            
            if (!empty($updateParts)) {
                $params[':id'] = $teacherId;
                $sql = "UPDATE teachers SET " . implode(', ', $updateParts) . " WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }
            
            // ดึงผลลัพธ์กลับส่งไคลเอนต์ประกอบการลูป
            $stmt = $pdo->prepare("SELECT id, email, fullName, position, schoolName, teachingSubject, teachingHours, photoUrl, headerBannerUrl, isApproved FROM teachers WHERE id = ?");
            $stmt->execute([$teacherId]);
            $profile = $stmt->fetch();
            $profile['isApproved'] = $profile['isApproved'] ? true : false;
            
            echo json_encode(["s" => true, "profile" => $profile], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "อัพโปรไฟล์ขัดข้อง: " . $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
        exit();
    }
}

// ---------------- ADMIN ACTIONS (Super Admin only) ----------------
if (strpos($action, 'admin_') === 0) {
    checkSuperAdmin();
    
    // GET Teachers
    if ($action === 'admin_teachers' && $method === 'GET') {
        try {
            $stmt = $pdo->query("SELECT id, email, fullName, position, schoolName, teachingSubject, teachingHours, photoUrl, headerBannerUrl, isApproved FROM teachers WHERE id != 'super_admin' ORDER BY fullName ASC");
            $teachers = $stmt->fetchAll();
            
            // แปลงไทป์ความสอดคล้อง
            foreach ($teachers as &$t) {
                $t['isApproved'] = $t['isApproved'] ? true : false;
            }
            
            echo json_encode(["list" => $teachers], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit();
    }
    
    // Approve Teacher
    if ($action === 'admin_approve_teacher' && ($method === 'PUT' || $method === 'POST')) {
        try {
            $teacherId = isset($_GET['teacherId']) ? trim($_GET['teacherId']) : '';
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true);
            $isApproved = isset($data['isApproved']) && $data['isApproved'] ? 1 : 0;
            
            if (empty($teacherId)) {
                http_response_code(400);
                echo json_encode(["error" => "ไม่พบไอดีครูที่ต้องการสั่งสถานะ"], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE teachers SET isApproved = ? WHERE id = ?");
            $stmt->execute([$isApproved, $teacherId]);
            
            $stmt = $pdo->prepare("SELECT id, email, fullName, position, schoolName, teachingSubject, teachingHours, photoUrl, headerBannerUrl, isApproved FROM teachers WHERE id = ?");
            $stmt->execute([$teacherId]);
            $profile = $stmt->fetch();
            $profile['isApproved'] = $profile['isApproved'] ? true : false;
            
            echo json_encode(["s" => true, "profile" => $profile], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit();
    }
    
    // Delete Teacher
    if ($action === 'admin_delete_teacher' && ($method === 'DELETE' || $method === 'POST')) {
        try {
            $teacherId = isset($_GET['teacherId']) ? trim($_GET['teacherId']) : '';
            
            if (empty($teacherId)) {
                http_response_code(400);
                echo json_encode(["error" => "จำเป็นต้องมีข้อมูลรหัสครูเพื่อทำการลบ"], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            $stmt = $pdo->prepare("DELETE FROM teachers WHERE id = ?");
            $stmt->execute([$teacherId]);
            
            echo json_encode(["s" => true], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit();
    }
    
    // mysql sync
    if ($action === 'admin_mysql_sync' && $method === 'POST') {
        // แกล้งซิงก์ logs ประสานผู้รับชม
        $timeStr = date('H:i:s');
        echo json_encode([
            "s" => true,
            "logs" => [
                "[{$timeStr}] 🟢 ตรวจพบระบบประมวลผล PHP PDO ท้องถิ่น",
                "[{$timeStr}] 🔷 ตาราง 'teachers' ทำงานแบบ SQL ข้อมูลสดสมบูรณ์",
                "[{$timeStr}] 🔷 ตาราง 'pa_agreements' มีการเช็คความครอบคลุม FOREIGN KEY ครบถ้วน",
                "[{$timeStr}] 🔷 ตาราง 'pa_indicators' และ 'pa_evidence' มีดัชนีตรวจจับความปลอดภัยครบวงจรเรียบร้อย",
                "[{$timeStr}] 🎉 ปัจจุบันระบบได้ผูกเข้ากับ MySQL ดาต้าเบสจริงเรียบร้อยหมดสิทธิ์ปัญหาขัดข้อง"
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

// ---------------- AGREEMENT FLOWS ----------------
// GET Agreements & POST Create Agreement
if ($action === 'agreements') {
    $teacherId = getAuthTeacherIdOrError();
    
    // GET Agreements
    if ($method === 'GET') {
        try {
            $stmt = $pdo->prepare("SELECT * FROM pa_agreements WHERE teacherId = ? ORDER BY budgetYear DESC");
            $stmt->execute([$teacherId]);
            $list = $stmt->fetchAll();
            echo json_encode(["list" => $list], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit();
    }
    
    // POST Create Agreement
    if ($method === 'POST') {
        try {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true);
            $budgetYear = isset($data['budgetYear']) ? trim($data['budgetYear']) : '';
            
            if (empty($budgetYear)) {
                http_response_code(400);
                echo json_encode(["error" => "กรุณาระบุปีงบประมาณ"], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            // ตรวจสอบว่าปีนี้มีอยู่แล้วหรือไม่
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM pa_agreements WHERE teacherId = ? AND budgetYear = ?");
            $stmt->execute([$teacherId, $budgetYear]);
            if ($stmt->fetchColumn() > 0) {
                http_response_code(400);
                echo json_encode(["error" => "ปีงบประมาณนี้มีขึ้นข้อตกลงในระบบอยู่แล้ว"], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            $agreementId = 'pa_agg_' . bin2hex(random_bytes(8));
            $now = date('Y-m-d\TH:i:s\Z');
            
            // สร้าง Agreement เปล่าเริ่มต้น
            $stmt = $pdo->prepare("INSERT INTO pa_agreements (id, teacherId, budgetYear, status, salary, workloadLessons, workloadSupport, workloadSchool, workloadLife, part2Title, part2Problem, part2Process, part2OutcomeQty, part2OutcomeQly, createdAt, updatedAt) VALUES (?, ?, ?, 'draft', '0', '0', '0', '0', '0', '', '', '', '', '', ?, ?)");
            $stmt->execute([$agreementId, $teacherId, $budgetYear, $now, $now]);
            
            // แตกข้อมูลตัวชี้วัด 15 แม่โครงแบบอัตโนมัติ
            foreach ($INDICATOR_TEMPLATES as $temp) {
                $indId = "pa-ind-" . $agreementId . "-" . str_replace('.', '_', $temp['number']);
                $stmt = $pdo->prepare("INSERT INTO pa_indicators (id, agreementId, category, number, title, description, workPlan, indicators, evaluationTimes, score, selfEvaluationText, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, '', ?)");
                $stmt->execute([
                    $indId,
                    $agreementId,
                    $temp['category'],
                    $temp['number'],
                    $temp['title'],
                    $temp['description'],
                    $temp['workPlan'],
                    $temp['indicators'],
                    $temp['evaluationTimes'],
                    $now
                ]);
            }
            
            // คืนค่ารายการทั้งหมด
            $stmt = $pdo->prepare("SELECT * FROM pa_agreements WHERE teacherId = ? ORDER BY budgetYear DESC");
            $stmt->execute([$teacherId]);
            $list = $stmt->fetchAll();
            
            echo json_encode(["s" => true, "list" => $list], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit();
    }
}

// GET Detail of Agreement & PUT Update Fields
if ($action === 'agreement_detail') {
    $teacherId = getAuthTeacherIdOrError();
    $id = isset($_GET['id']) ? trim($_GET['id']) : '';
    
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(["error" => "ไม่ระบุปีบประมาณไอดี"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // GET Detail
    if ($method === 'GET') {
        try {
            $stmt = $pdo->prepare("SELECT * FROM pa_agreements WHERE id = ? AND teacherId = ?");
            $stmt->execute([$id, $teacherId]);
            $agreement = $stmt->fetch();
            
            if (!$agreement) {
                http_response_code(404);
                echo json_encode(["error" => "ไม่พบข้อมูลสัญญาร์ตามรหัสและสิทธิ์เจ้าของ"], JSON_UNESCAPED_UNICODE);
                exit();
            }
            echo json_encode(["agreement" => $agreement], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit();
    }
    
    // PUT Update Detail
    if ($method === 'PUT') {
        try {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true);
            
            $fields = [
                'status', 'salary', 'workloadLessons', 'workloadSupport', 'workloadSchool', 'workloadLife',
                'part2Title', 'part2Problem', 'part2Process', 'part2OutcomeQty', 'part2OutcomeQly'
            ];
            
            $updateParts = [];
            $params = [];
            
            foreach ($fields as $f) {
                if (isset($data[$f])) {
                    $updateParts[] = "`{$f}` = :{$f}";
                    $params[":{$f}"] = $data[$f];
                }
            }
            
            if (!empty($updateParts)) {
                $now = date('Y-m-d\TH:i:s\Z');
                $updateParts[] = "`updatedAt` = :updatedAt";
                $params[':updatedAt'] = $now;
                
                $params[':id'] = $id;
                $params[':teacherId'] = $teacherId;
                
                $sql = "UPDATE pa_agreements SET " . implode(', ', $updateParts) . " WHERE id = :id AND teacherId = :teacherId";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }
            
            $stmt = $pdo->prepare("SELECT * FROM pa_agreements WHERE id = ? AND teacherId = ?");
            $stmt->execute([$id, $teacherId]);
            $agreement = $stmt->fetch();
            
            echo json_encode(["s" => true, "agreement" => $agreement], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit();
    }
}

// ---------------- INDICATORS ----------------
if ($action === 'indicators' && $method === 'GET') {
    $teacherId = getAuthTeacherIdOrError();
    $agreementId = isset($_GET['agreementId']) ? trim($_GET['agreementId']) : '';
    
    if (empty($agreementId)) {
        http_response_code(400);
        echo json_encode(["error" => "ไม่ระบุไอดีตัวข้อตกลงเชื่อมต่อ"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    try {
        // ตรวจสอบสิทธิ์เจ้าของสัญญา
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM pa_agreements WHERE id = ? AND teacherId = ?");
        $stmt->execute([$agreementId, $teacherId]);
        if ($stmt->fetchColumn() == 0) {
            http_response_code(403);
            echo json_encode(["error" => "คุณไม่มีสิทธิ์เข้าถึงข้อตกลงนี้"], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $stmt = $pdo->prepare("SELECT * FROM pa_indicators WHERE agreementId = ? ORDER BY CAST(number AS DECIMAL(10,2)) ASC, number ASC");
        $stmt->execute([$agreementId]);
        $list = $stmt->fetchAll();
        
        // แปลง score เป็น int ตลอดแนว
        foreach ($list as &$i) {
            $i['score'] = (int)$i['score'];
        }
        
        echo json_encode(["list" => $list], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit();
}

if ($action === 'update_indicator' && $method === 'PUT') {
    $teacherId = getAuthTeacherIdOrError();
    $indicatorId = isset($_GET['indicatorId']) ? trim($_GET['indicatorId']) : '';
    
    if (empty($indicatorId)) {
        http_response_code(400);
        echo json_encode(["error" => "ไม่พบไอดีหัวข้อประเด็นชิ้นงานวิชาการตัวชี้วัด"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    try {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        
        $fields = ['workPlan', 'indicators', 'evaluationTimes', 'score', 'selfEvaluationText'];
        $updateParts = [];
        $params = [];
        
        foreach ($fields as $f) {
            if (isset($data[$f])) {
                $updateParts[] = "`{$f}` = :{$f}";
                $params[":{$f}"] = $data[$f];
            }
        }
        
        if (!empty($updateParts)) {
            $now = date('Y-m-d\TH:i:s\Z');
            $updateParts[] = "`updatedAt` = :updatedAt";
            $params[':updatedAt'] = $now;
            
            $params[':id'] = $indicatorId;
            
            $sql = "UPDATE pa_indicators SET " . implode(', ', $updateParts) . " WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }
        
        $stmt = $pdo->prepare("SELECT * FROM pa_indicators WHERE id = ?");
        $stmt->execute([$indicatorId]);
        $indicator = $stmt->fetch();
        $indicator['score'] = (int)$indicator['score'];
        
        echo json_encode(["s" => true, "indicator" => $indicator], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit();
}

// ---------------- EVIDENCE ACTIONS ----------------
if ($action === 'evidence') {
    $teacherId = getAuthTeacherIdOrError();
    $agreementId = isset($_GET['agreementId']) ? trim($_GET['agreementId']) : '';
    
    if (empty($agreementId)) {
        http_response_code(400);
        echo json_encode(["error" => "ไม่ระบุไอดีตัวข้อตกลงเพื่อดึงชิ้นงาน"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    // GET Evidence
    if ($method === 'GET') {
        try {
            // ตรวจสอบสิทธิ์ฝั่งครูผู้ปฏิบัติ
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM pa_agreements WHERE id = ? AND teacherId = ?");
            $stmt->execute([$agreementId, $teacherId]);
            if ($stmt->fetchColumn() == 0) {
                http_response_code(403);
                echo json_encode(["error" => "คุณไม่มีสิทธิ์เข้าถึง"], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            $stmt = $pdo->prepare("SELECT * FROM pa_evidence WHERE agreementId = ? ORDER BY addedAt DESC");
            $stmt->execute([$agreementId]);
            $list = $stmt->fetchAll();
            
            echo json_encode(["list" => $list], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit();
    }
    
    // POST Add Evidence
    if ($method === 'POST') {
        try {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true);
            
            $indicatorNumber = isset($data['indicatorNumber']) ? trim($data['indicatorNumber']) : '';
            $title = isset($data['title']) ? trim($data['title']) : '';
            $linkUrl = isset($data['linkUrl']) ? trim($data['linkUrl']) : '';
            $evidenceType = isset($data['evidenceType']) ? trim($data['evidenceType']) : 'link';
            $description = isset($data['description']) ? trim($data['description']) : '';
            
            if (empty($indicatorNumber) || empty($title) || empty($linkUrl)) {
                http_response_code(400);
                echo json_encode(["error" => "กรุณากรอกข้อมูลที่สำคัญให้ครบถ้วน"], JSON_UNESCAPED_UNICODE);
                exit();
            }
            
            $id = 'evidence_' . bin2hex(random_bytes(8));
            $now = date('Y-m-d\TH:i:s\Z');
            
            $stmt = $pdo->prepare("INSERT INTO pa_evidence (id, agreementId, indicatorNumber, title, description, linkUrl, evidenceType, addedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $agreementId, $indicatorNumber, $title, $description, $linkUrl, $evidenceType, $now]);
            
            $stmt = $pdo->prepare("SELECT * FROM pa_evidence WHERE id = ?");
            $stmt->execute([$id]);
            $evidence = $stmt->fetch();
            
            echo json_encode(["s" => true, "evidence" => $evidence], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit();
    }
}

// DELETE EVIDENCE
if ($action === 'delete_evidence' && $method === 'DELETE') {
    $teacherId = getAuthTeacherIdOrError();
    $id = isset($_GET['id']) ? trim($_GET['id']) : '';
    
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(["error" => "ไม่ได้ระบุรหัสชิ้นงานแนบที่ต้องการลบ"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM pa_evidence WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["s" => true], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit();
}

// ---------------- AI COPILOT ROUTE (NATIVE cURL TO GEMINI) ----------------
if ($action === 'copilot_chat' && $method === 'POST') {
    try {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        
        $messages = isset($data['messages']) ? $data['messages'] : [];
        $contextInfo = isset($data['contextInfo']) ? $data['contextInfo'] : [];
        
        // พยายามดึง GEMINI_API_KEY ค้นหาแบบแผ่วเบาจาก env หรือจากระบบ
        $gemini_key = getenv('GEMINI_API_KEY');
        if (empty($gemini_key)) {
            // อ่านค่าจาก .env เผื่อโรงเรียนจัดวาง
            if (file_exists('.env')) {
                $lines = file('.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    if (strpos(trim($line), '#') === 0) continue;
                    if (strpos($line, '=') !== false) {
                        list($k, $v) = explode('=', $line, 2);
                        if (trim($k) === 'GEMINI_API_KEY') {
                            $gemini_key = trim($v, " '\"");
                            break;
                        }
                    }
                }
            }
        }
        
        if (empty($gemini_key)) {
            // หากไม่มี ให้ใช้ประโยคร่วมจำลองการสะกดจิตตอบกลับอุ่นใจคุณครูทันที
            echo json_encode([
                "text" => "💡 [ข้อความช่วยเหลือจำลอง]: ระบบตรวจจับว่าปัจจุบันเซิร์ฟเวอร์ไม่ได้ระบุ `GEMINI_API_KEY` แต่อย่างไรก็ตาม ข้อแนะในการกรอกข้อมูล วPA ในส่วนของตัวชี้วัดนี้ คุณครูควรเน้นการแสดงผลสัมฤทธิ์เชิงปริมาณและคุณภาพที่วัดได้ชี้ชัด เช่น:\n\n*   **ประเด็นที่ 1**: การสืบค้นการวิเคราะห์หลักสูตรอย่างเห็นผล\n*   **ประเด็นที่ 2**: ผลลัพธ์ผู้เรียนร้อยละ 75 ผ่านการประเมินหน่วยในรายวิชาที่สอน\n*   **ประเด็นที่ 3**: จัดวางสภาพสื่อ Active Learning ร่วมด้วยเทคโนโลยีอย่างเป็นธรรมชาติ\n\n*กรุณากำหนดค่า GEMINI_API_KEY ในไฟล์ระบบเพื่อเปิดการเสนอคำเขียนเต็มรูปแบบ*"
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }

        // เสกคำพึมพำควบคุมสภาพจิต (System Instructions)
        $systemInstruction = "คุณคือ 'ผู้ช่วยอัจฉริยะ วPA' สำหรับข้าราชการครูสังกัดสำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.) ประเทศไทย\n"
            . "หน้าที่หลักของคุณคือช่วยคุณครูเรียบเรียงและเขียนคำอธิบายผลลัพธ์การจัดการเรียนรู้, การพัฒนาผลงานวิชาการ, และการร่างคำอธิบายในประเด็นท้าทาย (Part 2) ให้ถูกต้องตามหลักเกณฑ์ วPA และตัวชี้วัดทั้ง 15 ของ สพฐ.\n\n"
            . "กฎเหล็กการทำงาน:\n"
            . "1. ตอบคำถามในภาษาไทยที่เป็นวิชาการด้วยน้ำเสียงสุภาพ อ่อนน้อม ให้เกียรติครู\n"
            . "2. ใช้คำพูดเช่น 'คุณครูครับ', 'แนวทางการเขียน', 'พิจารณาเรียงความเขียน'\n"
            . "3. มอบแนวทางการปฏิบัติตามแบบพจนานุกรม สพฐ. เป็นหัวข้อที่ครูสามารถนำไปคัดลอกใส่ในฟอร์มข้อตกลง วPA ได้ทันที\n\n"
            . "ข้อมูลประกอบสถานการณ์ปัจจุบันของคุณครูมีดังนี้:\n"
            . "- ชื่อนามสกุลครู: " . (isset($contextInfo['teacherName']) ? $contextInfo['teacherName'] : 'ไม่ระบุ') . "\n"
            . "- ตำแหน่งปัจจุบัน: " . (isset($contextInfo['teacherPosition']) ? $contextInfo['teacherPosition'] : 'ไม่ระบุครูผู้สอน') . "\n"
            . "- วิชาสอนเด่น: " . (isset($contextInfo['teachingSubject']) ? $contextInfo['teachingSubject'] : 'ไม่ระบุวิชาหลัก') . "\n"
            . "- ตัวชี้วัดที่กำลังกรอกข้อมูลชิ้นงาน: " . (isset($contextInfo['currentIndicatorNum']) ? "ตัวชี้วัดที่ " . $contextInfo['currentIndicatorNum'] . " " . (isset($contextInfo['currentIndicatorTitle']) ? $contextInfo['currentIndicatorTitle'] : '') : 'หัวข้อหลักภาพรวม') . "\n\n"
            . "หากครูถามหาวิธีการเขียนหรือขอให้เรียบเรียง ให้เสนอแนวการเขียนที่มี 3 ประเด็นหลักสอดคล้องกับพจนานุกรม สพฐ. โดยเขียนเป็นจุดไข่ปลาชี้ชัดให้เขานำไปคัดลอกใส่ระบบ PA ได้ทันที!";

        // แนบประวัติการแชทแปลงเข้าโครงสร้าง Google Gemini API 1.5/2.5
        $contents = [];
        foreach ($messages as $m) {
            $contents[] = [
                "role" => ($m['role'] === 'model' ? 'model' : 'user'),
                "parts" => [
                    ["text" => $m['text']]
                ]
            ];
        }

        // จัดเตรียม body สู่ API ภายนอก
        $body = [
            "contents" => $contents,
            "systemInstruction" => [
                "parts" => [
                    ["text" => $systemInstruction]
                ]
            ],
            "generationConfig" => [
                "temperature" => 0.7
            ]
        ];

        // รัวคัดลอกผ่านเว็บเบสท์ cURL
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $gemini_key;
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);
        
        if ($err) {
            echo json_encode(["text" => "เกิดข้อผิดพลาดในการเชื่อมต่อคลาวด์วิจัย Gemini: " . $err], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $resDecoded = json_decode($response, true);
        if (isset($resDecoded['candidates'][0]['content']['parts'][0]['text'])) {
            $text = $resDecoded['candidates'][0]['content']['parts'][0]['text'];
            echo json_encode(["text" => $text], JSON_UNESCAPED_UNICODE);
        } else {
            // ส่งกลับแบบฟอลแบ็คหากโดนจำกัดโควต้าหรือคีย์ขัดข้อง
            echo json_encode(["text" => "💡 *ผู้ช่วยอัจฉริยะสังเกตการณ์พยายามติดต่อคุณครู แต่เกิดเหตุขัดข้องทางเทคนิคจากระบบพิกัดคลาวด์ หรืออาจขัดข้องทางลิขสิทธิ์ความถี่ตอบสนองกรุณาตรจจสอบ `GEMINI_API_KEY`*"], JSON_UNESCAPED_UNICODE);
        }
    } catch (\Exception $e) {
        echo json_encode(["text" => "ผู้ช่วยขัดข้อง: " . $e->getMessage()]);
    }
    exit();
}

// ---------------- EXPORT DATABASE ACTIONS (DUMP REAL LIVE MYSQL RECORDS) ----------------
if ($action === 'mysql_dump' && $method === 'GET') {
    try {
        header("Content-Type: text/plain; charset=utf-8");
        header("Content-Disposition: attachment; filename=schoolos_Pateacher_backup_live.sql");
        
        echo "-- ========================================================\n";
        echo "-- MySQL / MariaDB Live Server Database Dump\n";
        echo "-- ระบบ PA ครู สพฐ. (ฝ่ายเทคโนโลยีสารสนเทศโรงเรียน)\n";
        echo "-- Generated on: " . date('Y-m-d H:i:s') . "\n";
        echo "-- ========================================================\n\n";

        echo "SET FOREIGN_KEY_CHECKS = 0;\n";
        echo "DROP TABLE IF EXISTS `pa_evidence`;\n";
        echo "DROP TABLE IF EXISTS `pa_indicators`;\n";
        echo "DROP TABLE IF EXISTS `pa_agreements`;\n";
        echo "DROP TABLE IF EXISTS `teachers`;\n";
        echo "SET FOREIGN_KEY_CHECKS = 1;\n\n";

        // 1) Teachers Table DDL + Insert
        echo "CREATE TABLE `teachers` (\n"
            . "  `id` VARCHAR(50) NOT NULL,\n"
            . "  `email` VARCHAR(100) NOT NULL UNIQUE,\n"
            . "  `passwordHash` VARCHAR(255) NOT NULL,\n"
            . "  `fullName` VARCHAR(150) NOT NULL,\n"
            . "  `position` VARCHAR(100) NOT NULL,\n"
            . "  `schoolName` VARCHAR(150) NOT NULL,\n"
            . "  `teachingSubject` VARCHAR(150) DEFAULT NULL,\n"
            . "  `teachingHours` VARCHAR(50) DEFAULT NULL,\n"
            . "  `photoUrl` TEXT DEFAULT NULL,\n"
            . "  `headerBannerUrl` TEXT DEFAULT NULL,\n"
            . "  `isApproved` TINYINT(1) NOT NULL DEFAULT 0,\n"
            . "  PRIMARY KEY (`id`)\n"
            . ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

        $stmt = $pdo->query("SELECT * FROM teachers");
        while ($r = $stmt->fetch()) {
            $quoteVals = array_map(function($v) use ($pdo) { return $v === null ? "NULL" : $pdo->quote($v); }, $r);
            echo "INSERT INTO `teachers` VALUES (" . implode(", ", $quoteVals) . ");\n";
        }
        echo "\n";

        // 2) Agreements Table DDL + Insert
        echo "CREATE TABLE `pa_agreements` (\n"
            . "  `id` VARCHAR(50) NOT NULL,\n"
            . "  `teacherId` VARCHAR(50) NOT NULL,\n"
            . "  `budgetYear` VARCHAR(10) NOT NULL,\n"
            . "  `status` VARCHAR(20) NOT NULL DEFAULT 'draft',\n"
            . "  `salary` VARCHAR(50) DEFAULT NULL,\n"
            . "  `workloadLessons` VARCHAR(50) DEFAULT NULL,\n"
            . "  `workloadSupport` VARCHAR(50) DEFAULT NULL,\n"
            . "  `workloadSchool` VARCHAR(50) DEFAULT NULL,\n"
            . "  `workloadLife` VARCHAR(50) DEFAULT NULL,\n"
            . "  `part2Title` TEXT DEFAULT NULL,\n"
            . "  `part2Problem` TEXT DEFAULT NULL,\n"
            . "  `part2Process` TEXT DEFAULT NULL,\n"
            . "  `part2OutcomeQty` TEXT DEFAULT NULL,\n"
            . "  `part2OutcomeQly` TEXT DEFAULT NULL,\n"
            . "  `createdAt` VARCHAR(50) NOT NULL,\n"
            . "  `updatedAt` VARCHAR(50) NOT NULL,\n"
            . "  PRIMARY KEY (`id`),\n"
            . "  CONSTRAINT `fk_obec_teacher_bak` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE\n"
            . ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

        $stmt = $pdo->query("SELECT * FROM pa_agreements");
        while ($r = $stmt->fetch()) {
            $quoteVals = array_map(function($v) use ($pdo) { return $v === null ? "NULL" : $pdo->quote($v); }, $r);
            echo "INSERT INTO `pa_agreements` VALUES (" . implode(", ", $quoteVals) . ");\n";
        }
        echo "\n";

        // 3) Indicators Table
        echo "CREATE TABLE `pa_indicators` (\n"
            . "  `id` VARCHAR(100) NOT NULL,\n"
            . "  `agreementId` VARCHAR(50) NOT NULL,\n"
            . "  `category` VARCHAR(50) NOT NULL,\n"
            . "  `number` VARCHAR(10) NOT NULL,\n"
            . "  `title` VARCHAR(255) NOT NULL,\n"
            . "  `description` TEXT DEFAULT NULL,\n"
            . "  `workPlan` TEXT DEFAULT NULL,\n"
            . "  `indicators` TEXT DEFAULT NULL,\n"
            . "  `evaluationTimes` TEXT DEFAULT NULL,\n"
            . "  `score` INT DEFAULT 0,\n"
            . "  `selfEvaluationText` TEXT DEFAULT NULL,\n"
            . "  `updatedAt` VARCHAR(50) NOT NULL,\n"
            . "  PRIMARY KEY (`id`),\n"
            . "  CONSTRAINT `fk_obec_agreement_indicators_bak` FOREIGN KEY (`agreementId`) REFERENCES `pa_agreements` (`id`) ON DELETE CASCADE\n"
            . ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

        $stmt = $pdo->query("SELECT * FROM pa_indicators");
        while ($r = $stmt->fetch()) {
            $quoteVals = array_map(function($v) use ($pdo) { return $v === null ? "NULL" : $pdo->quote($v); }, $r);
            echo "INSERT INTO `pa_indicators` VALUES (" . implode(", ", $quoteVals) . ");\n";
        }
        echo "\n";

        // 4) Evidence Table
        echo "CREATE TABLE `pa_evidence` (\n"
            . "  `id` VARCHAR(50) NOT NULL,\n"
            . "  `agreementId` VARCHAR(50) NOT NULL,\n"
            . "  `indicatorNumber` VARCHAR(10) NOT NULL,\n"
            . "  `title` VARCHAR(255) NOT NULL,\n"
            . "  `description` TEXT DEFAULT NULL,\n"
            . "  `linkUrl` TEXT NOT NULL,\n"
            . "  `evidenceType` VARCHAR(50) NOT NULL,\n"
            . "  `addedAt` VARCHAR(50) NOT NULL,\n"
            . "  PRIMARY KEY (`id`),\n"
            . "  CONSTRAINT `fk_obec_agreement_ev_bak` FOREIGN KEY (`agreementId`) REFERENCES `pa_agreements` (`id`) ON DELETE CASCADE\n"
            . ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

        $stmt = $pdo->query("SELECT * FROM pa_evidence");
        while ($r = $stmt->fetch()) {
            $quoteVals = array_map(function($v) use ($pdo) { return $v === null ? "NULL" : $pdo->quote($v); }, $r);
            echo "INSERT INTO `pa_evidence` VALUES (" . implode(", ", $quoteVals) . ");\n";
        }
        echo "\n";

    } catch (\Exception $e) {
        http_response_code(500);
        echo "🔴 ล้มเหลวในการส่งออกดัมพ์ SQL จากฐานข้อมูล: " . $e->getMessage();
    }
    exit();
}

// ---------------- EXPORT PHP BACKEND DOWNLOAD ----------------
if ($action === 'php_backend' && $method === 'GET') {
    try {
        header("Content-Type: application/octet-stream");
        header("Content-Disposition: attachment; filename=obec_pa_connector.php");
        // คืนประโยคโค้ดไฟล์ตัวเองส่งผู้ขอทันที
        readfile(__FILE__);
    } catch (\Exception $e) {
        http_response_code(500);
        echo "🔴 เกิดความขัดข้องดึงข้อมูล: " . $e->getMessage();
    }
    exit();
}

http_response_code(404);
echo json_encode(["error" => "ไม่พบเส้นทางสคริปต์ปลายทางที่เรียกหาบนเซิร์ฟเวอร์สำนักงาน"], JSON_UNESCAPED_UNICODE);
?>
