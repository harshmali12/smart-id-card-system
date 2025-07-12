import express from "express";
import mysql from "mysql2";
import cors from "cors";
import { SerialPort, ReadlineParser } from "serialport";

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

// ✅ Connect to MySQL Database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "smart_id_system"
});

db.connect((err) => {
    if (err) console.error("❌ MySQL Connection Failed:", err);
    else console.log("✅ Database Connected!");
});

// ✅ Setup Serial Communication (Change COM Port as needed)
const serialPort = new SerialPort({ path: "COM10", baudRate: 9600 });
const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));

serialPort.on("open", () => console.log("✅ Serial Port Connected to Arduino"));
parser.on("data", handleSerialData);

// ✅ Handle Incoming Serial Data from Arduino
async function handleSerialData(data) {
    const cleanedData = data.trim();
    console.log("📡 Received:", cleanedData);

    // Ignore extra logs that don't match RFID,Fingerprint format
    if (!cleanedData.includes(",")) {
        console.log("❌ Skipping Non-Data Log:", cleanedData);
        return;
    }

    // Ensure data is in correct format: RFID,Fingerprint
    const parts = cleanedData.split(",");
    if (parts.length !== 2) {
        console.log("❌ Invalid Data Format:", cleanedData);
        return;
    }

    const rfidUID = parts[0].trim();
    const fingerprintID = parts[1].trim();

    console.log(`🔍 Checking Database for RFID: ${rfidUID} & Fingerprint: ${fingerprintID}`);

    try {
        // Check if student exists with both RFID and Fingerprint
        const [rows] = await db.promise().query(
            "SELECT id FROM users WHERE rfid_uid = ? AND fingerprint_id = ?",
            [rfidUID, fingerprintID]
        );

        if (rows.length > 0) {
            const userID = rows[0].id;

            // Mark Attendance
            await db.promise().query(
                "INSERT INTO attendance (userID, timestamp, rfidUID) VALUES (?, NOW(), ?)",
                [userID, rfidUID]
            );

            console.log("✅ Attendance Recorded Successfully!");
            serialPort.write("AUTH_SUCCESS\n");
        } else {
            console.log("❌ Student Not Found in Database!");
            serialPort.write("AUTH_FAIL\n");
        }
    } catch (error) {
        console.error("❌ Database Error:", error);
    }
}

// ✅ API to Fetch Attendance Records
app.get("/api/attendance", async (req, res) => {
    try {
        const [attendance] = await db.promise().query(`
            SELECT attendance.id, users.name, attendance.timestamp, attendance.rfidUID 
            FROM attendance 
            JOIN users ON attendance.userID = users.id
        `);
        res.json(attendance);
    } catch (error) {
        console.error("❌ Error fetching attendance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Admin Login API
app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const [results] = await db.promise().query(
            "SELECT * FROM admin WHERE email = ? AND password = ?", 
            [email, password]
        );
        if (results.length > 0) {
            res.json({ message: "Login successful" });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ Get All Users
app.get("/api/users", async (req, res) => {
    try {
        const [users] = await db.promise().query("SELECT * FROM users");
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Add New User
app.post("/api/users/add", async (req, res) => {
    const { name, rfidUID, fingerprintHash } = req.body;
    if (!name || !rfidUID || !fingerprintHash) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        await db.promise().query(
            "INSERT INTO users (name, rfid_uid, fingerprint_id) VALUES (?, ?, ?)", 
            [name, rfidUID, fingerprintHash]
        );
        res.json({ message: "User added successfully!" });
    } catch (error) {
        console.error("❌ Error adding user:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
