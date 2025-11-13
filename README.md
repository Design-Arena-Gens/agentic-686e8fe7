# AnnapurnaAI - Ancient Indian Food Recommender

A full-stack web application built with React, Node.js/Express, and MongoDB that provides personalized Ayurvedic food recommendations based on your health profile and dosha.

## Features

### 🔐 Authentication
- JWT-based authentication with login/signup
- Secure password hashing with bcrypt
- Profile setup after registration (height, weight, activity level, health conditions)

### 🏠 Home Page
- Hero banner with "Discover Ancient Foods for Modern Health"
- Featured Ayurvedic foods showcase
- Remedy of the Day (randomly selected)
- About Ayurveda information sections
- Responsive design with earthy green-beige-brown theme

### 📊 Dashboard
- Sidebar navigation with dosha display
- Health score tracking (out of 100)
- Daily stats cards: Water intake, Calories, Sleep, Weight
- Interactive charts (Recharts) for:
  - Weight trend over 7 days
  - Calorie intake over 7 days
- Weekly averages display
- "Add Today's Stats" modal for logging daily health data

### 🍲 Food Recommendations (Remedies Page)
- Disease dropdown filter for targeted recommendations
- Personalized recommendations based on user profile and dosha
- Complete food database with:
  - Name, description, category (spice, herb, fruit, etc.)
  - Health benefits
  - Associated diseases it helps treat
  - Dosha compatibility
  - Nutritional information (calories, protein, carbs, fiber)
  - Taste profile (sweet, sour, bitter, pungent, etc.)
- Beautiful card layouts with hover effects

### 💬 Chatbot
- AI-powered Ayurvedic health guide
- Rule-based responses for common queries:
  - Disease-specific food recommendations
  - Dosha information
  - Stress/anxiety relief tips
  - Immunity boosting advice
  - Weight management guidance
  - Sleep improvement tips
- Real-time chat interface with typing indicators
- Quick question buttons for easy interaction

## Tech Stack

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Recharts for data visualization
- CSS3 with custom Ayurvedic theme
- Responsive design (mobile-friendly)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

### Deployment
- Vercel (configured with vercel.json)
- MongoDB Atlas (cloud database)

## Project Structure

```
annapurna-ai/
├── client/                 # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   └── src/
│       ├── components/     # Reusable components
│       │   └── Navbar.js
│       ├── context/        # React Context
│       │   └── AuthContext.js
│       ├── pages/          # Page components
│       │   ├── Home.js
│       │   ├── Login.js
│       │   ├── Signup.js
│       │   ├── ProfileSetup.js
│       │   ├── Dashboard.js
│       │   ├── Remedies.js
│       │   └── Chatbot.js
│       ├── App.js
│       └── index.js
├── server/                 # Express backend
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Food.js
│   │   └── HealthLog.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── food.js
│   │   ├── health.js
│   │   └── chatbot.js
│   ├── middleware/
│   │   └── auth.js
│   └── index.js           # Server entry point
├── .env                    # Environment variables
├── .env.example           # Example env file
├── vercel.json            # Vercel deployment config
└── package.json

```

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production
```

## Installation & Setup

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Local Development

1. Clone the repository
2. Install root dependencies:
   ```bash
   npm install
   ```

3. Install server dependencies:
   ```bash
   cd server && npm install
   ```

4. Install client dependencies:
   ```bash
   cd client && npm install
   ```

5. Set up environment variables in `.env`

6. Seed the database with initial foods:
   ```bash
   # Start the server first
   cd server && npm start
   
   # In another terminal, make a POST request to seed data
   curl -X POST http://localhost:5000/api/food/seed
   ```

7. Run the development servers:
   ```bash
   # From root directory
   npm run dev
   ```
   This runs both client (port 3000) and server (port 5000) concurrently.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)

### Food
- `GET /api/food` - Get all foods
- `GET /api/food/featured` - Get featured foods
- `GET /api/food/remedy-of-day` - Get random remedy
- `GET /api/food/recommend/:disease` - Get foods for specific disease (protected)
- `GET /api/food/personalized` - Get personalized recommendations (protected)
- `POST /api/food/seed` - Seed initial food data

### Health
- `GET /api/health/today` - Get today's health stats (protected)
- `POST /api/health/log` - Log daily health stats (protected)
- `GET /api/health/history?days=30` - Get health history (protected)
- `GET /api/health/dashboard` - Get dashboard data (protected)

### Chatbot
- `POST /api/chatbot/ask` - Send message to chatbot (protected)

## Deployment to Vercel

The application is configured for Vercel deployment with the included `vercel.json` file.

### Prerequisites
1. Vercel account with CLI access
2. Environment variables set:
   - `VERCEL_TOKEN` - Your Vercel authentication token
   - Or use `vercel login` to authenticate

### Deploy Command
```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-686e8fe7
```

### Environment Variables on Vercel
Set these in your Vercel project settings:
- `MONGODB_URI`
- `JWT_SECRET`

### Verification
After deployment, verify the app is running:
```bash
curl https://agentic-686e8fe7.vercel.app/api/health-check
```

## Design Theme

The application features an elegant Ayurvedic-inspired design:
- **Primary Color**: Deep forest green (#2d5016)
- **Secondary Color**: Vibrant green (#4a7c2e)
- **Accent**: Light green (#8db66b)
- **Background**: Warm beige (#f5f1e8)
- **Neutrals**: Brown tones (#5d4e37, #8b7355)
- **Typography**: Inter font family
- **Components**: Rounded corners, soft shadows, smooth transitions

## Key Features

### Health Score Calculation
The health score (0-100) is calculated based on:
- Consistency of logging (5 points per day)
- Water intake (8+ glasses = 2 points)
- Sleep quality (7-9 hours = 3 points)
- Activity level (8000+ steps = 2 points)
- Balanced calories (1500-2500 = 2 points)

### Dosha Calculation
Simple BMI-based dosha assignment:
- BMI < 18.5: Vata (air & space)
- BMI 18.5-25: Pitta (fire & water)
- BMI > 25: Kapha (earth & water)

### Personalized Recommendations
Foods are recommended based on:
- User's health conditions/diseases
- User's dosha type
- Food benefits and properties

## Database Schema

### User Model
- name, email, password (hashed)
- age, gender, height, weight
- activityLevel, diseases[]
- healthScore, dosha
- timestamps

### Food Model
- name, description, category
- benefits[], diseases[], dosha[]
- taste, nutrients{}
- isFeatured flag

### HealthLog Model
- userId (reference)
- date, weight, calories
- waterIntake, sleep, steps, mood

## Future Enhancements

- Integration with real AI/LLM for chatbot
- Meal planning feature
- Recipe recommendations
- Community features
- Mobile app (React Native)
- Integration with fitness trackers
- Multi-language support (Sanskrit terms)
- More detailed dosha quiz
- Consultation booking system

## License

MIT License

## Credits

Built with ancient Ayurvedic wisdom and modern technology.
