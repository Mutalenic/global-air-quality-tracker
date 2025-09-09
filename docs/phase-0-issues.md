# Phase 0 GitHub Issues - Zambia Environmental Intelligence Platform

This document outlines the GitHub issues to be created for Phase 0 of the platform evolution.

## Issue Template Variables

All issues should use the `phase-0-task.md` template with the following structure:

```markdown
---
name: Phase 0 Task
about: Foundation & Zambia Focus tasks for Phase 0
title: "[PHASE-0] Issue Title"
labels: ["phase-0", "foundation", "priority-level"]
assignees: []
---
```

## Phase 0 Issues List

### 1. Migrate to Redux Toolkit + RTK Query
**Title**: `[PHASE-0] Migrate to Redux Toolkit + RTK Query`  
**Priority**: High  
**Estimate**: 2 weeks  
**Labels**: `phase-0`, `refactor`, `redux`

**Description**: Replace legacy Redux/thunks with RTK; refactor state management; use RTK Query for OpenWeather/OpenAQ APIs.

**Acceptance Criteria**:
- [ ] Remove redux, redux-thunk, redux-devtools-extension dependencies
- [ ] Install @reduxjs/toolkit
- [ ] Migrate existing actions/reducers to RTK slices
- [ ] Implement RTK Query for API calls
- [ ] Update all components to use new hooks
- [ ] Maintain backward compatibility during migration
- [ ] All tests pass with new implementation

---

### 2. Secure API Keys with Fastify Proxy
**Title**: `[PHASE-0] Secure API Keys with Fastify Proxy`  
**Priority**: High  
**Estimate**: 1 week  
**Labels**: `phase-0`, `security`, `backend`

**Description**: Move API keys to .env; deploy Fastify proxy on Render; proxy OpenWeather/OpenAQ calls.

**Acceptance Criteria**:
- [ ] Create .env and .env.example files
- [ ] Remove hardcoded API keys from source code
- [ ] Set up Fastify server with proxy endpoints
- [ ] Deploy proxy to Render/Railway
- [ ] Update frontend to use proxy endpoints
- [ ] Test API security and rate limiting
- [ ] Document proxy setup and deployment

---

### 3. Enable TypeScript Strict Mode
**Title**: `[PHASE-0] Enable TypeScript Strict Mode`  
**Priority**: Medium  
**Estimate**: 1 week  
**Labels**: `phase-0`, `typescript`, `refactor`

**Description**: Convert to TypeScript; enforce strict mode with ESLint; set up feature-sliced architecture.

**Acceptance Criteria**:
- [ ] Create tsconfig.json with strict: true
- [ ] Convert main App components to TypeScript
- [ ] Set up feature-sliced folder structure
- [ ] Create type definitions for API responses
- [ ] Update ESLint config for TypeScript
- [ ] Ensure 100% type coverage for new code
- [ ] Document TypeScript guidelines

**Folder Structure**:
```
src/
├── features/
│   ├── aqi/
│   │   ├── components/
│   │   ├── api/
│   │   └── types/
│   ├── farms/
│   │   ├── components/
│   │   ├── api/
│   │   └── types/
│   ├── maps/
│   │   ├── components/
│   │   ├── api/
│   │   └── types/
│   └── shared/
│       ├── ui/
│       ├── api/
│       └── config/
└── store/
```

---

### 4. Add Leaflet Zambia Map
**Title**: `[PHASE-0] Add Leaflet Zambia Map`  
**Priority**: High  
**Estimate**: 2 weeks  
**Labels**: `phase-0`, `maps`, `zambia-local`

**Description**: Integrate Leaflet with OSM basemap; add ZEMA ward shapes; implement AQI heatmap layer.

**Acceptance Criteria**:
- [ ] Install react-leaflet and leaflet dependencies
- [ ] Create ZambiaMap component with Lusaka center
- [ ] Add OpenStreetMap tile layer
- [ ] Implement AQI monitoring points for major cities
- [ ] Add interactive popups with pollution data
- [ ] Style markers based on AQI levels
- [ ] Ensure mobile responsiveness
- [ ] Add loading states and error handling

**Default Monitoring Locations**:
- Lusaka: [-15.4167, 28.2833]
- Ndola: [-12.9587, 28.6366] 
- Kitwe: [-12.8024, 28.2132]
- Livingstone: [-17.8419, 25.8561]

---

### 5. Set Up i18n (English/Bemba)
**Title**: `[PHASE-0] Set Up i18n (English/Bemba)`  
**Priority**: Medium  
**Estimate**: 1 week  
**Labels**: `phase-0`, `i18n`, `accessibility`

**Description**: Implement react-i18next; externalize strings; add Web Speech API for Bemba audio.

