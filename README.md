# The Sunvizors - Tour Vote Map

Interactive map for fans of **The Sunvizors** to vote for tour cities. This project allows fans to express where they want the band to perform in 2026.

**Official Website:** [https://map.thesunvizors.com](https://map.thesunvizors.com)

## 🚀 Project Overview

- **Frontend:** React with Vite, Tailwind CSS, and Framer Motion.
- **Backend:** Native PHP API optimized for shared hosting (LWS).
- **Database:** MySQL.
- **Features:** Anti-bot protection (Honeypot, Rate Limiting), Admin Dashboard, CSV Export, and Social Sharing (FB, X, WhatsApp).

## 📁 Project Structure

- `/frontend`: React source code.
- `/backend`: PHP API scripts.
- `/dist-production`: Compiled version ready for LWS deployment.

## 🛠 Installation

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Development)
4. `npm run build` (Production)

### Backend
1. Upload the content of `/dist-production` to your FTP server.
2. Import the `database.sql` schema into your MySQL database.
3. Configure `api/db.php` with your credentials.

## 🔒 Security
- Protection against SQL Injections (PDO).
- Bot protection via invisible Honeypot.
- Rate limiting (5 votes/10min/IP).
- Admin access protected by password.

---
*Developed for The Sunvizors Tour 2026 Promotion.*
