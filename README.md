# 💸 ExpensesTracker

A fullstack web application to manage and track your daily expenses. Built with **React** for the frontend and **Spring Boot + MySQL** for the backend.

---

## 🌟 Features

- ✅ User authentication (JWT-based)
- 💰 Add, edit, and delete income & expense transactions
- 📜 View transaction history
- 📊 Dashboard with financial overview
- 💾 Persistent data storage using MySQL
- 📱 Responsive and mobile-friendly UI

---

## 🛠️ Tech Stack

### **Frontend**
- React
- Axios
- React Router DOM
- Tailwind CSS (or your preferred styling framework)

### **Backend**
- Spring Boot
- Java
- MySQL
- Spring Data JPA
- Spring Security + JWT
- Lombok

---

## 📦 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/saisankar333/ExpensesTracker.git
cd ExpensesTracker

# -----------------------------
# 2️⃣ Backend Setup (Spring Boot + MySQL)
# -----------------------------
cd backend


mysql:
-- ✅ Create MySQL Database
CREATE DATABASE expense_tracker;


# ✏️ Configure application.properties
# Path: src/main/resources/application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.security.jwt.secret=your_jwt_secret


   # ▶️ Run Backend
./mvnw spring-boot:run

# -----------------------------
# 3️⃣ Frontend Setup (React)
# -----------------------------

cd ../frontend
npm install
npm start



