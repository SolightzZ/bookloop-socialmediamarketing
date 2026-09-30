import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { useApiHealth } from '../../hooks/useApiHealth';

/**
 * Badge สถานะเส้น API ใน footer (เห็นทุกหน้ารวม /register)
 * ตอบคำถาม "API อยู่ที่ไหน + ใช้ได้ไหม" โดยไม่ต้องเปิด devtools —
 * ตรรกะเดียวกับ dashboard ฝั่ง backend (ยิง GET {base}/ แล้วดูว่าเป็น JSON ไหม)
 */
export const ApiStatusBadge: React.FC = () => {
  const { status, latencyMs, endpointCount, baseUrl, lastChecked, recheck } = useApiHealth();

  const dotColor = status === 'online' ? '#4ADE80' : status === 'offline' ? '#F87171' : '#64748B';
  const label =
    status === 'online'
      ? `API พร้อม${latencyMs !== null ? ` · ${latencyMs} ms` : ''}`
      : status === 'offline'
        ? 'API ต่อไม่ได้'
        : 'กำลังเช็ก API…';

  const tooltipLines = [
    `Backend: ${baseUrl}/`,
    status === 'online'
      ? `ตอบกลับ JSON ปกติ${endpointCount !== null ? ` (${endpointCount} endpoints)` : ''}${latencyMs !== null ? ` ใน ${latencyMs} ms` : ''}`
      : status === 'offline'
        ? 'เบราว์เซอร์อ่านคำตอบจาก API ไม่ได้ — เน็ตล่ม หรือโฮสต์สกัดกั้น request ข้ามเว็บ (anti-bot)'
        : 'กำลังตรวจสอบ…',
    lastChecked ? `เช็กล่าสุด ${lastChecked.toLocaleTimeString('th-TH')}` : '',
    'คลิกเพื่อเช็กอีกครั้ง',
  ].filter(Boolean);

  return (
    <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipLines.join('\n')}</span>} arrow>
      <Chip
        size="small"
        onClick={recheck}
        label={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: dotColor,
                display: 'inline-block',
              }}
            />
            {label}
          </span>
        }
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.06)',
          color: '#CBD5E1',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)' },
        }}
      />
    </Tooltip>
  );
};
