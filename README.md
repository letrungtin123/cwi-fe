# cwi-fe-landing-page

Trang công khai của CEO Workforce Index: landing page, khảo sát, xem và tải báo cáo quý, đăng ký CEO Roundtable/Webinar, trang chính sách. Có tiếng Việt và tiếng Anh.

React 19, TypeScript, Vite, Tailwind CSS.

## Chạy local

```bash
npm install
cp .env.example .env    # VITE_CWI_API_BASE_URL trỏ tới cwi-backend
npm run dev             # http://127.0.0.1:5670
```

## Lệnh

| Lệnh | Việc |
| --- | --- |
| `npm run build` | Typecheck và build vào `dist/` |
| `npm run lint` | oxlint |
| `npm test` | vitest |
| `npm run check:i18n` | Kiểm tra bản dịch tiếng Anh đủ |

Production phục vụ thư mục `dist/`, được đóng gói cùng backend (xem `cwi-backend/deploy/README.md`).
