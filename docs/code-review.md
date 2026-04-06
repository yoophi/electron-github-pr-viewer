# 코드 리뷰 및 개선 사항

> 최초 분석일: 2026-04-06
> 최종 업데이트: 2026-04-06

## 해결 완료

| # | 내용 | 상태 |
|---|---|---|
| 2 | console.log로 access token 포함 설정 전체 출력 | 해결 |
| 3 | staleTime/gcTime 1초 → 기본값 유지 (entity 훅에서 개별 설정) | 부분 해결 |
| 4 | 하드코딩된 조직명/날짜 → 설정으로 분리, 날짜 동적 변경 | 해결 |
| 5 | 차트 색상 Math.random() → 문자열 해시 기반 고정 색상 | 해결 |
| 6 | pull-requests-all 418줄 → 180줄, features로 분리 | 해결 |
| - | useSettingStore dead code 30줄 제거 | 해결 |
| - | members-all.tsx 미사용 console.log 제거 | 해결 |
| - | 설정 로딩 4곳 중복 → useSettingStore.init() 단일 소스 통합 | 해결 |
| - | PR 데이터 any 타입 → PullRequest 타입 정의 | 해결 |
| - | 부분 실패 시 조용히 누락 → UI에 loading/error 카운트 표시 | 해결 |
| - | FileSettingsRepository 에러 삼킴 → ENOENT만 기본값, 나머지 전파 | 해결 |
| - | SaveSettings members 덮어씀 → load-and-merge 패턴 | 해결 |
| - | IPCResponse가 domain에 위치 → driving adapter로 이동 | 해결 |
| - | aggregateContributors spread-in-reduce O(n*k) → mutation O(n) | 해결 |
| - | pull-requests-all 집계에 useMemo 미적용 → 전체 적용 | 해결 |

## 미해결 (남은 개선 사항)

### 보안

| 심각도 | 내용 |
|---|---|
| **심각** | access token이 `~/gh-pr-viewer.json`에 **평문 저장** — Electron safeStorage API 적용 필요 |
| **심각** | `sandbox: false` (main/index.ts BrowserWindow) — 보안 샌드박스 비활성화 |

### 성능

| 내용 |
|---|
| `query-client-provider.tsx`의 기본 `staleTime: 1000`, `gcTime: 1000` — 상향 조정 권장 (10분/1시간) |
| 53개 레포에 대해 동시 API 호출 — rate limit 위험, 동시성 제한 필요 |
| `repositories-list.tsx`의 `useReducer` 수동 리렌더 버튼 — 제거 필요 |

### 타입

| 내용 |
|---|
| `repositories-list.tsx`의 `createColumnHelper<any>()` — 레포 데이터 타입 미정의 |
| `OctokitGitHubRepository`의 `any[]` 반환 타입 — 도메인 타입 정의 필요 |
| IPC 채널명이 문자열 리터럴 — 공유 상수로 관리 권장 |
