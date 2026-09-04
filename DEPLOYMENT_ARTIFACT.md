# Triển khai landing và khảo sát

## Production dùng gì?

Production chỉ phục vụ thư mục `dist` được tạo bởi `npm run build`. Mã nguồn React, Git metadata, file `.env`, test và log không được đưa lên máy chủ.

Bản build của repository này được đóng gói cùng `cwi-dashboard` và `cwi-backend` thành một release artifact. Không chạy `git pull` hoặc build raw source trên production.

## Kiểm tra local

```powershell
npm ci --no-audit --no-fund
npm run lint
npm run build
```

Biến môi trường frontend phải bắt đầu bằng `VITE_` và được truyền trong lúc build. Release production mặc định dùng API cùng origin `/api`; `.env` localhost chỉ phục vụ dev và không được đưa vào bundle production. Không đưa service-role key, database URL hoặc secret backend vào frontend.

## Cập nhật production

Sau khi push `main`, chạy script điều phối tại `D:\CWI\cwi-backend`:

```powershell
.\deploy\publish-production-artifact.ps1 `
  -RemoteHost "SERVER_HOST" `
  -RemoteUser "ubuntu" `
  -SshKeyPath "C:\path\to\ssh-key"
```

Script sẽ build lại repository này, kiểm tra landing và dashboard ở staging rồi mới chuyển PM2. Dữ liệu khảo sát nằm ở backend/Supabase và không bị tác động bởi việc thay file `dist`.
