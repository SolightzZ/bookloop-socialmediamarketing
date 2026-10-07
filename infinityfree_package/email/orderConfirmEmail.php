<?php

// ─── BookLoop Transactional Order Confirmation Email ──────────────────────────
// Soft Swiss Editorial Layout: Tabular precision, balanced typographic hierarchy,
// resilient HTML email tables, compliant with BookLoop DESIGN.md tokens & Craft Floor.

// Template defaults — caller sets these before include.
// isset() form: no runtime notice AND no editor (Intelephense) warning.
if (!isset($name)) {
    $name = 'คุณลูกค้า';
}
if (!isset($orderId)) {
    $orderId = 'BL-XXXXXX';
}
if (!isset($items) || !is_array($items)) {
    $items = [];
}
if (!isset($total)) {
    $total = '0.00';
}
if (!isset($shippingAddress)) {
    $shippingAddress = '';
}
if (!isset($paymentMethod)) {
    $paymentMethod = 'promptpay';
}
if (!isset($shippingMethod)) {
    $shippingMethod = 'standard';
}
if (!isset($shippingCarrier)) {
    $shippingCarrier = 'Flash Express';
}
if (!isset($trackingNumber)) {
    $trackingNumber = '';
}
if (!isset($promoCode)) {
    $promoCode = '';
}
if (!isset($orderDate)) {
    $orderDate = date('d/m/Y H:i');
}

$safeName        = htmlspecialchars(trim((string)$name) !== '' ? trim((string)$name) : 'คุณลูกค้า', ENT_QUOTES, 'UTF-8');
$safeOrderId     = htmlspecialchars((string)$orderId, ENT_QUOTES, 'UTF-8');
$safeTracking    = htmlspecialchars((string)$trackingNumber, ENT_QUOTES, 'UTF-8');
$safeCarrier     = htmlspecialchars((string)$shippingCarrier, ENT_QUOTES, 'UTF-8');
$safePromoCode   = htmlspecialchars((string)$promoCode, ENT_QUOTES, 'UTF-8');
$safeDate        = htmlspecialchars((string)$orderDate, ENT_QUOTES, 'UTF-8');

$bookloopUrl  = 'https://panitijahem.xo.je/app';
$supportEmail = 'support@bookloop.co';

// Lookup dictionaries (PHP 7.4+ compatible)
$paymentLabels = [
    'promptpay'     => 'PromptPay QR (พร้อมเพย์)',
    'credit_card'   => 'บัตรเครดิต / เดบิต',
    'bank_transfer' => 'โอนผ่านบัญชีธนาคาร',
    'cod'           => 'ชำระเงินปลายทาง (COD)',
    'truewallet'    => 'TrueMoney Wallet',
    'qr'            => 'QR Payment',
];
$paymentLabel = $paymentLabels[$paymentMethod] ?? 'PromptPay QR (พร้อมเพย์)';

$shippingLabels = [
    'express'  => 'จัดส่งด่วนพิเศษ (1–2 วันทำการ)',
    'standard' => 'จัดส่งพัสดุมาตรฐาน (2–3 วันทำการ)',
];
$shippingLabel = $shippingLabels[$shippingMethod] ?? 'จัดส่งพัสดุมาตรฐาน (2–3 วันทำการ)';

// Condition labels & styles
$conditionLabels = [
    'like_new'    => ['label' => 'สภาพเหมือนใหม่ 99%', 'color' => '#15803D', 'bg' => '#DCFCE7'],
    'very_good'   => ['label' => 'สภาพดีมาก 90-95%',  'color' => '#0369A1', 'bg' => '#E0F2FE'],
    'good'        => ['label' => 'สภาพดี 80-89%',      'color' => '#0369A1', 'bg' => '#E0F2FE'],
    'fair'        => ['label' => 'สภาพพอใช้ 70-79%',   'color' => '#B45309', 'bg' => '#FEF3C7'],
    'acceptable'  => ['label' => 'สภาพอ่านได้',         'color' => '#C2410C', 'bg' => '#FFEDD5'],
];

// Calculate financial breakdown
$calculatedSubtotal = 0.0;
foreach ($items as $item) {
    $p = (float)($item['price'] ?? 0);
    $q = (int)($item['quantity'] ?? 1);
    $calculatedSubtotal += ($p * max(1, $q));
}

$subtotalAmount = isset($subtotal) && is_numeric($subtotal)
    ? (float)$subtotal
    : $calculatedSubtotal;

$totalAmount = (float)$total;

$shippingFeeAmount = isset($shippingFee) && is_numeric($shippingFee)
    ? (float)$shippingFee
    : ($shippingMethod === 'express' ? 50.0 : 0.0);

