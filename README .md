# Artfolio — Creative Portfolio Platform

> Nền tảng portfolio sáng tạo dành cho **designer**, **artist** và **photographer**.  
> Chia sẻ tác phẩm · Kết nối cộng đồng

**INT1334 · CreativePortfolio · 2026**

---

## Mục lục

- [Tổng quan dự án](#tổng-quan-dự-án)
- [Tính năng chính](#tính-năng-chính)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Biến môi trường](#biến-môi-trường)
- [API Endpoints](#api-endpoints)
- [Tính năng AI](#tính-năng-ai)
- [Deploy](#deploy)

---

## Tổng quan dự án

Artfolio là ứng dụng web full-stack cho phép người dùng đăng tải và khám phá tác phẩm sáng tạo. Hệ thống tích hợp **Google Gemini AI** để tự động phân tích ảnh và gợi ý tiêu đề, tags, mô tả phù hợp — giúp người dùng tạo portfolio chuyên nghiệp chỉ trong vài giây.

---

## Tính năng chính

| Tính năng | Mô tả |
|---|---|
| Xác thực | Đăng ký / Đăng nhập bằng Email hoặc Google OAuth |
| Đăng tác phẩm | Upload tối đa 5 ảnh (10MB/ảnh) |
| AI phân tích | Gemini AI tự động gợi ý tiêu đề, tags và mô tả từ ảnh |
| Phân tích màu sắc | AI phân tích bảng màu và gợi ý phối màu phù hợp |
| Khám phá | Lọc theo danh mục, tìm kiếm full-text, feed cá nhân hóa "Just For You" |
| Tương tác | Thích tác phẩm, bình luận, thông báo realtime qua Socket.io |
| Hồ sơ cá nhân | Quản lý portfolio, đổi avatar, xem thống kê |
| Admin | Quản lý người dùng và tác phẩm qua dashboard riêng |

---

## Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                    │
│              Next.js 16 · React 19 · TypeScript         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / WebSocket
┌──────────────────────▼──────────────────────────────────┐
│                   API SERVER (Node.js)                   │
│           Express 4 · Socket.io · Babel                 │
└────────┬──────────────┬──────────────┬──────────────────┘
         │              │              │
┌────────▼──────┐ ┌─────▼──────┐ ┌────▼────────────────┐
│   MongoDB     │ │ Cloudinary │ │   Google Gemini AI  │
│  (Atlas)      │ │ (Images +  │ │  (Phân tích ảnh /  │
│               │ │  Images)   │ │   màu sắc)         │
└───────────────┘ └────────────┘ └────────────────────┘
```

---

## Công nghệ sử dụng

### Backend (`artfolio-api`)

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| Express | ^4.18 | Web framework |
| Mongoose | ^9.6 | ODM cho MongoDB |
| Socket.io | ^4.8 | Realtime notifications |
| Multer + Cloudinary | ^1.4 / ^2.4 | Upload & lưu trữ file |
| @google/generative-ai | ^0.24 | Gemini AI |
| jsonwebtoken | ^9.0 | Xác thực JWT |
| bcryptjs | ^3.0 | Mã hóa mật khẩu |
| Nodemailer | ^8.0 | Gửi email OTP |
| google-auth-library | ^10.7 | Google OAuth |
| Joi | ^18.2 | Validation |
| Sharp | ^0.33 | Xử lý ảnh |

### Frontend (`artfolio-web`)

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| Next.js | 16.2.6 | React framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Styling |
| Zustand | ^5.0 | State management |
| React Hook Form + Zod | ^7.76 / ^4.4 | Form & validation |
| Framer Motion | ^12.40 | Animations |
| Socket.io Client | ^4.8 | Realtime |
| Lucide React | ^1.16 | Icons |
| react-hot-toast | ^2.6 | Notifications |

---

## Cấu trúc thư mục

```
DOANCUOIKYWEB-main/
├── artfolio-api/               # Backend Node.js
│   ├── src/
│   │   ├── config/             # MongoDB, CORS, environment
│   │   ├── controllers/        # Logic xử lý request
│   │   │   ├── aiController.js         # Gemini AI
│   │   │   ├── authController.js       # Đăng nhập / đăng ký
│   │   │   ├── portfolioController.js  # CRUD tác phẩm
│   │   │   ├── userController.js       # Hồ sơ người dùng
│   │   │   ├── commentController.js    # Bình luận
│   │   │   └── notificationController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js       # JWT protect
│   │   │   └── uploadMiddleware.js     # Multer + Cloudinary
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/v1/          # API routes
│   │   ├── services/           # Business logic
│   │   ├── sockets/            # Socket.io handlers
│   │   ├── utils/              # Helpers, constants
│   │   ├── validations/        # Joi schemas
│   │   └── server.js           # Entry point
│   ├── .env.example
│   └── package.json
│
└── artfolio-web/               # Frontend Next.js
    ├── app/
    │   ├── (auth)/             # Login, Register, OTP
    │   ├── create/             # Đăng tác phẩm mới
    │   ├── dashboard/          # Quản lý cá nhân
    │   ├── explore/ & portfolios/  # Khám phá
    │   ├── portfolio/[id]/     # Chi tiết tác phẩm
    │   ├── profile/[id]/       # Trang cá nhân
    │   ├── admin/              # Trang quản trị
    │   ├── store/              # Zustand stores
    │   ├── utils/              # apiConfig, helpers
    │   └── components/         # Shared components
    ├── public/
    │   ├── logo.png            # Logo chính
    │   └── icons/
    ├── .env.example
    └── package.json
```

---

## Cài đặt và chạy dự án

### Yêu cầu

- **Node.js** >= 18.x
- **npm** >= 9.x
- Tài khoản **MongoDB Atlas**
- Tài khoản **Cloudinary**
- **Google Gemini API Key** (lấy tại [ai.google.dev](https://ai.google.dev))
- *(Tùy chọn)* **Google OAuth Client ID**

---

### 1. Clone dự án

```bash
git clone https://github.com/DOANCUOIKYWEBB/DOANCUOIKYWEB.git
cd DOANCUOIKYWEB-main
```

### 2. Cài đặt Backend

```bash
cd artfolio-api
npm install

# Tạo file biến môi trường từ mẫu
cp .env.example .env.development
# → Điền đầy đủ các giá trị vào .env.development (xem mục Biến môi trường)

# Chạy development server (port 5000)
npm run dev
```

### 3. Cài đặt Frontend

```bash
cd ../artfolio-web
npm install

# Tạo file biến môi trường từ mẫu
cp .env.example .env.local
# → Điền đầy đủ các giá trị vào .env.local

# Chạy development server (port 3000)
npm run dev
```

### 4. (Tùy chọn) Seed dữ liệu mẫu

```bash
cd artfolio-api
npm run seed
```

Truy cập ứng dụng tại: **http://localhost:3000**

---

## Biến môi trường

### Backend — `artfolio-api/.env.development`

```env
# Server
APP_HOST=localhost
APP_PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/
DATABASE_NAME=creative-portfolio

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Cloudinary (lưu ảnh)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Email (Gmail App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="Artfolio <your_email@gmail.com>"

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend — `artfolio-web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/auth/register` | Đăng ký tài khoản |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/logout` | Đăng xuất |
| POST | `/auth/refresh-token` | Làm mới access token |
| POST | `/auth/google` | Đăng nhập bằng Google |
| POST | `/auth/send-otp` | Gửi mã OTP xác thực email |
| POST | `/auth/verify-otp` | Xác thực OTP |

### Portfolios
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/portfolios` | Danh sách tác phẩm (lọc, tìm kiếm) | — |
| GET | `/portfolios/:id` | Chi tiết tác phẩm | — |
| POST | `/portfolios` | Đăng tác phẩm mới (multipart/form-data) | ✅ |
| PUT | `/portfolios/:id` | Cập nhật tác phẩm | ✅ |
| DELETE | `/portfolios/:id` | Xóa tác phẩm | ✅ |
| POST | `/portfolios/:id/like` | Thích / bỏ thích | ✅ |
| POST | `/portfolios/:id/view` | Tăng lượt xem | — |
| GET | `/portfolios/just-for-you` | Feed cá nhân hóa | ✅ |

### AI
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/ai/analyze-image` | Phân tích 1 ảnh (base64) | ✅ |
| POST | `/ai/analyze-images` | Phân tích tối đa 5 ảnh | ✅ |
| POST | `/ai/analyze-palette` | Phân tích bảng màu HEX | ✅ |

### Users, Comments, Notifications
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/users/:id` | Hồ sơ người dùng |
| PUT | `/users/:id` | Cập nhật hồ sơ |
| POST | `/users/:id/avatar` | Đổi avatar |
| GET/POST | `/comments` | Bình luận theo portfolio |
| GET | `/notifications` | Danh sách thông báo |
| PATCH | `/notifications/read-all` | Đánh dấu đã đọc tất cả |

---

## Tính năng AI

Artfolio tích hợp **Google Gemini** với cơ chế fallback tự động qua nhiều model:

```
gemini-2.5-flash → gemini-2.5-flash-lite → gemini-2.0-flash
```

Khi một model hết quota (429) hoặc quá tải (503), hệ thống tự động thử model tiếp theo mà không gián đoạn người dùng.

### Các tính năng AI:

**1. Phân tích ảnh đơn / nhiều ảnh**
- Upload ảnh → AI trả về `title`, `tags`, `description` phù hợp phong cách tác phẩm
- Hỗ trợ phân tích đồng thời tối đa 5 ảnh của cùng một bộ sưu tập

**2. Phân tích bảng màu**
- Nhập danh sách mã HEX → AI phân tích cảm xúc, phong cách, gợi ý màu bổ sung

---

## Deploy

### Backend (Render / Railway)

```bash
cd artfolio-api
npm run build       # Build Babel → ./build/
npm run production  # Chạy production
```

Thiết lập biến môi trường `NODE_ENV=production` và các secrets trên platform.

### Frontend (Vercel)

```bash
cd artfolio-web
npm run build
```

Kết nối repo GitHub với Vercel, thiết lập các biến `NEXT_PUBLIC_*` trong Vercel Dashboard.

> **Lưu ý:** Sau khi deploy backend, cập nhật `NEXT_PUBLIC_API_URL` và `NEXT_PUBLIC_SOCKET_URL` trỏ đến URL production của backend.

---

## Nhóm thực hiện

**Team 4 ae siêu nhân** · INT1334 · 2026

---

*© 2026 Artfolio. Dự án học tập.*
