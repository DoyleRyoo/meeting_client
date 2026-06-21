# damlok_frontend

### 기술 스택

- React
- vite
- Tailwindcss@3
- Axios
- Zustand
- React Router Dom
- Docker
- Oauth
- Flutter (가능할 시)

### 📁 구조

**_도커로 기본 세팅 필요_**

```text
frontend/
├─ public/
│
├─ src/
│
├─ eslint.config.ts
├─ tsconfig.json
└─ .env

src/
├─ api/                 # API 호출
│  ├─ authApi.ts
│  ├─ projectApi.ts
│  ├─ participantApi.ts
│  ├─ aiApi.ts
│  └─ axios.ts
│
├─ components/          # 재사용 컴포넌트
│  ├─ layout/
│  │  ├─ AppLayout.tsx
│  │  ├─ Sidebar.tsx
│  │  └─ UserProfile.tsx
│  │
│  ├─ common/
│  │  ├─ Button.tsx
│  │  ├─ Modal.tsx
│  │  ├─ Loading.tsx
│  │  └─ EmptyState.tsx
│  │
│  └─ meeting/
│     ├─ MeetingSummary.tsx
│     ├─ ActionItemList.tsx
│     └─ RecordingControl.tsx
│
├─ pages/
│  ├─ LoginPage.tsx
│  ├─ ProjectPage.tsx
│  ├─ ProjectDetailPage.tsx
│  ├─ MeetingCreatePage.tsx
│  └─ MeetingDetailPage.tsx
│
├─ routes/
│  └─ Router.tsx
│
├─ store/               # Context API
│  ├─ AuthContext.tsx
│  └─ ProjectContext.tsx
│
├─ hooks/
│  ├─ useAuth.ts
│  └─ useRecording.ts
│
├─ utils/
│  ├─ constants.ts
│  └─ formatters.ts
│
├─ App.tsx
└─ main.tsx
```
