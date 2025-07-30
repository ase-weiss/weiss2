import express from 'express';
import basicAuth from 'express-basic-auth';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------------------------- 설정 ----------------------------
const allowedBasicAuth = process.env.USE_BASIC_AUTH || 'true';
// 인증 사용자/비밀번호
const authUser = process.env.AUTH_USER || 'weissUser';
const authPass = process.env.AUTH_PASS || 'weisspub1#!@';

// IP 필터링 사용 여부
const useIPFilter = process.env.USE_IP_FILTER === 'true';
// 허용된 IP 목록 ( 컴마로 구분 )
const allowedIPsRaw = process.env.ALLOWED_IPS || '127.0.0.1,::1';
const allowedIPs = allowedIPsRaw.split(',').map(ip => ip.trim());
// ---------------------------------------------------------------


// Basic 인증 (선택적 적용)
if(allowedBasicAuth) {
    app.use(basicAuth({
    users: { [authUser]: authPass },
    challenge: true
    }));
}

// IP 필터링 미들웨어 (선택적 적용)
if (useIPFilter) {
  app.use((req, res, next) => {
    const clientIP = req.ip.replace('::ffff:', '');
    if (!allowedIPs.includes(clientIP)) {
      return res.status(403).send('Access denied: Your IP is not allowed.');
    }
    next();
  });
}

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));

// 기본 루트 요청 시 index.html 반환
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  if(allowedBasicAuth) console.log('Basic Auth is enabled');
  else console.log('Basic Auth is disabled');

  if(useIPFilter) console.log('IP filtering is enabled:', allowedIPs);
  else console.log('IP filtering is disabled');

  
});
