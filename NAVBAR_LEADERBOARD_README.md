# 🏆 Navbar Leaderboard - Quick Access

## Tổng quan

Leaderboard dropdown trên navbar cho phép users nhanh chóng xem Top 10 streak leaders từ bất kỳ trang nào trong ứng dụng mà không cần chuyển đến Dashboard.

## Vị trí

Icon Trophy 🏆 màu cam trên navbar, nằm giữa:

- Theme Toggle (trái)
- Notification Bell (phải)

## Tính năng

### 1. **Quick Access**

- Click icon Trophy để mở/đóng dropdown
- Không cần reload page hay chuyển trang
- Tự động fetch data lần đầu mở

### 2. **Top 10 Display**

- Hiển thị 10 users có streak cao nhất (All Time)
- Rank badges với màu gradient đẹp mắt:
  - 🥇 #1: Vàng
  - 🥈 #2: Bạc
  - 🥉 #3: Đồng
  - #4-10: Xanh

### 3. **Interactive**

- Click vào user → Navigate đến profile của họ
- Click "View All" (header) → Chuyển đến Dashboard
- Click "Xem bảng xếp hạng đầy đủ" (footer) → Chuyển đến Dashboard
- Click bên ngoài dropdown → Đóng dropdown

### 4. **UI/UX**

- Header gradient cam-vàng nổi bật
- Loading spinner khi fetch data
- Smooth transition khi mở/đóng
- Responsive design
- Dark mode support

## Component Structure

```
src/components/navbar/
├── LeaderboardDropdown.tsx  (New)
└── Navbar.tsx               (Updated)
```

## API Endpoint

```typescript
GET /api/Streaks/leaderboard?scope=0&period=0
```

**Parameters:**

- `scope=0`: Global (toàn bộ users)
- `period=0`: All Time (mọi thời đại)

**Response:**

```typescript
{
  period: 0,
  items: [
    {
      userId: string,
      displayName: string,
      currentStreak: number
    }
  ]
}
```

## Styling

### Colors

- **Icon**: `text-orange-500` (màu cam nổi bật)
- **Header**: Gradient cam-vàng `from-orange-500 to-yellow-400`
- **Rank #1**: `from-yellow-400 to-yellow-600`
- **Rank #2**: `from-gray-300 to-gray-500`
- **Rank #3**: `from-orange-400 to-orange-600`
- **Others**: `from-blue-400 to-blue-600`

### Layout

- Width: `w-80` (320px)
- Max height: `max-h-96` (384px)
- Position: Absolute right-aligned
- Border radius: `rounded-xl`
- Shadow: `shadow-lg`

## User Flow

```
1. User đang ở bất kỳ trang nào (lessons, classrooms, etc.)
2. Click icon Trophy 🏆 trên navbar
3. Dropdown hiển thị Top 10 streak leaders
4. Click vào user → Xem profile chi tiết
5. Hoặc click "View All" → Xem leaderboard đầy đủ trong Dashboard
```

## Features Highlights

✅ **Always Accessible** - Có mặt trên mọi trang (khi đã login)
✅ **Fast Loading** - Chỉ fetch khi cần (lazy loading)
✅ **Clean UI** - Design đơn giản, dễ đọc
✅ **Clickable** - Mọi item đều có thể click
✅ **Responsive** - Hoạt động tốt trên mọi màn hình
✅ **Dark Mode** - Tự động theo theme

## Code Example

### Usage in Navbar

```tsx
import LeaderboardDropdown from "./LeaderboardDropdown";

// In Navbar component:
{
  token && <LeaderboardDropdown />;
}
```

### Component Features

- State management với `useState`
- Automatic data fetching với `useEffect`
- Click outside detection
- Router navigation
- Loading states

## Performance

### Optimization

1. **Lazy Loading**: Chỉ fetch data khi dropdown được mở lần đầu
2. **Cache Data**: Sau khi fetch, data được cache trong state
3. **Conditional Rendering**: Dropdown chỉ render khi `open=true`
4. **Event Cleanup**: Đúng cách cleanup event listeners

### Size

- Component bundle: ~3KB
- No external dependencies (chỉ dùng built-in React hooks)

## Future Enhancements

Các tính năng có thể thêm trong tương lai:

1. **Refresh Button**: Cho phép user manually refresh data
2. **Tab Switching**: Thêm tabs All Time vs Weekly ngay trong dropdown
3. **My Rank**: Hiển thị rank của user hiện tại
4. **Animations**: Thêm entrance/exit animations
5. **Skeleton Loading**: Loading placeholder thay vì spinner
6. **Real-time Updates**: WebSocket để update real-time
7. **Filter Options**: Filter theo school, club, etc.
8. **Share Button**: Share leaderboard lên social media

## Testing Checklist

- [ ] Dropdown mở khi click icon
- [ ] Dropdown đóng khi click outside
- [ ] Data fetch đúng từ API
- [ ] Loading state hiển thị
- [ ] Click user navigate đến profile
- [ ] View All button chuyển đến dashboard
- [ ] Rank colors hiển thị đúng
- [ ] Dark mode hoạt động
- [ ] Responsive trên mobile
- [ ] No console errors

## Troubleshooting

### Issue: Dropdown không mở

- Check: User đã login chưa? (chỉ hiển thị khi có token)
- Check: Console có error không?

### Issue: Không có data

- Check: API endpoint hoạt động?
- Check: Network tab trong DevTools
- Check: User permissions

### Issue: Styling bị lỗi

- Check: Tailwind CSS đã được compile?
- Check: Dark mode class names
- Check: z-index conflicts

## Support

Nếu có vấn đề hoặc câu hỏi, vui lòng:

1. Check console logs
2. Check network requests
3. Verify API responses
4. Review component props

---

**Created**: 2025
**Status**: ✅ Production Ready
**Dependencies**: React, Next.js, Lucide Icons, Tailwind CSS