**Acceptance Criteria**:
- [ ] Install react-i18next and i18next
- [ ] Create translation files for English and Bemba
- [ ] Implement language switcher component
- [ ] Externalize all user-facing strings
- [ ] Add Web Speech API for audio translations
- [ ] Test language switching functionality
- [ ] Ensure RTL support for future languages

**Key Translations**:
```json
{
  "en": {
    "aqi.title": "Air Quality",
    "nav.home": "Home",
    "common.loading": "Loading..."
  },
  "bem": {
    "aqi.title": "Umwela wa Mpepo", 
    "nav.home": "Ng'anda",
    "common.loading": "Tulelengela..."
  }
}
```

---

### 6. Bootstrap Workbox PWA
**Title**: `[PHASE-0] Bootstrap Workbox PWA`  
**Priority**: High  
**Estimate**: 1.5 weeks  
**Labels**: `phase-0`, `pwa`, `offline`

**Description**: Set up Workbox cache-first strategy; implement Dexie.js for IndexedDB; configure VAPID push notifications.

**Acceptance Criteria**:
- [ ] Install workbox-webpack-plugin
- [ ] Configure service worker with cache-first strategy
- [ ] Set up Dexie.js database schema
- [ ] Implement offline data caching (24h forecasts)
- [ ] Add background sync for failed requests
- [ ] Configure push notification service
- [ ] Test offline functionality on 2G simulation
- [ ] Update manifest.json for Zambia branding

**Cache Strategy**:
- API responses: 24 hours
- Map tiles: 7 days
- Static assets: 30 days
- User data: Indefinite (IndexedDB)

---

### 7. Add Testing Suite
**Title**: `[PHASE-0] Add Testing Suite`  
**Priority**: Medium  
**Estimate**: 1 week  
**Labels**: `phase-0`, `testing`, `quality`

**Description**: Set up MSW for API mocks; implement E2E testing framework; conduct WCAG 2.1 audit.

**Acceptance Criteria**:
- [ ] Set up MSW (Mock Service Worker)
- [ ] Create API mocks for all endpoints
- [ ] Write unit tests for components
- [ ] Implement integration tests for RTK Query
- [ ] Set up automated accessibility testing
- [ ] Achieve 95% test coverage
- [ ] Document testing guidelines
- [ ] Set up CI/CD test pipeline

**Test Coverage Targets**:
- Unit tests: 95%
- API integration: 100%
- Accessibility: WCAG 2.1 AA (90%+)
- Performance: 2G <2.5s load time

---

### 8. Secure ZMD API MoU
**Title**: `[PHASE-0] Secure ZMD API MoU`  
**Priority**: High  
**Estimate**: 1 week  
**Labels**: `phase-0`, `partnerships`, `zambia-local`

**Description**: Draft MOU with Zambia Meteorological Department; set up mock webhook for weather data integration.

**Acceptance Criteria**:
- [ ] Research ZMD API capabilities and data formats
- [ ] Draft MOU template for data access
- [ ] Create mock ZMD webhook endpoint
- [ ] Implement weather data parsing
- [ ] Set up authentication for ZMD API
- [ ] Test data integration and validation
- [ ] Document API integration process
- [ ] Plan fallback to OpenWeather if needed

**Mock Data Sources**:
- Weather forecasts (temperature, precipitation, humidity)
- Historical climate data
- Severe weather alerts
- Agricultural weather indices

---

## Issue Creation Script

To create these issues programmatically, use the GitHub CLI:

```bash
# Install GitHub CLI if not available
# gh auth login

# Create each issue
gh issue create --title "[PHASE-0] Migrate to Redux Toolkit + RTK Query" \
  --body-file issue-templates/redux-migration.md \
  --label "phase-0,refactor,priority-high" \
  --assignee "@me"

gh issue create --title "[PHASE-0] Secure API Keys with Fastify Proxy" \
  --body-file issue-templates/api-security.md \
  --label "phase-0,security,priority-high" \
  --assignee "@me"

# Continue for all 8 issues...
```

## Project Board Setup

Create a GitHub Project board with columns:
- **Backlog**: All Phase 0 issues
- **To Do**: Ready for development
- **In Progress**: Currently being worked on
- **Review**: Awaiting code review
- **Testing**: In QA/testing phase
- **Done**: Completed and merged

## Milestones

Create milestone: **Phase 0: Foundation** with due date 8 weeks from start.

All 8 issues should be assigned to this milestone for tracking progress.

## Labels

Standard labels to create:
- `phase-0` - Phase 0 specific tasks
- `phase-1` - Future Phase 1 tasks  
- `refactor` - Code refactoring work
- `security` - Security-related tasks
- `pwa` - Progressive Web App features
- `maps` - Mapping functionality
- `i18n` - Internationalization
- `testing` - Test-related work
- `zambia-local` - Zambia-specific features
- `priority-high` - High priority items
- `priority-medium` - Medium priority items
- `priority-low` - Low priority items