$discountAmount = isset($discount) && is_numeric($discount)
    ? (float)$discount
    : max(0.0, ($subtotalAmount + $shippingFeeAmount) - $totalAmount);

// Format currency strings
$subtotalFormatted = number_format($subtotalAmount, 2);
$shippingFormatted = $shippingFeeAmount > 0 ? ('฿' . number_format($shippingFeeAmount, 2)) : 'ฟรี';
$discountFormatted = number_format($discountAmount, 2);
$totalFormatted    = number_format($totalAmount, 2);

// Format shipping address string
if (is_array($shippingAddress)) {
    $addrName     = htmlspecialchars($shippingAddress['name'] ?? '', ENT_QUOTES, 'UTF-8');
    $addrPhone    = htmlspecialchars($shippingAddress['phone'] ?? '', ENT_QUOTES, 'UTF-8');
    $addrStreet   = htmlspecialchars($shippingAddress['address'] ?? '', ENT_QUOTES, 'UTF-8');
    $addrProvince = htmlspecialchars($shippingAddress['province'] ?? '', ENT_QUOTES, 'UTF-8');
    $addrZip      = htmlspecialchars($shippingAddress['postalCode'] ?? '', ENT_QUOTES, 'UTF-8');
    
    $renderedAddress = "<strong>{$addrName}</strong> &bull; {$addrPhone}<br>{$addrStreet} {$addrProvince} {$addrZip}";
} else {
    $renderedAddress = nl2br(htmlspecialchars(trim((string)$shippingAddress), ENT_QUOTES, 'UTF-8'));
    if ($renderedAddress === '') {
        $renderedAddress = "ที่อยู่ตามที่ลงทะเบียนไว้กับระบบ";
    }
}

// Render Tabular Item Rows
$itemRows = '';
$totalItemCount = 0;
foreach ($items as $index => $item) {
    $itemTitle  = htmlspecialchars($item['title'] ?? 'หนังสือ', ENT_QUOTES, 'UTF-8');
    $itemAuthor = htmlspecialchars($item['author'] ?? '', ENT_QUOTES, 'UTF-8');
    $itemPrice  = number_format((float)($item['price'] ?? 0), 2);
    $itemQty    = max(1, (int)($item['quantity'] ?? 1));
    $itemTotal  = number_format((float)($item['price'] ?? 0) * $itemQty, 2);
    $itemImage  = htmlspecialchars($item['image'] ?? $item['cover'] ?? '', ENT_QUOTES, 'UTF-8');
    $conditionKey = strtolower(trim((string)($item['condition'] ?? '')));
    $totalItemCount += $itemQty;

    $conditionBadge = '';
    if (isset($conditionLabels[$conditionKey])) {
        $cfg = $conditionLabels[$conditionKey];
        $conditionBadge = "<span style=\"display:inline-block;padding:2px 7px;background:{$cfg['bg']};color:{$cfg['color']};font-size:11px;font-weight:700;border-radius:4px;margin-top:4px;\">{$cfg['label']}</span>";
    }

    $imageTag = $itemImage !== ''
        ? "<img src=\"{$itemImage}\" alt=\"{$itemTitle}\" width=\"52\" style=\"display:block;width:52px;height:68px;object-fit:cover;border:1px solid #E5EAF0;border-radius:6px;background:#F8FBFF;\">"
        : "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"52\" height=\"68\" style=\"width:52px;height:68px;border:1px solid #E5EAF0;border-radius:6px;background:#F8FBFF;\"><tr><td align=\"center\" valign=\"middle\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#1976D2\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\"></path><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\"></path></svg></td></tr></table>";

    $borderStyle = ($index < count($items) - 1) ? 'border-bottom:1px solid #E5EAF0;' : '';

    $itemRows .= <<<ROW
    <tr>
        <td style="padding:14px 0;{$borderStyle}vertical-align:top;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                    <td width="52" style="vertical-align:top;">
                        {$imageTag}
                    </td>
                    <td style="padding-left:14px;vertical-align:top;">
                        <div style="margin:0;color:#0F2D4A;font-family:'Noto Sans Thai','Inter',-apple-system,sans-serif;font-size:14px;font-weight:700;line-height:1.4;">
                            {$itemTitle}
                        </div>
                        <div style="margin:2px 0 0;color:#64748B;font-family:'Noto Sans Thai','Inter',-apple-system,sans-serif;font-size:12px;line-height:1.4;">
                            {$itemAuthor}
                        </div>
                        {$conditionBadge}
                        <div style="margin:4px 0 0;color:#64748B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;">
                            จำนวน: {$itemQty} &times; ฿{$itemPrice}
                        </div>
                    </td>
                    <td width="90" style="text-align:right;vertical-align:top;">
                        <div style="margin:0;color:#0F2D4A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;font-weight:700;">
                            ฿{$itemTotal}
                        </div>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
ROW;
}

