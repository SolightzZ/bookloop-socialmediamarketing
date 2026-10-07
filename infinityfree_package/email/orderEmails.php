<?php

// ─── BookLoop Cart Reminder & Order Notification Email ────────────────────────
// Soft Swiss Editorial Layout: Tabular precision, high-contrast hierarchy,
// resilient HTML email tables, compliant with BookLoop DESIGN.md tokens & Craft Floor.

require_once __DIR__ . '/sendMail.php';

// ─── Exported Email Helper Functions ──────────────────────────────────────────

if (!function_exists('sendPurchaseEmail')) {
    /**
     * ส่งอีเมลยืนยันคำสั่งซื้อ (เชื่อมต่อกับ orderConfirmEmail.php)
     */
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
        string $shippingMethod = 'standard',
        string $shippingCarrier = 'Flash Express',
        string $trackingNumber = '',
        string $promoCode = '',
        string $discount = '0.00',
        string $subtotal = '0.00'
    ): array {
        // ถ้าไม่ส่ง items มา ให้สร้างจาก single book
        if (empty($items) && $bookTitle !== '') {
            $items = [[
                'title'     => $bookTitle,
                'author'    => '',
                'price'     => $bookPrice,
                'quantity'  => 1,
                'image'     => '',
                'condition' => 'very_good',
            ]];
        }

        return sendEmail($to, $userName, 'purchase', [
            'orderId'         => $orderId,
            'bookTitle'       => $bookTitle,
            'bookPrice'       => $bookPrice,
            'items'           => $items,
            'subtotal'        => $subtotal,
            'discount'        => $discount,
            'promoCode'       => $promoCode,
            'total'           => $total,
            'shippingAddress' => $shippingAddress,
            'paymentMethod'   => $paymentMethod,
            'shippingMethod'  => $shippingMethod,
            'shippingCarrier' => $shippingCarrier,
            'trackingNumber'  => $trackingNumber,
        ]);
    }
}

if (!function_exists('sendAddToCartEmail')) {
    /**
     * ส่งอีเมลแจ้งเตือนสินค้าในตะกร้า / Cart Abandonment Reminder
     */
    function sendAddToCartEmail(
        string $to,
        string $userName,
        string $bookTitle = '',
        string $bookPrice = '',
        string $bookImage = '',
        string $bookAuthor = '',
        string $condition = 'very_good',
        array $items = []
    ): array {
        return sendEmail($to, $userName, 'add_to_cart', [
            'bookTitle'  => $bookTitle,
            'bookPrice'  => $bookPrice,
            'bookImage'  => $bookImage,
            'bookAuthor' => $bookAuthor,
            'condition'  => $condition,
            'items'      => $items,
        ]);
    }
}

// ─── Layout Template Rendering ────────────────────────────────────────────────
// ป้องกันการ echo เมื่อถูก require_once จาก API endpoint เช่น track.php ($activitiesFile ถูกตั้งค่าไว้)
$isApiCaller = isset($activitiesFile);
$shouldRender = !$isApiCaller;

