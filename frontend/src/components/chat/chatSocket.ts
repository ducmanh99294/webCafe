// components/chat/chatSocket.ts
// Quản lý DUY NHẤT 1 kết nối WebSocket cho toàn bộ trang.
// - Lấy ticket dùng 1 lần qua API đã xác thực (GET /api/chat/ws-ticket),
//   rồi mở ws://<host>/ws/chat?ticket=... (trình duyệt không gắn được header Authorization nên dùng ticket).
// - Tự kết nối lại (backoff) khi rớt mạng / server restart.
// - Các component đăng ký nhận sự kiện qua subscribeChatEvents(),
//   kiểm tra trạng thái qua useChatSocketStatus() để bật/tắt poll dự phòng.
import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/base';

export type ChatWsEventName = 'new_message' | 'message_deleted' | 'conversation_deleted' | 'read';
export interface ChatWsEvent {
  type: 'chat';
  event: ChatWsEventName;
  conversationId: string;
  message?: { id: number | string; senderRole: 'USER' | 'ADMIN'; content: string; createdAt?: any; read?: boolean };
  messageId?: number | string;
}

type Listener = (e: ChatWsEvent) => void;
type StatusListener = (connected: boolean) => void;

/* Nếu frontend và backend khác origin mà KHÔNG dùng proxy (vd: chạy npm run dev,
   frontend gọi thẳng http://localhost:8080), điền vào đây, vd: 'ws://localhost:8080'.
   Để trống = tự lấy theo domain hiện tại (đúng cho cả dev có vite proxy lẫn production). */
const WS_BASE_OVERRIDE = '';

function wsBase(): string {
  if (WS_BASE_OVERRIDE.length >0) return WS_BASE_OVERRIDE.replace(/\/+$/, '');
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}`;
}

const hasToken = () => { try { return Boolean(localStorage.getItem('token')); } catch { return false; } };

let socket: WebSocket | null = null;
let connecting = false;
let started = false;
let connected = false;
let retryDelay = 1000;
const listeners = new Map<number, Listener>();
const statusListeners = new Set<StatusListener>();
let nextId = 1;

function setConnected(v: boolean) {
  if (connected === v) return;
  connected = v;
  statusListeners.forEach(cb => { try { cb(v); } catch { /* ignore */ } });
}

function scheduleRetry(ms: number) {
  setTimeout(() => { retryDelay = Math.min(ms * 2, 30000); connect(); }, ms);
}

async function connect() {
  if (connecting || socket) return;
  if (!hasToken()) { scheduleRetry(5000); return; } // chưa đăng nhập -> thử lại sau
  connecting = true;
  try {
    const res = await apiFetch('/api/chat/ws-ticket');
    if (!res.ok) throw new Error('no ticket');
    const { ticket } = await res.json();
    if (!ticket) throw new Error('no ticket');
    const ws = new WebSocket(`${wsBase()}/ws/chat?ticket=${encodeURIComponent(ticket)}`);
    socket = ws;
    ws.onopen = () => { connecting = false; retryDelay = 1000; setConnected(true); };
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data && data.type === 'chat') {
          listeners.forEach(cb => { try { cb(data as ChatWsEvent); } catch { /* ignore */ } });
        }
      } catch { /* bỏ qua message lạ */ }
    };
    ws.onerror = () => { try { ws.close(); } catch { /* ignore */ } };
    ws.onclose = () => {
      connecting = false; socket = null; setConnected(false);
      scheduleRetry(retryDelay);
    };
  } catch {
    connecting = false; socket = null; setConnected(false);
    scheduleRetry(retryDelay);
  }
}

function start() {
  if (started) return;
  started = true;
  connect();
}

/** Đăng ký nhận sự kiện chat realtime. Trả về hàm hủy đăng ký (dùng trong useEffect). */
export function subscribeChatEvents(cb: Listener): () => void {
  start();
  const id = nextId++;
  listeners.set(id, cb);
  return () => { listeners.delete(id); };
}

/** Theo dõi trạng thái kết nối WS (để component bật/tắt poll dự phòng). */
export function onChatSocketStatus(cb: StatusListener): () => void {
  statusListeners.add(cb);
  cb(connected);
  start();
  return () => { statusListeners.delete(cb); };
}

/** Hook tiện lợi: true = WS đang nối, component không cần poll. */
export function useChatSocketStatus(): boolean {
  const [up, setUp] = useState(connected);
  useEffect(() => onChatSocketStatus(setUp), []);
  return up;
}