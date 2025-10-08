# 🚀 Setup Guide - Dairy Farm Management System

এই গাইড আপনাকে ধাপে ধাপে প্রজেক্ট সেটআপ করতে সাহায্য করবে।

## 📋 প্রয়োজনীয় সফটওয়্যার

### 1. Node.js ইনস্টল করুন

**Windows:**

- [Node.js ডাউনলোড করুন](https://nodejs.org/) (LTS version)
- ইনস্টলার রান করুন এবং ডিফল্ট সেটিংস রাখুন

**Verify Installation:**

```bash
node --version
npm --version
```

### 2. PostgreSQL ইনস্টল করুন

**Option A: Local PostgreSQL**

Windows:

- [PostgreSQL ডাউনলোড করুন](https://www.postgresql.org/download/windows/) (LTS version 14+)
- EDB Installer ব্যবহার করুন
- ইনস্টলেশনের সময়:
  - Port: `5432` (default)
  - Superuser Password সেট করুন (মনে রাখুন!)
  - Stack Builder skip করতে পারেন

**Option B: Cloud Database (সুপারিশকৃত - সবচেয়ে সহজ) 🌟**

কোনো local installation লাগবে না! এই services ব্যবহার করুন:

**1. [Supabase](https://supabase.com/)** (সবচেয়ে জনপ্রিয়)

- Free tier: 500 MB database
- Built-in dashboard
- Real-time features
- Setup:
  1. Account তৈরি করুন
  2. "New Project" ক্লিক করুন
  3. Database password সেট করুন
  4. Project Settings → Database → Connection string কপি করুন

**2. [Neon](https://neon.tech/)** (সবচেয়ে দ্রুত)

- Free tier: 3 GB storage
- Serverless PostgreSQL
- Instant scaling
- Setup:
  1. GitHub দিয়ে login করুন
  2. "Create Project" ক্লিক করুন
  3. Connection string কপি করুন

**3. [Railway](https://railway.app/)**

- Free tier: $5 credit/month
- One-click PostgreSQL
- Easy deployment
- Setup:
  1. GitHub দিয়ে signup করুন
  2. "New Project" → "Provision PostgreSQL"
  3. Variables tab থেকে DATABASE_URL কপি করুন

**4. [Render](https://render.com/)**

- Free tier: 90 days free PostgreSQL
- Auto-backups
- Setup:
  1. Account তৈরি করুন
  2. "New" → "PostgreSQL"
  3. External Database URL কপি করুন

### 3. Git ইনস্টল করুন (Optional)

- [Git ডাউনলোড করুন](https://git-scm.com/downloads)

## 🔧 প্রজেক্ট সেটআপ

### Step 1: ফোল্ডারে যান

```bash
cd next.js
```

### Step 2: Dependencies ইনস্টল করুন

```bash
npm install
```

এটি সব প্রয়োজনীয় packages ইনস্টল করবে। এতে 5-10 মিনিট লাগতে পারে।

### Step 3: Environment Variables সেট করুন

1. `.env.example` ফাইল কপি করুন এবং `.env` নাম দিন:

**Windows CMD:**

```cmd
copy .env.example .env
```

**PowerShell:**

```powershell
Copy-Item .env.example .env
```

2. `.env` ফাইল এডিট করুন এবং আপনার তথ্য দিন:

```env
# PostgreSQL Connection
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/dairy_farm"

# Cloud Database থেকে পেলে সরাসরি paste করুন
# DATABASE_URL="postgresql://user:pass@host.supabase.co:5432/postgres"

# NextAuth Configuration
NEXTAUTH_SECRET="my-super-secret-key-12345-change-this"
NEXTAUTH_URL="http://localhost:3000"
```

**DATABASE_URL ফরম্যাট:**

**Local PostgreSQL:**

```
postgresql://[username]:[password]@[host]:[port]/[database_name]
```

উদাহরণ:

- Username: `postgres` (default)
- Password: `mypassword123`
- Host: `localhost`
- Port: `5432` (PostgreSQL default)
- Database: `dairy_farm`

**Result:** `postgresql://postgres:mypassword123@localhost:5432/dairy_farm`

**Cloud Database (Supabase/Neon/Railway):**

Cloud service থেকে পাওয়া connection string সরাসরি ব্যবহার করুন:

```env
# Supabase example
DATABASE_URL="postgresql://postgres.abcdefgh:[password]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# Neon example
DATABASE_URL="postgresql://neondb_owner:[password]@ep-cool-name-12345.us-east-2.aws.neon.tech/neondb"

# Railway example
DATABASE_URL="postgresql://postgres:[password]@containers-us-west-123.railway.app:5432/railway"
```

### Step 4: Database তৈরি করুন

#### Option A: pgAdmin ব্যবহার করে (GUI)

1. pgAdmin খুলুন (PostgreSQL এর সাথে install হয়েছে)
2. Left sidebar এ "Servers" → "PostgreSQL" → "Databases" খুলুন
3. "Databases" এ right-click করুন
4. "Create" → "Database..." সিলেক্ট করুন
5. Database name: `dairy_farm` দিন
6. "Save" ক্লিক করুন

#### Option B: Command Line ব্যবহার করে

```bash
psql -U postgres
```

Password দিন, তারপর:

```sql
CREATE DATABASE dairy_farm;
\q
```

**Note:** যদি `psql` command not found দেখায়, তাহলে PostgreSQL bin folder PATH এ add করুন:

- `C:\Program Files\PostgreSQL\15\bin`

#### Option C: Cloud Database (Supabase/Neon/Railway)

যদি cloud database ব্যবহার করেন, তাহলে database আগে থেকেই তৈরি আছে!
শুধু connection string `.env` এ paste করুন। ✅

### Step 5: Database Schema সেটআপ করুন

```bash
npx prisma generate
npx prisma db push
```

এটি আপনার database এ সব tables তৈরি করবে।

### Step 6: Database চেক করুন (Optional)

Prisma Studio দিয়ে database দেখুন:

```bash
npx prisma studio
```

একটি browser window খুলবে যেখানে আপনি database দেখতে পারবেন।

## 🎉 প্রজেক্ট রান করুন

### Development Server শুরু করুন

```bash
npm run dev
```

এটি দেখাবে:

```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.5s
```

### Browser এ খুলুন

ব্রাউজারে যান: **http://localhost:3000**

## 👤 প্রথম User তৈরি করুন

1. "Sign Up" বাটনে ক্লিক করুন
2. আপনার তথ্য দিন:
   - Full Name: `Admin User`
   - Email: `admin@dairyfarm.com`
   - Role: `Admin`
   - Password: `admin123` (নিরাপদ password ব্যবহার করুন!)
3. "Sign Up" বাটনে ক্লিক করুন
4. Login page এ redirect হবে
5. আপনার email ও password দিয়ে login করুন

## ✅ সেটআপ সফল হয়েছে কিনা চেক করুন

যদি সব ঠিকঠাক থাকে, আপনি দেখবেন:

1. ✅ Login page লোড হয়েছে
2. ✅ Sign up করতে পারছেন
3. ✅ Login করতে পারছেন
4. ✅ Dashboard দেখতে পাচ্ছেন
5. ✅ Sidebar এ সব menu দেখা যাচ্ছে

## 🎯 পরবর্তী পদক্ষেপ

### Animals যোগ করুন

1. Sidebar থেকে "Animal Records" এ যান
2. "Add Animal" বাটনে ক্লিক করুন
3. Animal এর তথ্য দিন
4. "Create Animal" বাটনে ক্লিক করুন

### অন্যান্য Modules ব্যবহার করুন

- **Animal Health**: পশুর স্বাস্থ্য রেকর্ড যোগ করুন
- **Animal Weight**: ওজন ট্র্যাক করুন
- **Breeding**: প্রজনন রেকর্ড যোগ করুন
- **Milk Records**: দুধের উৎপাদন লগ করুন
- **Milk Sales**: বিক্রয় রেকর্ড করুন
- **Stock Feed**: খাদ্য inventory পরিচালনা করুন
- **Employees**: কর্মচারী যোগ করুন
- **Farm Finance**: আয়-ব্যয় ট্র্যাক করুন

## 🐛 সমস্যা সমাধান

### Database Connection Error

**Error:** `Can't reach database server` বা `Connection refused`

**সমাধান:**

1. **PostgreSQL service চালু আছে কিনা চেক করুন:**

   - Windows: Services app খুলে "postgresql" service চালু করুন
   - অথবা: `services.msc` run করে "postgresql-x64-15" service start করুন

2. **`.env` ফাইলে DATABASE_URL সঠিক আছে কিনা চেক করুন:**

   - Port: `5432` (PostgreSQL default)
   - Username: `postgres` (default)
   - Password: আপনার set করা password
   - Database name: `dairy_farm`

3. **Database তৈরি হয়েছে কিনা চেক করুন:**

   ```bash
   psql -U postgres -l
   ```

   এটি সব databases list দেখাবে

4. **Connection test করুন:**
   ```bash
   psql -U postgres -d dairy_farm
   ```
   যদি connect হয়, তাহলে database ঠিক আছে!

### Cloud Database Connection Issues

**Error:** `SSL connection required`

**সমাধান:**
Connection string এর শেষে `?sslmode=require` যোগ করুন:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### Port 3000 Already in Use

**সমাধান:**

**Windows:**

```cmd
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

অথবা অন্য port ব্যবহার করুন:

```bash
npm run dev -- -p 3001
```

### Prisma Generate Error

**সমাধান:**

```bash
rm -rf node_modules
npm install
npx prisma generate
```

### Module Not Found Errors

**সমাধান:**

```bash
npm install
```

## 📱 Production এ Deploy করুন

### Vercel এ Deploy (সবচেয়ে সহজ)

1. [Vercel](https://vercel.com) এ account তৈরি করুন
2. GitHub এ আপনার code push করুন
3. Vercel এ "Import Project"
4. Environment variables যোগ করুন
5. Deploy!

### Environment Variables (Production)

Production এ এই variables প্রয়োজন:

```env
# Production PostgreSQL Database
DATABASE_URL="postgresql://user:password@production-host:5432/dairy_farm?sslmode=require"

# Production URL
NEXTAUTH_URL="https://your-domain.com"

# Strong production secret (32+ characters)
NEXTAUTH_SECRET="use-a-very-strong-and-different-secret-for-production-environment"

# Environment
NODE_ENV="production"
```

### সুপারিশকৃত Production Setup:

**Database:** Supabase/Neon (Free tier available)
**Hosting:** Vercel/Netlify (Next.js optimized)
**Benefits:**

- Zero configuration
- Auto-scaling
- Free SSL
- CDN included

## 🎓 আরো শিখুন

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs) (if using Supabase)

## 💡 টিপস

### General Tips:

1. **Regular Backup**: নিয়মিত database backup নিন
2. **Strong Passwords**: শক্তিশালী password ব্যবহার করুন
3. **Environment Variables**: কখনো `.env` ফাইল commit করবেন না
4. **Updates**: নিয়মিত dependencies update করুন

### PostgreSQL Specific Tips:

1. **Connection Pooling**: Production এ Supabase/Neon ব্যবহার করলে connection pooling automatic
2. **Prisma Studio**: Database data দেখার জন্য `npx prisma studio` ব্যবহার করুন
3. **Migrations**: Schema change করলে `npx prisma db push` run করুন
4. **Performance**: PostgreSQL MySQL থেকে complex queries এ দ্রুত
5. **Backup Command**:
   ```bash
   pg_dump -U postgres dairy_farm > backup.sql
   ```
6. **Restore Command**:
   ```bash
   psql -U postgres dairy_farm < backup.sql
   ```

## 🤝 সাহায্য প্রয়োজন?

যদি কোনো সমস্যায় পড়েন:

1. Error message ভালোভাবে পড়ুন
2. Google এ search করুন
3. Documentation চেক করুন
4. GitHub এ issue তৈরি করুন

---

Happy Coding! 🚀🐄
