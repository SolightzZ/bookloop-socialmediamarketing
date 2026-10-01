<?php

// ไฟล์สำหรับส่งอีเมลที่เกี่ยวกับคำสั่งซื้อและตะกร้า
// โหลด sendMail.php เพื่อใช้ sendEmail() / getSubject() ร่วมกัน
require_once __DIR__ . '/sendMail.php';

// ส่งอีเมลยืนยันคำสั่งซื้อ
function sendPurchaseEmail(
    string $to,
    string $userName,
    string $orderId,
    string $bookTitle = '',
    string $bookPrice = '',
    array $items = [],
    string $total = '0.00',
    string $shippingAddress = '',
    string $paymentMethod = 'promptpay',
    string $shippingMethod = 'standard'
): array {
    // ถ้าไม่ส่ง items มา ให้สร้างจาก single book
    if (empty($items) && $bookTitle) {
        $items = [['title' => $bookTitle, 'author' => '', 'price' => $bookPrice, 'quantity' => 1, 'image' => '']];
    }

    return sendEmail($to, $userName, 'purchase', [
        'orderId' => $orderId,
        'bookTitle' => $bookTitle,
        'bookPrice' => $bookPrice,
        'items' => $items,
        'total' => $total,
        'shippingAddress' => $shippingAddress,
        'paymentMethod' => $paymentMethod,
        'shippingMethod' => $shippingMethod,
    ]);
}

// ส่งอีเมลแจ้งเตือนตะกร้า
function sendAddToCartEmail(string $to, string $userName, string $bookTitle = '', string $bookPrice = ''): array
{
    return sendEmail($to, $userName, 'add_to_cart', [
        'bookTitle' => $bookTitle,
        'bookPrice' => $bookPrice,
    ]);
}