if ($shouldRender) {
    // Template defaults — caller (sendMail.php / emailService.php) sets these
    // before include. isset() form: no runtime notice AND no editor warning.
    if (!isset($name)) {
        $name = isset($userName) ? $userName : 'นักอ่าน';
    }
    if (!isset($bookTitle)) {
        $bookTitle = 'หนังสือที่คุณสนใจ';
    }
    if (!isset($bookPrice)) {
        $bookPrice = '0.00';
    }
    if (!isset($bookImage)) {
        $bookImage = '';
    }
    if (!isset($bookAuthor)) {
        $bookAuthor = '';
    }
    if (!isset($condition)) {
        $condition = 'very_good';
    }
    if (!isset($promoCode)) {
        $promoCode = 'NEW10';
    }
    if (!isset($items) || !is_array($items)) {
        $items = [];
    }

    $safeName       = htmlspecialchars(trim((string)$name) !== '' ? trim((string)$name) : 'นักอ่าน', ENT_QUOTES, 'UTF-8');
    $safeBookTitle  = htmlspecialchars((string)$bookTitle, ENT_QUOTES, 'UTF-8');
    $safeBookAuthor = htmlspecialchars((string)$bookAuthor, ENT_QUOTES, 'UTF-8');
    $safePromoCode  = htmlspecialchars((string)$promoCode, ENT_QUOTES, 'UTF-8');
    $safeImage      = htmlspecialchars((string)$bookImage, ENT_QUOTES, 'UTF-8');

    $formattedPrice = is_numeric($bookPrice) ? number_format((float)$bookPrice, 2) : htmlspecialchars((string)$bookPrice, ENT_QUOTES, 'UTF-8');

    $bookloopUrl  = 'https://panitijahem.xo.je/app';
    $cartUrl      = "{$bookloopUrl}/cart";
    $checkoutUrl  = "{$bookloopUrl}/checkout";
    $supportEmail = 'support@bookloop.co';

    // Condition lookup
    $conditionConfigs = [
        'like_new'    => ['label' => 'สภาพเหมือนใหม่ 99%', 'color' => '#15803D', 'bg' => '#DCFCE7'],
        'very_good'   => ['label' => 'สภาพดีมาก 90-95%',  'color' => '#0369A1', 'bg' => '#E0F2FE'],
        'good'        => ['label' => 'สภาพดี 80-89%',      'color' => '#0369A1', 'bg' => '#E0F2FE'],
        'fair'        => ['label' => 'สภาพพอใช้ 70-79%',   'color' => '#B45309', 'bg' => '#FEF3C7'],
        'acceptable'  => ['label' => 'สภาพอ่านได้',         'color' => '#C2410C', 'bg' => '#FFEDD5'],
    ];
    $condKey = strtolower(trim((string)$condition));
    $condConfig = $conditionConfigs[$condKey] ?? $conditionConfigs['very_good'];

    // Render items list if multiple items exist, or single book
    $renderedItemsHtml = '';
    if (!empty($items)) {
        foreach ($items as $idx => $it) {
            $itTitle  = htmlspecialchars($it['title'] ?? 'หนังสือ', ENT_QUOTES, 'UTF-8');
            $itAuthor = htmlspecialchars($it['author'] ?? '', ENT_QUOTES, 'UTF-8');
            $itPrice  = number_format((float)($it['price'] ?? 0), 2);
            $itImage  = htmlspecialchars($it['image'] ?? $it['cover'] ?? '', ENT_QUOTES, 'UTF-8');
            $itQty    = max(1, (int)($it['quantity'] ?? 1));

            $imgTag = $itImage !== ''
                ? "<img src=\"{$itImage}\" alt=\"{$itTitle}\" width=\"52\" style=\"display:block;width:52px;height:68px;object-fit:cover;border:1px solid #E5EAF0;border-radius:6px;background:#F8FBFF;\">"
                : "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"52\" height=\"68\" style=\"width:52px;height:68px;border:1px solid #E5EAF0;border-radius:6px;background:#F8FBFF;\"><tr><td align=\"center\" valign=\"middle\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#1976D2\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\"></path><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\"></path></svg></td></tr></table>";

            $borderStyle = ($idx < count($items) - 1) ? 'border-bottom:1px solid #E5EAF0;' : '';

            $renderedItemsHtml .= <<<ITEM_ROW
            <tr>
                <td style="padding:14px 0;{$borderStyle}vertical-align:top;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td width="52" style="vertical-align:top;">{$imgTag}</td>
                            <td style="padding-left:14px;vertical-align:top;">
                                <div style="color:#0F2D4A;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:14px;font-weight:700;line-height:1.4;">{$itTitle}</div>
                                <div style="margin-top:2px;color:#64748B;font-family:'Noto Sans Thai',sans-serif;font-size:12px;">{$itAuthor}</div>
                                <div style="margin-top:4px;color:#64748B;font-size:12px;">จำนวน: {$itQty} เล่ม</div>
                            </td>
                            <td width="90" style="text-align:right;vertical-align:top;">
                                <div style="color:#0F2D4A;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:15px;font-weight:700;">฿{$itPrice}</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
ITEM_ROW;
        }
    } else {
        // Single book card
        $bookCoverTag = $safeImage !== ''
            ? "<img src=\"{$safeImage}\" alt=\"{$safeBookTitle}\" width=\"64\" style=\"display:block;width:64px;height:84px;object-fit:cover;border:1px solid #E5EAF0;border-radius:6px;background:#F8FBFF;\">"
            : "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"64\" height=\"84\" style=\"width:64px;height:84px;border:1px solid #E5EAF0;border-radius:6px;background:#F8FBFF;\"><tr><td align=\"center\" valign=\"middle\"><svg width=\"26\" height=\"26\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#1976D2\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\"></path><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\"></path></svg></td></tr></table>";

        $authorSnippet = $safeBookAuthor !== ''
            ? "<div style=\"margin-top:3px;color:#64748B;font-family:'Noto Sans Thai',sans-serif;font-size:13px;line-height:1.4;\">{$safeBookAuthor}</div>"
            : '';

        $renderedItemsHtml = <<<SINGLE_ROW
        <tr>
            <td style="padding:16px;background-color:#F8FBFF;border:1px solid #E5EAF0;border-radius:8px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td width="64" style="vertical-align:top;">{$bookCoverTag}</td>
                        <td style="padding-left:16px;vertical-align:top;">
                            <div style="color:#0F2D4A;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:15px;font-weight:700;line-height:1.4;">{$safeBookTitle}</div>
                            {$authorSnippet}
                            <div style="margin-top:6px;">
                                <span style="display:inline-block;padding:2px 8px;background:{$condConfig['bg']};color:{$condConfig['color']};font-size:11px;font-weight:700;border-radius:4px;">
                                    {$condConfig['label']}
                                </span>
                            </div>
                        </td>
                        <td width="90" style="text-align:right;vertical-align:top;">
                            <div style="color:#0F2D4A;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:18px;font-weight:800;">฿{$formattedPrice}</div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
SINGLE_ROW;
    }

    $bodyContent = <<<HTML
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>หนังสือในตะกร้ากำลังรอคุณอยู่ - BookLoop</title>
</head>
<body style="margin:0;padding:0;background-color:#F8FBFF;-webkit-font-smoothing:antialiased;word-spacing:normal;">

<!-- Outer Shell -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#F8FBFF;margin:0;padding:32px 16px;">
    <tr>
        <td align="center">

            <!-- Main Card Container: 600px Max Width (Swiss Grid Standard) -->
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;background-color:#FFFFFF;border:1px solid #E5EAF0;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(15,45,74,0.03);">

                <!-- Swiss Top Accent Bar -->
                <tr>
                    <td style="background-color:#1976D2;font-size:0;line-height:0;height:4px;">&nbsp;</td>
                </tr>

                <!-- Masthead / Brand Header -->
                <tr>
                    <td style="padding:20px 28px;background-color:#FFFFFF;border-bottom:1px solid #E5EAF0;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="vertical-align:middle;">
                                    <div style="color:#0F2D4A;font-family:'Noto Sans Thai','Inter',-apple-system,sans-serif;font-size:20px;font-weight:800;letter-spacing:-0.03em;">
                                        <img src="cid:logo_image" alt="BookLoop" width="28" height="28" style="display:inline-block;width:28px;height:28px;vertical-align:-6px;margin-right:8px;border:0;">BOOKLOOP<span style="color:#1976D2;">.</span>
                                    </div>
                                </td>
                                <td style="text-align:right;vertical-align:middle;">
                                    <span style="display:inline-block;padding:5px 12px;background-color:#EAF4FF;color:#1976D2;font-family:'Noto Sans Thai',-apple-system,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.02em;border-radius:9999px;">
                                        รายการในตะกร้าสินค้า
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Hero Section: Cart Reminder -->
                <tr>
                    <td style="padding:32px 28px 20px;background-color:#FFFFFF;">
                        <h1 style="margin:0;color:#0F2D4A;font-family:'Noto Sans Thai','Inter',-apple-system,sans-serif;font-size:26px;font-weight:800;line-height:1.25;letter-spacing:-0.02em;">
                            ยังมีหนังสือรอคุณอยู่ในตะกร้า
                        </h1>
                        <p style="margin:10px 0 0;color:#64748B;font-family:'Noto Sans Thai','Inter',-apple-system,sans-serif;font-size:14px;line-height:1.6;">
                            สวัสดี <strong style="color:#0F2D4A;">คุณ{$safeName}</strong> เราเก็บหนังสือเล่มนี้ไว้ให้คุณเรียบร้อยแล้ว อย่าปล่อยให้เรื่องราวดีๆ หลุดมือไปนะครับ
                        </p>
                    </td>
                </tr>

                <!-- Book Item Card Section -->
                <tr>
                    <td style="padding:0 28px 24px;background-color:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            {$renderedItemsHtml}
                        </table>
                    </td>
                </tr>

                <!-- Special Incentive Offer Banner: NEW10 Promo -->
                <tr>
                    <td style="padding:0 28px 24px;background-color:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F0FDF4;border:1px dashed #16A34A;border-radius:8px;">
                            <tr>
                                <td style="padding:16px 20px;text-align:center;">
                                    <div style="color:#166534;font-family:'Noto Sans Thai',sans-serif;font-size:12px;font-weight:700;">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                                        สิทธิพิเศษต้อนรับสมาชิกใหม่ &bull; ลดทันที 10%
                                    </div>
                                    <div style="margin:6px 0;color:#15803D;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;font-size:22px;font-weight:900;letter-spacing:3px;">
                                        {$safePromoCode}
                                    </div>
                                    <div style="color:#166534;font-family:'Noto Sans Thai',sans-serif;font-size:12px;line-height:1.5;">
                                        กรอกโค้ดนี้ที่หน้าชำระเงินเพื่อรับส่วนลด 10% สำหรับคำสั่งซื้อแรกของคุณ
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Action Button Section (Bulletproof Email Table Button) -->
                <tr>
                    <td align="center" style="padding:8px 28px 28px;background-color:#FFFFFF;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                            <tr>
                                <td align="center" style="background-color:#1976D2;border-radius:8px;">
                                    <a href="{$cartUrl}" target="_blank" style="display:inline-block;padding:14px 34px;font-family:'Noto Sans Thai','Inter',-apple-system,sans-serif;font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:8px;line-height:1.2;">
                                        ดำเนินการสั่งซื้อต่อทันที &nbsp;&rarr;
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <div style="margin-top:14px;">
                            <a href="{$bookloopUrl}" target="_blank" style="color:#64748B;font-family:'Noto Sans Thai',sans-serif;font-size:13px;text-decoration:none;">
                                เลือกค้นหาหนังสือเล่มอื่นเพิ่มเติม &rarr;
                            </a>
                        </div>
                    </td>
                </tr>

                <!-- Trust Badges (Why BookLoop) -->
                <tr>
                    <td style="padding:18px 28px;background-color:#F8FBFF;border-top:1px solid #E5EAF0;border-bottom:1px solid #E5EAF0;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" style="color:#475569;font-family:'Noto Sans Thai',sans-serif;font-size:12px;line-height:1.6;">
                                    <span style="display:inline-block;margin:0 6px;vertical-align:middle;">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:3px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        ตรวจสอบสภาพจริงทุกเล่ม
                                    </span>
                                    &bull;
                                    <span style="display:inline-block;margin:0 6px;vertical-align:middle;">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:3px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                        พร้อมเพย์ไร้ค่าธรรมเนียมแฝง
                                    </span>
                                    &bull;
                                    <span style="display:inline-block;margin:0 6px;vertical-align:middle;">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:3px;"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                        จัดส่งรวดเร็ว 1–3 วัน
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Swiss Clean Footer -->
                <tr>
                    <td style="padding:24px 28px;background-color:#0F2D4A;color:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="vertical-align:top;">
                                    <div style="font-family:'Noto Sans Thai','Inter',sans-serif;font-size:15px;font-weight:800;letter-spacing:-0.02em;color:#FFFFFF;">
                                        BOOKLOOP<span style="color:#1976D2;">.</span>
                                    </div>
                                    <div style="margin-top:4px;color:#A8B3C7;font-family:'Noto Sans Thai',sans-serif;font-size:12px;line-height:1.6;">
                                        พื้นที่ส่งต่อหนังสือและเรื่องราวของนักอ่าน
                                    </div>
                                </td>
                                <td style="text-align:right;vertical-align:top;">
                                    <div style="color:#A8B3C7;font-family:'Noto Sans Thai',sans-serif;font-size:11px;">
                                        ติดต่อสอบถาม
                                    </div>
                                    <div style="margin-top:2px;">
                                        <a href="mailto:{$supportEmail}" style="color:#FFFFFF;font-family:-apple-system,sans-serif;font-size:12px;font-weight:700;text-decoration:none;">
                                            {$supportEmail}
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding-top:16px;border-top:1px solid #1E3A5F;margin-top:16px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td style="color:#64748B;font-family:-apple-system,sans-serif;font-size:11px;">
                                                &copy; 2026 BookLoop. All rights reserved.
                                            </td>
                                            <td style="text-align:right;color:#64748B;font-family:'Noto Sans Thai',sans-serif;font-size:11px;">
                                                หนังสือที่ดี เปลี่ยนวันธรรมดาให้พิเศษเสมอ
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

            </table>
            <!-- /Main Card Container -->

        </td>
    </tr>
</table>
<!-- /Outer Shell -->

</body>
</html>
HTML;

    echo $bodyContent;
}