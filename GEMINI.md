# The Sunvizors - Tour Vote Map (Version LWS)

## Project Overview
Interactive map for fans of **The Sunvizors** to vote for tour cities. This version is optimized for **LWS Shared Hosting**.

## Architecture (LWS Stack)
*   **Frontend:** React (Compiled assets in `assets/`).
*   **Backend:** Native PHP API in `api/`.
*   **Database:** MySQL.
*   **Hosting:** LWS (Linux Shared).

## Directory Structure
```text
/
├── DEPLOY-LWS-PHP/           # ACTIVE PRODUCTION PROJECT
│   ├── api/                  # PHP API implementation
│   │   ├── db.php            # MySQL Connection & CORS
│   │   ├── stats.php         # Statistics & City Details
│   │   ├── vote.php          # Vote Creation, Update & Deletion
│   │   └── export.php        # CSV Export (Excel Compatible)
│   ├── assets/               # Compiled React Frontend
│   ├── index.html            # Main entry point
│   ├── .htaccess             # Server configuration
│   └── database.sql          # Database schema
└── GEMINI.md                 # Project context
```

## Security & Features
*   **Anti-Bot:** Honeypot and Rate Limiting (max 5 votes/10min/IP).
*   **Admin Dashboard:** Detail view per city, CSV export, and vote deletion (Trash button).
*   **Environment:** Auto-configured for LWS pathing (`/api/*.php`).

## Maintenance
*   **PHP Config:** All PHP files in `api/` must **omit** the closing `?>` tag to avoid JSON whitespace issues.
*   **Database:** Add columns using the `update_db.php` pattern (then delete the script).