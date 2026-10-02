// components/chat/UserChatWidget.tsx
// Widget chat phía user: nút nổi + badge tin chưa đọc + panel chat mượt mà, responsive.
import { useCallback, useEffect, useRef, useState } from 'react';
import ChatBox from './ChatBox';
import { apiFetch } from '../../api/base';
import { subscribeChatEvents, useChatSocketStatus } from './chatSocket';

const SEEN_KEY = 'webcafe_chat_seen_id';

const ChatBubbleIcon = ({ open }: { open: boolean }) => open ? (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
) : (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function UserChatWidget() {
  const [allowed] = useState(() => {
    try {
      return Boolean(localStorage.getItem('userId')) && localStorage.getItem('role') !== 'ADMIN';
    } catch { return false; }
  });
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const openRef = useRef(open);
  openRef.current = open;
  const wsUp = useChatSocketStatus(); // true = WebSocket đang nối, badge tự cập nhật qua sự kiện

  // Đánh dấu đã xem: khi mở chat, lưu id tin mới nhất
  const markSeen = (id: number | string) => {
    try {
      localStorage.setItem(SEEN_KEY, String(id));
      setUnread(0);
    } catch { /* ignore */ }
  };

  // Đếm tin chưa đọc khi widget đang đóng
  const check = useCallback(async () => {
    if (openRef.current) return;
    try {
      const res = await apiFetch('/api/chat/me');
      if (!res.ok) return;
      const data: any[] = await res.json();
      const seen = localStorage.getItem(SEEN_KEY);
      const fresh = data.filter(m => m.senderRole === 'ADMIN' && String(m.id) !== String(seen) &&
        (seen == null || Number(m.id) > Number(seen)));
      setUnread(fresh.length);
    } catch { /* im lặng */ }
  }, []);

  // poll dự phòng khi WebSocket chưa kết nối
  useEffect(() => {
    if (!allowed) return;
    check();
    if (wsUp) return;
    const t = setInterval(() => { if (!document.hidden) check(); }, 5000);
    return () => clearInterval(t);
  }, [allowed, wsUp, check]);

  // WebSocket: có tin mới từ admin -> kiểm tra badge ngay
  useEffect(() => {
    if (!allowed) return;
    return subscribeChatEvents((e) => {
      if (e.type === 'chat' && e.event === 'new_message' && e.message?.senderRole === 'ADMIN') check();
    });
  }, [allowed, check]);

  // ESC để đóng
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!allowed) return null;

  return (
    <>
      <style>{`
        @keyframes chatPanelIn { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes chatFabPulse { 0% { box-shadow: 0 6px 20px rgba(75,59,43,.35), 0 0 0 0 rgba(160,82,45,.55); } 70% { box-shadow: 0 6px 20px rgba(75,59,43,.35), 0 0 0 14px rgba(160,82,45,0); } 100% { box-shadow: 0 6px 20px rgba(75,59,43,.35), 0 0 0 0 rgba(160,82,45,0); } }
        @keyframes chatBadgePop { 0% { transform: scale(.4); } 60% { transform: scale(1.25); } 100% { transform: scale(1); } }
      `}</style>

      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 20, zIndex: 1100,
          width: 'min(380px, calc(100vw - 32px))',
          height: 'min(600px, calc(100dvh - 150px))',
          background: '#fff', borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(59,47,37,.28)',
          border: '1px solid #EAE3D5',
          animation: 'chatPanelIn .28s cubic-bezier(.2,.9,.3,1.2)',
          display: 'flex', flexDirection: 'column',
        }}>
          <ChatBox
            path="/api/chat/me"
            mine="USER"
            title="WebCafe Support"
            subtitle="Online • Usually replies in a few minutes"
            onClose={() => setOpen(false)}
            onLatestId={markSeen}
          />
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open support chat'}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 1100,
          width: 58, height: 58, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #4B3B2B, #6B4E33)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(75,59,43,.35)',
          animation: unread > 0 && !open ? 'chatFabPulse 1.8s infinite' : 'none',
          transition: 'transform .2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <ChatBubbleIcon open={open} />
        {unread > 0 && !open && (
          <span style={{
            position: 'absolute', top: -4, right: -4, minWidth: 24, height: 24,
            borderRadius: 999, background: '#E74C3C', color: '#fff',
            fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 6px', border: '2px solid #fff',
            animation: 'chatBadgePop .3s ease',
          }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>
    </>
  );
}