<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/NextAuth-5-000?logo=nextauth.js" alt="NextAuth" />
  <img src="https://img.shields.io/badge/Neon-PostgreSQL-00e599?logo=neon" alt="Neon" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License" />
</p>

<h1 align="center">
  <span style="color:white">Link</span><span style="background:linear-gradient(90deg,#22d3ee,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent">US</span>
</h1>

<p align="center">
  <strong>Bio Link SaaS untuk Creator Indonesia</strong><br/>
  Satu halaman untuk semua link penting. Dashboard realtime, 14 tema, analytics, QR code, dan export data. Gratis!
</p>

<p align="center">
  <a href="https://bio-link-saas.vercel.app">🔗 Live Demo</a> ·
  <a href="https://bio-link-saas.vercel.app/u/maya">👤 Contoh Bio Page</a>
</p>

---

## Fitur

### Dashboard
- Editor profil (nama, headline, bio, lokasi, avatar)
- Drag-and-drop link manager
- 11 jenis link: Twitter, Instagram, YouTube, TikTok, WhatsApp, Telegram, Discord, Twitch, GitHub, Facebook, Website
- Aktif/nonaktif link per item
- Schedule link (tanggal mulai & selesai)
- Preview bio page realtime
- QR code generator
- Copy link & share link

### Public Bio Page (`/u/username`)
- 14 template tema visual:
  `studio-pearl` · `velvet-night` · `lime-signal` · `ocean-glass` · `editorial-rose` · `sunset-wire` · `forest-mint` · `mono-slate` · `orchid-ink` · `midnight-neon` · `arctic-blue` · `golden-hour` · `sakura-bloom` · `cyberpunk-grid`
- Custom CSS per user
- Mobile responsive
- Click tracking per link

### Auth & Security
- NextAuth v5 (Credentials + OAuth ready)
- Register, login, forgot password, reset password
- Email verification (Brevo SMTP)
- Bcrypt password hashing
- Admin panel (`/admin`)

### Data & Analytics
- Analytics dashboard (visits, clicks, signups per hari)
- Export/Import data (JSON)
- PostgreSQL via Prisma + Neon (serverless)
- Sitemap & robots.txt otomatis

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 6 (driver adapter) |
| Auth | NextAuth v5 (beta) |
| Email | Brevo (REST API) |
| Icons | Lucide React |
| QR Code | qrcode |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (Neon gratis: [neon.tech](https://neon.tech))
- Brevo account untuk email (opsional)

### Install

```bash
git clone https://github.com/Poeroro/bio-link-saas.git
cd bio-link-saas
npm install
```

### Environment Variables

Buat file `.env`:

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_SECRET="random-secret-string"
NEXTAUTH_URL="http://localhost:3000"

# Brevo (opsional - untuk email verification)
BREVO_API_KEY="xkeysib-..."
BREVO_SENDER_EMAIL="noreply@yourdomain.com"
BREVO_SENDER_NAME="LinkUS"

# Admin
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-admin-password"
```

### Database Setup

```bash
npx prisma db push
npx prisma generate
```

### Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Struktur Project

```
src/
├── app/
│   ├── admin/           # Admin panel
│   ├── api/
│   │   ├── admin/       # Admin API (stats, users, settings)
│   │   ├── analytics/   # Analytics API
│   │   ├── auth/        # NextAuth + register + verify
│   │   ├── clicks/      # Click tracking
│   │   ├── links/       # Link CRUD + reorder
│   │   ├── profile/     # Profile update
│   │   └── upload/      # Avatar upload
│   ├── dashboard/       # User dashboard
│   ├── login/           # Login page
│   ├── register/        # Register page
│   ├── u/[username]/    # Public bio page
│   └── verify-email/    # Email verification
├── components/
│   ├── admin/           # Admin components
│   ├── auth/            # Auth card
│   ├── bio/             # Bio preview & share
│   └── dashboard/       # Dashboard panels
└── lib/
    ├── themes.ts        # 14 tema definitions
    ├── types.ts         # TypeScript types
    └── storage.ts       # Client-side helpers
```

---

## Deployment

### Vercel (Recommended)

1. Push ke GitHub
2. Import repo di [vercel.com](https://vercel.com)
3. Tambah environment variables
4. Deploy

### Self-Hosted

```bash
npm run build
npm run start
```

---

## Kontribusi

1. Fork repo ini
2. Buat branch (`git checkout -b fitur-baru`)
3. Commit (`git commit -m 'tambah fitur baru'`)
4. Push (`git push origin fitur-baru`)
5. Buat Pull Request

---

## License

MIT © Muhashi

---

<p align="center">
  Vibe Coding ©Muhashi. Bio link SaaS untuk semua.
</p>
