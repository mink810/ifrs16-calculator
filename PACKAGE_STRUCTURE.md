# 패키지 구조

```
ifrs16-calculator/
├── app/
├── components/
│   ├── calculator/
│   ├── i18n/
│   ├── landing/
│   └── providers/
├── lib/
│   ├── ifrs16/
│   └── i18n/
├── messages/
├── public/
├── stores/
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

---

## `app/`

Next.js App Router 라우트·레이아웃·전역 스타일.

- `layout.tsx` — 루트 레이아웃, `AppProviders` 적용
- `page.tsx` — `/` 랜딩 페이지
- `ifrs16/page.tsx` — `/ifrs16` IFRS 16 포트폴리오 페이지
- `globals.css` — Tailwind 진입
- `aurel.css` — Aurel UI 스타일

---

## `components/`

React UI 컴포넌트.

### `components/calculator/`

IFRS 16 계산기 화면.

- `Ifrs16Portfolio.tsx` — 포트폴리오 메인. 탭(요약·자산별), 자산 추가/삭제, `usePortfolioStore` 연동
- `LeaseAssetPanel.tsx` — 단일 자산 입력 폼·상각 스케줄 표·계산·엑셀보내기

### `components/i18n/`

- `LocaleProvider.tsx` — locale 상태, `localStorage` 저장, `t(path)` 번역

### `components/landing/`

랜딩·공통 레이아웃.

- `LandingPage.tsx` — 랜딩 페이지 조합
- `Hero.tsx` — 히어로 섹션
- `FeatureGrid.tsx` — 기능 소개
- `TopNav.tsx` — 상단 네비게이션
- `Footer.tsx` — 푸터
- `LangToggle.tsx` — 언어 전환 (ko / en)

### `components/providers/`

- `AppProviders.tsx` — 클라이언트 프로바이더 (`LocaleProvider` 등)

---

## `lib/`

프레임워크에 묶이지 않는 비즈니스·유틸 로직.

### `lib/ifrs16/`

IFRS 16 계산·보내기.

- `types.ts` — `LeaseInputs`, `LeaseScheduleRow`, `LeaseAsset`, `PortfolioTabId` 등
- `calculate-schedule.ts` — 리스 입력 → 기간별·분기 소계 스케줄
- `calculate-rou-asset.ts` — 월납·기간·이자율로 ROU 자산(리스부채 PV) 계산
- `format.ts` — 금액 포맷 (`formatAmount`)
- `export-schedule-xlsx.ts` — 스케줄 엑셀(.xlsx) 다운로드

### `lib/i18n/`

다국어 헬퍼.

- `types.ts` — `Locale`, `Messages` 타입
- `messages.ts` — `ko` / `en` JSON 로드
- `get-message.ts` — dot path로 번역 문자열 조회

---

## `stores/`

Zustand 클라이언트 상태.

- `use-portfolio-store.ts` — 다중 리스 자산 목록, 활성 탭, 입력 변경·스케줄 재계산

---

## `messages/`

번역 JSON.

- `ko.json` — 한국어
- `en.json` — 영어

---

## `public/`

정적 파일 (SVG 등). URL `/` 기준으로 제공.

---

## 루트 설정 파일

- `next.config.ts` — Next.js 설정
- `postcss.config.mjs` — PostCSS (Tailwind)
- `tsconfig.json` — TypeScript, `@/*` 경로 별칭
- `package.json` — 의존성·npm 스크립트
