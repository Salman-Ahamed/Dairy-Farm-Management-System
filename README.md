# 🐄 Dairy Farm Management System - Next.js

A modern, full-stack web application for managing dairy farm operations, built with Next.js 14, TypeScript, Prisma, and MySQL. This comprehensive system helps dairy farmers manage every aspect of their operations, from animal care to financial tracking, with advanced automation features.

## ✨ Core Features

### 🔐 Authentication & User Management

- Secure login and registration with NextAuth.js
- Role-based access control (Admin/Manager/User)
- Password encryption with bcrypt
- Session management with JWT

### 🐮 Animal Records Management

- Complete animal profiles with unique tag numbers
- Track breed, age, gender, and health status
- Record purchase information and current weight
- View complete animal history and timeline
- **Full CRUD operations** (Create, Read, Update, Delete)
- **Individual animal view** with detailed information
- Animal status tracking (Active, Sold, Deceased, Transferred)

### ❤️ Health Management System

- Record health examinations and treatments
- Track diseases, symptoms, and medications
- Assign veterinarians and record costs
- Schedule follow-up checkups
- Health status monitoring (Healthy, Under Treatment, Critical, Recovered)
- **Complete health history** per animal

### ⚖️ Weight Tracking

- Monitor animal growth and body condition
- Track weight changes over time
- Record height and body condition scores
- Visual weight progression charts
- **Growth analytics** and trends

### 👶 Breeding Management

- Manage breeding cycles (Natural & Artificial Insemination)
- Track male and female animals in breeding
- Expected and actual delivery dates
- Record breeding outcomes (Successful, Failed, Aborted, Pending)
- Offspring tracking and breeding costs

### 🥛 Milk Production Tracking

- Daily milk production recording (Morning, Afternoon, Evening)
- Automatic total calculation
- Quality assessment (Excellent, Good, Average, Poor)
- Fat content tracking
- **Per-animal production** tracking
- Production reports and analytics

### 💰 Advanced Milk Sales System

- **Customer Management Integration**
  - Complete customer database with contact details
  - Default price per customer
  - Purchase history tracking
- **Smart Payment System**
  - Track total amount vs. amount paid
  - **Customer Balance Management** (Credit/Due tracking)
  - **Auto-payment from customer credit balance**
  - Support for advance payments
  - Payment status tracking (Paid, Pending, Overdue)
- **Automatic Financial Integration**
  - Auto-create income records when payment status is PAID
  - Track cash payments separately
  - Detailed transaction history
- **Auto-Settle Pending Dues**
  - One-click settlement of pending dues from customer credit
  - Intelligent partial payment handling
  - Oldest dues settled first
  - Automatic status updates

### 📦 Milk Stock Management

- **Real-time stock calculation** (Production - Sales)
- Current milk stock display on dashboard
- Color-coded stock alerts (Low, Medium, High)
- Weekly and monthly stock analysis
- Dedicated milk stock page with detailed analytics
- Recent activity tracking (Production & Sales)

### 👥 Customer Management

- Complete customer database
- Contact information (Phone, Email, Address)
- Default pricing per customer
- **Customer Balance Tracking**
  - Positive balance = Advance/Credit
  - Negative balance = Due/Pending payment
- Total purchases tracking
- Last purchase date
- Full purchase history with due amounts
- Customer-wise sales reports

### 🌾 Stock Feed Inventory

- Feed type management (Concentrate, Roughage, Supplements)
- Purchase tracking with supplier information
- Expiry date monitoring
- Current stock levels
- Minimum stock alerts
- Cost tracking per unit
- **Auto-integration with Finance** (Expense tracking)

### 👥 Employee Management

- Employee records with unique IDs
- Position and department tracking
- Contact information
- Salary management
- Join/leave date tracking
- Employee status (Active, Inactive, Terminated, Resigned)

### 📊 Financial Management System

- **Comprehensive income tracking**
  - Milk sales (automatic)
  - Balance adjustments
  - Other income sources
- **Expense tracking**
  - Stock feed purchases (automatic)
  - Health treatments
  - Employee salaries
  - Other expenses
- **Advanced Features**
  - Automatic integration with Milk Sales
  - Automatic integration with Stock Feed
  - Transaction categorization
  - Reference number tracking
  - Detailed descriptions with breakdowns
  - Payment method tracking
  - **Pagination** (5 records per page)
  - Date-wise filtering
- **Financial Analytics**
  - Income vs. Expense comparison
  - Monthly/Yearly summaries
  - Profitability tracking

### 📈 Intelligent Dashboard

- **Real-time Statistics**
  - Total animals count
  - Health alerts
  - Today's milk production
  - Current milk stock with alerts
  - Active employees
  - Monthly sales
