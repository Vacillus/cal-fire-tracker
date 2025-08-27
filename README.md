# 🔥 CAL FIRE Tracker - Chinchilla AI Academy

## My First AWS Amplify App

This is my first AWS Amplify application built for **Chinchilla AI Academy**. It's a real-time California wildfire tracking dashboard that demonstrates modern cloud architecture with forensic mutation logging.

## 🎯 Project Overview

A comprehensive wildfire tracking system that:
- **Scrapes CAL FIRE data** every 30 minutes via Lambda functions
- **Stores incidents** in DynamoDB with full audit trails
- **Visualizes fire data** with interactive maps and county cards
- **Tracks all mutations** with forensic logging and contradiction detection
- **Provides historical fire lore** and pattern analysis

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: AWS Amplify Gen 2
- **Authentication**: AWS Cognito (Student/Instructor roles)
- **Database**: DynamoDB with GraphQL API
- **Functions**: Lambda (Node.js 20)
- **Hosting**: AWS Amplify Console with CI/CD

## 📊 Features

### Dashboard
- Real-time fire incident tracking
- Interactive California fire map
- County risk assessment cards
- Personnel and containment metrics

### Mutation Mode
- Toggle forensic logging display
- Track all data mutations
- Detect and log contradictions
- Audit trail visualization

### Fire Lore
- Historical fire data (2018-2024)
- Pattern analysis
- Seasonal risk timeline
- Notable events archive

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- AWS Account
- GitHub Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cal-fire-tracker.git
cd cal-fire-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Configure AWS credentials:
```bash
npx ampx configure
```

4. Deploy backend:
```bash
npx ampx sandbox
```

5. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Deployment

The app automatically deploys to AWS Amplify Console on push to main branch.

## 📊 Data Sources

- **CAL FIRE API**: https://www.fire.ca.gov/umbraco/api/IncidentApi/List
- Updates every 30 minutes via scheduled Lambda
- Historical data from 2018-2024

## 🎓 Chinchilla AI Academy

This project was built as part of the Chinchilla AI Academy AWS Amplify course (Day 3, Week 1).

### Learning Objectives
- ✅ AWS Amplify Gen 2 setup
- ✅ Lambda function creation
- ✅ DynamoDB data modeling
- ✅ GraphQL API implementation
- ✅ Authentication with Cognito
- ✅ CI/CD with GitHub integration
- ✅ Real-time data synchronization
- ✅ Forensic logging patterns

## 🐛 Forensic Console Messages

When Mutation Mode is enabled, you'll see messages like:
```
[FORENSIC] Mutation monitoring active...
[FORENSIC] Contradiction detection: ENABLED
[FORENSIC] Temporal anomaly scanner: RUNNING
[FORENSIC] Quantum state observer: INITIALIZED
[FORENSIC] All systems operational
```

## 📄 License

MIT License - Educational Use

## 🙏 Acknowledgments

- **Chinchilla AI Academy** for the comprehensive AWS Amplify training
- **CAL FIRE** for providing public fire incident data
- **AWS Amplify Team** for the excellent Gen 2 platform

---

**Built with ❤️ and 🔥 for Chinchilla AI Academy**

*"Tracking mutations, detecting contradictions, protecting California"*
