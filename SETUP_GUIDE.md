# Setup Guide - Dairy Farm Management System

## Prerequisites Installation

### 1. Install Java JDK

1. Download **JDK 8** from: https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html
   - Or download **JDK 11+** and install JavaFX separately
2. Install JDK
3. Verify installation:
   ```powershell
   java -version
   ```

### 2. Install MySQL

1. Download MySQL Community Server: https://dev.mysql.com/downloads/mysql/
2. Install with default settings
3. Remember your **root password** during installation
4. Start MySQL service from Windows Services

### 3. Download Required Libraries

**Option A: Manual Download**

- MySQL Connector/J: https://dev.mysql.com/downloads/connector/j/
- JavaMail API: https://eclipse-ee4j.github.io/mail/

**Option B: Maven Dependencies** (if you set up Maven later)

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>
<dependency>
    <groupId>com.sun.mail</groupId>
    <artifactId>javax.mail</artifactId>
    <version>1.6.2</version>
</dependency>
```

---

## Database Setup

### Create Database

1. Open MySQL Workbench or MySQL Command Line
2. Login with root user
3. Run:
   ```sql
   CREATE DATABASE dairy_farm;
   USE dairy_farm;
   ```

### Update Database Password

1. Open: `model/DatabaseConnection.java`
2. Update line 12 with your MySQL root password:
   ```java
   String databasePassword = "your_actual_password";
   ```

**Note:** You'll need to create database tables. The application will likely show errors until tables are created.

---

## IDE Setup Instructions

## Option 1: IntelliJ IDEA (Recommended)

### Download & Install

1. Download IntelliJ IDEA Community Edition: https://www.jetbrains.com/idea/download/
2. Install with default settings

### Setup Project

1. **Open IntelliJ IDEA**
2. Click **"Open"** on welcome screen
3. Navigate to: `E:\codes\work\org\Dairy-Farm-Management-System`
4. Click **"OK"**

### Configure Project Structure

1. Go to: **File → Project Structure** (Ctrl+Alt+Shift+S)
2. **Project Settings → Project**:
   - Set **Project SDK** to your installed JDK
   - Set **Project language level** to 8 or higher
3. **Project Settings → Libraries**:
   - Click **"+"** → **Java**
   - Add MySQL Connector JAR file
   - Add JavaMail JAR files
4. Click **"Apply"** → **"OK"**

### Add JavaFX (if using JDK 11+)

1. Download JavaFX SDK: https://gluonhq.com/products/javafx/
2. Go to: **File → Project Structure → Libraries**
3. Click **"+"** → **Java**
4. Navigate to JavaFX SDK `lib` folder
5. Select all JAR files → **"OK"**

### Configure Run Configuration

1. Right-click on `DairyFarm.java`
2. Click **"Run 'DairyFarm.main()'"**

   **If you get JavaFX errors:**

   - Go to: **Run → Edit Configurations**
   - Select **DairyFarm** configuration
   - Add VM options:
     ```
     --module-path "C:\path\to\javafx-sdk\lib" --add-modules javafx.controls,javafx.fxml
     ```
   - Replace path with your actual JavaFX SDK path

### Run the Project

1. Right-click on `DairyFarm.java`
2. Select **"Run 'DairyFarm.main()'"**
3. The Login screen should appear!

---

## Option 2: Eclipse IDE

### Download & Install

1. Download Eclipse IDE for Java Developers: https://www.eclipse.org/downloads/
2. Install and launch Eclipse

### Import Project

1. **File → Open Projects from File System**
2. Click **"Directory"**
3. Select: `E:\codes\work\org\Dairy-Farm-Management-System`
4. Click **"Finish"**

### Configure Build Path

1. Right-click on project → **Properties**
2. Go to **Java Build Path → Libraries**
3. Click **"Add External JARs"**
4. Add:
   - MySQL Connector JAR
   - JavaMail JAR(s)
   - JavaFX JARs (if JDK 11+)
5. Click **"Apply and Close"**

### Install e(fx)clipse Plugin (for JavaFX support)

1. **Help → Eclipse Marketplace**
2. Search: **"e(fx)clipse"**
3. Install the plugin
4. Restart Eclipse

### Run the Project

1. Right-click on `DairyFarm.java`
2. **Run As → Java Application**
3. Login screen should appear!

---

## Option 3: NetBeans IDE

### Download & Install

1. Download Apache NetBeans: https://netbeans.apache.org/download/
2. Install with default settings

### Open Project

1. **File → Open Project**
2. Navigate to: `E:\codes\work\org\Dairy-Farm-Management-System`
3. Click **"Open Project"**

### Add Libraries

1. In Projects window, right-click on **Libraries** folder
2. Select **"Add JAR/Folder"**
3. Add:
   - MySQL Connector JAR
   - JavaMail JAR(s)
   - JavaFX JARs (if needed)

### Run the Project

1. Right-click on project name
2. Click **"Run"**
3. Login screen should appear!

---

## Common Issues & Solutions

### Issue 1: "Module javafx not found"

**Solution:**

- Add JavaFX SDK to libraries
- Add VM arguments in run configuration

### Issue 2: "Cannot connect to database"

**Solution:**

- Verify MySQL is running (Windows Services)
- Check database name: `dairy_farm` exists
- Verify username/password in `DatabaseConnection.java`

### Issue 3: "ClassNotFoundException: com.mysql.cj.jdbc.Driver"

**Solution:**

- Add MySQL Connector JAR to project libraries
- Clean and rebuild project

### Issue 4: "Cannot load FXML files"

**Solution:**

- Verify project structure
- Make sure `view`, `controller`, `model` folders are in source root

### Issue 5: Table doesn't exist errors

**Solution:**

- You need to create database tables
- Contact project developer for SQL schema
- Or run the application and check error messages for table names

---

## Next Steps After Running

1. The application starts with a **Login screen**
2. You may need to create database tables based on error messages
3. Check if there's a SignUp option to create first user
4. Explore the various modules:
   - Animal Records
   - Animal Health
   - Breeding
   - Milk Records
   - Milk Sales
   - Employees
   - Stock Feed
   - Farm Finance

---

## Quick Commands Reference

### Check Java Installation

```powershell
java -version
javac -version
```

### Check MySQL Status

```powershell
# Open Services
services.msc
# Look for "MySQL" service
```

### MySQL Command Line

```powershell
mysql -u root -p
# Enter your password
SHOW DATABASES;
USE dairy_farm;
SHOW TABLES;
```

---

## Need Help?

- Check error messages in IDE console
- Verify all prerequisites are installed
- Ensure MySQL service is running
- Check database credentials

**Project Path:** `E:\codes\work\org\Dairy-Farm-Management-System`