- **Quick Actions** (One-click shortcuts)
  - Add Milk Production
  - Add Milk Sale
  - Add Health Record
  - Add Stock Feed
- **Recent Activity Feed**
  - Latest milk production records
  - Recent milk sales
  - New health reports
  - Newly added animals
  - Recent stock feed purchases
  - Time-ago formatting
  - Color-coded activity icons

## 🔄 Key Workflows

### 1. 🥛 Milk Sale Workflow (with Auto-Payment)

```
┌─────────────────────────────────────────────────────────────┐
│                    MILK SALE WORKFLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Select Customer                                          │
│     ├─ Shows customer's available credit (if any)          │
│     ├─ Shows customer's pending dues (if any)              │
│     └─ Auto-fills default price                            │
│                                                              │
│  2. Enter Sale Details                                       │
│     ├─ Quantity (Liters)                                    │
│     ├─ Price per Liter                                      │
│     └─ Total Amount = Quantity × Price                     │
│                                                              │
│  3. Auto-Payment Calculation                                 │
│     ├─ System checks customer's credit balance             │
│     ├─ Auto-applies credit to current sale                 │
│     └─ Shows remaining due (if any)                        │
│                                                              │
│  4. Additional Payment (Optional)                            │
│     └─ Customer can pay extra cash                         │
│                                                              │
│  5. Payment Status (Auto-Updated)                           │
│     ├─ PAID: If fully paid (credit + cash)                │
│     └─ PENDING: If partial payment                         │
│                                                              │
│  6. Automatic Backend Actions                                │
│     ├─ Update customer balance                             │
│     ├─ Record milk sale                                    │
│     ├─ Create finance income record (if PAID)             │
│     └─ Update customer purchase history                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Example Scenarios:**

**Scenario A: Customer with Credit**

- Customer Balance: +৳500 (Advance)
- New Sale: 10L × ৳80 = ৳800
- Auto-payment: ৳500 from credit
- Customer pays: ৳300 cash
- Result: Balance = ৳0, Status = PAID ✓

**Scenario B: Customer with Insufficient Credit**

- Customer Balance: +৳200
- New Sale: 10L × ৳80 = ৳800
- Auto-payment: ৳200 from credit
- Customer pays: ৳0 cash
- Result: Balance = -৳600, Status = PENDING (৳600 due)

---

### 2. 💳 Auto-Settle Pending Dues Workflow

```
┌─────────────────────────────────────────────────────────────┐
│              AUTO-SETTLE PENDING DUES WORKFLOW               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Customer Gives Advance Payment                           │
│     └─ Add ৳2000 to customer balance                        │
│                                                              │
│  2. System Detects Pending Dues                              │
│     ├─ Checks all customer's sales                         │
│     ├─ Identifies sales with due amounts                   │
│     └─ Shows "Auto-Settle" card on customer detail page    │
│                                                              │
│  3. View Settlement Preview                                  │
│     ├─ Shows number of pending sales                       │
│     ├─ Shows total due amount                              │
│     ├─ Shows available credit                              │
│     └─ Indicates full/partial settlement possibility       │
│                                                              │
│  4. Click "Auto-Settle Dues" Button                          │
│     └─ Confirmation dialog appears                          │
│                                                              │
│  5. Automatic Settlement Process (Oldest First)              │
│     ├─ Get all sales with due amounts                      │
│     ├─ Sort by date (oldest first)                         │
│     ├─ Pay each sale using available credit                │
│     ├─ Update sale status to PAID (if fully paid)         │
│     ├─ Create finance income records                       │
│     └─ Update customer's remaining balance                 │
│                                                              │
│  6. Settlement Complete                                      │
│     ├─ Shows success message                               │
│     ├─ Displays settled count and amount                   │
│     └─ Shows remaining balance                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Example:**

- Customer Balance: +৳2000
- Pending Sales:
  - Oct 1: ৳500 due → Paid ✓
  - Oct 3: ৳800 due → Paid ✓
  - Oct 5: ৳400 due → Paid ✓
- Total Settled: ৳1700
- Remaining Balance: ৳300

---

### 3. 📦 Milk Stock Tracking Workflow

