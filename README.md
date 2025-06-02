# 🆘 HUB - Humanitarian Unified Backbone

<div align="center">

![HUB Logo](public/images/hub-logo.png)

**Empowering Communities Through Technology in Times of Crisis**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=for-the-badge&logo=openai)](https://openai.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

[🚀 Live Demo](https://your-hub-app.vercel.app) • [📖 Documentation](#documentation) • [🤝 Contributing](#contributing) • [🆘 Support](#support)

</div>

---

## 🌟 Overview

The **Humanitarian Unified Backbone (HUB)** mobile app is a critical component of the HUB ecosystem, designed to empower civilians, first responders, and stakeholders with real-time information and tools to enhance disaster response and situational awareness.

Built with cutting-edge technology and powered by **C3 (Command, Control, and Communications)**, HUB serves as a lifeline during emergencies, providing essential tools for survival, communication, and coordination.

## ✨ Key Features

### 🚨 **Emergency Response**
- **Real-Time Alerts**: Instant notifications for earthquakes, floods, and disasters
- **Emergency SOS**: One-tap distress signal with automatic location sharing
- **AI-Powered Assistant**: C3-powered chatbot for emergency guidance and self-rescue
- **Offline Mode**: Critical functionality without internet connectivity

### 🗺️ **Navigation & Location**
- **Shelter Navigation**: OpenStreetMap integration for finding safe shelters
- **Location Tracking**: Real-time GPS with emergency contact sharing
- **Callable Interfaces**: Direct calling to emergency services and shelters
- **Interactive Maps**: No API keys required, privacy-focused mapping

### 🔗 **Device Integration**
- **Device Onboarding**: Connect Portable Lora Nodes, sensors, drones, and wearables
- **Real-Time Monitoring**: Battery, signal strength, and device status
- **LoRa Mesh Network**: Long-range communication when cellular fails
- **Device Analytics**: Comprehensive metrics and diagnostics

### 💬 **Communication**
- **LoRa Chat**: Mesh network messaging for disaster zones
- **News Reporting**: Community-driven disaster updates
- **Emergency Contacts**: Shareable contact lists with one-tap calling
- **Multi-Channel Communication**: Voice, text, and data transmission

### 💰 **Community Support**
- **Crowdfunding Platform**: Disaster relief fundraising campaigns
- **Donation Tracking**: Transparent fund allocation and progress
- **Community Coordination**: Volunteer and resource management
- **Impact Reporting**: Real-time updates on relief efforts

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks and local storage
- **PWA**: Service workers for offline functionality

### **Backend & AI**
- **API Routes**: Next.js serverless functions
- **AI Integration**: OpenAI GPT-3.5-turbo via C3 platform
- **Real-time**: WebSocket connections for live updates
- **Database**: Edge-compatible storage solutions

### **Maps & Location**
- **Mapping**: OpenStreetMap (no API keys required)
- **Routing**: OSRM for directions and navigation
- **Geolocation**: Browser-native GPS with fallbacks
- **Offline Maps**: Cached map tiles for emergency use

### **Communication**
- **LoRa Integration**: Long-range radio communication
- **Mesh Networking**: Decentralized communication protocols
- **WebRTC**: Peer-to-peer voice and video calls
- **Push Notifications**: Real-time alert delivery

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- OpenAI API key for C3 AI assistant
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-org/hub-app.git
   cd hub-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Environment setup**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your OpenAI API key:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

4. **Run development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

Deploy instantly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/hub-app)

Or build manually:
\`\`\`bash
npm run build
npm start
\`\`\`

## 📱 App Architecture

### **Core Modules**

\`\`\`
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes and serverless functions
│   ├── emergency/         # Emergency SOS functionality
│   ├── shelters/          # Shelter navigation and maps
│   ├── devices/           # Device management and onboarding
│   ├── lora-chat/         # LoRa mesh communication
│   ├── crowdfunding/      # Disaster relief fundraising
│   └── profile/           # User settings and preferences
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   ├── mobile-layout.tsx # Main app layout and navigation
│   ├── ai-assistant.tsx  # C3 AI chatbot interface
│   └── floating-chatbot.tsx # Quick access chat button
├── lib/                  # Utility functions and helpers
└── public/              # Static assets and PWA files
\`\`\`

### **Data Flow**

1. **User Interaction** → UI Components
2. **State Management** → React hooks + localStorage
3. **API Calls** → Next.js API routes
4. **External Services** → OpenAI, OpenStreetMap, LoRa networks
5. **Real-time Updates** → WebSocket connections
6. **Offline Storage** → Service workers + IndexedDB

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for C3 AI assistant | ✅ |
| `NEXT_PUBLIC_APP_URL` | App URL for sharing and redirects | ❌ |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox token (optional, OSM used by default) | ❌ |

### **PWA Configuration**

The app includes Progressive Web App features:
- **Offline functionality** for critical features
- **Install prompts** for mobile home screen
- **Background sync** for delayed data transmission
- **Push notifications** for emergency alerts

### **Device Integration**

Supported device types:
- **Portable Lora Nodes**: Long-range communication devices
- **Environmental Sensors**: Temperature, humidity, air quality
- **Wearables**: Health monitoring and emergency beacons
- **Drones**: Aerial reconnaissance and delivery
- **Smart Emergency Helmets**: Worker safety and communication

## 🎯 Use Cases

### **For Civilians**
- Receive early warning alerts for natural disasters
- Find nearest emergency shelters with real-time availability
- Get AI-powered guidance for emergency situations
- Communicate when cellular networks are down
- Contribute to community relief efforts through crowdfunding

### **For First Responders**
- Coordinate rescue operations with real-time data
- Access crowd-sourced information from affected areas
- Monitor connected devices and sensor networks
- Communicate across different agencies and platforms
- Track resource allocation and deployment

### **For Emergency Managers**
- Monitor disaster impact through connected sensors
- Coordinate multi-agency response efforts
- Analyze real-time data for decision making
- Manage evacuation routes and shelter capacity
- Communicate with affected populations

### **For Communities**
- Report local conditions and needs
- Organize volunteer efforts and resource sharing
- Stay informed about ongoing relief operations
- Support neighbors through integrated communication tools
- Build resilience through preparedness features

## 🔒 Security & Privacy

### **Data Protection**
- **End-to-end encryption** for sensitive communications
- **Local storage** for critical offline data
- **Privacy-first mapping** with OpenStreetMap
- **Minimal data collection** with user consent
- **GDPR compliance** for international users

### **Emergency Protocols**
- **Automatic location sharing** only during active emergencies
- **Secure device pairing** with encrypted connections
- **Anonymous reporting** options for sensitive situations
- **Data retention policies** for emergency vs. normal operations

## 🤝 Contributing

We welcome contributions from developers, emergency management professionals, and community members!

### **Development Setup**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### **Contribution Guidelines**

- **Code Quality**: Follow TypeScript best practices and ESLint rules
- **Testing**: Add tests for new features and bug fixes
- **Documentation**: Update README and inline comments
- **Accessibility**: Ensure features work with screen readers and assistive technology
- **Mobile-First**: Design for mobile devices and emergency scenarios

### **Areas for Contribution**

- 🌐 **Internationalization**: Multi-language support for global deployment
- 📱 **Mobile Optimization**: Performance improvements for low-end devices
- 🔌 **Device Integration**: Support for additional IoT and emergency devices
- 🗺️ **Mapping Features**: Enhanced offline maps and routing capabilities
- 🤖 **AI Improvements**: Better emergency response prompts and training
- ♿ **Accessibility**: Screen reader support and assistive technology
- 🔒 **Security**: Penetration testing and vulnerability assessments

## 📊 Performance & Monitoring

### **Key Metrics**
- **Response Time**: < 2 seconds for critical emergency features
- **Offline Capability**: 90% of features available without internet
- **Battery Optimization**: Minimal drain during emergency mode
- **Accessibility Score**: WCAG 2.1 AA compliance
- **Mobile Performance**: Lighthouse score > 90

### **Monitoring Tools**
- **Real User Monitoring** for performance tracking
- **Error Tracking** with detailed stack traces
- **Usage Analytics** for feature optimization
- **Uptime Monitoring** for critical API endpoints

## 🆘 Support

### **Emergency Support**
If you're in immediate danger, **call your local emergency services** (911 in the US, 112 in Europe, etc.) immediately.

### **Technical Support**
- 📧 **Email**: support@hub-emergency.org
- 💬 **Discord**: [Join our community](https://discord.gg/hub-emergency)
- 📖 **Documentation**: [docs.hub-emergency.org](https://docs.hub-emergency.org)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-org/hub-app/issues)

### **Community Resources**
- 🎓 **Training Materials**: Emergency response guides and tutorials
- 🎥 **Video Tutorials**: Step-by-step feature demonstrations
- 📚 **Best Practices**: Emergency preparedness and response protocols
- 🌍 **Global Network**: Connect with HUB deployments worldwide

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Emergency Management Professionals** who provided real-world requirements
- **Open Source Community** for the incredible tools and libraries
- **Beta Testers** who helped refine the user experience
- **Disaster Response Organizations** for their guidance and feedback
- **C3 Platform** for AI and communication infrastructure

---

<div align="center">

**Built with ❤️ for humanity's resilience**

[🌐 Website](https://hub-emergency.org) • [📧 Contact](mailto:info@hub-emergency.org) • [🐦 Twitter](https://twitter.com/hub_emergency)

*"In times of crisis, technology becomes a bridge to safety, hope, and recovery."*

</div>
