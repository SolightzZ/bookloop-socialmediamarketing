<?php
/*
 * Manual browser preview (ไม่รันใน CI):
 *   http://localhost:8000/src_backend/email/onboardingWelcomeEmail.test.php
 */
$name = 'ชานนท์ นักอ่าน';
$categories = ['novel', 'growth', 'comic'];
$bookloopUrl = 'https://solightzz.github.io/bookloop-socialmediamarketing';
$profileUrl = $bookloopUrl . '/account/profile';
$books = [
    [
        'id' => 'b1',
        'title' => 'เจ้าชายน้อย (The Little Prince)',
        'author' => 'อองตวน เดอ แซงเตก-ซูว์เปรี',
        'price' => 189,
        'category' => 'นิยาย',
        'cover' => 'https://covers.openlibrary.org/b/id/15155833-L.jpg',
        'url' => $bookloopUrl . '/books/b1',
    ],
    [
        'id' => 'b2',
        'title' => 'Atomic Habits',
        'author' => 'James Clear',
        'price' => 259,
        'category' => 'พัฒนาตนเอง',
        'cover' => 'https://covers.openlibrary.org/b/id/12539702-L.jpg',
        'url' => $bookloopUrl . '/books/b2',
    ],
    [
        'id' => 'b3',
        'title' => 'One Piece เล่ม 1',
        'author' => 'Eiichiro Oda',
        'price' => 95,
        'category' => 'การ์ตูน',
        'cover' => 'https://covers.openlibrary.org/b/id/7374457-L.jpg',
        'url' => $bookloopUrl . '/books/b3',
    ],
];

include __DIR__ . '/onboardingWelcomeEmail.php';