```
┌─────────────────────────────────────────────────────────────┐
│               MILK STOCK TRACKING WORKFLOW                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Real-time Calculation:                                      │
│  ════════════════════                                        │
│                                                              │
│  Current Stock = Total Production - Total Sales              │
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │ Milk Production  │         │   Milk Sales     │        │
│  │   Record Added   │    →    │  Record Added    │   →    │
│  │  (+50L today)    │         │  (-30L today)    │        │
│  └──────────────────┘         └──────────────────┘        │
│                                                              │
│           ↓                              ↓                   │
│                                                              │
│  ┌────────────────────────────────────────────────┐        │
│  │     Current Stock = 50L - 30L = 20L            │        │
│  │                                                  │        │
│  │     Status: 🔴 Low Stock (< 50L)              │        │
│  └────────────────────────────────────────────────┘        │
│                                                              │
│  Dashboard Display:                                          │
│  ─────────────────                                          │
│  - Current Stock with color alerts                          │
│  - Weekly production vs. sales                              │
│  - Monthly trends                                           │
│  - Recent activities                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. 🏦 Automatic Finance Integration

```
┌─────────────────────────────────────────────────────────────┐
│          AUTOMATIC FINANCE INTEGRATION WORKFLOW              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  INCOME (Automatic):                                         │
│  ════════════════                                           │
│                                                              │
│  Milk Sale (PAID)          →    Finance Record Created      │
│  ├─ Amount: Cash payment only                              │
│  ├─ Category: "Milk Sale"                                  │
│  ├─ Description: Details with breakdown                    │
│  └─ Reference: MILK-SALE-{id}                              │
│                                                              │
│  Customer Balance Adjustment  →    Finance Record Created   │
│  ├─ Amount: Adjustment amount                              │
│  ├─ Category: "Balance Adjustment"                         │
│  └─ Reference: BALANCE-ADJ-{id}                            │
│                                                              │
│                                                              │
│  EXPENSE (Automatic):                                        │
│  ═════════════════                                          │
│                                                              │
│  Stock Feed Purchase    →    Finance Record Created         │
│  ├─ Amount: Total cost                                     │
│  ├─ Category: "Stock Feed Purchase"                        │
│  ├─ Description: Feed details                              │
│  └─ Reference: STOCKFEED-{id}                              │
│                                                              │
│  Actions that Sync Finance:                                 │
│  ───────────────────────                                   │
│  ✓ Create  → Finance record created                        │
│  ✓ Update  → Finance record updated                        │
│  ✓ Delete  → Finance record deleted                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. 👤 Complete Customer Journey

```
┌─────────────────────────────────────────────────────────────┐
│              COMPLETE CUSTOMER JOURNEY                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Day 1: Customer Registration                                │
│  ─────────────────────────                                  │
│  - Add new customer: "Karim"                                │
│  - Set default price: ৳80/L                                 │
│  - Add contact info                                         │
│  - Initial balance: ৳0                                      │
│                                                              │
│  Day 2: First Sale (Credit Sale)                            │
│  ────────────────────────────                               │
│  - Sale: 20L × ৳80 = ৳1600                                 │
│  - Customer pays: ৳0                                        │
│  - Balance: -৳1600 (Due)                                   │
│  - Status: PENDING                                          │
│                                                              │
│  Day 3: Second Sale (More Debt)                             │
│  ───────────────────────────                                │
│  - Sale: 15L × ৳80 = ৳1200                                 │
│  - Customer pays: ৳0                                        │
│  - Balance: -৳2800 (Total Due)                             │
│  - Status: PENDING                                          │
│                                                              │
│  Day 5: Customer Gives Advance                              │
│  ──────────────────────────                                 │
│  - Customer pays: ৳5000 (Advance for future)               │
│  - Balance: -৳2800 + ৳5000 = +৳2200                       │
│                                                              │
│  Day 5: Auto-Settle Pending Dues                            │
│  ────────────────────────────                               │
│  - Click "Auto-Settle" button                              │
│  - System settles 2 pending sales (৳2800)                 │
│  - Both marked as PAID                                      │
│  - Finance records created                                  │
│  - New Balance: +৳2200 - ৳2800 = -৳600 (Adjusted)        │
│                                                              │
│  Day 7: New Sale (Auto-Payment)                             │
│  ───────────────────────────                                │
│  - Sale: 10L × ৳80 = ৳800                                  │
│  - Auto-payment from credit: ৳600                          │
│  - Customer pays cash: ৳200                                │
│  - Balance: ৳0                                              │
│  - Status: PAID ✓                                          │
│                                                              │
│  Day 10: New Sale (Advance Payment)                         │
│  ────────────────────────────────                           │
│  - Sale: 5L × ৳80 = ৳400                                   │
│  - Customer pays: ৳1000                                    │
│  - Balance: +৳600 (Credit for next time)                   │
│  - Status: PAID ✓                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 6. 📊 Daily Farm Operations Flow

```
Morning:
────────
1. Login to Dashboard
2. Check health alerts
3. Record morning milk production
4. Check milk stock levels
5. If low stock alert → Plan sales

Midday:
───────
1. Record any health issues
2. Add animal weight records
3. Check breeding schedules
4. Record afternoon milk production

Evening:
────────
1. Record evening milk production
2. Process milk sales
   - Select customer
   - Auto-payment applied
   - Update balances
3. Check pending dues
4. Settle dues if customer paid
5. Update stock feed inventory
6. Review financial summary

