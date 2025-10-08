# 🐄 Dairy Farm Management System - Next.js

A modern, full-stack web application for managing dairy farm operations, built with Next.js 14, TypeScript, Prisma, and MySQL.

## ✨ Features

- **🔐 Authentication System** - Secure login and user management with NextAuth.js
- **🐮 Animal Records** - Complete animal management with profiles, tracking, and history
- **❤️ Health Management** - Track animal health records, treatments, and veterinary visits
- **⚖️ Weight Tracking** - Monitor animal growth and body condition
- **👶 Breeding Management** - Manage breeding cycles and offspring records
- **🥛 Milk Production** - Daily milk production tracking with quality metrics
- **💰 Milk Sales** - Track milk sales, revenue, and payment status
- **🌾 Stock Feed** - Inventory management for animal feed
- **👥 Employee Management** - Manage farm staff and payroll
- **📊 Financial Management** - Track income, expenses, and farm profitability
- **📈 Dashboard** - Real-time insights and analytics

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MySQL with Prisma ORM
- **Authentication:** NextAuth.js v5
- **UI Components:** Radix UI + Tailwind CSS
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form + Zod
- **Charts:** Recharts
- **Date Handling:** date-fns

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm or yarn or pnpm
- MySQL 8.0 or higher (or use cloud MySQL like PlanetScale)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd next.js
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then update the `.env` file with your configuration:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/dairy_farm"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Email (Optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@dairyfarm.com"

# App
NEXT_PUBLIC_APP_NAME="Dairy Farm Management System"
```

### 4. Set Up the Database

#### Create MySQL Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE dairy_farm;
EXIT;
```

#### Run Prisma Migrations

```bash
npx prisma generate
npx prisma db push
```

### 5. Create Initial User (Optional)

You can create an initial admin user by signing up through the application, or use Prisma Studio:

```bash
npx prisma studio
```

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

### First Time Setup

1. Navigate to `http://localhost:3000`
2. Click on "Sign Up" to create your account
3. Fill in your details and select your role (Admin/Manager/User)
4. Login with your credentials
5. Start managing your dairy farm!

### Default Login (if created manually)

If you created a user manually in the database, use those credentials to login.

## 🗂️ Project Structure

```
next.js/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── animals/      # Animal CRUD operations
│   │   │   ├── health/       # Health records
│   │   │   ├── weight/       # Weight tracking
│   │   │   ├── breeding/     # Breeding records
│   │   │   ├── milk/         # Milk production
│   │   │   ├── milk-sales/   # Sales records
│   │   │   ├── stockfeed/    # Feed inventory
│   │   │   ├── employees/    # Employee management
│   │   │   └── finance/      # Financial records
│   │   ├── dashboard/        # Main application pages
│   │   │   ├── animals/      # Animal management UI
│   │   │   ├── health/       # Health tracking UI
│   │   │   ├── weight/       # Weight tracking UI
│   │   │   ├── breeding/     # Breeding management UI
│   │   │   ├── milk/         # Milk production UI
│   │   │   ├── milk-sales/   # Sales tracking UI
│   │   │   ├── stockfeed/    # Feed inventory UI
│   │   │   ├── employees/    # Employee management UI
│   │   │   └── finance/      # Finance management UI
│   │   ├── login/            # Login page
│   │   ├── signup/           # Registration page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/               # Reusable UI components
│   └── lib/
│       ├── prisma.ts         # Prisma client
│       ├── auth.ts           # Authentication config
│       └── utils.ts          # Utility functions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database

## 🌟 Key Features Explained

### Animal Management
- Add, edit, and track animals with unique tag numbers
- Record breed, age, gender, and health status
- Track purchase information and current weight
- View complete animal history

### Health Tracking
- Record health examinations and treatments
- Track diseases, symptoms, and medications
- Schedule follow-up checkups
- Monitor health costs

### Milk Production
- Log daily milk production (morning, afternoon, evening)
- Track milk quality and fat content
- Generate production reports
- Identify top-producing animals

### Financial Management
- Track all farm income and expenses
- Categorize transactions
- View financial summaries
- Monitor profitability

## 🔐 Security Features

- Secure password hashing with bcrypt
- JWT-based session management
- Protected API routes
- Role-based access control (RBAC) ready
- SQL injection prevention with Prisma

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables
4. Deploy!

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**
- **Google Cloud Run**

## 📚 API Documentation

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### Animals

- `GET /api/animals` - Get all animals
- `POST /api/animals` - Create animal
- `GET /api/animals/:id` - Get animal by ID
- `PUT /api/animals/:id` - Update animal
- `DELETE /api/animals/:id` - Delete animal

### Health Records

- `GET /api/health` - Get all health records
- `POST /api/health` - Create health record

### Weight Records

- `GET /api/weight` - Get all weight records
- `POST /api/weight` - Create weight record

(Similar endpoints exist for breeding, milk, milk-sales, stockfeed, employees, and finance)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed with ❤️ for dairy farm management

## 🐛 Known Issues

- None at the moment

## 📞 Support

For support, email support@dairyfarm.com or open an issue in the repository.

## 🔜 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics and reporting
- [ ] Export to PDF/Excel
- [ ] Multi-language support
- [ ] Barcode/QR code scanning
- [ ] Weather integration
- [ ] Automated backup system
- [ ] SMS notifications
- [ ] Integration with IoT devices

---

Made with ❤️ using Next.js

