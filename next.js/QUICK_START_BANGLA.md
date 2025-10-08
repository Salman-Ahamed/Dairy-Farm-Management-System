# 🚀 দ্রুত শুরু করুন - ডেইরি ফার্ম ম্যানেজমেন্ট সিস্টেম

## 📦 যা যা লাগবে

1. **Node.js** - [ডাউনলোড](https://nodejs.org/)
2. **MySQL** - [ডাউনলোড](https://dev.mysql.com/downloads/) অথবা [PlanetScale](https://planetscale.com/) (ফ্রি ক্লাউড)
3. **Code Editor** - [VS Code](https://code.visualstudio.com/) (সুপারিশকৃত)

## 🎯 ৫ মিনিটে সেটআপ

### ধাপ ১: প্রজেক্ট ফোল্ডারে যান

```bash
cd next.js
```

### ধাপ ২: প্যাকেজ ইনস্টল করুন

```bash
npm install
```

⏳ এতে ৫-১০ মিনিট লাগতে পারে। অপেক্ষা করুন...

### ধাপ ৩: ডাটাবেস তৈরি করুন

**MySQL খুলুন** এবং রান করুন:

```sql
CREATE DATABASE dairy_farm;
```

### ধাপ ৪: Environment File তৈরি করুন

`.env.example` কপি করে `.env` নাম দিন এবং এডিট করুন:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/dairy_farm"
NEXTAUTH_SECRET="any-random-text-here-123456"
NEXTAUTH_URL="http://localhost:3000"
```

**গুরুত্বপূর্ণ:** 
- `your_password` এর জায়গায় আপনার MySQL password দিন
- `any-random-text-here-123456` এর জায়গায় যেকোনো টেক্সট দিন

### ধাপ ৫: ডাটাবেস সেটআপ করুন

```bash
npx prisma generate
npx prisma db push
```

### ধাপ ৬: প্রজেক্ট চালু করুন

```bash
npm run dev
```

### ধাপ ৭: Browser এ খুলুন

👉 যান: **http://localhost:3000**

## 🎉 প্রথম ব্যবহার

### ১. একাউন্ট তৈরি করুন

- "Sign Up" বাটনে ক্লিক করুন
- আপনার তথ্য দিন:
  - নাম: `আপনার নাম`
  - ইমেইল: `admin@example.com`
  - Role: `Admin` সিলেক্ট করুন
  - পাসওয়ার্ড: `নিরাপদ পাসওয়ার্ড`

### ২. লগইন করুন

- ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন
- Dashboard দেখতে পাবেন

### ৩. প্রথম Animal যোগ করুন

1. Sidebar থেকে **"Animal Records"** এ ক্লিক করুন
2. **"Add Animal"** বাটনে ক্লিক করুন
3. তথ্য পূরণ করুন:
   - Tag Number: `A001`
   - Breed: `Holstein`
   - Gender: `Female` সিলেক্ট করুন
   - Date of Birth: তারিখ সিলেক্ট করুন
   - Current Weight: `450` (kg)
4. **"Create Animal"** বাটনে ক্লিক করুন

## 🎯 মূল বৈশিষ্ট্য

### 📋 সবগুলো Module

1. **Dashboard** - সামগ্রিক তথ্য দেখুন
2. **Animal Records** - পশু রেজিস্টার ও পরিচালনা
3. **Animal Health** - স্বাস্থ্য রেকর্ড
4. **Animal Weight** - ওজন ট্র্যাকিং
5. **Breeding** - প্রজনন রেকর্ড
6. **Milk Records** - দুধ উৎপাদন
7. **Milk Sales** - দুধ বিক্রয়
8. **Stock Feed** - খাদ্য মজুদ
9. **Employees** - কর্মচারী ব্যবস্থাপনা
10. **Farm Finance** - আয়-ব্যয় হিসাব

### 🔑 প্রতিটি Module এর কাজ

**Animal Records:**
- নতুন পশু যোগ করুন
- পশুর তথ্য দেখুন/এডিট করুন
- Tag number দিয়ে সার্চ করুন
- Status ট্র্যাক করুন

**Milk Records:**
- প্রতিদিন দুধের পরিমাণ লিখুন
- সকাল, দুপুর, সন্ধ্যার হিসাব
- Quality ট্র্যাক করুন
- পশু-ভিত্তিক রিপোর্ট

**Finance:**
- আয় রেকর্ড করুন
- খরচ রেকর্ড করুন
- লাভ-লোকসান দেখুন
- Category-wise হিসাব

## 🐛 সমস্যা হলে

### Database Connect হচ্ছে না?

**চেক করুন:**
1. MySQL চালু আছে কিনা
2. `.env` ফাইলে password সঠিক আছে কিনা
3. `dairy_farm` database তৈরি হয়েছে কিনা

**সমাধান:**
```bash
# Database reset করুন
npx prisma db push --force-reset
```

### Port 3000 Already in Use?

**অন্য port ব্যবহার করুন:**
```bash
npm run dev -- -p 3001
```

এরপর যান: `http://localhost:3001`

### Module Not Found Error?

**সমাধান:**
```bash
# node_modules ডিলিট করুন
rm -rf node_modules

# আবার install করুন
npm install
```

### Prisma Error?

**সমাধান:**
```bash
npx prisma generate
npx prisma db push
```

## 💡 দরকারি টিপস

### 1. Data Backup নিন

```bash
# Database backup
mysqldump -u root -p dairy_farm > backup.sql
```

### 2. Database দেখুন

```bash
# Prisma Studio খুলুন
npx prisma studio
```

Browser এ database GUI দেখতে পাবেন!

### 3. নিয়মিত Update করুন

```bash
# Check করুন
npm outdated

# Update করুন
npm update
```

## 📱 Mobile থেকে ব্যবহার

1. আপনার কম্পিউটারের IP address বের করুন:
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. Mobile এর browser এ যান:
   ```
   http://YOUR_IP:3000
   ```
   
   উদাহরণ: `http://192.168.1.100:3000`

## 🚀 Production এ Deploy

### Vercel (সহজ ও ফ্রি)

1. [Vercel.com](https://vercel.com) এ যান
2. GitHub এ code push করুন
3. "Import Project" ক্লিক করুন
4. Environment variables যোগ করুন:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
5. Deploy করুন!

## 📚 আরো শিখুন

- **Next.js Tutorial:** [nextjs.org/learn](https://nextjs.org/learn)
- **Prisma Tutorial:** [prisma.io/docs](https://prisma.io/docs)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)

## 🎓 ভিডিও টিউটোরিয়াল (প্রস্তাবিত)

YouTube এ search করুন:
- "Next.js 14 Tutorial Bangla"
- "Prisma MySQL Tutorial"
- "React Basics Bangla"

## ✅ Checklist: সব ঠিক আছে?

- [ ] Node.js ইনস্টল হয়েছে
- [ ] MySQL ইনস্টল হয়েছে
- [ ] `npm install` সফল হয়েছে
- [ ] Database তৈরি হয়েছে
- [ ] `.env` ফাইল সেট করা হয়েছে
- [ ] `prisma db push` সফল হয়েছে
- [ ] `npm run dev` চালু হয়েছে
- [ ] Browser এ login page দেখা যাচ্ছে
- [ ] Sign up করতে পারছি
- [ ] Login করতে পারছি
- [ ] Dashboard দেখতে পাচ্ছি

## 🆘 Help দরকার?

### সাধারণ Commands

```bash
# Development চালু করুন
npm run dev

# Build করুন (production জন্য)
npm run build

# Production চালু করুন
npm run start

# Database GUI খুলুন
npx prisma studio

# Database reset করুন
npx prisma db push --force-reset
```

### File Structure দেখুন

```
next.js/
├── src/
│   ├── app/
│   │   ├── dashboard/  ← সব pages এখানে
│   │   ├── api/        ← সব API এখানে
│   │   └── login/      ← Login page
│   ├── components/     ← UI components
│   └── lib/           ← Helper functions
├── prisma/
│   └── schema.prisma  ← Database schema
└── .env               ← আপনার settings
```

## 🎯 পরবর্তী পদক্ষেপ

1. ✅ সব modules এ data যোগ করুন
2. ✅ আপনার team কে access দিন
3. ✅ Regular backup নিন
4. ✅ নিয়মিত ব্যবহার করুন
5. ✅ Feedback দিন এবং improve করুন

---

## 🎉 অভিনন্দন!

আপনি এখন একটি modern web-based dairy farm management system ব্যবহার করতে পারছেন!

**সফল হোন! 🚀🐄**

---

**সমস্যা হলে:**
- README.md পড়ুন (বিস্তারিত)
- SETUP_GUIDE.md পড়ুন (step by step)
- PROJECT_SUMMARY.md পড়ুন (technical details)

**যোগাযোগ:** GitHub Issues তৈরি করুন

Made with ❤️ in Bangladesh

