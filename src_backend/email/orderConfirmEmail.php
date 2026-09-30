<?php

$name = $name ?? 'ลูกค้า';
$orderId = $orderId ?? 'BL-XXXXXX';
$items = $items ?? [];
$total = $total ?? '0.00';
$shippingAddress = $shippingAddress ?? '';
$paymentMethod = $paymentMethod ?? 'promptpay';
$shippingMethod = $shippingMethod ?? 'standard';

$safeName = htmlspecialchars(trim($name), ENT_QUOTES, 'UTF-8');
$safeOrderId = htmlspecialchars($orderId, ENT_QUOTES, 'UTF-8');
$safeShippingAddress = htmlspecialchars($shippingAddress, ENT_QUOTES, 'UTF-8');

$bookloopUrl  = 'https://solightzz.github.io/bookloop-socialmediamarketing';
$facebookUrl  = 'https://facebook.com/';
$instagramUrl = 'https://instagram.com/';
$youtubeUrl   = 'https://youtube.com/';
$xUrl         = 'https://x.com/';

$paymentLabel = match($paymentMethod) {
    'promptpay' => 'PromptPay QR',
    'qr'        => 'QR Payment',
    'cod'       => 'ชำระเงินปลายทาง (COD)',
    default     => 'PromptPay QR',
};

$shippingLabel = match($shippingMethod) {
    'express' => 'จัดส่งด่วน (1-2 วัน)',
    default   => 'จัดส่งมาตรฐาน (2-3 วัน)',
};

