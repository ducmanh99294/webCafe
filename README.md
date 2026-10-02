# ☕ Moc Coffee — Full-Stack Café Web App
A complete café management & ordering platform: customers browse the menu, order online and chat with the shop in **real time**; staff manage products, tables, orders, employees and revenue from a full **admin dashboard**.

## ✨ Features

**Customer**
- 🏠 Animated landing page (GSAP scroll animations, hero slider, events)
- 🛍️ Product catalog with categories, product detail & search
- 🛒 Cart + checkout with table selection (dine-in)
- 📦 Order tracking & order history
- 👤 Auth (JWT), profile management
- 💬 **Real-time chat with the shop** — native WebSocket, instant messaging, unread badges, toast + sound + browser notifications

**Admin dashboard**
- 📊 Revenue reports with charts (revenue by day/product)
- 🛍️ Product & category management (CRUD + images)
- 🧾 Order management & status updates
- 🪑 Table management with visual floor layout & statuses
- 👥 User & employee management
- 💬 Live customer chat — reply instantly, delete messages/conversations, unread highlighting, notifications on **every** admin page

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router 7, TanStack Query, Axios |
| UI/UX | Bootstrap 5, GSAP (animations), Swiper (sliders), Recharts + Chart.js (dashboards), Lucide icons |
| Realtime | Native WebSocket (Spring `WebSocketHandler` + ticket auth, auto-reconnect on client) |
| Backend | Spring Boot, Spring Security (JWT), Spring Data MongoDB |
| Database | MongoDB |
| DevOps | Docker & Docker Compose, Jenkins (`Jenkinsfile`), Kubernetes manifests (`k8s/`), Spring Boot Admin dashboard config |

## 📸 Screenshots

> Add your screenshots here — clients love visuals.

| Landing page | Menu | Admin dashboard |
|---|---|---|
| `docs/landing.png` | `docs/menu.png` | `docs/admin.png` |

## 🚀 Quick Start

Prerequisites: Docker & Docker Compose.

```bash
git clone https://github.com/ducmanh99294/webcafe.git
cd webcafe
docker compose up --build -d
```

| Service | URL |
|---|---|
| Customer site | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| MongoDB | localhost:27017 |

Stop: `docker compose down`

### Run without Docker

```bash
# Backend
cd backend && ./gradlew bootRun

# Frontend
cd frontend && npm install && npm run dev
```

## 🔑 Demo Accounts

Register a new account at `/register` — new users get the `USER` role.
To access the admin panel (`/admin`), set the user's `role` to `ADMIN` in MongoDB:

```js
db.users.updateOne({ username: "your-username" }, { $set: { role: "ADMIN" } })
```

Available roles: `USER`, `ADMIN`, `BANNER`.

## 📁 Project Structure

```
webcafe/
├── frontend/                 # React 19 + Vite + TypeScript
│   └── src/
│       ├── components/
│       │   ├── user/         # Customer pages (home, products, cart, orders, profile)
│       │   ├── admin/        # Admin dashboard (dashboard, orders, products, chat, …)
│       │   └── chat/         # Realtime chat UI + WebSocket client (chatSocket.ts)
│       └── api/              # Axios wrappers
├── backend/                  # Spring Boot
│   └── src/main/java/com/example/webcafe/
│       ├── controller/       # REST controllers (incl. ChatController)
│       ├── websocket/        # WebSocket handler, ticket auth, config
│       ├── service/          # Business logic
│       ├── repository/       # MongoDB repositories
│       ├── model/            # Domain entities
│       ├── jwt/              # JWT auth filter & utils
│       └── config/           # Security & WebSocket config
├── docker-compose.yml
├── Jenkinsfile               # CI pipeline
└── k8s/                      # Kubernetes manifests
```

## 💡 How the realtime chat works

1. Client fetches a one-time ticket via authenticated `GET /api/chat/ws-ticket`
2. Opens `ws://<host>/ws/chat?ticket=...` (browsers can't set auth headers on WebSocket)
3. Server validates the ticket during handshake and pushes events
   (`new_message`, `message_deleted`, `conversation_deleted`, `read`) to admins + the right customer
4. Client auto-reconnects with backoff; falls back to polling if WebSocket is unavailable

## 📝 Notes

- Container timezone is set to `Asia/Ho_Chi_Minh` in the backend Dockerfile so timestamps display correctly.
- `springboot-dashboard.json` — Grafana dashboard for Spring Boot metrics.

## 📄 License

MIT — feel free to use for learning and commercial projects.
