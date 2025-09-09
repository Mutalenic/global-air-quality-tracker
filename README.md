# Zambia Environmental Intelligence Platform

![](https://img.shields.io/badge/Microverse-blueviolet)

## 🌍 Vision

A hyper-local, inclusive, and offline-resilient platform empowering Zambia's 1.6M smallholder farmers, 1M+ eco-tourists, and stakeholders (ZMD, ZEMA, MinAg) with AI-driven environmental insights for climate resilience.

### Key Differentiators
- **Equity**: 80% usability on feature phones (USSD/SMS); 95% offline functionality for rural users
- **AI-Powered**: Edge ML for pest/planting predictions; resilience scores (AQI + heat + crop data)
- **Community Trust**: Blockchain-inspired DAO for crowdsourced data validation
- **Impact**: 25% climate risk reduction, aligned with Zambia's National Adaptation Plan (NAP)

![screenshoot](./src/images/countries.png) ![screenshoot2](./src/images/homepage.png)

## 🚀 Current Status: Phase 0 Complete

### ✅ Phase 0: Foundation & Zambia Focus (Complete)
- **Redux Toolkit Migration**: Migrated from legacy Redux to RTK + RTK Query
- **TypeScript Implementation**: Strict mode enabled with feature-sliced architecture
- **API Security**: Environment variables and secure proxy setup
- **Zambia Map Integration**: Leaflet map with Zambia basemap and AQI monitoring points
- **Internationalization**: English/Bemba support with react-i18next
- **PWA Foundation**: Basic service worker and manifest setup
- **Testing Infrastructure**: MSW mocks and testing framework
- **Offline Database**: Dexie.js setup for IndexedDB storage

### 🎯 Upcoming Phases
- **Phase 1**: Farmer MVP (Planting/irrigation advisories, USSD/SMS)
- **Phase 2**: Tourist MVP (Itinerary planning, safety indices)  
- **Phase 3**: Stakeholder & Community MVP (Dashboards, crowdsourced data)
- **Phase 4**: Scale & AI (Edge ML, carbon credits, full i18n)

## 🛠 Built With

### Frontend
- **React 18** with TypeScript (strict mode)
- **Redux Toolkit** + RTK Query for state management
- **React Router** for navigation
- **React Leaflet** for interactive maps
- **React i18next** for internationalization (English/Bemba/Nyanja/Tonga)
- **Workbox** for PWA functionality

### Backend & APIs
- **Fastify** proxy server (planned)
- **OpenWeather API** for weather and air quality data
- **RestCountries API** for country information
- **ZMD API** for Zambia Meteorological Department data (planned)
- **ZEMA API** for Zambia Environmental Management Agency data (planned)

### Database & Offline
- **Dexie.js** for IndexedDB offline storage
- **MSW (Mock Service Worker)** for API mocking in development

### Development Tools
- **ESLint** + **Stylelint** for code quality
- **MSW** for API mocking and testing
- **Git Flow** for version control

## 🌍 Zambia-Specific Features

### Air Quality Monitoring
- Real-time AQI data for major Zambian cities:
  - Lusaka (Capital)
  - Ndola (Industrial Hub)  
  - Kitwe (Mining District)
  - Livingstone (Tourism Center)

### Multi-Language Support
- **English**: Official language
- **Bemba**: Northern and Central provinces
- **Nyanja**: Eastern province (planned)
- **Tonga**: Southern province (planned)

### Offline-First Design
- Works on 2G/3G networks common in rural Zambia
- Cached weather forecasts and farm data
- Progressive Web App for feature phone compatibility

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mutalenic/global-air-quality-tracker.git
cd global-air-quality-tracker
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Start development server**
```bash
npm start
```

5. **Build for production**
```bash
npm run build
```

### Development Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Build for production
npm run build

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🗺 API Endpoints

### Current Endpoints
- `GET /api/countries?region=Africa` - Get countries by region
- `GET /api/pollution?lat=-15.4167&lon=28.2833` - Get air quality data

### Planned Endpoints (Phase 1+)
- `POST /api/farms` - Create farm profile
- `GET /api/advisories` - Get farming advisories
- `POST /api/ussd` - Handle USSD interactions
- `POST /api/sms` - Send SMS notifications

## 📱 PWA Features

### Offline Capabilities
- Cached air quality data (24 hours)
- Offline map tiles for Zambia
- Farm profile storage in IndexedDB
- Background sync for advisories

### Performance Targets
- **2G Networks**: <2.5s page load
- **3G Networks**: <1.5s page load
- **Offline Success**: 95% functionality
- **Accessibility**: WCAG 2.1 AA compliance (90%+)

## 🧪 Testing

### Test Coverage Targets
- **Unit Tests**: 95% coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user journeys
- **Accessibility**: WCAG 2.1 audit

### Test Commands
```bash
# Run all tests
npm test -- --watchAll=false

# Run with coverage
npm test -- --coverage --watchAll=false

# E2E tests (when Cypress is available)
npx cypress run
```

## 🌍 Deployment

### Recommended Platforms
- **Frontend**: Vercel, Netlify
- **Backend**: Render, Railway
- **Database**: Supabase (Zambia residency preferred)

### Environment Variables
```env
REACT_APP_OPENWEATHER_API_KEY=your_key_here
REACT_APP_ZMD_API_URL=https://api.zmd.gov.zm
REACT_APP_ZEMA_API_URL=https://api.zema.gov.zm
REACT_APP_DEFAULT_CENTER_LAT=-15.4167
REACT_APP_DEFAULT_CENTER_LNG=28.2833
```

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Follow feature-sliced architecture in `/src/features`
3. Write tests for all new features
4. Ensure TypeScript strict mode compliance
5. Submit PR with detailed description

### Code Style
- **TypeScript**: Strict mode required
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic formatting
- **Conventional Commits**: Required for commit messages

## 📋 Project Roadmap

### Q1 2026: Phase 0 ✅
- [x] Redux Toolkit migration
- [x] TypeScript strict mode
- [x] Zambia map integration
- [x] i18n foundation
- [x] PWA setup

### Q2 2026: Phase 1 (Farmer MVP)
- [ ] Farm profiles with GPS
- [ ] Planting/irrigation indices
- [ ] USSD/SMS integration
- [ ] 200 farmer pilot in Chipata

### Q3 2026: Phase 2 (Tourist MVP) 
- [ ] Itinerary planner
- [ ] Park safety indices
- [ ] Offline maps
- [ ] 100 tourist pilot in Livingstone

### Q3-Q4 2026: Phase 3 (Stakeholder MVP)
- [ ] ZEMA/MinAg dashboards
- [ ] Community data input
- [ ] Trust scoring system
- [ ] Copperbelt pilot

### Q4 2026-Q1 2027: Phase 4 (Scale & AI)
- [ ] Edge ML for pest prediction
- [ ] Carbon credit calculator
- [ ] Full Tonga translation
- [ ] 5,000 user scale

## 📊 KPIs & Success Metrics

### Platform KPIs
- **Error Rate**: <0.5%
- **API Latency**: <1.5s on 3G
- **Offline Success**: 95%
- **Crash-Free**: 99.5%
- **NPS Score**: >80

### User Segment KPIs
- **Farmers**: 75% retention, 30% advisory actions, 20-25% yield gain
- **Tourists**: 85% itinerary completion, 90% alert acknowledgment
- **Stakeholders**: 95% advisory delivery, 60% export usage

## 🤝 Partnerships

### Government
- **ZMD**: Zambia Meteorological Department (weather data)
- **ZEMA**: Zambia Environmental Management Agency (AQI data)
- **MinAg**: Ministry of Agriculture (crop calendars, pest data)
- **ZAWA**: Zambia Wildlife Authority (park data)

### Private Sector
- **MTN Zambia**: USSD/SMS services
- **Zamtel**: Rural connectivity

### International
- **GIZ**: E-PICSA agriculture extension
- **WWF**: Biodiversity data
- **GCF**: Climate finance ($100K+ grants)
- **FAO**: Crop calendars and agroforestry

## 📄 License

This project is MIT licensed.

## 👥 Authors

👤 **Nicholas Mutale**
- GitHub: [@Mutalenic](https://github.com/Mutalenic)
- Twitter: [@nicomutale](https://twitter.com/nicomutale)
- LinkedIn: [@nicomutale](https://linkedin.com/in/nicomutale)

## 🙏 Acknowledgments

- **Design Inspiration**: [Nelson Sakwa](https://www.behance.net/sakwadesignstudio)
- **Linters**: Microverse configurations
- **Zambia Focus**: Community feedback from Eastern and Copperbelt provinces
- **Climate Data**: OpenWeather, NASA POWER, Microsoft Planetary Computer
