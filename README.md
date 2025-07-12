# smart-id-card-system
Smart ID-based attendance system using RFID and fingerprint
# 🎓 Smart Student Identity Card System 🔐

An IoT-based attendance management system that uses **RFID cards** and **fingerprint sensors** for secure student authentication. Built using **Arduino**, **Node.js**, **MySQL**, and a custom **web interface**.

---

## 📦 Features

✅ Dual-authentication using RFID and fingerprint  
✅ Attendance gets logged with timestamp  
✅ Node.js + MySQL backend  
✅ Clean frontend with HTML, CSS, JavaScript (dark theme)  
✅ Admin login system  
✅ REST APIs for attendance and user management  
✅ Future-ready for ESP8266 wireless sync

---

## 🧰 Technologies Used

| Layer      | Tools / Tech                          |
|------------|----------------------------------------|
| Hardware   | Arduino UNO, MFRC522 (RFID), AS608 (Fingerprint) |
| Backend    | Node.js, Express.js, MySQL             |
| Frontend   | HTML, CSS, JavaScript                  |
| Communication | Serial (USB), ESP8266 (planned)     |

---

## 🗂️ Project Structure

```
smart-id-card-system/
├── backend/          # Node.js server & API logic
├── frontend/         # Web UI files
├── arduino-code/     # Arduino sketch (.ino)
├── database/         # MySQL database schema
├── .gitignore
├── README.md
```

---

## 🚀 How to Run the Project

### 1. Flash Arduino Code
Upload the `rfid_fingerprint.ino` code to your Arduino UNO via Arduino IDE.

### 2. MySQL Database Setup
Import the SQL file:
```bash
mysql -u root -p < database/smart_id_db.sql
```

### 3. Start Backend
```bash
cd backend
npm install
node server.js
```

### 4. Use Frontend
Open `frontend/index.html` in your browser.

---

## 🔐 Admin Login Credentials

```
Email: admin@smartid.com
Password: admin123
```

---

## 📷 Screenshots


---

## 🔮 Future Improvements

- ESP8266 WiFi integration
- Real-time dashboard
- Parent/teacher mobile app
- Email/SMS notifications

---

## 🙋‍♂️ Developed By

**Harsh Tushar Mali**  
📧 harshmali333@gmail.com  
🔗 https://www.linkedin.com/in/harsh-mali-811106253