Weekly:
───────
1. Analyze milk production trends
2. Review customer balances
3. Settle pending dues
4. Check stock feed levels
5. Employee attendance/salary
6. Financial reports

Monthly:
────────
1. Complete financial analysis
2. Customer payment review
3. Health record summary
4. Breeding outcomes
5. Profitability assessment
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MySQL with Prisma ORM
- **Authentication:** NextAuth.js v4
- **UI Components:** Radix UI + Tailwind CSS
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form + Zod
- **Charts:** Recharts
- **Date Handling:** date-fns
- **Icons:** Lucide React

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

## 📝 Usage Guide

### First Time Setup

1. Navigate to `http://localhost:3000`
2. Click on "Sign Up" to create your account
3. Fill in your details and select your role (Admin/Manager/User)
4. Login with your credentials
5. Start managing your dairy farm!

---

## 🚀 Quick Start Guide

Once logged in, follow these steps to get started:

### Step 1: Add Your Animals

1. Go to **Animals** page
2. Click **"Add New Animal"**
3. Fill in details (Tag Number, Breed, Gender, Date of Birth, etc.)
4. Save the animal

### Step 2: Set Up Customers

1. Go to **Customers** page
2. Click **"Add New Customer"**
3. Enter customer name, contact info
4. Set default price per liter (optional)
5. Save customer

### Step 3: Record Milk Production

1. Go to **Milk Production** page
2. Click **"Add New Record"**
3. Select animal
4. Enter production amounts (Morning, Afternoon, Evening)
5. Total is calculated automatically
6. Save record

### Step 4: Make a Milk Sale

1. Go to **Milk Sales** page
2. Click **"Add New Sale"**
3. Select customer from dropdown (or enter new buyer name)
4. Enter quantity and price
5. **Payment Features:**
   - System shows customer's available credit
   - Credit is automatically applied to sale
   - Enter additional cash payment (if any)
   - Payment status auto-updates if fully paid
6. Save sale

**Result:**

- Milk stock automatically updated ✅
- Customer balance updated ✅
- Finance income record created (if PAID) ✅

### Step 5: Monitor Dashboard

1. Go to **Dashboard**
2. View:
   - Total animals
   - Today's milk production
   - Current milk stock (with color alerts)
   - Recent activities
3. Use **Quick Actions** for fast data entry:
   - Add Milk Production
   - Add Milk Sale
   - Add Health Record
   - Add Stock Feed

### Step 6: Manage Customer Balances

1. Go to **Customers** page
2. Click on a customer to view details
3. View:
   - Current balance (Credit/Due)
   - Complete purchase history
   - Pending dues
4. **Balance Actions:**
   - **Adjust Balance:** Manually add/deduct amount
   - **Auto-Settle Dues:** One-click to settle all pending dues from credit

### Step 7: Track Finances

1. Go to **Finance** page
2. View all income and expenses
3. **Automatic Records:**
   - Milk sales (when PAID)
   - Stock feed purchases
   - Customer balance adjustments
4. Filter by date and type
5. View total income vs. expenses

### Step 8: Monitor Milk Stock

1. Check **Dashboard** for current stock
2. Go to **Milk Stock** page for detailed analysis:
   - Current stock with alerts
   - Weekly/Monthly production vs. sales
   - Recent activities
   - Quick action buttons

### Step 9: Add Stock Feed

1. Go to **Stock Feed** page
2. Click **"Add New Stock Feed"**
3. Enter feed details (Type, Quantity, Supplier, Cost)
4. Save record

**Result:**

- Finance expense record automatically created ✅

### Step 10: Track Animal Health

1. Go to **Health Management** page
2. Click **"Add New Health Record"**
3. Select animal
4. Enter disease, symptoms, treatment, medication
5. Add veterinarian name and cost
6. Set next checkup date
7. Save record

---

## 💡 Pro Tips

### For Milk Sales

- Always select an existing customer to automatically apply credit
- The system shows a real-time payment summary
- Green badge = Credit, Red badge = Due
- If customer has credit, it's automatically applied to new sales

### For Customer Management

- Set default price per customer to save time
- Use "Auto-Settle Dues" when customer pays advance
- Orange highlighted rows in purchase history = Has pending dues
- Customer balance: + (Credit) / - (Due)

### For Finance Tracking

- No need to manually add milk sale income (automatic)
- No need to manually add stock feed expense (automatic)
- Use pagination to view older records (5 per page)
- Check reference numbers to trace back to original transactions

### For Milk Stock

- Red alert (<50L) = Low stock, need to reduce sales
- Orange alert (<100L) = Medium stock
- Cyan/Green (≥100L) = Good stock
- Stock calculation: Production - Sales (automatic)

### For Dashboard