/* Swiss Design — tabular item rows, hairline grid, no rounded pills */
$itemRows = '';
foreach ($items as $index => $item) {
    $itemTitle = htmlspecialchars($item['title'] ?? '', ENT_QUOTES, 'UTF-8');
    $itemAuthor = htmlspecialchars($item['author'] ?? '', ENT_QUOTES, 'UTF-8');
    $itemPrice = number_format((float)($item['price'] ?? 0), 2);
    $itemQty = (int)($item['quantity'] ?? 1);
    $itemLineTotal = number_format((float)($item['price'] ?? 0) * $itemQty, 2);
    $itemImage = htmlspecialchars($item['image'] ?? '', ENT_QUOTES, 'UTF-8');
    $itemNo = str_pad((string)($index + 1), 2, '0', STR_PAD_LEFT);

    $itemRows .= <<<ROW
    <tr>
        <td style="padding:14px 0;border-bottom:1px solid #C9DDF7;vertical-align:top;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                    <td width="30" style="vertical-align:top;padding-top:2px;color:#54749E;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;">
                        {$itemNo}
                    </td>
                    <td width="56" style="vertical-align:top;">
                        <img src="{$itemImage}" alt="{$itemTitle}" width="56" style="display:block;width:56px;height:70px;object-fit:cover;border:1px solid #C9DDF7;border-radius:4px;background:#F2F3F5;">
                    </td>
                    <td style="padding-left:14px;vertical-align:top;">
                        <div style="margin:0;color:#0B2A5B;font-family:'Noto Sans Thai','Inter','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;line-height:1.4;">
                            {$itemTitle}
                        </div>
                        <div style="margin:3px 0 0;color:#54749E;font-family:'Noto Sans Thai','Inter',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.4;">
                            {$itemAuthor}
                        </div>
                        <div style="margin:6px 0 0;color:#54749E;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;line-height:1.4;">
                            QTY {$itemQty} &nbsp;/&nbsp; ฿{$itemPrice}
                        </div>
                    </td>
                    <td width="92" style="text-align:right;vertical-align:top;">
                        <div style="margin:0;color:#0B2A5B;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:800;">
                            ฿{$itemLineTotal}
                        </div>
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
    <title>ยืนยันคำสั่งซื้อ {$safeOrderId} - BookLoop</title>
</head>
<body style="margin:0;padding:0;background:#EAF2FE;font-family:'Noto Sans Thai','Inter','Helvetica Neue',Helvetica,Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0;padding:32px 16px;background:#EAF2FE;">
    <tr>
        <td align="center">
            <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #C9DDF7;border-radius:6px;overflow:hidden;">

                <!-- Swiss top rule -->
                <tr>
                    <td style="background:#0F6CF0;font-size:0;line-height:0;height:6px;">&nbsp;</td>
                </tr>

                <!-- Masthead -->
                <tr>
                    <td style="padding:18px 32px;background:#FFFFFF;border-bottom:1px solid #C9DDF7;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="color:#0B2A5B;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.5px;">
                                    BOOKLOOP<span style="color:#0F6CF0;">®</span>
                                </td>
                                <td style="text-align:right;color:#54749E;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;">
                                    ORDER / ใบยืนยัน
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Hero -->
                <tr>
                    <td style="padding:32px 32px 8px;background:#FFFFFF;">
                        <div style="margin:0;color:#0F6CF0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:2.5px;line-height:1.5;">
                            ORDER CONFIRMATION — ยืนยันคำสั่งซื้อ
                        </div>
                        <div style="margin:10px 0 0;color:#0B2A5B;font-family:'Noto Sans Thai','Inter','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:32px;font-weight:800;letter-spacing:-1px;line-height:1.15;">
                            คำสั่งซื้อสำเร็จ.
                        </div>
                        <div style="margin:10px 0 0;color:#54749E;font-family:'Noto Sans Thai','Inter',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;">
                            ขอบคุณ คุณ {$safeName} เราได้รับคำสั่งซื้อของคุณแล้ว และกำลังเตรียมจัดส่ง
                        </div>
                    </td>
                </tr>

                <!-- Order meta -->
                <tr>
                    <td style="padding:20px 32px 28px;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #0B2A5B;border-radius:6px;">
                            <tr>
                                <td style="padding:14px 18px;">
                                    <div style="color:#54749E;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;">ORDER NO.</div>
                                    <div style="margin-top:4px;color:#0B2A5B;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:800;letter-spacing:1px;">{$safeOrderId}</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Items -->
                <tr>
                    <td style="padding:0 32px;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding:0 0 12px;border-bottom:2px solid #0B2A5B;color:#0B2A5B;font-family:Arial,'Noto Sans Thai',Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:2px;">
                                    รายการสินค้า
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:4px 32px 20px;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            {$itemRows}
                        </table>
                    </td>
                </tr>

                <!-- 02 Payment / Shipping -->
                <tr>
                    <td style="padding:8px 32px 0;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding:0 0 12px;border-bottom:2px solid #0B2A5B;color:#0B2A5B;font-family:Arial,'Noto Sans Thai',Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:2px;">
                                    การชำระเงิน / การจัดส่ง
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:0 32px 20px;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding:12px 0;border-bottom:1px solid #C9DDF7;color:#54749E;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:13px;">
                                    วิธีการชำระเงิน
                                </td>
                                <td style="padding:12px 0;border-bottom:1px solid #C9DDF7;color:#0B2A5B;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;text-align:right;">
                                    {$paymentLabel}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:12px 0;border-bottom:1px solid #C9DDF7;color:#54749E;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:13px;">
                                    การจัดส่ง
                                </td>
                                <td style="padding:12px 0;border-bottom:1px solid #C9DDF7;color:#0B2A5B;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;text-align:right;">
                                    {$shippingLabel}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Total inverted bar -->
                <tr>
                    <td style="padding:4px 32px 24px;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0F6CF0;border-radius:6px;">
                            <tr>
                                <td style="padding:16px 20px;color:#FFFFFF;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;">
                                    ยอดชำระสุทธิ / TOTAL
                                </td>
                                <td style="padding:16px 20px;text-align:right;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:800;">
                                    ฿{$total}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- 03 Address -->
                <tr>
                    <td style="padding:4px 32px 0;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding:0 0 12px;border-bottom:2px solid #0B2A5B;color:#0B2A5B;font-family:Arial,'Noto Sans Thai',Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:2px;">
                                    ที่อยู่จัดส่ง
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:14px 32px 28px;background:#FFFFFF;">
                        <div style="padding:14px 18px;border:1px solid #C9DDF7;border-left:4px solid #0F6CF0;border-radius:0 6px 6px 0;background:#EAF2FE;">
                            <div style="margin:0;color:#0B2A5B;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;">
                                {$safeShippingAddress}
                            </div>
                        </div>
                    </td>
                </tr>

                <!-- CTA Swiss rectangular -->
                <tr>
                    <td align="left" style="padding:0 32px 32px;background:#FFFFFF;">
                        <a href="{$bookloopUrl}/orders/{$safeOrderId}" style="display:inline-block;padding:14px 28px;background:#0F6CF0;color:#FFFFFF;text-decoration:none;border-radius:6px;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.5px;line-height:1.2;">
                            ติดตามคำสั่งซื้อ →
                        </a>
                        &nbsp;&nbsp;
                        <a href="{$bookloopUrl}" style="display:inline-block;padding:13px 26px;background:#FFFFFF;color:#0B2A5B;text-decoration:none;border:1px solid #0B2A5B;border-radius:6px;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1.2;">
                            กลับสู่ร้าน
                        </a>
                    </td>
                </tr>

                <!-- Footer dark Swiss grid -->
                <tr>
                    <td style="padding:24px 32px 28px;background:#0B2A5B;">
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
                                <td colspan="2" style="padding-top:14px;border-bottom:1px solid #1E2A3D;font-size:0;line-height:0;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="padding-top:14px;color:#A8B3C7;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;">
                                    หนังสือที่ดี เปลี่ยนวันธรรมดาให้พิเศษเสมอ
                                </td>
                                <td style="padding-top:14px;text-align:right;">
                                    <a href="{$facebookUrl}" style="color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">&nbsp;f&nbsp;</a>
                                    <a href="{$instagramUrl}" style="color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">&nbsp;◎&nbsp;</a>
                                    <a href="{$youtubeUrl}" style="color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:700;">&nbsp;▶&nbsp;</a>
                                    <a href="{$xUrl}" style="color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">&nbsp;𝕏&nbsp;</a>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding-top:12px;color:#54749E;font-family:Arial,sans-serif;font-size:10px;line-height:1.5;">
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
