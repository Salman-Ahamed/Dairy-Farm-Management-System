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

### 2. MySQL ইনস্টল করুন

**Option A: Local MySQL**

Windows:
- [MySQL Installer ডাউনলোড করুন](https://dev.mysql.com/downloads/installer/)
- MySQL Server 8.0 ইনস্টল করুন
- Password সেট করুন (মনে রাখুন!)

**Option B: Cloud Database (সহজ পদ্ধতি)**

[PlanetScale](https://planetscale.com/) ব্যবহার করুন (ফ্রি):
1. PlanetScale account তৈরি করুন
2. নতুন database তৈরি করুন
3. Connection string কপি করুন

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
# আপনার MySQL connection
DATABASE_URL="mysql://root:your_password@localhost:3306/dairy_farm"

# Random string generate করুন (যেকোনো কিছু লিখতে পারেন)
NEXTAUTH_SECRET="my-super-secret-key-12345"

# Local development এর জন্য
NEXTAUTH_URL="http://localhost:3000"
```

**DATABASE_URL ফরম্যাট:**
```
mysql://[username]:[password]@[host]:[port]/[database_name]
```

উদাহরণ:
- Username: `root`
- Password: `mypassword123`
- Host: `localhost`
- Port: `3306`
- Database: `dairy_farm`

= `mysql://root:mypassword123@localhost:3306/dairy_farm`

### Step 4: Database তৈরি করুন

#### Option A: MySQL Workbench ব্যবহার করে

1. MySQL Workbench খুলুন
2. Local connection এ connect করুন
3. নতুন query tab খুলুন
4. Run করুন:

```sql
CREATE DATABASE dairy_farm;
```

#### Option B: Command Line ব্যবহার করে

```bash
mysql -u root -p
```

Password দিন, তারপর:

```sql
CREATE DATABASE dairy_farm;
EXIT;
```

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

**Error:** `Can't reach database server`

**সমাধান:**
1. MySQL service চালু আছে কিনা চেক করুন
2. `.env` ফাইলে DATABASE_URL সঠিক আছে কিনা চেক করুন
3. Database তৈরি হয়েছে কিনা চেক করুন

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
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="different-secret-for-production"
```

## 🎓 আরো শিখুন

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 💡 টিপস

1. **Regular Backup**: নিয়মিত database backup নিন
2. **Strong Passwords**: শক্তিশালী password ব্যবহার করুন
3. **Environment Variables**: কখনো `.env` ফাইল commit করবেন না
4. **Updates**: নিয়মিত dependencies update করুন

## 🤝 সাহায্য প্রয়োজন?

যদি কোনো সমস্যায় পড়েন:

1. Error message ভালোভাবে পড়ুন
2. Google এ search করুন
3. Documentation চেক করুন
4. GitHub এ issue তৈরি করুন

---

Happy Coding! 🚀🐄