- Use Quick Actions for fast data entry
- Recent Activity shows last 5 actions across all modules
- Color-coded icons help identify activity type
- Stock alert visible at a glance

## 🗂️ Project Structure

```
next.js/
├── prisma/
│   ├── schema.prisma                      # Database schema with 11 models
│   └── migrations/                        # Database migration files
├── src/
│   ├── app/
│   │   ├── api/                          # API routes (RESTful endpoints)
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   │   └── signup/route.ts          # User registration
│   │   │   ├── animals/
│   │   │   │   ├── route.ts                 # GET, POST /api/animals
│   │   │   │   └── [id]/route.ts            # GET, PUT, DELETE /api/animals/:id
│   │   │   ├── health/
│   │   │   │   ├── route.ts                 # Health records listing/create
│   │   │   │   └── [id]/route.ts            # Individual record operations
│   │   │   ├── weight/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── breeding/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── milk/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── milk-sales/
│   │   │   │   ├── route.ts                 # + Auto-payment + Finance integration
│   │   │   │   └── [id]/route.ts            # + Balance sync + Status updates
│   │   │   ├── customers/
│   │   │   │   ├── route.ts                 # Customer CRUD
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts             # Customer details
│   │   │   │       ├── adjust-balance/route.ts   # Manual balance adjustment
│   │   │   │       └── settle-dues/route.ts      # Auto-settle pending dues
│   │   │   ├── stockfeed/
│   │   │   │   ├── route.ts                 # + Auto finance expense
│   │   │   │   └── [id]/route.ts            # + Finance sync on edit/delete
│   │   │   ├── employees/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── finance/
│   │   │       ├── route.ts                 # With pagination support
│   │   │       └── [id]/route.ts
│   │   │
│   │   ├── dashboard/                    # Protected dashboard pages
│   │   │   ├── page.tsx                     # Dashboard home (Stats + Quick Actions)
│   │   │   ├── layout.tsx                   # Dashboard layout with Sidebar
│   │   │   ├── animals/
│   │   │   │   ├── page.tsx                 # Animals list
│   │   │   │   ├── new/page.tsx             # Add new animal
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx             # View animal details
│   │   │   │       └── edit/page.tsx        # Edit animal
│   │   │   ├── health/
│   │   │   │   ├── page.tsx                 # Health records list
│   │   │   │   ├── new/page.tsx             # Add health record
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx             # View health record
│   │   │   │       └── edit/page.tsx        # Edit health record
│   │   │   ├── weight/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/ (view + edit)
│   │   │   ├── breeding/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/ (view + edit)
│   │   │   ├── milk/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/ (view + edit)
│   │   │   ├── milk-sales/
│   │   │   │   ├── page.tsx                 # Sales list
│   │   │   │   ├── new/page.tsx             # + Payment summary + Auto-payment
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx             # View with finance link
│   │   │   │       └── edit/page.tsx        # Edit with payment tracking
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx                 # Customers list with balance
│   │   │   │   ├── new/page.tsx             # Add new customer
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx             # + Purchase history + Auto-settle
│   │   │   │       └── edit/page.tsx        # Edit customer
│   │   │   ├── milk-stock/
│   │   │   │   └── page.tsx                 # Stock analysis + Alerts
│   │   │   ├── stockfeed/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx             # + Finance integration info
│   │   │   │   └── [id]/ (view + edit)
│   │   │   ├── employees/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/ (view + edit)
│   │   │   └── finance/
│   │   │       ├── page.tsx                 # With pagination (5 per page)
│   │   │       ├── new/page.tsx
│   │   │       └── [id]/ (view + edit)
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx                     # Login form
│   │   ├── signup/
│   │   │   └── page.tsx                     # Registration form
│   │   ├── page.tsx                         # Landing page
│   │   ├── layout.tsx                       # Root layout
│   │   └── globals.css                      # Global styles
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx                  # Navigation with all modules
│   │   │   └── Header.tsx                   # User menu + logout
│   │   └── ui/                              # Shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── badge.tsx
│   │       ├── tabs.tsx
│   │       ├── dialog.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       └── use-toast.ts
│   │
│   └── lib/
│       ├── prisma.ts                        # Prisma client singleton
│       ├── auth.ts                          # NextAuth configuration
│       └── utils.ts                         # Utility functions
│                                             # (formatDate, formatCurrency, etc.)
│
├── public/                                   # Static assets
├── .env                                      # Environment variables
├── package.json                              # Dependencies
├── tsconfig.json                             # TypeScript config
├── tailwind.config.ts                        # Tailwind CSS config
├── next.config.js                            # Next.js config
├── README.md                                 # This file
└── SETUP_GUIDE.md                           # Detailed setup instructions
```

### Key File Highlights

**Smart API Routes:**

