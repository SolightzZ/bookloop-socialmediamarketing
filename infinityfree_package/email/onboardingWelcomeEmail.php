<?php
/*
 * Personalized onboarding welcome email (dynamic — ห้าม hardcode ค่า)
 * ถูก render ผ่าน ob_start()/include จาก sendOnboardingWelcomeEmailService()
 *
 * ตัวแปรขาเข้า:
 *   $name        string   ชื่อผู้ใช้
 *   $categories  string[] category id ที่ผู้ใช้เลือก (เช่น novel, growth)
 *   $books       array[]  [['id','title','author','price','category','cover','url']] (สูงสุด 6)
 *   $bookloopUrl string   URL หน้าแรก BookLoop
 *   $profileUrl  string   URL หน้าโปรไฟล์ (สำหรับแก้ความสนใจ)
 */

$name = $name ?? 'นักอ่าน';
$categories = (isset($categories) && is_array($categories)) ? $categories : [];
$books = (isset($books) && is_array($books)) ? array_slice($books, 0, 6) : [];
$bookloopUrl = $bookloopUrl ?? 'https://panitijahem.xo.je/app';
$profileUrl = $profileUrl ?? $bookloopUrl;

$safeName = htmlspecialchars(trim((string)$name) !== '' ? trim((string)$name) : 'นักอ่าน', ENT_QUOTES, 'UTF-8');

$categoryThaiNames = [
    'novel' => 'นิยาย', 'growth' => 'พัฒนาตนเอง', 'business' => 'ธุรกิจ',
    'knowledge' => 'ความรู้', 'comic' => 'การ์ตูน', 'education' => 'การศึกษา',
    'kids' => 'เด็ก', 'rare' => 'หนังสือสะสม', 'science' => 'วิทยาศาสตร์',
    'history' => 'ประวัติศาสตร์', 'technology' => 'เทคโนโลยี', 'psychology' => 'จิตวิทยา',
    'finance' => 'การเงิน', 'health' => 'สุขภาพ', 'art' => 'ศิลปะ', 'language' => 'ภาษา',
];

/* ชิปหมวดที่เลือก — inline-block ปลอดภัยทุก email client */
$categoryChips = '';
foreach ($categories as $catId) {
    $label = $categoryThaiNames[strtolower(trim((string)$catId))] ?? null;
    if ($label === null) {
        continue;
    }
    $safeLabel = htmlspecialchars($label, ENT_QUOTES, 'UTF-8');
    $categoryChips .= <<<CHIP
    <span style="display:inline-block;margin:0 6px 8px 0;padding:7px 14px;border:1px solid #0F6CF0;border-radius:6px;background:#EFF4FF;color:#0B2A5B;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;line-height:1.2;">{$safeLabel}</span>
CHIP;
}

/* แถวหนังสือแนะนำ */
$bookRows = '';
foreach ($books as $book) {
    if (!is_array($book)) {
        continue;
    }
    $bookTitle = htmlspecialchars(mb_substr(trim((string)($book['title'] ?? 'หนังสือแนะนำ')), 0, 120), ENT_QUOTES, 'UTF-8');
    $bookAuthor = htmlspecialchars(mb_substr(trim((string)($book['author'] ?? '')), 0, 120), ENT_QUOTES, 'UTF-8');
    $bookPrice = number_format(max(0, (float)($book['price'] ?? 0)), 2);
    $bookCategory = htmlspecialchars(mb_substr(trim((string)($book['category'] ?? '')), 0, 60), ENT_QUOTES, 'UTF-8');
    $bookCover = htmlspecialchars(trim((string)($book['cover'] ?? '')), ENT_QUOTES, 'UTF-8');
    $bookUrl = htmlspecialchars(trim((string)($book['url'] ?? '')) !== '' ? trim((string)($book['url'])) : $bookloopUrl, ENT_QUOTES, 'UTF-8');
    $coverImg = $bookCover !== ''
        ? "<img src=\"{$bookCover}\" alt=\"{$bookTitle}\" width=\"56\" style=\"display:block;width:56px;height:76px;object-fit:cover;border:1px solid #C9DDF7;border-radius:4px;background:#EAF2FE;\">"
        : "<div style=\"width:56px;height:76px;line-height:76px;text-align:center;border:1px solid #C9DDF7;border-radius:4px;background:#EAF2FE;color:#0F6CF0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:800;\">B</div>";

    $bookRows .= <<<ROW
    <tr>
        <td style="padding:14px 0;border-bottom:1px solid #C9DDF7;vertical-align:top;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                    <td width="56" style="vertical-align:top;">
                        <a href="{$bookUrl}" style="text-decoration:none;">{$coverImg}</a>
                    </td>
                    <td style="padding-left:14px;vertical-align:top;">
                        <a href="{$bookUrl}" style="text-decoration:none;margin:0;color:#0B2A5B;font-family:'Noto Sans Thai','Inter',Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;line-height:1.4;">
                            {$bookTitle}
                        </a>
                        <div style="margin:3px 0 0;color:#54749E;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;">
                            {$bookAuthor}
                        </div>
                        <div style="margin:6px 0 0;color:#54749E;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;line-height:1.4;">
                            {$bookCategory}
                        </div>
                    </td>
                    <td width="92" style="text-align:right;vertical-align:top;">
                        <div style="margin:0;color:#0B2A5B;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:800;">
                            ฿{$bookPrice}
                        </div>
                        <a href="{$bookUrl}" style="display:inline-block;margin-top:8px;padding:7px 12px;background:#0F6CF0;color:#FFFFFF;text-decoration:none;border-radius:4px;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;line-height:1.2;">
                            ดูเลย
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
ROW;
}