if ($itemRows === '') {
    $itemRows = '<tr><td style="padding:20px 0;color:#64748B;text-align:center;font-size:14px;">(ไม่มีรายการสินค้า)</td></tr>';
}

// Discount line display
$discountRow = '';
if ($discountAmount > 0) {
    $promoTag = $safePromoCode !== '' ? " <span style=\"display:inline-block;padding:2px 6px;background:#DCFCE7;color:#15803D;border-radius:4px;font-size:11px;font-weight:700;margin-left:4px;\">{$safePromoCode}</span>" : '';
    $discountRow = <<<DISCOUNT
    <tr>
        <td style="padding:8px 0;color:#15803D;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:13px;font-weight:600;">
            ส่วนลด{$promoTag}
        </td>
        <td style="padding:8px 0;text-align:right;color:#15803D;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:700;">
            -฿{$discountFormatted}
        </td>
    </tr>
DISCOUNT;
}

// Tracking snippet if available
$trackingSnippet = '';
if ($safeTracking !== '') {
    $trackingSnippet = <<<TRACK
    <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E5EAF0;color:#64748B;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:13px;">
            หมายเลขติดตามพัสดุ
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #E5EAF0;text-align:right;color:#0F2D4A;font-family:-apple-system,BlinkMacSystemFont,monospace;font-size:13px;font-weight:700;">
            {$safeTracking} ({$safeCarrier})
        </td>
    </tr>
TRACK;
}

$bodyContent = <<<HTML
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <title>ยืนยันคำสั่งซื้อ #{$safeOrderId} - BookLoop</title>
    <style>
        :root { color-scheme: light only; supported-color-schemes: light only; }
    </style>
</head>
<body style="margin:0;padding:0;background-color:#F8FBFF;-webkit-font-smoothing:antialiased;word-spacing:normal;">