- `milk-sales/route.ts`: Auto-payment logic, customer balance updates, finance integration
- `customers/[id]/settle-dues/route.ts`: Automatic pending dues settlement
- `stockfeed/route.ts`: Auto finance expense creation

**Interactive Pages:**

- `milk-sales/new/page.tsx`: Real-time payment summary with credit auto-application
- `customers/[id]/page.tsx`: Customer details with auto-settle card
- `dashboard/page.tsx`: Live stats with quick actions and recent activity

**Utility Functions:**

- `formatDate()`: Consistent date formatting
- `formatCurrency()`: Taka (৳) formatting
- `calculateAge()`: Animal age calculation
- `getAgeString()`: Human-readable age

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

```
POST   /api/auth/signup              - Register new user
POST   /api/auth/signin              - User login
POST   /api/auth/signout             - User logout
GET    /api/auth/session             - Get current session
```

### Animals

```
GET    /api/animals                  - Get all animals (with filters)
POST   /api/animals                  - Create new animal
GET    /api/animals/:id              - Get animal details by ID
PUT    /api/animals/:id              - Update animal
DELETE /api/animals/:id              - Delete animal
```

### Health Records

```
GET    /api/health                   - Get all health records
POST   /api/health                   - Create health record
GET    /api/health/:id               - Get health record by ID
PUT    /api/health/:id               - Update health record
DELETE /api/health/:id               - Delete health record
```

### Weight Records

```
GET    /api/weight                   - Get all weight records
POST   /api/weight                   - Create weight record
GET    /api/weight/:id               - Get weight record by ID
PUT    /api/weight/:id               - Update weight record
DELETE /api/weight/:id               - Delete weight record
```

### Breeding Records

```
GET    /api/breeding                 - Get all breeding records
POST   /api/breeding                 - Create breeding record
GET    /api/breeding/:id             - Get breeding record by ID
PUT    /api/breeding/:id             - Update breeding record
DELETE /api/breeding/:id             - Delete breeding record
```

### Milk Production

```
GET    /api/milk                     - Get all milk production records
POST   /api/milk                     - Create milk record
GET    /api/milk/:id                 - Get milk record by ID
PUT    /api/milk/:id                 - Update milk record
DELETE /api/milk/:id                 - Delete milk record
```

### Milk Sales

```
GET    /api/milk-sales               - Get all milk sales
POST   /api/milk-sales               - Create milk sale
                                       • Auto-applies customer credit
                                       • Creates finance record (if PAID)
                                       • Updates customer balance
                                       • Auto-creates customer if new

GET    /api/milk-sales/:id           - Get milk sale by ID
PUT    /api/milk-sales/:id           - Update milk sale
                                       • Updates finance record
                                       • Updates customer balance
                                       • Handles status changes

DELETE /api/milk-sales/:id           - Delete milk sale
                                       • Deletes finance record
                                       • Reverses customer balance
```

### Customers

```
GET    /api/customers                - Get all customers
POST   /api/customers                - Create new customer
GET    /api/customers/:id            - Get customer details
                                       • Includes purchase history
                                       • Shows balance
                                       • Shows pending dues

PUT    /api/customers/:id            - Update customer
DELETE /api/customers/:id            - Delete customer

POST   /api/customers/:id/adjust-balance
                                     - Manually adjust customer balance
                                       • Creates finance record
                                       • Updates balance

POST   /api/customers/:id/settle-dues
                                     - Auto-settle pending dues
                                       • Oldest dues first
                                       • Creates finance records
                                       • Updates payment status
```

### Stock Feed

```
GET    /api/stockfeed                - Get all stock feed records
POST   /api/stockfeed                - Create stock feed
                                       • Auto-creates finance expense

GET    /api/stockfeed/:id            - Get stock feed by ID
PUT    /api/stockfeed/:id            - Update stock feed
                                       • Updates finance record

DELETE /api/stockfeed/:id            - Delete stock feed
                                       • Deletes finance record
```

### Employees

```
GET    /api/employees                - Get all employees
POST   /api/employees                - Create employee
GET    /api/employees/:id            - Get employee by ID
PUT    /api/employees/:id            - Update employee
DELETE /api/employees/:id            - Delete employee
```

### Finance

```
GET    /api/finance                  - Get all finance records
                                       • Supports pagination
                                       • Date filtering

POST   /api/finance                  - Create finance record
GET    /api/finance/:id              - Get finance record by ID
PUT    /api/finance/:id              - Update finance record
DELETE /api/finance/:id              - Delete finance record
```

---

## 💾 Database Schema

### Key Models

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("USER")
  createdAt DateTime @default(now())
}

