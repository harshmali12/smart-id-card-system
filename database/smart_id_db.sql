-- Create Database
CREATE DATABASE IF NOT EXISTS smart_id_system;
USE smart_id_system;

-- Admin Table
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100)
);

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rfid_uid VARCHAR(50) UNIQUE NOT NULL,
    fingerprint_id VARCHAR(50) UNIQUE NOT NULL
);

-- Attendance Table
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    rfidUID VARCHAR(50),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin
INSERT INTO admin (name, email, password)
VALUES ('Admin', 'admin@smartid.com', 'admin123');
