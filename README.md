# URL Shortener API

A simple and efficient URL shortening service built with Node.js, Express, and PostgreSQL. Convert long URLs into short, shareable links and track their usage.

## Features

- ✅ Shorten long URLs to 6-character codes
- ✅ Automatic redirect from short URL to original URL
- ✅ Click tracking and analytics
- ✅ View statistics for any shortened URL
- ✅ List all shortened URLs
- ✅ Collision-free short code generation

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Supabase)
- **Environment:** dotenv
- **CORS:** Enabled for cross-origin requests

## Installation

1. **Clone the repository:**
```bash
   git clone https://github.com/YOUR-USERNAME/url-shortener.git
   cd url-shortener
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
```
   DATABASE_URL=your-postgresql-connection-string
   PORT=3000
```

4. **Set up the database:**
   
   Run this SQL in your PostgreSQL database:
```sql
   CREATE TABLE urls (
       id SERIAL PRIMARY KEY,
       original_url TEXT NOT NULL,
       short_code VARCHAR(10) UNIQUE NOT NULL,
       clicks INTEGER DEFAULT 0,
       created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE INDEX idx_short_code ON urls(short_code);
```

5. **Start the server:**
```bash
   node server.js
```

   Server will run on `http://localhost:3000`

## API Endpoints

### 1. Shorten URL
**POST** `/api/shorten`

Create a short URL from a long URL.

**Request:**
```json
{
  "originalUrl": "https://www.example.com/very/long/url"
}
```

**Response:**
```json
{
  "shortUrl": "http://localhost:3000/aBc123",
  "shortCode": "aBc123"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://www.google.com"}'
```

---

### 2. Redirect Short URL
**GET** `/:shortCode`

Redirects to the original URL and increments click count.

**Example:**
```
http://localhost:3000/aBc123
→ Redirects to https://www.example.com/very/long/url
```

**Browser Test:**
```
Open: http://localhost:3000/aBc123
```

---

### 3. Get URL Statistics
**GET** `/api/stats/:shortCode`

View statistics for a shortened URL.

**Response:**
```json
{
  "id": 1,
  "original_url": "https://www.example.com",
  "short_code": "aBc123",
  "clicks": 42,
  "created_at": "2024-02-09T10:30:00.000Z"
}
```

**cURL Example:**
```bash
curl http://localhost:3000/api/stats/aBc123
```

---

### 4. List All URLs
**GET** `/api/urls`

Get all shortened URLs (ordered by creation date, newest first).

**Response:**
```json
[
  {
    "id": 1,
    "original_url": "https://www.example.com",
    "short_code": "aBc123",
    "clicks": 42,
    "created_at": "2024-02-09T10:30:00.000Z"
  },
  ...
]
```

**cURL Example:**
```bash
curl http://localhost:3000/api/urls
```

---

## Database Schema
```sql
urls
├── id (SERIAL PRIMARY KEY)
├── original_url (TEXT NOT NULL)
├── short_code (VARCHAR(10) UNIQUE NOT NULL)
├── clicks (INTEGER DEFAULT 0)
└── created_at (TIMESTAMP DEFAULT NOW())

Index: idx_short_code on short_code (for fast lookups)
```

---

## How It Works

### Short Code Generation

- 6-character random codes using alphanumeric characters (a-z, A-Z, 0-9)
- 62^6 = ~56.8 billion possible combinations
- Collision detection with automatic retry
- Indexed for fast lookups

### Click Tracking

- Each redirect automatically increments the click counter
- Updates happen before redirect (ensures count accuracy)
- Logged to console for monitoring

---

## Project Structure
```
url-shortener/
├── server.js          # Main application and routes
├── db.js              # Database connection
├── .env               # Environment variables (not committed)
├── .gitignore         # Git ignore rules
├── package.json       # Dependencies
└── README.md          # This file
```

---

## Git Commands Reference

### Common Git Workflow
```bash
# Stage files
git add filename.txt
git add .

# Commit
git commit -m "Your message"

# Push
git push
```

### Unstage Files (Important!)

**Unstage specific file:**
```bash
git restore --staged filename.txt
```

**Unstage all files:**
```bash
git restore --staged .
```

**Check what's staged:**
```bash
git status
```

**Remove from Git tracking (but keep file):**
```bash
git rm --cached filename.txt
git rm -r --cached node_modules
```

### If You Accidentally Committed .env or node_modules
```bash
# Make sure .gitignore includes:
# node_modules
# .env

# Remove from Git tracking
git rm --cached .env
git rm -r --cached node_modules

# Commit the removal
git add .gitignore
git commit -m "Remove sensitive files from tracking"

# Push
git push
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PORT` | Server port (default: 3000) | `3000` |

---

## Security Notes

- ⚠️ **Never commit `.env` file** - contains database credentials
- ⚠️ **Never commit `node_modules`** - large dependency folder
- ✅ Always use `.gitignore` to exclude sensitive files
- ✅ Use environment variables for all secrets

---

## Future Enhancements

Potential features to add:

- [ ] Custom short codes (let users choose their code)
- [ ] Expiration dates for URLs
- [ ] Rate limiting (prevent abuse)
- [ ] QR code generation
- [ ] Analytics dashboard (charts, graphs)
- [ ] User authentication (track who created which URLs)
- [ ] URL validation (check if URL exists before shortening)
- [ ] Admin panel

---

## Testing

### Manual Testing Checklist

- [ ] Create short URL with valid long URL
- [ ] Redirect works and increments clicks
- [ ] Get statistics for existing short code
- [ ] Get statistics for non-existent code (404)
- [ ] List all URLs
- [ ] Create multiple URLs and verify uniqueness
- [ ] Test with very long URLs
- [ ] Test with URLs containing special characters

---

## Troubleshooting

### Database Connection Error
```bash
Error: getaddrinfo ENOTFOUND
```

**Solution:** Check `DATABASE_URL` in `.env` file. Make sure:
- Connection string is correct
- Password has no `[YOUR-PASSWORD]` placeholder
- Database is accessible

---

### Port Already in Use
```bash
Error: listen EADDRINUSE :::3000
```

**Solution:** 
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the MIT License.

---

## Author

Built as part of a backend development learning journey.

**Project Timeline:** Day 16 of 20-day learning path

**Related Projects:**
- Day 15: Blog API
- Day 17-18: Todo API with Sharing
- Day 19-20: Auth Boilerplate

---

## Acknowledgments

- Built with guidance from Claude (Anthropic)
- Part of Path B: Building muscle memory through multiple backend projects
- Database hosted on Supabase

---

**⭐ Star this repo if you found it helpful!**