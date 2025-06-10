# SafetyNet - Community Safety Platform

A real-time community safety monitoring platform that helps users stay informed about incidents in their area and contribute to community safety.

## Features

- Real-time incident mapping
- Community reporting system
- Safety alerts and notifications
- Interactive safety zones
- Incident filtering and search
- Mobile-responsive design

## Tech Stack

- React
- Vite
- TailwindCSS
- MapLibre GL JS
- AWS Location Services

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- AWS Account with Location Services enabled

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd safetynet
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```
Then edit `.env` and add your AWS credentials and other configuration.

4. Start the development server
```bash
npm run dev
```

## Development

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Making Changes

1. Create a new branch
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit
```bash
git add .
git commit -m "Description of your changes"
```

3. Push your changes
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub

### Code Style

- Follow the ESLint configuration
- Use Prettier for code formatting
- Follow component naming conventions
- Write meaningful commit messages

## Collaboration

1. Always pull latest changes before starting work
```bash
git pull origin develop
```

2. Resolve conflicts if any
3. Create feature branches from `develop`
4. Submit pull requests to `develop`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests (when implemented)

## Project Structure

```
safetynet/
├── src/
│   ├── components/
│   │   ├── SafetyMap.jsx
│   │   ├── IncidentForm.jsx
│   │   ├── PredictiveAlerts.jsx
│   │   └── ...
│   ├── config/
│   │   └── aws-config.js
│   ├── context/
│   │   └── SafetyContext.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .gitignore
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or collaboration, please contact:
[Your Contact Information] # Safety_Net
