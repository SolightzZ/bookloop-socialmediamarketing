<?php
/**
 * ไฟล์ทดสอบอีเมลยืนยันคำสั่งซื้อสำเร็จ
 * เปิดในเบราว์เซอร์เพื่อดูตัวอย่างอีเมล
 *
 * วิธีใช้: เปิดไฟล์นี้ในเบราว์เซอร์โดยตรง
 *   http://localhost:8000/src_backend/email/orderConfirmEmail.test.php
 */

// จำลองตัวแปรที่ template ต้องการ
$name = 'สมชาย รักการอ่าน';
$orderId = 'BL-7A3K9F';
$items = [
    [
        'title'    => 'สมเด็จพระสังฆราช',
        'author'   => 'หม่อมราชวงศ์คึกฤิทธิ์ ปราโมช',
        'price'    => '189.00',
        'quantity' => 1,
        'image'    => 'https://picsum.photos/seed/book1/120/150',
    ],
    [
        'title'    => 'กลศาสตร์ของความสุข',
        'author'   => 'แดน アリエリ',
        'price'    => '225.00',
        'quantity' => 2,
        'image'    => 'https://picsum.photos/seed/book2/120/150',
    ],
    [
        'title'    => 'การเงินดี ชีวิตดี',
        'author'   => 'นิพนธ์ 名誉会長',
        'price'    => '165.00',
        'quantity' => 1,
        'image'    => 'https://picsum.photos/seed/book3/120/150',
    ],
];
$total = '804.00';
$shippingAddress = 'สมชาย รักการอ่าน, 0812345678, 123/45 ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา จ.กรุงเทพมหานคร 10110';
$paymentMethod = 'promptpay';
$shippingMethod = 'standard';

// แสดงผล template — แปลง cid: เป็น path รูปจริงเพื่อให้พรีวิวในเบราว์เซอร์ได้
// (ตอนส่งจริงผ่าน SMTP ยังใช้ CID inline attachment ตามเดิม ไม่กระทบ Gmail)
ob_start();
include __DIR__ . '/orderConfirmEmail.php';
$previewHtml = ob_get_clean();
echo str_replace('cid:welcome_image', '../images/orderSuccess.jpg', $previewHtml);
