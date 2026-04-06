# Handoff Notes

> 최종 업데이트: 2026-04-06

## 현재 작업 상태

### 완료된 작업

1. **Main 프로세스 Hexagonal Architecture**
   - domain/types, application/ports, application/use-cases, adapters 분리
   - index.ts는 Composition Root (의존성 조립만 담당)
   - Codex 리뷰 반영: 에러 전파, atomic write, load-and-merge, IPCResponse 레이어 분리

2. **Renderer FSD 리팩토링**
   - entities 정비: pull-request (PullRequest 타입 + usePullRequests 훅), repository (useRepositories 훅), settings (useSettingStore 단일 소스)
   - features 레이어: settings-form, pr-analysis, repo-discovery
   - pages 슬림화: 비즈니스 로직을 features로 위임
   - Codex 리뷰 반영: 설정 로딩 단일 소스 통합, PullRequest 타입 도입, 부분 실패 UI 노출

3. **코드 품질 개선**
   - console.log 민감정보 노출 제거
   - 하드코딩된 조직명/날짜를 설정으로 분리
   - 차트 색상 고정, useMemo 적용, O(n*k) → O(n) 최적화
   - IPC handler 보일러플레이트 → handleWith 헬퍼
   - cal-heatmap dead code 제거

4. **아키텍처 문서화**
   - README에 Main(Hexagonal) / Renderer(FSD) 아키텍처 결정 이유 기록

## 유의사항

### 아키텍처 규칙
- **Main**: 새로운 IPC 핸들러 추가 시 반드시 Use Case → Port → Adapter 패턴 따를 것. IPCResponse 변환은 driving adapter에서만
- **Renderer**: `window.api`는 `entities/*/api/` 에서만 호출. 페이지/피처에서 직접 호출 금지
- **FSD 레이어 규칙**: `app → pages → features → entities → shared` (하향만 import 가능)
- **설정 로딩**: `useSettingStore.init()` (App.tsx)이 유일한 진입점. 페이지에서 `window.api.getSettings()` 직접 호출 금지

### 남은 이슈
- `pages/members/` 페이지는 미완성 (데이터만 표시, 의미있는 분석 UI 없음)
- `staleTime: 1000`, `gcTime: 1000` (query-client-provider.tsx) — 상향 조정 필요
- `sandbox: false` (main/index.ts BrowserWindow) — 보안 개선 필요
- access token이 `~/gh-pr-viewer.json`에 평문 저장 — Electron safeStorage API 적용 필요
- API 동시 호출 제한 없음 (53개 레포 동시 요청 → rate limit 위험)
- `repositories-list.tsx`에 수동 Rerender 버튼 잔존

## 이후 계획

### 단기
1. `staleTime`/`gcTime` 적절한 값으로 조정 (10분/1시간 권장)
2. Members 페이지 완성 (멤버별 PR 기여도 시각화)
3. `repositories-list.tsx` Rerender 버튼 제거

### 중기
4. Electron safeStorage로 access token 암호화
5. GitHub API 동시 요청 수 제한 (p-limit 또는 배치 처리)
6. IPC 채널명을 공유 상수로 관리
7. Main의 GitHubPort `any[]` → 도메인 타입으로 교체

### 장기
8. sandbox: true 활성화 및 보안 모델 재설계
9. GitHub GraphQL API 지원 (Octokit adapter 교체로 가능)
10. 오프라인 캐시 (IndexedDB 또는 SQLite)
