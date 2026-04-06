# Handoff Notes

## 현재 작업 상태

### 완료된 작업

1. **Main 프로세스 Hexagonal Architecture 리팩토링** (커밋 `065630c`)
   - domain/types, application/ports, application/use-cases, adapters 분리 완료
   - index.ts는 Composition Root로 정리됨

2. **Renderer FSD 리팩토링** (커밋 `b85cf0a` ~ `e17aed3`)
   - entities 정비: pull-request, repository entity에 API 훅 캡슐화
   - features 레이어 추가: settings-form, pr-analysis, repo-discovery
   - pages 슬림화: 비즈니스 로직을 features로 위임
   - dead code 제거 및 타입 정리

3. **코드 품질 개선** (커밋 `4734b79` ~ `018ae7d`)
   - console.log 민감정보 노출 제거
   - 하드코딩된 조직명/날짜를 설정으로 분리
   - 차트 색상 랜덤 생성 → 문자열 해시 기반 고정

4. **아키텍처 문서화** (커밋 `5fb4177`)
   - README에 Main(Hexagonal) / Renderer(FSD) 아키텍처 결정 이유 기록

## 유의사항

### 아키텍처 규칙
- **Main**: 새로운 IPC 핸들러 추가 시 반드시 Use Case → Port → Adapter 패턴 따를 것
- **Renderer**: `window.api`는 `entities/*/api/` 에서만 호출. 페이지/피처에서 직접 호출 금지
- **FSD 레이어 규칙**: `app → pages → features → entities → shared` (하향만 import 가능)

### 알려진 이슈
- `pages/settings/index.tsx`에서 여전히 `window.api.getSettings()`를 직접 호출 중 (초기 로딩용). entity의 `useSettingStore.init()`과 중복 — 통합 필요
- `pages/members/` 페이지는 미완성 (데이터만 로드하고 의미있는 UI 없음)
- `staleTime: 1000`, `gcTime: 1000` (query-client-provider.tsx) — 캐시 효과 거의 없음, 상향 조정 필요
- `sandbox: false` (main/index.ts BrowserWindow) — 보안 개선 필요
- access token이 `~/gh-pr-viewer.json`에 평문 저장 — Electron safeStorage API 적용 필요

### 미적용 코드 리뷰 항목 (docs/code-review.md 참조)
- 1번: access token 평문 저장 → safeStorage
- 3번: staleTime/gcTime 상향 조정
- 6번: pull-requests-all 내 PR 목록 탭을 별도 컴포넌트로 분리 가능
- 7번: API 동시 호출 제한 (53개 레포 동시 요청 → rate limit 위험)

## 이후 계획

### 단기
1. `staleTime`/`gcTime` 적절한 값으로 조정 (10분/1시간 권장)
2. Settings 페이지의 `window.api.getSettings()` 직접 호출을 entity 훅으로 통합
3. Members 페이지 완성 (멤버별 PR 기여도 시각화)

### 중기
4. Electron safeStorage로 access token 암호화
5. GitHub API 동시 요청 수 제한 (p-limit 또는 배치 처리)
6. PR 목록 탭을 features/pr-analysis/ui/pr-list.tsx로 분리

### 장기
7. sandbox: true 활성화 및 보안 모델 재설계
8. GitHub GraphQL API 지원 (Octokit adapter 교체로 가능)
9. 오프라인 캐시 (IndexedDB 또는 SQLite)
