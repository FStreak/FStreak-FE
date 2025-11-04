# Quick Test Guide - Teacher Login Fix

## 🚀 Bước 1: Clear Cache & Logout

```javascript
// Mở Browser Console (F12) và chạy:
localStorage.clear();
location.reload();
```

## 🔐 Bước 2: Login với Teacher Account

1. Đi đến `/login`
2. Login với account có role "teacher"
3. Mở Console (F12) để xem logs

### ✅ Expected Console Output:

```
🔐 Login successful - Token info:
User roles from response: ["teacher"]
Is teacher from token? true
✅ Redirecting to /teacher
🔍 Teacher Layout - Checking access with token: Present
🎓 Is teacher? true
✅ Access granted - rendering teacher page
```

## 🔍 Bước 3: Verify với Debug Page

Truy cập: `http://localhost:3000/debug-auth`

### Kiểm tra:

- ✅ **Has Token:** Yes (màu xanh)
- ✅ **Is Teacher:** Yes (màu xanh)
- ✅ **User ID:** Có giá trị (không phải N/A)
- ✅ **Roles Detected:** Badge màu cam hiển thị "teacher"
- ✅ **Decoded JWT:** Có claim `"role": "teacher"`

## 🎯 Bước 4: Test Navigation

### Navbar Test:

- ✅ Link "Teacher" 🎓 hiển thị trên navbar
- ✅ Click vào → redirect về `/teacher`

### Direct Access Test:

- ✅ Gõ trực tiếp `http://localhost:3000/teacher`
- ✅ Page load thành công (không redirect về dashboard)

## ❌ Nếu vẫn redirect về dashboard

### Debug Checklist:

1. **Check Console Logs:**

   ```
   ❌ No token found, redirecting to login
   ```

   → Token chưa được lưu đúng

2. **Check Token Structure:**

   - Dùng https://jwt.io paste token
   - Verify claim `"role": "teacher"` tồn tại

3. **Check Token Expiry:**

   ```javascript
   const storage = JSON.parse(localStorage.getItem("fstreak-auth-storage"));
   const decoded = JSON.parse(atob(storage.state.token.split(".")[1]));
   console.log("Expiry:", new Date(decoded.exp * 1000));
   ```

4. **Re-register với role teacher:**
   - Backend có support `role` field trong register
   - Thử register account mới với role="teacher"

## 📝 Test Results Template

Sau khi test, report kết quả:

```
✅ Clear cache: Done
✅ Login successful: Yes/No
✅ Console shows correct logs: Yes/No
✅ Debug page shows teacher role: Yes/No
✅ Teacher link visible: Yes/No
✅ /teacher page loads: Yes/No

Issue (if any): _____________
Console error: _____________
```

## 🆘 Still Not Working?

1. Share console logs (toàn bộ từ khi login)
2. Share screenshot của `/debug-auth` page
3. Share JWT token (paste vào https://jwt.io)
4. Check backend có trả đúng role "teacher" không

## 📞 Backend API Check

Test API trả role đúng không:

```bash
# Login và xem response
curl -X POST http://your-api/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"password"}'

# Response phải có:
{
  "user": {
    "roles": ["teacher"]  // <-- Phải có này
  },
  "accessToken": "eyJ..."  // <-- Token phải chứa role claim
}
```