model Animal {
  id            String    @id @default(cuid())
  tagNumber     String    @unique
  name          String?
  breed         String
  dateOfBirth   DateTime
  gender        Gender
  purchaseDate  DateTime?
  purchasePrice Float?
  currentWeight Float?
  status        AnimalStatus @default(ACTIVE)
  // Relations
  healthRecords HealthRecord[]
  weightRecords WeightRecord[]
  milkRecords   MilkRecord[]
  breedingMale  Breeding[]    @relation("MaleAnimal")
  breedingFemale Breeding[]   @relation("FemaleAnimal")
}

model Customer {
  id                    String     @id @default(cuid())
  name                  String
  phone                 String?
  email                 String?
  address               String?
  defaultPricePerLiter  Float?
  balance               Float      @default(0)  // + = Credit, - = Due
  lastPurchaseDate      DateTime?
  totalPurchases        Float      @default(0)
  notes                 String?
  // Relations
  milkSales             MilkSale[]
}

model MilkSale {
  id              String        @id @default(cuid())
  customerId      String?
  customer        Customer?     @relation(fields: [customerId])
  saleDate        DateTime
  quantity        Float
  pricePerLiter   Float
  totalAmount     Float
  amountPaid      Float         @default(0)
  buyer           String?
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   String?
  notes           String?
}

model Finance {
  id              String       @id @default(cuid())
  date            DateTime
  type            FinanceType  // INCOME or EXPENSE
  category        String
  description     String
  amount          Float
  paymentMethod   String?
  referenceNumber String?      @unique
  notes           String?
}

model MilkRecord {
  id            String   @id @default(cuid())
  animalId      String
  animal        Animal   @relation(fields: [animalId])
  date          DateTime
  morningAmount Float    @default(0)
  afternoonAmount Float  @default(0)
  eveningAmount Float    @default(0)
  totalAmount   Float
  quality       MilkQuality?
  fatContent    Float?
}

model HealthRecord {
  id                String       @id @default(cuid())
  animalId          String
  animal            Animal       @relation(fields: [animalId])
  checkupDate       DateTime
  disease           String?
  symptoms          String?
  treatment         String?
  medication        String?
  veterinarian      String?
  cost              Float?
  nextCheckupDate   DateTime?
  status            HealthStatus
  notes             String?
}

model WeightRecord {
  id              String   @id @default(cuid())
  animalId        String
  animal          Animal   @relation(fields: [animalId])
  recordDate      DateTime
  weight          Float
  height          Float?
  bodyCondition   Float?
  notes           String?
}

model Breeding {
  id                 String         @id @default(cuid())
  maleAnimalId       String
  femaleAnimalId     String
  maleAnimal         Animal         @relation("MaleAnimal", fields: [maleAnimalId])
  femaleAnimal       Animal         @relation("FemaleAnimal", fields: [femaleAnimalId])
  breedingDate       DateTime
  breedingType       BreedingType
  expectedDelivery   DateTime?
  actualDelivery     DateTime?
  outcome            BreedingOutcome?
  notes              String?
}

model StockFeed {
  id              String   @id @default(cuid())
  feedType        String
  quantity        Float
  unit            String
  supplier        String?
  purchaseDate    DateTime
  expiryDate      DateTime?
  costPerUnit     Float
  totalCost       Float
  currentStock    Float
  minimumStock    Float?
  notes           String?
}

model Employee {
  id          String         @id @default(cuid())
  employeeId  String         @unique
  name        String
  position    String
  department  String?
  phone       String?
  email       String?
  address     String?
  salary      Float?
  joinDate    DateTime
  leaveDate   DateTime?
  status      EmployeeStatus @default(ACTIVE)
  notes       String?
}

// Enums
enum Gender { MALE FEMALE }
enum AnimalStatus { ACTIVE SOLD DECEASED TRANSFERRED }
enum HealthStatus { HEALTHY UNDER_TREATMENT CRITICAL RECOVERED }
enum MilkQuality { EXCELLENT GOOD AVERAGE POOR }
enum PaymentStatus { PAID PENDING OVERDUE }
enum BreedingType { NATURAL ARTIFICIAL_INSEMINATION }
enum BreedingOutcome { SUCCESSFUL FAILED ABORTED PENDING }
enum FinanceType { INCOME EXPENSE }
enum EmployeeStatus { ACTIVE INACTIVE TERMINATED RESIGNED }
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Whether it's bug fixes, new features, or documentation improvements, your contribution is valued.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🌟 Key Automation Features

This system includes several smart automation features that save time and reduce errors:

### 🤖 Automatic Finance Tracking

- **Milk Sales (PAID)** → Auto-creates income record
- **Stock Feed Purchases** → Auto-creates expense record
- **Customer Balance Adjustments** → Auto-creates finance record
- **Edit/Delete** → Finance records automatically sync

### 💰 Smart Payment System

- **Auto-payment**: Credit balance automatically applied to new sales
- **Real-time calculation**: Shows exactly how much is covered by credit
- **Status auto-update**: Payment status automatically set to PAID when fully covered
- **Balance tracking**: Positive (Credit) / Negative (Due) tracking

