# GitHub PR Viewer

GitHub 조직의 Pull Request를 시각적으로 관리하고 분석하는 Electron 기반 데스크톱 애플리케이션입니다.

## 주요 기능

- **PR 시각화**: 날짜별 히트맵과 차트를 통한 PR 활동 분석
- **다중 리포지토리 조회**: 조직 내 여러 리포지토리의 PR을 한번에 수집
- **팀 멤버 관리**: GitHub 사용자 ID와 팀 멤버 매핑 및 그룹 분류
- **필터링**: 사용자별, 리포지토리별, 상태별 PR 필터링
- **설정 관리**: GitHub 토큰, 조직명, 리포지토리 목록 설정

## 기술 스택

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Desktop**: Electron 31
- **상태 관리**: Zustand + TanStack React Query
- **UI 라이브러리**: Radix UI + Recharts + Cal-heatmap
- **빌드 도구**: Electron Vite
- **API**: GitHub REST API (Octokit)

## 아키텍처

### 설계 원칙

이 프로젝트는 Main 프로세스와 Renderer 프로세스에 **서로 다른 아키텍처**를 적용합니다. 각 영역의 특성에 맞는 아키텍처를 선택한 이유와 적용 방식을 설명합니다.

### Main 프로세스 — Hexagonal Architecture

**선택 이유**: Main 프로세스는 GitHub API(Octokit)와 파일시스템(fs) 등 **실제 인프라와 직접 통신**합니다. 이 영역에서는:

- GitHub API 클라이언트를 다른 구현체로 교체할 가능성이 있음 (예: GraphQL API)
- 설정 저장소를 파일 → DB 또는 Electron safeStorage로 변경할 수 있음
- 비즈니스 로직(날짜 필터링 등)을 인프라 없이 단위 테스트해야 함

Port/Adapter 패턴으로 인프라를 추상화하면 이런 교체와 테스트가 자연스럽습니다.

```
src/main/
├── index.ts                              # Composition Root (의존성 조립)
├── domain/
│   └── types.ts                          # SettingData, IPCResponse 등
├── application/
│   ├── ports/
│   │   ├── settings-port.ts              # interface SettingsPort
│   │   └── github-port.ts               # interface GitHubPort
│   └── use-cases/
│       ├── get-settings.ts               # 설정 조회
│       ├── save-settings.ts              # 설정 저장
│       ├── get-repositories.ts           # 레포 목록 조회
│       └── get-pull-requests.ts          # PR 목록 조회 + 날짜 필터
└── adapters/
    ├── driving/
    │   └── ipc-handler.ts                # IPC → UseCase 연결
    └── driven/
        ├── file-settings-repository.ts   # SettingsPort 구현 (fs)
        └── github-repository.ts          # GitHubPort 구현 (Octokit)
```

**의존성 방향**: `IPC Handler → Use Case → Port ← Adapter`

- Use Case는 Port 인터페이스만 알고, 구체적인 Octokit이나 fs를 모름
- index.ts(Composition Root)에서 Adapter를 생성하여 Use Case에 주입

### Renderer 프로세스 — Feature-Sliced Design (FSD)

**선택 이유**: Renderer는 **데이터를 받아서 보여주는 UI 영역**입니다. 이 영역에서는:

- 인프라 교체가 거의 없음 (항상 `window.api` IPC만 사용, 실제 API는 Main이 담당)
- 관심사는 "어떤 데이터를 어떻게 조합하여 보여줄 것인가"
- React의 선언적 패턴(hooks, components)과 자연스럽게 맞는 구조가 필요

Hexagonal이나 DDD를 추가로 적용하는 것은 과도합니다. 대신 FSD의 레이어/슬라이스 규칙으로 관심사를 분리하고, **Hexagonal의 핵심 아이디어 하나만 차용**합니다:

> `window.api` 호출을 `entities/*/api/` 훅에 캡슐화하여 페이지에서 IPC를 직접 호출하지 않는 것

```
src/renderer/src/
├── app/                          # 앱 설정 (라우터, 프로바이더)
│   ├── router/index.tsx
│   └── providers/query-client-provider.tsx
│
├── pages/                        # 페이지 조합 (feature + entity 위젯 조합)
│   ├── pull-requests/            # PR 조회 및 시각화
│   ├── repositories/             # 레포 목록
│   ├── members/                  # 팀 멤버
│   ├── settings/                 # 설정
│   └── root/                     # 레이아웃
│
├── features/                     # 비즈니스 기능 단위
│   ├── pr-analysis/              # PR 집계, 차트, 필터
│   │   ├── lib/aggregate-prs.ts  #   집계/변환 유틸리티
│   │   └── ui/                   #   차트, 필터 컴포넌트
│   ├── repo-discovery/           # 레포 토픽 파싱/필터
│   │   ├── lib/parse-topics.ts
│   │   └── ui/topic-filter.tsx
│   └── settings-form/            # 설정 폼 + Zod 검증
│       ├── model/schema.ts
│       └── ui/settings-form.tsx
│
├── entities/                     # 도메인 엔티티 (API 훅 + 모델)
│   ├── settings/                 # 설정 (Zustand store)
│   ├── pull-request/             # PR (useQueries 훅)
│   └── repository/               # 레포 (useQuery 훅 + 테이블)
│
├── widgets/                      # 복합 위젯
│   └── navigation/
│
└── shared/                       # 공유 UI, 훅, 유틸리티
    ├── ui/                       # Radix UI 컴포넌트, 히트맵, 차트
    ├── hooks/                    # use-toast 등
    ├── lib/                      # cn() 유틸리티
    └── model/                    # IPCResponse 타입
```

**FSD 레이어 규칙**:
```
app → pages → features → entities → shared
```
- 상위 레이어만 하위 레이어를 import할 수 있음
- 같은 레이어 내 cross-slice import 금지
- `window.api`는 `entities/*/api/` 에서만 호출

### 왜 FSD + DDD 또는 FSD + Hexagonal을 Renderer에 적용하지 않았는가

| 기준 | FSD 단독 | FSD + DDD | FSD + Hexagonal |
|---|---|---|---|
| 이 프로젝트 적합도 | 높음 | 낮음 | 보통 |
| 보일러플레이트 | 적음 | 많음 | 중간 |
| React 호환성 | 자연스러움 | 어색함 | 약간 어색 |

- **DDD**: 읽기 전용 대시보드에 Aggregate Root, Value Object는 과도. 쓰기 중심 도메인에 적합
- **Hexagonal**: Renderer에서 어댑터를 교체할 일이 없음 (항상 IPC). Main이 이미 인프라를 추상화

## IPC 통신 구조

```
React Component → window.api (Preload) → IPC → Main (Use Case → Port → Adapter) → GitHub API / FS
```

## 시작하기

### 필수 요구사항

- Node.js (v18 이상)
- GitHub Personal Access Token

### 설치 및 실행

```bash
npm install
npm run dev
```

### 빌드

```bash
npm run build          # TypeScript 타입 체크 + 빌드
npm run build:mac      # macOS
npm run build:win      # Windows
npm run build:linux    # Linux
```

## 설정

### GitHub 액세스 토큰

1. [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)에서 토큰 생성
2. 필요 권한: `repo` (private 레포 접근), `read:org` (조직 레포 목록)
3. 앱 Settings 페이지에서 토큰, 조직명, 레포지토리 목록 입력

### 데이터 범위

- **기간**: 현재 시점 기준 최근 1년
- **조직**: Settings에서 설정 (기본값: `payhereinc`)
- **페이지네이션**: 100개씩 자동 수집