$bodyContent = <<<HTML
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <title>ยินดีต้อนรับสู่ BookLoop</title>
    <style>
        :root { color-scheme: light only; supported-color-schemes: light only; }
    </style>
</head>
<body style="margin:0;padding:0;background:#F8FBFF;font-family:'Noto Sans Thai','Inter','Helvetica Neue',Helvetica,Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0;padding:32px 16px;background:#F8FBFF;">
    <tr>
        <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #C9DDF7;border-radius:6px;overflow:hidden;">

                <tr>
                    <td style="background:#0F6CF0;font-size:0;line-height:0;height:4px;">&nbsp;</td>
                </tr>

                <tr>
                    <td style="padding:20px 28px;background:#FFFFFF;border-bottom:1px solid #C9DDF7;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="color:#0B2A5B;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.5px;">
                                    <img src="cid:logo_image" alt="BookLoop" width="28" height="28" style="display:inline-block;width:28px;height:28px;vertical-align:-6px;margin-right:8px;border:0;">BOOKLOOP<span style="color:#0F6CF0;">®</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:32px 28px 20px;background:#FFFFFF;">
                        <div style="margin:0;color:#0F6CF0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:2.5px;line-height:1.5;">
                            PERSONALIZED FOR YOU — คัดมาเพื่อคุณโดยเฉพาะ
                        </div>
                        <div style="margin:10px 0 0;color:#0B2A5B;font-family:'Noto Sans Thai','Inter','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:30px;font-weight:800;letter-spacing:-1px;line-height:1.2;">
                            สวัสดีคุณ {$safeName}
                        </div>
                        <div style="margin:10px 0 0;color:#54749E;font-family:'Noto Sans Thai','Inter',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;">
                            ยินดีต้อนรับสู่ BookLoop พื้นที่สำหรับหนังสือมือสองที่พร้อมส่งต่อให้เจ้าของคนใหม่
                            เราคัดหนังสือตามความสนใจของคุณมาให้แล้ว
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="padding:20px 28px 0;background:#FFFFFF;">
                        <div style="margin:0 0 10px;color:#0B2A5B;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:13px;font-weight:800;letter-spacing:1.5px;">
                            สิ่งที่คุณสนใจ
                        </div>
                        <div style="margin:0;">
                            {$categoryChips}
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="padding:12px 28px 0;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding:0 0 4px;border-bottom:2px solid #0B2A5B;color:#0B2A5B;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:13px;font-weight:800;letter-spacing:1.5px;">
                                    หนังสือที่เราคิดว่าคุณอาจชอบ
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:4px 28px 8px;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            {$bookRows}
                        </table>
                    </td>
                </tr>

                <tr>
                    <td align="left" style="padding:16px 28px 10px;background:#FFFFFF;">
                        <a href="{$bookloopUrl}" style="display:inline-block;padding:14px 28px;background:#0F6CF0;color:#FFFFFF;text-decoration:none;border-radius:6px;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1.2;">
                            ดูหนังสือที่แนะนำ&nbsp; →
                        </a>
                    </td>
                </tr>
                <tr>
                    <td align="left" style="padding:0 28px 28px;background:#FFFFFF;">
                        <a href="{$profileUrl}" style="color:#0F6CF0;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;text-decoration:underline;">
                            เลือกความสนใจเพิ่มเติม
                        </a>
                    </td>
                </tr>

                <tr>
                    <td style="padding:24px 28px 28px;background:#0B2A5B;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.5px;">
                                    BOOKLOOP<span style="color:#0F6CF0;">®</span>
                                </td>
                                <td style="text-align:right;color:#A8B3C7;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;letter-spacing:2.5px;">
                                    BE PART OF OUR BOOK JOURNEY
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding-top:14px;border-bottom:1px solid #2A5298;font-size:0;line-height:0;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding-top:14px;color:#A8B3C7;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;">
                                    BookLoop ไม่ได้แค่โชว์หนังสือ — เราเรียนรู้สิ่งที่คุณชอบ เพื่อช่วยค้นพบเล่มต่อไปของคุณ
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding-top:12px;color:#6B7A90;font-family:Arial,sans-serif;font-size:10px;line-height:1.5;">
                                    © 2026 BookLoop. All rights reserved.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
HTML;

echo $bodyContent;
