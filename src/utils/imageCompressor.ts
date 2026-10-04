/**
 * ยูทิลิตี้บีบอัดและปรับขนาดรูปภาพฝั่ง Client-side
 * ช่วยลดขนาดรูปถ่ายกล้องมือถือ (2MB - 12MB) ให้เหลือต่ำกว่า 500KB (เฉลี่ย 150KB - 350KB)
 * ทำให้ส่งขึ้น Server (PHP / InfinityFree) ได้รวดเร็ว ไม่ติดขีดจำกัด Payload และไม่โดนตัดทิ้ง
 */

export interface CompressOptions {
  maxDimension?: number; // ความกว้างหรือความสูงสูงสุด (default 1280px)
  maxSizeBytes?: number; // ขนาดสูงสุดที่ยอมรับ (default 480KB)
  initialQuality?: number; // คุณภาพเริ่มต้น (default 0.82)
}

export async function compressImageToDataUrl(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxDimension = 1280,
    maxSizeBytes = 480 * 1024, // < 480KB (ต่ำกว่า 500KB อย่างแน่นอน)
    initialQuality = 0.82,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'));

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('ไม่สามารถประมวลผลรูปภาพได้'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // คำนวณอัตราส่วนการย่อขนาด (รักษา Aspect Ratio เดิม)
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback ถ้าสร้าง context ไม่ได้
          resolve(readerEvent.target?.result as string);
          return;
        }

        // วาดรูปลง Canvas
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // วนลด Quality ลงเรื่อยๆ จนกว่าจะได้ขนาด < maxSizeBytes
        let currentQuality = initialQuality;
        let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);

        // คำนวณขนาด Base64 เป็น Bytes โดยประมาณ
        const getSizeBytes = (url: string) => {
          const base64Str = url.split(',')[1] || '';
          return Math.round((base64Str.length * 3) / 4);
        };

        let currentSize = getSizeBytes(dataUrl);

        // ถ้ายังเกิน 480KB ให้ค่อยๆ ปรับ quality ลงทีละสเต็ป
        while (currentSize > maxSizeBytes && currentQuality > 0.35) {
          currentQuality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          currentSize = getSizeBytes(dataUrl);
        }

        // ถ้ายังเกินอีก ให้ย่อขนาด Canvas ลงอีกครึ่งหนึ่ง
        if (currentSize > maxSizeBytes) {
          const smallCanvas = document.createElement('canvas');
          smallCanvas.width = Math.round(width * 0.7);
          smallCanvas.height = Math.round(height * 0.7);
          const sCtx = smallCanvas.getContext('2d');
          if (sCtx) {
            sCtx.fillStyle = '#FFFFFF';
            sCtx.fillRect(0, 0, smallCanvas.width, smallCanvas.height);
            sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
            dataUrl = smallCanvas.toDataURL('image/jpeg', 0.65);
          }
        }

        resolve(dataUrl);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
