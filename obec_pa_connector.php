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

try {
    // -------------------------------------------------------------------------
    // 2. เริ่มต้นระบบจัดการจัดตั้งขั้วเชื่อมโยง PHP PDO
    // -------------------------------------------------------------------------
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    // พยายามเชื่อมโยงขั้วฐานข้อมูล
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    
    // คำสั่งพิจารณาจัดตั้งสร้าง Database ประดุจยังไม่มีตัวตนบนระบบ
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `" . DB_NAME . "`;");
    
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "s" => false,
        "error" => "🔴 เชื่อมต่อ MySQL บนเซิร์ฟเวอร์ล้มเหลว: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// -------------------------------------------------------------------------
// 3. ระบบกำกับและสร้างตารางความสัมพันธ์อัตโนมัติ (Relational Database Schema)
// -------------------------------------------------------------------------
try {
    // ตารางคุณครูผู้ประเมินเล่มเก็บ (teachers)
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

    // ตารางข้อตกลงเล่มระบบ (pa_agreements)
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
        CONSTRAINT `fk_obec_teacher` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // ตารางบันทึก 15 ด้านตัวชี้วัด (pa_indicators)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `pa_indicators` (
        `id` VARCHAR(50) NOT NULL,
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
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // ตารางจัดวางไฟล์แนบและรูปถ่ายประจักษ์ (pa_evidence)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `pa_evidence` (
        `id` VARCHAR(50) NOT NULL,
        `agreementId` VARCHAR(50) NOT NULL,
        `indicatorNumber` VARCHAR(10) NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT DEFAULT NULL,
        `linkUrl` TEXT NOT NULL,
        `evidenceType` VARCHAR(50) NOT NULL,
        `addedAt` VARCHAR(50) NOT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "s" => false,
        "error" => "🔴 รันสร้างพจนานุกรมความตารางลงฐานข้อมูลล้มเหลว: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// -------------------------------------------------------------------------
// 4. ส่วนของ API จัดการตามคำสั่งฝั่งไคลเอนต์ (Routing API Command)
// -------------------------------------------------------------------------
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'status';

if ($action === 'status') {
    echo json_encode([
        "s" => true,
        "version" => "1.0.0",
        "language" => "PHP " . phpversion(),
        "database" => DB_NAME,
        "connectHost" => DB_HOST,
        "text" => "🟢 ระบบเชื่อมต่อ PHP & MySQL ทำการเชื่อมโยงฐานข้อมูลโรงเรียน schoolos_Pateacher สำเร็จเสร็จโครงสร้าง!"
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// ดึงรายชื่อคุณครูทั้งหมด
if ($action === 'get_teachers' && $method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, email, fullName, position, schoolName, teachingSubject, teachingHours, isApproved FROM teachers ORDER BY fullName ASC");
        $teachers = $stmt->fetchAll();
        echo json_encode(["list" => $teachers], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit();
}

// ยืนยันอนุมัติบัญชีคุณครู
if ($action === 'approve_teacher' && $method === 'POST') {
    try {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        
        if (!isset($data['id']) || !isset($data['isApproved'])) {
            http_response_code(400);
            throw new Exception("ความต้องการข้อมูลไม่สอดคล้อง (ต้องการ id และ isApproved)");
        }
        
        $stmt = $pdo->prepare("UPDATE teachers SET isApproved = :approved WHERE id = :id");
        $stmt->execute([
            ':approved' => $data['isApproved'] ? 1 : 0,
            ':id' => $data['id']
        ]);
        
        echo json_encode(["s" => true, "id" => $data['id'], "isApproved" => $data['isApproved']], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit();
}

// สั่งลบบัญชีครูถาวรออกระบบหลังบ้าน
if ($action === 'delete_teacher' && $method === 'POST') {
    try {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        
        if (!isset($data['id'])) {
            http_response_code(400);
            throw new Exception("ต้องการข้อมูลรหัส id เพื่อทำคำขอถอนตัว");
        }
        
        $stmt = $pdo->prepare("DELETE FROM teachers WHERE id = :id");
        $stmt->execute([':id' => $data['id']]);
        
        echo json_encode(["s" => true, "message" => "ถอดข้อมูลโปรไฟล์คุณครูออกจากระบบเรียบร้อย"], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit();
}

http_response_code(404);
echo json_encode(["error" => "ไม่พบเส้นทางสคริปต์ปลายทางที่เรียกหาบนเซิร์ฟเวอร์"], JSON_UNESCAPED_UNICODE);
?>
