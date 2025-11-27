# 🤖 AI Backend Requirements

## Endpoints cần implement cho AI Learning Content

### 1. Generate Learning Content

**Endpoint:** `POST /api/ai/generate-content`

**Request Body:**
```json
{
  "lessonId": "string (UUID)",
  "documentUrl": "string (optional)",
  "videoTranscript": "string (optional)",
  "targetAudience": "beginner" | "intermediate" | "advanced",
  "contentLength": "short" | "medium" | "long"
}
```

**Response:**
```json
{
  "success": true,
  "content": {
    "id": "string",
    "lessonId": "string",
    "sections": [
      {
        "title": "string",
        "content": "string",
        "order": 0,
        "keyPoints": ["string"],
        "examples": ["string"]
      }
    ],
    "summary": "string",
    "keyTakeaways": ["string"],
    "generatedByAI": true,
    "createdAt": "string (ISO date)"
  },
  "message": "string (optional)"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### 2. Get Learning Content

**Endpoint:** `GET /api/lessons/{lessonId}/content`

**Response:**
```json
{
  "id": "string",
  "lessonId": "string",
  "sections": [...],
  "summary": "string",
  "keyTakeaways": ["string"],
  "generatedByAI": true,
  "createdAt": "string"
}
```

**Status Codes:**
- `200 OK`: Content found
- `404 Not Found`: No content exists for this lesson (this is normal)

## Implementation Notes

1. **AI Service Integration:**
   - Backend cần tích hợp với AI service (OpenAI, Azure OpenAI, hoặc custom)
   - Đọc và phân tích document từ `documentUrl`
   - Nếu có video, có thể extract transcript hoặc dùng video description

2. **Content Structure:**
   - Phân chia nội dung thành các sections có logic
   - Mỗi section có title, content, key points, và examples
   - Tạo summary tổng quan
   - Extract key takeaways

3. **Caching:**
   - Nên cache learning content để tránh regenerate mỗi lần
   - Có thể store trong database với lessonId

4. **Error Handling:**
   - Handle trường hợp document không đọc được
   - Handle trường hợp AI service timeout
   - Return error message rõ ràng

## Testing

Sau khi implement, test với:
- Lesson có document
- Lesson có video
- Lesson có cả document và video
- Lesson không có file (should return error)



