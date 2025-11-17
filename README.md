# Moto3 Training Pro 🏍️

Professional Training Management System for Moto3 Pilots - A complete web application for tracking workouts, monitoring recovery, and optimizing performance over an 18-week training cycle.

## 🚀 Deploy Veloce

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955)

**Clicca uno dei pulsanti sopra per deployare in 60 secondi! 🎯**

## ✨ Features

### 🏋️ Training Management
- **18-Week Periodized Program**: Structured training schedule with detailed workout tracking
- **Session Logging**: Track training sessions with RPE, duration, and load calculations
- **Exercise Library**: Comprehensive database of exercises with progression tracking
- **Custom Routines**: Create and follow personalized workout routines

### 💪 Recovery Monitoring
- **HRV Tracking**: Heart Rate Variability monitoring for recovery assessment
- **Sleep Quality**: Daily sleep tracking with quality metrics
- **Morning Routine**: 12-minute mobility protocol with progress tracking
- **Red Flag System**: Automatic alerts for recovery issues

### 📊 Performance Analytics
- **Progress Charts**: Visual representation of performance over time
- **Milestone Tracking**: Track personal bests and achievements
- **Weekly Load Management**: Monitor training load and prevent overtraining
- **Biometric Dashboard**: Comprehensive view of all health metrics

### 🛠️ Training Tools
- **Interval Timer**: Customizable work/rest interval timer
- **ACR Calculator**: Acute:Chronic Ratio calculator for injury prevention
- **Exercise Database**: Searchable database with exercise demonstrations
- **Calendar View**: Visual overview of your 18-week training plan

### 📱 Mobile-First Design
- **Progressive Web App**: Install on your phone like a native app
- **Offline Support**: Access your data even without internet connection
- **Touch-Optimized**: Large tap targets and smooth interactions
- **Responsive Design**: Works perfectly on all screen sizes
- **Safe Area Support**: Optimized for notched devices (iPhone X and newer)

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh) (v1.2.0 or higher)
- Modern web browser with PWA support

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd preparatoreatleticomoto3app-2955
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_BETTER_AUTH_URL=your_auth_url
   ```

4. **Run the development server**
   ```bash
   bun dev
   ```

5. **Open in your browser**
   Navigate to `http://localhost:5173`

## 📱 Installing on Mobile

### iOS (iPhone/iPad)
1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right

### Android
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Follow the prompts to install

Once installed, the app will:
- ✅ Work offline
- ✅ Send push notifications (if enabled)
- ✅ Open in fullscreen mode
- ✅ Save data locally
- ✅ Sync when online

## 🔧 Customization

### Modifying the Theme
Edit `/src/styles/global.css` to customize colors:

```css
:root {
  --primary: oklch(0.6 0.12 190);    /* Change primary color */
  --background: oklch(0.985 0.008 95); /* Change background */
  /* ... more colors ... */
}
```

### Adding New Pages
1. Create a new file in `/src/pages/your-page.tsx`
2. Add the route in `/src/app.tsx`:
   ```tsx
   <Route path="/your-page" element={<YourPage />} />
   ```

### Modifying the Training Program
Edit `/public/training-data.json` to customize:
- Exercise list
- Weekly schedules
- Rep schemes
- Rest periods

### Customizing the PWA
Edit `/public/manifest.json` to change:
- App name and description
- Theme colors
- Icons
- Shortcuts

## 🏗️ Building for Production

```bash
# Build the application
bun run build

# Preview the production build
bun run preview

# Deploy (if using Cloudflare Pages/Workers)
bun run autumn:push:prod
```

## 📁 Project Structure

```
preparatoreatleticomoto3app-2955/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # shadcn/ui components
│   │   └── ...         # Custom components
│   ├── pages/          # Page components
│   │   ├── home.tsx    # Landing/dashboard page
│   │   ├── calendar.tsx # Training calendar
│   │   ├── routine.tsx  # Morning routine
│   │   ├── tools.tsx    # Training tools
│   │   └── ...
│   ├── lib/            # Utilities and helpers
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # Global styles
│   └── types/          # TypeScript types
├── worker/             # Cloudflare Workers API
│   ├── routes/         # API routes
│   └── db/             # Database schema
├── public/             # Static assets
│   ├── manifest.json   # PWA manifest
│   ├── sw.js          # Service worker
│   └── ...
└── ...
```

## 🔐 Authentication

The app uses [Better Auth](https://www.better-auth.com/) for authentication with support for:
- Email/Password login
- OAuth providers
- Session management
- Role-based access control

## 💾 Database

Using Drizzle ORM with Cloudflare D1:

```bash
# Generate migrations
bun run db:generate

# View database in dashboard
bun run autumn:dashboard
```

## 🎨 UI Components

Built with:
- **React 19**: Latest React features
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: High-quality, customizable components
- **Lucide Icons**: Beautiful, consistent icons
- **Framer Motion**: Smooth animations

## 📊 State Management

- **TanStack Query**: Server state management and caching
- **React Context**: Global client state
- **Better Auth**: Authentication state

## 🧪 Development

```bash
# Run linter
bun run lint

# Type checking (if configured)
tsc --noEmit

# Run development server
bun dev
```

## 🚢 Deployment

### Cloudflare Pages (Recommended)
```bash
bun run autumn:push:prod
```

### Other Platforms
The app is a standard Vite application and can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Any static hosting service

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Training program designed for professional Moto3 pilots
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)

## 🐛 Issues & Support

If you encounter any issues or need help:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include screenshots if relevant

## 🔄 Updates

To get the latest updates:
```bash
git pull origin main
bun install
bun run build
```

---

**Made with ❤️ for Moto3 Training**
