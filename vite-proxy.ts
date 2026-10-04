import type { Plugin, ViteDevServer } from 'vite';
import vm from 'vm';

let cachedCookie = '';
let cookieExpiry = 0;
let cachedAesCode = '';
let activatingPromise: Promise<string> | null = null;

/**
 * ดึงและคำนวณ __test cookie สำหรับ bypass anti-bot challenge (aes.js) ของ InfinityFree
 * พร้อมกระตุ้น session ที่ /?i=1 ให้เซิร์ฟเวอร์เปิดรับ API requests
 */
async function getActivatedCookie(): Promise<string> {
  const now = Date.now();
  if (cachedCookie && now < cookieExpiry) {
    return cachedCookie;
  }

  if (activatingPromise) {
    return activatingPromise;
  }

  activatingPromise = (async () => {
    try {
      if (!cachedAesCode) {
        const aesRes = await fetch('https://panitijahem.xo.je/aes.js');
        cachedAesCode = await aesRes.text();
      }

      const challengeRes = await fetch('https://panitijahem.xo.je/', {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      const html = await challengeRes.text();
      const match = html.match(/var a=toNumbers\("([^"]+)"\),b=toNumbers\("([^"]+)"\),c=toNumbers\("([^"]+)"\)/);
      if (!match) {
        return cachedCookie;
      }

      const [, aHex, bHex, cHex] = match;
      const sandbox: Record<string, any> = {};
      vm.runInNewContext(
        cachedAesCode +
          '; function toNumbers(d){var e=[];d.replace(/(..)/g,function(d){e.push(parseInt(d,16))});return e}' +
          'function toHex(){for(var d=[],d=1==arguments.length&&arguments[0].constructor==Array?arguments[0]:arguments,e="",f=0;f<d.length;f++)e+=(16>d[f]?"0":"")+d[f].toString(16);return e.toLowerCase()}' +
          'var a=toNumbers("' +
          aHex +
          '"),b=toNumbers("' +
          bHex +
          '"),c=toNumbers("' +
          cHex +
          '");' +
          'result = toHex(slowAES.decrypt(c,2,a,b));',
        sandbox
      );

      const cookieVal = '__test=' + sandbox.result;

      // กระตุ้น session บน InfinityFree ด้วย ?i=1 (เลียนแบบพฤติกรรม aes.js ที่ redirect ไปยัง URL แรก)
      await fetch('https://panitijahem.xo.je/?i=1', {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Cookie: cookieVal,
        },
      });

      cachedCookie = cookieVal;
      cookieExpiry = Date.now() + 5 * 60 * 60 * 1000; // แคชไว้ 5 ชั่วโมง
      return cachedCookie;
    } catch (e) {
      console.warn('[InfinityFree Proxy] Cookie challenge solve warning:', e);
      return cachedCookie;
    } finally {
      activatingPromise = null;
    }
  })();

  return activatingPromise;
}

/**
 * Vite plugin ที่ดักจับทุก request ที่ขึ้นต้นด้วย /api/
 * แล้วส่งต่อไปยัง API จริง https://panitijahem.xo.je พร้อม cookie bypass อัตโนมัติ
 * ทำให้ฝั่งเบราว์เซอร์ (localhost:3000) ไม่ติด CORS และไม่ต้องเปิดเซิร์ฟเวอร์ PHP บนเครื่อง
 */
export function infinityFreeProxyPlugin(): Plugin {
  return {
    name: 'infinityfree-api-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next();
        }

        // กรณีระบุว่าต้องการใช้ local backend (localhost:8000) ให้ส่งต่อไปยัง Vite server.proxy ปกติ
        if (process.env.VITE_BACKEND_TARGET === 'local') {
          return next();
        }

        const chunks: Buffer[] = [];
        req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        req.on('end', async () => {
          const bodyBuffer = chunks.length > 0 ? Buffer.concat(chunks) : null;

          async function sendProxy(retry = true): Promise<void> {
            const cookie = await getActivatedCookie();
            const targetUrl = 'https://panitijahem.xo.je' + req.url;

            const forwardHeaders: Record<string, string> = {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Origin: 'https://panitijahem.xo.je',
              Referer: 'https://panitijahem.xo.je/app/',
            };

            if (cookie) {
              forwardHeaders['Cookie'] = cookie;
            }

            if (req.headers['content-type']) {
              forwardHeaders['Content-Type'] = req.headers['content-type'] as string;
            }
            if (req.headers['authorization']) {
              forwardHeaders['Authorization'] = req.headers['authorization'] as string;
            }

            try {
              const upstreamRes = await fetch(targetUrl, {
                method: req.method || 'GET',
                headers: forwardHeaders,
                ...(req.method !== 'GET' && req.method !== 'HEAD' && bodyBuffer ? { body: bodyBuffer } : {}),
              });

              const text = await upstreamRes.text();

              // หากโดนหน้าแอนตี้บอทแทรก (เช่น cookie หมดอายุ) ให้เคลียร์แล้วลองใหม่อีก 1 ครั้งอัตโนมัติ
              if (text.includes('/aes.js') && retry) {
                cachedCookie = '';
                return sendProxy(false);
              }

              res.statusCode = upstreamRes.status;
              const contentType = upstreamRes.headers.get('content-type') || 'application/json; charset=utf-8';
              res.setHeader('Content-Type', contentType);
              res.end(text);
            } catch (err: any) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  message: 'Proxy to panitijahem.xo.je failed: ' + (err.message || String(err)),
                })
              );
            }
          }

          sendProxy().catch((err) => {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: String(err) }));
          });
        });
      });
    },
  };
}