### 🔄 Auto-Settle Dues

- **One-click settlement**: Settle all pending dues at once
- **Intelligent payment**: Oldest dues paid first
- **Partial settlement**: Works even if credit doesn't cover all dues
- **Auto-status update**: Sales marked as PAID automatically

### 📦 Real-time Stock Tracking

- **Live calculation**: Stock = Production - Sales
- **Color alerts**: Low (Red), Medium (Orange), Good (Cyan)
- **Dashboard display**: Always see current stock at a glance

### 👤 Smart Customer Management

- **Auto-registration**: New buyers automatically added as customers
- **Price memory**: Default price auto-filled for existing customers
- **Balance display**: Shows available credit or pending dues
- **Purchase history**: Complete transaction history with each customer

---

## 📊 System Capabilities Summary

| Module             | Create | Read | Update | Delete | Auto-Integration  | Special Features              |
| ------------------ | ------ | ---- | ------ | ------ | ----------------- | ----------------------------- |
| 🐮 Animals         | ✅     | ✅   | ✅     | ✅     | -                 | View page, Status tracking    |
| ❤️ Health          | ✅     | ✅   | ✅     | ✅     | -                 | Per-animal history            |
| ⚖️ Weight          | ✅     | ✅   | ✅     | ✅     | -                 | Growth tracking               |
| 👶 Breeding        | ✅     | ✅   | ✅     | ✅     | -                 | Outcome tracking              |
| 🥛 Milk Production | ✅     | ✅   | ✅     | ✅     | Stock Calculation | 3-session tracking            |
| 💰 Milk Sales      | ✅     | ✅   | ✅     | ✅     | Finance + Balance | Auto-payment, Auto-customer   |
| 👥 Customers       | ✅     | ✅   | ✅     | ✅     | Finance (Adjust)  | Balance tracking, Settle dues |
| 📦 Milk Stock      | -      | ✅   | -      | -      | Production/Sales  | Real-time calculation         |
| 🌾 Stock Feed      | ✅     | ✅   | ✅     | ✅     | Finance (Expense) | Expiry tracking               |
| 👥 Employees       | ✅     | ✅   | ✅     | ✅     | -                 | Status tracking               |
| 🏦 Finance         | ✅     | ✅   | ✅     | ✅     | -                 | Pagination, Categories        |

---

## 🎯 Who Should Use This System?

This Dairy Farm Management System is perfect for:

- **Small to Medium Dairy Farms** (10-200 animals)
- **Farm Managers** who want to digitize operations
- **Farm Owners** who need real-time insights
- **Dairy Cooperatives** managing multiple farmers
- **Agricultural Students** learning farm management
- **Veterinarians** tracking animal health

---

## 💡 Why Choose This System?

### ✅ Comprehensive

- Covers ALL aspects of dairy farm management
- From animal health to financial tracking

### ✅ Smart Automation

- Auto-payment from customer credit
- Auto-finance integration
- Auto-settle pending dues
- Real-time stock tracking

### ✅ User-Friendly

- Clean, modern interface
- Intuitive navigation
- Color-coded alerts
- Quick action shortcuts

### ✅ Reliable

- Built with enterprise-grade tech stack
- Secure authentication
- Data validation
- Error handling

### ✅ Scalable

- Handles growing farm operations
- Pagination for large datasets
- Optimized database queries
- Fast performance

---

## 🔜 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics with charts
- [ ] Export to PDF/Excel
- [ ] Multi-language support (Bengali, English)
- [ ] Barcode/QR code scanning for animals
- [ ] Weather integration for milk production correlation
- [ ] Automated backup system
- [ ] SMS notifications for payment reminders
- [ ] Integration with IoT devices (milk meters)
- [ ] Offline mode support
- [ ] Multi-farm support
- [ ] WhatsApp integration for customer notifications
- [ ] Inventory forecasting
- [ ] Feed efficiency calculator

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

Built with modern web technologies to help dairy farmers manage their operations more efficiently. Special thanks to:

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Shadcn/ui for beautiful components
- The open-source community

---

## 📞 Support & Contact

For questions, issues, or feature requests:

- 📧 Email: support@dairyfarm.com
- 🐛 Issues: Open an issue on GitHub
- 💬 Discussions: Join our community discussions

---

<div align="center">

### 🐄 Made with ❤️ for Dairy Farmers

**Dairy Farm Management System - Modernizing Traditional Farming**

[⭐ Star this repo](https://github.com/yourusername/dairy-farm) | [🍴 Fork it](https://github.com/yourusername/dairy-farm/fork) | [📖 Read the docs](https://github.com/yourusername/dairy-farm/wiki)

</div>
