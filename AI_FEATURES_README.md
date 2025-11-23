# 🤖 AI-Powered Learning Features

## Tổng quan

Hệ thống tích hợp AI để tự động hóa việc tạo quiz, phân tích bài viết, và theo dõi tiến độ học sinh.

## ✨ Tính năng chính

### 1. 🎯 AI Quiz Generator

**Cho Teacher:**

- Tự động tạo quiz từ tài liệu lesson (PDF, DOC, Video)
- Chọn số lượng câu hỏi (5-50)
- Chọn độ khó (Easy/Medium/Hard)
- Chọn loại câu hỏi:
  - Multiple Choice
  - True/False
  - Short Answer
  - Essay

**Cách sử dụng:**

1. Upload lesson với document hoặc video
2. Vào `/teacher/lessons/{lessonId}`
3. Click "Generate Quiz"
4. Chọn settings và click "Generate Quiz with AI"
5. AI sẽ phân tích nội dung và tạo câu hỏi phù hợp

### 2. 📝 Essay Analyzer

**Cho cả Teacher và Student:**

- Phân tích chất lượng bài viết
- Đánh giá:
  - Content Score (0-100)
  - Clarity Score
  - Grammar Score
  - Overall Score
- Phát hiện lỗi ngữ pháp với gợi ý sửa
- Đưa ra strengths, weaknesses, và suggestions

**Cách sử dụng:**

```tsx
import { EssayAnalyzer } from "@/components/ai/EssayAnalyzer";

<EssayAnalyzer
  initialText={studentEssay}
  questionPrompt="Describe your learning experience"
  onAnalysisComplete={(analysis) => console.log(analysis)}
/>;
```

### 3. 📊 Quiz Analytics Dashboard

**Cho Teacher:**

- Tổng quan performance của students
- Score distribution
- Question-level analysis
- Identify challenging questions
- Pass rate và average score

**Truy cập:**
`/teacher/quizzes/{quizId}/results`

---

## 🏗️ Kiến trúc

### Data Models

```typescript
// Quiz Structure
interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
  totalPoints: number;
  timeLimit?: number; // minutes
  isPublished: boolean;
  generatedByAI: boolean;
}

// Question Types
enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  SHORT_ANSWER = "short_answer",
  ESSAY = "essay",
}

// AI Analysis
interface AIAnalysis {
  analysis: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    grammarErrors?: GrammarError[];
    scores: {
      content: number;
      clarity: number;
      grammar: number;
      overall: number;
    };
  };
}
```

### API Endpoints (Backend cần implement)

```
POST   /api/ai/generate-quiz       - Generate quiz from lesson
GET    /api/lessons/{id}/quizzes   - Get all quizzes for lesson
GET    /api/quizzes/{id}            - Get quiz details
PUT    /api/quizzes/{id}            - Update quiz
DELETE /api/quizzes/{id}            - Delete quiz

POST   /api/quizzes/{id}/attempts  - Start quiz attempt
POST   /api/quiz-attempts/{id}/submit - Submit quiz answers
GET    /api/quiz-attempts/{id}      - Get attempt results

POST   /api/ai/analyze-essay       - Analyze essay with AI
GET    /api/quizzes/{id}/analytics - Get quiz analytics
```

---

## 🚀 Workflow

### Teacher Workflow

1. **Create Lesson**

   - Upload document/video
   - Add title, description, settings

2. **Generate Quiz**

   - Go to lesson detail page
   - Click "Generate Quiz"
   - Configure quiz settings
   - AI generates questions automatically

3. **Review & Edit**

   - Review AI-generated questions
   - Edit if needed
   - Publish when ready

4. **Monitor Performance**

   - View analytics dashboard
   - See which questions are challenging
   - Track student progress

5. **Grade Essays**
   - Use AI analyzer for initial analysis
   - Review AI suggestions
   - Assign final grade

### Student Workflow

1. **Take Quiz**

   - Click on quiz from lesson page
   - Answer questions within time limit
   - Submit answers

2. **View Results**

   - See score immediately (for auto-graded questions)
   - Wait for teacher to grade essays
   - View feedback and explanations

3. **Improve Writing**
   - Use Essay Analyzer for practice
   - Get instant feedback
   - Learn from AI suggestions

---

## 🎨 UI Components

### Teacher Components

