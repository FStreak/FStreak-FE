# Teacher Dashboard Setup Guide

## Tổng quan

Hệ thống đã được cấu hình để tự động nhận diện teacher và redirect đến trang quản lý lessons.

## Cách hoạt động

### 1. Authentication Flow

- Khi login/signup thành công, hệ thống decode JWT token
- Kiểm tra claim `role` trong JWT
- Nếu role = `"teacher"` → redirect về `/teacher`
- Nếu không → redirect về `/dashboard`

### 2. JWT Claims được hỗ trợ

Token của bạn cần có:

```json
{
  "role": "teacher", // Claim chính
  "nameid": "user-id-here" // User ID
}
```

## Troubleshooting

### Method 1: Use Debug Page (Recommended) 🎯

**Truy cập:** `http://localhost:3000/debug-auth` (chỉ trong development mode)

Trang này hiển thị:

- Token status và role
- User ID từ store và từ JWT
- Decoded JWT payload
- LocalStorage data
- Buttons để test redirect

### Method 2: Console Logs

**Kiểm tra 1: Xem console logs khi login**
Mở Console (F12) và login, bạn sẽ thấy:

```
🔐 Login successful - Token info:
User roles from response: ["teacher"]
Is teacher from token? true
✅ Redirecting to /teacher
🔍 Teacher Layout - Checking access with token: Present
🎓 Is teacher? true
✅ Access granted - rendering teacher page
```

**Kiểm tra 2: Nếu thấy redirect sai**

```
✅ Redirecting to /teacher
🔍 Teacher Layout - Checking access with token: Missing
❌ No token found, redirecting to login
```

→ Có race condition, token chưa kịp load

**Kiểm tra 3: Verify token trong localStorage**

```javascript
// Copy token từ localStorage
const storage = localStorage.getItem("fstreak-auth-storage");
const parsed = JSON.parse(storage);
console.log("Token:", parsed.state.token);
console.log("User ID:", parsed.state.userId);
```

### Method 3: JWT.io

Paste token vào https://jwt.io và kiểm tra:

- Có claim `"role": "teacher"` không? ✅
- Có claim `"nameid"` hoặc `"sub"` cho user ID không? ✅

### Vấn đề: Teacher bị redirect về dashboard thay vì teacher page

**Giải pháp:**

1. ✅ **Clear cache và logout:**

   ```javascript
   localStorage.clear();
   // Reload page và login lại
   ```

2. ✅ **Kiểm tra token expiry:**

   - Token có thể đã hết hạn (exp claim)
   - Login lại để có token mới

3. ✅ **Verify role trong JWT:**
   - Dùng debug page `/debug-auth` để xem role
   - Role phải là chính xác "teacher" (lowercase)

### Vấn đề: Không fetch được lessons

**Nguyên nhân có thể:**

1. UserId không được lưu vào store
2. Token không có quyền gọi API `/api/Lessons/teacher/{teacherId}`

**Cách fix:**

- Kiểm tra localStorage có `userId` không:

```javascript
const storage = JSON.parse(localStorage.getItem("fstreak-auth-storage"));
console.log("User ID:", storage.state.userId);
```

- Nếu không có, token sẽ tự động decode để lấy userId

### Vấn đề: Teacher link không hiển thị trên Navbar

**Nguyên nhân:** Token chưa được load hoặc role check fail

**Cách fix:**

- Refresh trang
- Logout và login lại
- Kiểm tra token còn hạn không (exp claim)

## API Endpoints sử dụng

```
GET    /api/Lessons/teacher/{teacherId}  - Lấy danh sách lessons
GET    /api/Lessons/{id}                  - Lấy chi tiết lesson
POST   /api/Lessons                       - Tạo lesson mới
PUT    /api/Lessons/{id}                  - Cập nhật lesson
DELETE /api/Lessons/{id}                  - Xóa lesson
```

## File Validation

Khi upload file:

- **Document**: PDF, DOC, DOCX, TXT
- **Video**: Any video format
- **Title**: Required, max 200 characters
- **Description**: Optional, max 1000 characters
- **Duration**: 1-1440 minutes (1 day max)

## Development Tips

### Test với mock teacher account

```typescript
// Mock teacher response
const mockTeacherLogin = {
  succeeded: true,
  accessToken: "eyJ...", // Token có role="teacher"
  user: {
    id: "590e2eb0-ca11-49f8-98a9-2d053ec6fbf9",
    roles: ["teacher"],
    // ...
  },
};
```

### Debug JWT decoding

File `src/utils/debugAuth.ts` được tạo để debug:

```typescript
import { debugToken } from "@/utils/debugAuth";

// Trong component hoặc console
debugToken(yourTokenString);
```

## Security Notes

- Teacher routes được bảo vệ bởi `layout.tsx`
- Không thể access `/teacher` nếu không có role Teacher
- Token được kiểm tra ở cả client và server side
- API calls sử dụng `privateApiClient` với Bearer token

## Liên hệ

Nếu vẫn gặp vấn đề, kiểm tra:

1. Backend API có trả đúng role trong JWT không
2. Token có được lưu vào localStorage không
3. Console có lỗi CORS hay 401 Unauthorized không
