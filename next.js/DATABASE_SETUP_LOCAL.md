# 💻 Local MySQL Installation Guide

যদি আপনি Local MySQL install করতে চান (Cloud database না চাইলে)

## 🪟 Windows এ MySQL Install

### Method 1: MySQL Installer (সহজ পদ্ধতি)

#### Step 1: Download করুন

1. যান: https://dev.mysql.com/downloads/installer/
2. "Windows (x86, 32-bit), MSI Installer" (Bigger size) ডাউনলোড করুন
3. "No thanks, just start my download" ক্লিক করুন

#### Step 2: Install করুন

1. Downloaded file রান করুন
2. Setup Type: **"Developer Default"** সিলেক্ট করুন
3. "Next" ক্লিক করুন
4. সব requirements install হতে দিন

#### Step 3: Configuration

**MySQL Server Configuration:**

1. **Config Type:** Development Computer
2. **Port:** 3306 (default রাখুন)
3. **Root Password:** একটি strong password সেট করুন
   - উদাহরণ: `MySecurePass123!`
   - ⚠️ এই password মনে রাখুন!
4. "Next" ক্লিক করুন
5. "Execute" ক্লিক করুন

**MySQL Router Configuration:**

- সব default রাখুন, "Next" করতে থাকুন

**Complete Installation:**

- "Finish" ক্লিক করুন

#### Step 4: Verify Installation

1. Start Menu এ search করুন: "MySQL Workbench"
2. Open করুন
3. "Local instance MySQL80" এ connect করুন
4. Password দিন

✅ যদি connect হয়, তাহলে installation সফল!

---

### Method 2: XAMPP (সবচেয়ে সহজ)

#### Step 1: Download

1. যান: https://www.apachefriends.org/
2. Windows version ডাউনলোড করুন

#### Step 2: Install

1. Downloaded file রান করুন
2. Components এ **শুধু MySQL** check করুন
3. Install location: `C:\xampp` (default)
4. Install করুন

#### Step 3: Start MySQL

1. XAMPP Control Panel খুলুন
2. MySQL এর পাশে "Start" বাটন ক্লিক করুন
3. ✅ সবুজ background হলে running

#### Step 4: Create Database

1. Browser এ যান: http://localhost/phpmyadmin
2. "New" ক্লিক করুন (left sidebar)
3. Database name: `dairy_farm`
4. Collation: `utf8mb4_unicode_ci`
5. "Create" ক্লিক করুন

#### Step 5: .env Configuration

```env
DATABASE_URL="mysql://root:@localhost:3306/dairy_farm"
```

⚠️ XAMPP এ default MySQL password **blank** থাকে!

---

## 🍎 Mac এ MySQL Install

### Method 1: Homebrew (Recommended)

#### Step 1: Install Homebrew (যদি না থাকে)

Terminal এ paste করুন:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Step 2: Install MySQL

```bash
brew install mysql
```

#### Step 3: Start MySQL Service

```bash
brew services start mysql
```

#### Step 4: Secure Installation

```bash
mysql_secure_installation
```

প্রশ্নগুলোর উত্তর:

1. Set root password? **Yes** → Password দিন
2. Remove anonymous users? **Yes**
3. Disallow root login remotely? **Yes**
4. Remove test database? **Yes**
5. Reload privilege tables? **Yes**

#### Step 5: Verify

```bash
mysql -u root -p
```

Password দিন।

যদি MySQL prompt আসে, তাহলে ✅ successful!

---

### Method 2: DMG Installer

1. যান: https://dev.mysql.com/downloads/mysql/
2. macOS DMG Archive ডাউনলোড করুন
3. .dmg file open করুন
4. .pkg file install করুন
5. System Preferences → MySQL এ গিয়ে Start করুন

---

## 🐧 Linux (Ubuntu) এ MySQL Install

### Step 1: Update Package List

```bash
sudo apt update
```

### Step 2: Install MySQL Server

```bash
sudo apt install mysql-server
```

### Step 3: Start MySQL

```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Step 4: Secure Installation

```bash
sudo mysql_secure_installation
```

### Step 5: Create User (Optional)

```bash
sudo mysql

CREATE USER 'dairy_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON *.* TO 'dairy_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 📝 Database তৈরি করুন

### Method 1: MySQL Workbench (Windows)

1. MySQL Workbench খুলুন
2. Local connection এ connect করুন
3. Query tab এ paste করুন:

```sql
CREATE DATABASE dairy_farm;
USE dairy_farm;
```

4. ⚡ lightning icon ক্লিক করুন (Run)

### Method 2: Command Line

**Windows:**

```cmd
mysql -u root -p
```

**Mac/Linux:**

```bash
mysql -u root -p
```

Password দিন, তারপর:

```sql
CREATE DATABASE dairy_farm;
EXIT;
```

### Method 3: phpMyAdmin (XAMPP)

1. Browser এ: http://localhost/phpmyadmin
2. "New" ক্লিক করুন
3. Database name: `dairy_farm`
4. "Create" ক্লিক করুন

