# ☁️ Cloud Database Setup Guide (MySQL ছাড়াই!)

## বিকল্প ১: PlanetScale (সবচেয়ে সহজ ও ফ্রি) ⭐

### ধাপ ১: PlanetScale Account তৈরি করুন

1. যান: https://planetscale.com
2. "Sign up" ক্লিক করুন
3. GitHub/Google দিয়ে sign up করুন (ফ্রি)

### ধাপ ২: নতুন Database তৈরি করুন

1. Dashboard এ "Create a new database" ক্লিক করুন
2. নাম দিন: `dairy-farm`
3. Region: `AWS - Mumbai` সিলেক্ট করুন (বাংলাদেশের কাছে)
4. "Create database" ক্লিক করুন

### ধাপ ৩: Connection String নিন

1. আপনার database এ ক্লিক করুন
2. "Connect" বাটনে ক্লিক করুন
3. "Prisma" সিলেক্ট করুন
4. Connection string কপি করুন

এরকম দেখাবে:
```
mysql://xxxxxxxxx:************@aws.connect.psdb.cloud/dairy-farm?sslaccept=strict
```

### ধাপ ৪: .env ফাইলে যোগ করুন

আপনার `next.js/.env` ফাইলে এটা পেস্ট করুন:

```env
DATABASE_URL="mysql://xxxxxxxxx:************@aws.connect.psdb.cloud/dairy-farm?sslaccept=strict"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="my-secret-key-change-this-123456"
```

### ধাপ ৫: Database Setup করুন

```bash
cd next.js
npm install
npx prisma generate
npx prisma db push
```

✅ **সব হয়ে গেছে! এখন চালান:**

```bash
npm run dev
```

---

## বিকল্প ২: Railway (আরেকটি ফ্রি option)

### ধাপ ১: Railway Account

1. যান: https://railway.app
2. GitHub দিয়ে sign up করুন

### ধাপ ২: MySQL Database তৈরি করুন

1. "New Project" → "Provision MySQL"
2. Database তৈরি হবে automatically

### ধাপ ৩: Connection Details

1. MySQL service এ ক্লিক করুন
2. "Connect" tab এ যান
3. "MySQL Connection URL" কপি করুন

### ধাপ ৪: .env তে যোগ করুন

```env
DATABASE_URL="mysql://root:password@containers-us-west-xxx.railway.app:5432/railway"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="my-secret-key-123456"
```

### ধাপ ৫: Setup

```bash
cd next.js
npx prisma generate
npx prisma db push
npm run dev
```

---

## বিকল্প ৩: Supabase (PostgreSQL - Free)

### ⚠️ Note: 
এটার জন্য Database schema একটু change করতে হবে (MySQL থেকে PostgreSQL এ)

### ধাপ ১: Account তৈরি করুন

1. যান: https://supabase.com
2. Sign up করুন (ফ্রি)

### ধাপ ২: Project তৈরি করুন

1. "New Project" ক্লিক করুন
2. নাম: `dairy-farm`
3. Database password সেট করুন
4. Region: `South Asia (Mumbai)` সিলেক্ট করুন

### ধাপ ৩: Connection String

1. Project Settings → Database
2. "Connection string" এর নিচে "URI" কপি করুন

### ধাপ ৪: Prisma Schema Update করুন

`next.js/prisma/schema.prisma` ফাইলে পরিবর্তন করুন:

```prisma
datasource db {
  provider = "postgresql"  // এখানে পরিবর্তন
  url      = env("DATABASE_URL")
}
```

### ধাপ ৫: .env Update করুন

```env
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="my-secret-key-123456"
```

### ধাপ ৬: Setup

```bash
cd next.js
npx prisma generate
npx prisma db push
npm run dev
```

---

## 🎯 কোনটা ব্যবহার করবেন?

| Option | সুবিধা | অসুবিধা | Rating |
|--------|---------|----------|---------|
| **PlanetScale** | ⚡ সবচেয়ে সহজ<br>🚀 দ্রুত<br>🌍 MySQL compatible | ❌ বাংলাদেশে slow হতে পারে | ⭐⭐⭐⭐⭐ |
| **Railway** | 💡 Easy setup<br>🎁 $5 free credit | ⏱️ Credit শেষ হলে pay করতে হবে | ⭐⭐⭐⭐ |
| **Supabase** | 🎨 Beautiful UI<br>📊 Built-in admin panel | 🔄 PostgreSQL (schema change লাগবে) | ⭐⭐⭐⭐ |

### 🏆 আমার Recommendation:

**PlanetScale ব্যবহার করুন!** কারণ:
- একদম ফ্রি
- Setup সবচেয়ে সহজ
- MySQL compatible (কোনো schema change লাগবে না)
- Automatic backups
- Reliable

---

## 🆘 সমস্যা সমাধান

### Connection Error?

**চেক করুন:**
1. Internet connection আছে কিনা
2. Connection string সঠিকভাবে কপি করেছেন কিনা
3. Quotes (`"`) এর মধ্যে paste করেছেন কিনা

**Example:**
```env
# ✅ সঠিক
DATABASE_URL="mysql://user:pass@host/db"

# ❌ ভুল
DATABASE_URL=mysql://user:pass@host/db
```

### SSL Error?

PlanetScale এর জন্য `sslaccept=strict` যোগ করুন:
```
DATABASE_URL="mysql://xxx@aws.connect.psdb.cloud/dairy-farm?sslaccept=strict"
```

### Prisma Push Failed?

```bash
# Force reset করুন
npx prisma db push --force-reset

# অথবা
npx prisma migrate dev
```

---

## 💡 Pro Tips

### 1. Database দেখুন

**PlanetScale:**
- Dashboard থেকে "Console" tab এ যান
- SQL queries চালাতে পারবেন

**Prisma Studio:**
```bash
npx prisma studio
```

### 2. Backup নিন

Cloud databases automatic backup নেয়, তবে manual backup এর জন্য:

```bash
# Export data
npx prisma db pull
```

### 3. Connection Test করুন

```bash
npx prisma db execute --stdin <<EOF
SELECT 1;
EOF
```

---

## ✅ Checklist

- [ ] Cloud database account তৈরি করেছি
- [ ] New database তৈরি করেছি
- [ ] Connection string কপি করেছি
- [ ] `.env` ফাইলে paste করেছি
- [ ] `npx prisma generate` চালিয়েছি
- [ ] `npx prisma db push` সফল হয়েছে
- [ ] `npm run dev` চালু হয়েছে
- [ ] Browser এ http://localhost:3000 খুলেছি

---

## 🎉 সফল হলে

আপনি এখন:
- ✅ MySQL install ছাড়াই database ব্যবহার করতে পারছেন
- ✅ যেকোনো জায়গা থেকে access করতে পারবেন
- ✅ Automatic backups পাবেন
- ✅ Production-ready setup আছে

**পরবর্তী পদক্ষেপ:**
1. Sign up করে user তৈরি করুন
2. Animals যোগ করুন
3. System ব্যবহার শুরু করুন!

---

Made with ❤️ - No Local MySQL Needed!