<!-- Outer Shell -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#F8FBFF;margin:0;padding:32px 16px;">
    <tr>
        <td align="center">
            
            <!-- Main Content Container: 600px Max Width (Swiss Grid Standard) -->
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
                                        ใบเสร็จยืนยันคำสั่งซื้อ
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Hero Banner: order-success artwork (embedded as cid:welcome_image on send) -->
                <tr>
                    <td style="padding:0;background-color:#FFFFFF;font-size:0;line-height:0;">
                        <img src="cid:welcome_image" alt="คำสั่งซื้อสำเร็จ - BookLoop" width="600" style="display:block;width:100%;height:auto;margin:0;padding:0;border:0;">
                    </td>
                </tr>

                <!-- Hero Section: Order Confirmation Status -->
                <tr>
                    <td style="padding:32px 28px 20px;background-color:#FFFFFF;">
                        <h1 style="margin:0;color:#0F2D4A;font-family:'Noto Sans Thai','Inter',-apple-system,sans-serif;font-size:26px;font-weight:800;line-height:1.25;letter-spacing:-0.02em;">
                            คำสั่งซื้อของคุณได้รับการยืนยันแล้ว
                        </h1>
                        <p style="margin:10px 0 0;color:#64748B;font-family:'Noto Sans Thai','Inter',-apple-system,sans-serif;font-size:14px;line-height:1.6;">
                            ขอบคุณ <strong style="color:#0F2D4A;">{$safeName}</strong> เราได้รับคำสั่งซื้อและกำลังเตรียมแพ็กหนังสือเพื่อส่งมอบความประทับใจให้คุณ
                        </p>
                    </td>
                </tr>

                <!-- Order Meta Ribbon: Swiss 2-Column Key/Value Grid -->
                <tr>
                    <td style="padding:0 28px 24px;background-color:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F8FBFF;border:1px solid #E5EAF0;border-radius:8px;">
                            <tr>
                                <td style="padding:14px 18px;border-right:1px solid #E5EAF0;vertical-align:top;width:50%;">
                                    <div style="color:#64748B;font-family:'Noto Sans Thai',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.04em;">
                                        หมายเลขคำสั่งซื้อ
                                    </div>
                                    <div style="margin-top:4px;color:#0F2D4A;font-family:-apple-system,BlinkMacSystemFont,monospace;font-size:16px;font-weight:800;">
                                        #{$safeOrderId}
                                    </div>
                                </td>
                                <td style="padding:14px 18px;vertical-align:top;width:50%;">
                                    <div style="color:#64748B;font-family:'Noto Sans Thai',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.04em;">
                                        วันที่สั่งซื้อ
                                    </div>
                                    <div style="margin-top:4px;color:#0F2D4A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:700;">
                                        {$safeDate} น.
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Items Section -->
                <tr>
                    <td style="padding:0 28px;background-color:#FFFFFF;">
                        <div style="padding-bottom:10px;border-bottom:1px solid #0F2D4A;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="color:#0F2D4A;font-family:'Noto Sans Thai',sans-serif;font-size:14px;font-weight:800;">
                                        รายการหนังสือ ({$totalItemCount} เล่ม)
                                    </td>
                                    <td style="text-align:right;color:#64748B;font-family:'Noto Sans Thai',sans-serif;font-size:12px;">
                                        ราคา
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="padding:4px 28px 16px;background-color:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            {$itemRows}
                        </table>
                    </td>
                </tr>

                <!-- Financial Calculation Receipt Breakdown -->
                <tr>
                    <td style="padding:0 28px 24px;background-color:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top:10px;border-top:1px solid #E5EAF0;">
                            <tr>
                                <td style="padding:6px 0;color:#64748B;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:13px;">
                                    รวมมูลค่าหนังสือ
                                </td>
                                <td style="padding:6px 0;text-align:right;color:#0F2D4A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;font-weight:600;">
                                    ฿{$subtotalFormatted}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:6px 0;color:#64748B;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:13px;">
                                    ค่าจัดส่ง ({$safeCarrier})
                                </td>
                                <td style="padding:6px 0;text-align:right;color:#0F2D4A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;font-weight:600;">
                                    {$shippingFormatted}
                                </td>
                            </tr>
                            {$discountRow}
                            <tr>
                                <td colspan="2" style="padding-top:12px;border-bottom:1px solid #E5EAF0;font-size:0;line-height:0;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="padding:14px 0 4px;color:#0F2D4A;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:16px;font-weight:800;">
                                    ยอดชำระสุทธิ
                                </td>
                                <td style="padding:14px 0 4px;text-align:right;color:#1976D2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:22px;font-weight:800;">
                                    ฿{$totalFormatted}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Payment & Delivery Details Section -->
                <tr>
                    <td style="padding:0 28px 24px;background-color:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F8FBFF;border:1px solid #E5EAF0;border-radius:8px;padding:16px;">
                            <tr>
                                <td style="padding-bottom:10px;border-bottom:1px solid #E5EAF0;color:#0F2D4A;font-family:'Noto Sans Thai',sans-serif;font-size:13px;font-weight:800;" colspan="2">
                                    ข้อมูลการชำระเงินและการจัดส่ง
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #E5EAF0;color:#64748B;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:13px;width:35%;">
                                    ช่องทางชำระเงิน
                                </td>
                                <td style="padding:10px 0;border-bottom:1px solid #E5EAF0;text-align:right;color:#0F2D4A;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:13px;font-weight:700;">
                                    {$paymentLabel}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #E5EAF0;color:#64748B;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:13px;">
                                    รูปแบบการจัดส่ง
                                </td>
                                <td style="padding:10px 0;border-bottom:1px solid #E5EAF0;text-align:right;color:#0F2D4A;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:13px;font-weight:700;">
                                    {$shippingLabel}
                                </td>
                            </tr>
                            {$trackingSnippet}
                            <tr>
                                <td style="padding:12px 0 0;color:#64748B;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:13px;vertical-align:top;">
                                    ที่อยู่สำหรับจัดส่ง
                                </td>
                                <td style="padding:12px 0 0;text-align:right;color:#0F2D4A;font-family:'Noto Sans Thai','Inter',sans-serif;font-size:13px;line-height:1.6;vertical-align:top;">
                                    {$renderedAddress}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Action Button Section (Bulletproof Email Table Button) -->
                <tr>
                    <td align="center" style="padding:8px 28px 32px;background-color:#FFFFFF;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                            <tr>
                                <td align="center" style="background-color:#1976D2;border-radius:8px;">
                                    <a href="{$bookloopUrl}/orders/{$safeOrderId}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:'Noto Sans Thai','Inter',-apple-system,sans-serif;font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:8px;line-height:1.2;">
                                        ตรวจสอบสถานะคำสั่งซื้อ &nbsp;&rarr;
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <div style="margin-top:14px;">
                            <a href="{$bookloopUrl}" target="_blank" style="color:#64748B;font-family:'Noto Sans Thai',sans-serif;font-size:13px;text-decoration:none;">
                                เลือกค้นหาหนังสือเพิ่มเติม &rarr;
                            </a>
                        </div>
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
                                        ต้องการความช่วยเหลือ?
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
            <!-- /Main Content Container -->

        </td>
    </tr>
</table>
<!-- /Outer Shell -->

</body>
</html>
HTML;

echo $bodyContent;
