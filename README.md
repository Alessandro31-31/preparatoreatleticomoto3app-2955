# Moto3 Training Pro 🏍️

Professional training management application for Moto3 pilots. Complete 18-week periodized program with advanced tracking, analytics, and recovery monitoring.

## ✨ Features

### 🏋️ Training Management
- **18-Week Calendar**: Periodized mesocycles (Anatomical Adaptation → Hypertrophy → Strength → Power → Peak)
- **Daily Training Sessions**: Structured workouts with exercise tracking
- **Morning Routine**: 12-minute mobility protocol with stiffness assessment
- **Preparation & Recovery**: Warmup, cooldown, stretching, and foam rolling protocols

### 📊 Monitoring & Analytics
- **Daily Readiness Check**: Sleep quality, muscle soreness, stress, energy, motivation
- **HRV Monitor**: Heart Rate Variability tracking (target: ≥55ms)
- **ACR Calculator**: Acute:Chronic Ratio for injury prevention (sweet spot: 0.8-1.3)
- **Load Tracking**: RPE × Duration with weekly trends
- **Posture Assessment**: FlexiTrace, wall test, pelvic tilt

### 🎯 Progress & Goals
- **Expected Progressions**: Week-by-week targets for strength, power, core, conditioning
- **Progress Charts**: Weight, HRV, stiffness, training load visualization
- **Target vs Actual**: Real-time comparison with expected progressions
- **Milestone Tracking**: 5 key checkpoints throughout 18-week cycle

### 🚨 Red Flag System
- **Injury Prevention**: Track warning signs (injury, fatigue, HRV drop, persistent soreness)
- **Severity Levels**: Low (monitor) → Medium (modify) → High (rest)
- **Recommended Actions**: Automatic guidance based on flag type
- **Resolution Tracking**: Document recovery and flag closure

### 📱 Mobile-First Design
- **Bottom Navigation**: Home, Calendar, Tools, Progress, Profile
- **Responsive Layout**: Optimized for mobile usage on track
- **Dark/Light Theme**: Customizable appearance
- **PWA Ready**: Install on phone home screen

### 📈 Export & Reporting
- **PDF Export**: Training reports with all metrics
- **Progress Graphs**: Visual trend analysis
- **Session History**: Complete training log

## 🏗️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Backend**: Hono on Cloudflare Workers
- **Database**: Drizzle ORM with D1 (SQLite)
- **Auth**: Better Auth with email/password
- **State**: TanStack Query for server state

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) runtime
- [Cloudflare account](https://cloudflare.com/) for deployment

### Installation

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Generate database schema:
```bash
bun run db:generate
```

4. Start development server:
```bash
bun run dev
```

5. Visit `http://localhost:5173`

## 📦 Database Schema

### Training Tables
- `trainingSessions` - Workout sessions with load, RPE, completion status
- `exercises` - Individual exercises with sets, reps, weight, RPE
- `morningRoutines` - Daily mobility routine with stiffness delta
- `progressions` - Target vs actual progression tracking

### Monitoring Tables
- `biometrics` - HRV, weight, sleep, readiness metrics
- `loadTracking` - Daily load, acute/chronic ratios, ACR
- `postureAssessments` - Posture evaluation data
- `redFlags` - Warning signs and injury prevention

### User Tables
- `userProfiles` - Athlete information
- `settings` - User preferences

## 🏃 Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run pre-deploy` - Generate migrations before deploy
- `bun run db:generate` - Generate database types

## 📱 Deployment

### Cloudflare Workers

1. Login to Cloudflare:
```bash
bunx wrangler login
```

2. Configure environment variables in Wrangler dashboard

3. Deploy:
```bash
bun run pre-deploy
bunx wrangler deploy
```

## 🎯 Training Phases (18 Weeks)

1. **Weeks 1-3**: Anatomical Adaptation
   - Focus: Movement patterns, technique
   - Intensity: Low-moderate

2. **Week 4**: Deload 1

3. **Weeks 5-7**: Hypertrophy
   - Focus: Muscle mass, endurance
   - Volume: High

4. **Week 8**: Deload 2

5. **Week 9**: Strength Base
   - Focus: Max strength development
   - Intensity: High

6. **Weeks 10-11**: Transfer + Power
   - Focus: Power, explosive strength
   - Specificity: Sport-specific

7. **Week 12**: Deload 3

8. **Weeks 13-15**: Peak Transfer
   - Focus: Competition-specific power
   - Intensity: Very high

9. **Week 16**: Taper + Deload

10. **Weeks 17-18**: Competition Peak
    - Ready for season start!

## 🔧 Customization

### Adding Exercises
Edit `worker/db/schema.ts` and create migrations:
```bash
bun run db:generate
```

### Modifying Progressions
Update expected progressions in `src/pages/progressions.tsx`

### Changing Training Schedule
Modify mesocycles in `src/pages/calendar.tsx`

## 📊 Key Metrics

- **HRV Target**: ≥55ms (optimal recovery)
- **Stiffness Delta**: ≥2.0 points improvement
- **ACR Sweet Spot**: 0.8-1.3
- **Session Completion**: >90% target
- **Sleep**: 8-9 hours for optimal recovery

## 🤝 Support

- Email: support@moto3training.com
- Documentation: Check `/preparation` for protocols
- AI Coach: Available in `/chat`

## 📄 License

Proprietary - Built for Moto3 athletes

---

**Moto3 Training Pro** - Train like a champion. 🏆