```typescript
// 1. AI Quiz Generator
<AIQuizGenerator
  lesson={lesson}
  onQuizGenerated={handleRefresh}
/>

// 2. Quiz List
<QuizList
  quizzes={quizzes}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onViewResults={handleViewResults}
/>

// 3. Analytics Dashboard
<QuizAnalyticsDashboard quizId={quizId} />
```

### Student Components

```typescript
// 1. Quiz Taking Interface
// Located at: /lessons/[id]/quiz/page.tsx

// 2. Essay Analyzer
<EssayAnalyzer
  initialText={essay}
  questionPrompt={prompt}
  onAnalysisComplete={handleAnalysis}
/>
```

---

## 🔧 Configuration

### Environment Variables (Backend)

```env
# AI Service (OpenAI, Azure OpenAI, or custom)
AI_SERVICE_PROVIDER=openai
AI_API_KEY=your-api-key
AI_MODEL=gpt-4

# Quiz Generation Settings
AI_MAX_QUESTIONS_PER_REQUEST=50
AI_TIMEOUT_SECONDS=60

# Essay Analysis Settings
AI_ESSAY_MAX_LENGTH=5000
AI_ENABLE_GRAMMAR_CHECK=true
```

---

## 📝 Implementation Checklist

### Backend Tasks

- [ ] Implement `/api/ai/generate-quiz` endpoint
- [ ] Integrate với AI service (OpenAI/Azure OpenAI)
- [ ] Implement quiz CRUD endpoints
- [ ] Implement quiz attempt tracking
- [ ] Auto-grade multiple choice/true-false
- [ ] Implement essay analysis endpoint
- [ ] Calculate and store analytics
- [ ] Add caching for expensive AI calls

### Frontend Tasks (Already Done ✅)

- [x] Create AI types and interfaces
- [x] Create aiService with API calls
- [x] Build AIQuizGenerator component
- [x] Build Quiz taking interface
- [x] Build EssayAnalyzer component
- [x] Build Analytics Dashboard
- [x] Integrate with Teacher page
- [x] Add navigation and routing

---

## 🎯 Next Steps

### Phase 1: Core Features (Current)

- ✅ Quiz generation
- ✅ Essay analysis
- ✅ Analytics dashboard

### Phase 2: Enhancements

- [ ] Bulk quiz generation for multiple lessons
- [ ] Quiz question bank/templates
- [ ] Peer review with AI assistance
- [ ] Personalized learning recommendations
- [ ] Study guides generation

### Phase 3: Advanced AI

- [ ] Adaptive learning paths
- [ ] Predictive analytics
- [ ] Auto-detect struggling students
- [ ] Content recommendations
- [ ] Voice-to-text for essays

---

## 🐛 Troubleshooting

### Quiz không generate được

**Kiểm tra:**

1. Lesson có document/video chưa?
2. Backend đã implement `/api/ai/generate-quiz`?
3. API key AI service còn hạn không?
4. Check console logs

### Essay analysis không hoạt động

**Kiểm tra:**

1. Text length có quá dài (> 5000 chars)?
2. Backend AI service có online không?
3. Network connectivity

### Analytics không hiển thị

**Kiểm tra:**

1. Quiz đã có student attempts chưa?
2. Backend có return đúng format không?
3. Check browser console

---

## 💡 Best Practices

### For Teachers

1. **Review AI-generated quizzes** before publishing
2. **Add explanations** to questions for better learning
3. **Monitor analytics** to identify challenging topics
4. **Use AI analysis as a guide**, not replacement for human judgment

### For Students

1. **Take quizzes seriously** - they help AI understand your level
2. **Use Essay Analyzer for practice**, not just for graded work
3. **Read AI feedback carefully** and apply suggestions

---

## 📚 Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Educational AI Best Practices](https://www.edweek.org/technology/ai-in-education)

---

## 🤝 Contributing

Khi thêm AI features mới:

1. Update types trong `src/model/ai/aiTypes.ts`
2. Add service methods trong `src/services/aiService.ts`
3. Create UI components trong `src/components/ai/` hoặc `src/app/teacher/components/`
4. Update documentation
5. Add tests

---

## 📞 Support

Nếu cần hỗ trợ:

1. Check documentation này
2. Check console logs (F12)
3. Verify backend API responses
4. Check AI service status



