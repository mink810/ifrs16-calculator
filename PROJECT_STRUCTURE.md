# IFRS 16 Calculator — 프로젝트 구조

Aurel 브랜드의 IFRS 16 리스 회계 계산기 웹 앱입니다. Next.js App Router 기반이며, 도메인 로직·UI·상태·다국어를 폴더별로 분리합니다.

## 기술 스택

| 구분           | 기술                                                             |
| ------------- | ---------------------------------------------------------------- |
| 프레임워크     | Next.js 16 (App Router)                                          |
| UI            | React 19                                                         |
| 언어          | TypeScript 5                                                     |
| 스타일        | Tailwind CSS v4, `app/aurel.css` (커스텀 디자인 토큰·컴포넌트) |
| 상태          | Zustand (`stores/`)                                              |
| 테이블 (예정)  | `@tanstack/react-table` (의존성만 추가, 아직 미사용)            |
| i18n          | JSON 메시지 + `LocaleProvider` (외부 i18n 라이브러리 없음)       |

경로 별칭: `@/*` → 프로젝트 루트 (`tsconfig.json`)

---

## 디렉터리 트리

```
ifrs16-calculator/
├── app/                    # Next.js 라우트·레이아웃·전역 스타일
├── components/             # React UI 컴포넌트
├── lib/                    # 프레임워크 비의존 비즈니스·유틸 로직
├── stores/                 # Zustand 전역 상태
├── messages/               # 다국어 JSON (ko, en)
├── public/                 # 정적 에셋
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

---

## `app/` — 라우팅·레이아웃

| 파일 | 역할 |
|------|------|
| `layout.tsx` | 루트 HTML, `AppProviders` 래핑, `globals.css` + `aurel.css` 로드 |
| `page.tsx` | `/` — 랜딩 페이지 (`LandingPage`) |
| `ifrs16/page.tsx` | `/ifrs16` — IFRS 16 포트폴리오 UI (`Ifrs16Portfolio`) |
| `globals.css` | Tailwind v4 진입 (`@import "tailwindcss"`) |
| `aurel.css` | Aurel 디자인 시스템 (레이아웃, 계산기, 랜딩 스타일) |

**라우트 요약**

| URL | 페이지 컴포넌트 |
|-----|-----------------|
| `/` | `components/landing/LandingPage` |
| `/ifrs16` | `components/calculator/Ifrs16Portfolio` |

---

## `components/` — UI

### `components/providers/`

| 파일 | 역할 |
|------|------|
| `AppProviders.tsx` | 클라이언트 프로바이더 루트. 현재 `LocaleProvider`만 등록 |

### `components/i18n/`

| 파일 | 역할 |
|------|------|
| `LocaleProvider.tsx` | locale 상태, `localStorage` 영속화, `t(path)` 번역 함수 제공 |

### `components/landing/`

랜딩·공통 크롬(네비, 푸터)용 컴포넌트.

| 파일 | 역할 |
|------|------|
| `LandingPage.tsx` | Hero + FeatureGrid + Footer 조합 |
| `Hero.tsx` | 메인 히어로 섹션 |
| `FeatureGrid.tsx` | 기능 소개 그리드 |
| `TopNav.tsx` | 상단 네비게이션, IFRS 16 링크 |
| `Footer.tsx` | 푸터 |
| `LangToggle.tsx` | ko / en 전환 |

### `components/calculator/`

IFRS 16 계산·표시 UI.

| 파일 | 역할 |
|------|------|
| `Ifrs16Portfolio.tsx` | **현재 `/ifrs16`에서 사용**. 입력 폼, 탭(요약·자산1·자산2), `useLeaseStore` 연동 스케줄 표 |
| `Ifrs16Calculator.tsx` | 초기 프로토타입 UI (하드코딩 샘플 데이터). 라우트에 연결되지 않음 |

---

## `lib/` — 도메인·유틸

### `lib/ifrs16/` — IFRS 16 계산 코어

프레임워크·React에 의존하지 않는 순수 TypeScript.

| 파일 | 역할 |
|------|------|
| `types.ts` | `LeaseInputs`, `LeaseScheduleRow` 등 타입 정의 |
| `calculate-schedule.ts` | 리스 입력 → 기간별·분기 소계 스케줄 계산 |
| `format.ts` | 금액 표시 (`formatAmount`) |

### `lib/i18n/` — 다국어 헬퍼

| 파일 | 역할 |
|------|------|
| `types.ts` | `Locale`, `Messages` 타입 (`en.json` 기준) |
| `messages.ts` | `ko` / `en` JSON import 및 `messagesByLocale` 맵 |
| `get-message.ts` | `"calculator.title"` 형태의 dot path로 문자열 조회 |

---

## `stores/` — 클라이언트 상태

| 파일 | 역할 |
|------|------|
| `use-lease-store.ts` | 리스 입력값(`LeaseInputs`) + `setInput` 시 `calculateSchedule` 재실행하여 `schedule` 동기화 |

**데이터 흐름 (계산기)**

```
사용자 입력 (Ifrs16Portfolio)
    → useLeaseStore.setInput
    → calculateSchedule (lib/ifrs16)
    → schedule 상태 갱신
    → UI 테이블 렌더
```

---

## `messages/` — 번역 리소스

| 파일 | 역할 |
|------|------|
| `ko.json` | 한국어 문자열 |
| `en.json` | 영어 문자열 |

네임스페이스 예: `nav`, `hero`, `features`, `calculator`, `footer` 등. 컴포넌트에서는 `t("calculator.title")`처럼 dot path로 접근합니다.

---

## `public/` — 정적 파일

SVG 등 정적 에셋. Next.js가 `/` 경로로 그대로 서빙합니다.

---

## 설정·메타 파일

| 파일 | 역할 |
|------|------|
| `next.config.ts` | Next.js 설정 |
| `postcss.config.mjs` | Tailwind v4 PostCSS 플러그인 |
| `eslint.config.mjs` | ESLint (eslint-config-next) |
| `AGENTS.md` / `CLAUDE.md` | 에이전트용 Next.js 16 가이드 참조 |

---

## 의존성 방향 (권장)

```
app/          → components/, (메타데이터만)
components/   → stores/, lib/, components/ (동일 레이어)
stores/       → lib/ifrs16/
lib/i18n/     → messages/ (JSON import)
lib/ifrs16/   → (외부 의존 없음)
```

- **도메인 계산**은 `lib/ifrs16`에만 두고, UI·상태는 그 결과를 소비합니다.
- **번역 문자열**은 `messages/*.json`에만 추가하고, 타입은 `lib/i18n/types.ts`와 맞춥니다.
- **새 페이지**는 `app/<route>/page.tsx`에 두고, 실제 UI는 `components/`에서 import합니다.

---

## 스크립트

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 빌드 결과 실행
npm run lint     # ESLint
```