---

## ⚙️ Project Configuration

### Step 1: .env File তৈরি করুন

`next.js/.env` ফাইল তৈরি করুন:

```env
# MySQL Connection
# Format: mysql://username:password@host:port/database_name

# Default (root user)
DATABASE_URL="mysql://root:your_password@localhost:3306/dairy_farm"

# XAMPP (no password)
# DATABASE_URL="mysql://root:@localhost:3306/dairy_farm"

# Custom user
# DATABASE_URL="mysql://dairy_user:password123@localhost:3306/dairy_farm"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-random-text-123456"

# Optional: Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@dairyfarm.com"
```

### Step 2: Connection String Format

```
mysql://[username]:[password]@[host]:[port]/[database]
```

**Examples:**

```env
# With password
DATABASE_URL="mysql://root:MyPass123@localhost:3306/dairy_farm"

# Without password (XAMPP)
DATABASE_URL="mysql://root:@localhost:3306/dairy_farm"

# Different port
DATABASE_URL="mysql://root:password@localhost:3307/dairy_farm"

# Remote database
DATABASE_URL="mysql://user:pass@192.168.1.100:3306/dairy_farm"
```

### Step 3: Test Connection

```bash
cd next.js
npx prisma db execute --stdin <<EOF
SELECT 1;
EOF
```

✅ যদি error না আসে, connection successful!

---

## 🔧 MySQL Configuration Tips

### 1. Change MySQL Port (যদি 3306 busy থাকে)

**Windows:**

1. `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini` open করুন
2. খুঁজুন: `port=3306`
3. পরিবর্তন করুন: `port=3307`
4. MySQL service restart করুন

**Mac/Linux:**

```bash
sudo nano /etc/mysql/my.cnf
# port পরিবর্তন করুন
sudo systemctl restart mysql
```

### 2. Increase Max Connections

```sql
SET GLOBAL max_connections = 500;
```

### 3. Check MySQL Status

**Windows:**

```cmd
services.msc
```

MySQL80 service খুঁজুন

**Mac:**

```bash
brew services list
```

**Linux:**

```bash
sudo systemctl status mysql
```

---

## 🐛 Common Problems & Solutions

### Problem 1: "Can't connect to MySQL server"

**Solution:**

```bash
# Check if MySQL is running

# Windows
services.msc → MySQL80 → Start

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
```

### Problem 2: "Access denied for user 'root'@'localhost'"

**Solution:**

```bash
# Reset root password
mysql -u root

ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewPassword123';
FLUSH PRIVILEGES;
EXIT;
```

### Problem 3: Port 3306 already in use

**Solution:**

```bash
# Find what's using port 3306
netstat -ano | findstr :3306

# Kill the process or change MySQL port
```

### Problem 4: MySQL service won't start

**Solution:**

**Windows:**

1. Event Viewer check করুন
2. MySQL error log দেখুন: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\`
3. Reinstall করুন

**Mac/Linux:**

```bash
# Check logs
sudo tail -f /var/log/mysql/error.log

# Fix permissions
sudo chown -R mysql:mysql /var/lib/mysql
```

---

## ✅ Final Setup

### 1. Install Dependencies

```bash
cd next.js
npm install
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Push Database Schema

```bash
npx prisma db push
```

### 4. Verify Database

```bash
npx prisma studio
```

Browser এ database GUI খুলবে!

### 5. Run Application

```bash
npm run dev
```

Open: http://localhost:3000

---

## 🎯 Checklist

- [ ] MySQL downloaded
- [ ] MySQL installed
- [ ] MySQL service running
- [ ] Root password set
- [ ] Database `dairy_farm` created
- [ ] `.env` file configured
- [ ] Connection tested
- [ ] `npx prisma generate` successful
- [ ] `npx prisma db push` successful
- [ ] Application running

---

## 💡 Pro Tips

### 1. MySQL Workbench Shortcuts

- **Run Query:** `Ctrl + Enter`
- **New Query:** `Ctrl + T`
- **Format Query:** `Ctrl + B`

### 2. Backup Database

```bash
# Backup
mysqldump -u root -p dairy_farm > backup.sql

# Restore
mysql -u root -p dairy_farm < backup.sql
```

### 3. GUI Tools (Alternative to Workbench)

- **HeidiSQL** (Windows) - Free
- **Sequel Ace** (Mac) - Free
- **DBeaver** (All platforms) - Free
- **TablePlus** (All platforms) - Paid

---

## 🆘 Need Help?

যদি local MySQL install এ কোনো সমস্যা হয়:

1. **Cloud database ব্যবহার করুন** (সহজ!) → `DATABASE_SETUP_CLOUD.md` দেখুন
2. **XAMPP ব্যবহার করুন** (সবচেয়ে সহজ local option)
3. Error message Google এ search করুন
4. MySQL documentation দেখুন

---

**Recommendation:** Cloud database (PlanetScale) ব্যবহার করুন - সহজ, ফ্রি, এবং reliable! 🚀
