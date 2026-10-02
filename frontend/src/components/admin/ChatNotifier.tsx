// components/admin/ChatNotifier.tsx
// Thông báo tin nhắn mới TOÀN SITE cho admin: toast + âm báo + browser notification + đếm trên tiêu đề tab.
// Gắn 1 lần trong App.tsx, chỉ hoạt động khi đăng nhập với quyền ADMIN.
// Bấm vào toast -> nhảy thẳng vào đúng hội thoại trong tab chat (/admin?tab=chat&user=...).
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/base';
import { subscribeChatEvents, useChatSocketStatus } from '../chat/chatSocket';

interface Conv {
  userId: string;
  username: string;
  lastMessage: string;
  lastAt: any;
  unread: number;
}
interface Toast { id: number; userId: string; username: string; text: string; }

const C = {
  coffee: '#4B3B2B', sienna: '#A0522D', cream: '#F5F0E6',
  line: '#EAE3D5', text: '#3B2F25', muted: '#9A8C7D',
};

/* Âm báo "ting-ting" bằng Web Audio, không cần file âm thanh */
export function playChatBeep() {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    [660, 880].forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine'; o.frequency.value = f;
      const t0 = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
      o.start(t0); o.stop(t0 + 0.18);
    });
    setTimeout(() => ctx.close(), 700);
  } catch { /* trình duyệt chặn audio trước khi có tương tác — bỏ qua */ }
}

const checkAdmin = () => {
  try { return localStorage.getItem('role') === 'ADMIN' && Boolean(localStorage.getItem('token')); }
  catch { return false; }
};
const soundOn = () => {
  try { return localStorage.getItem('webcafe_chat_sound') !== 'off'; }
  catch { return true; }
};

export default function ChatNotifier() {
  const [isAdmin, setIsAdmin] = useState(checkAdmin);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const prevUnread = useRef(new Map<string, number>());
  const viewingRef = useRef<string | null>(null); // hội thoại admin đang mở xem
  const navigate = useNavigate();
  const wsUp = useChatSocketStatus(); // true = WebSocket đang nối, sự kiện tới là xử lý ngay
  const pollRef = useRef<() => void>(() => {});

  // Theo dõi quyền admin (khi login/logout không reload trang)
  useEffect(() => {
    const t = setInterval(() => setIsAdmin(checkAdmin()), 5000);
    const onStorage = () => setIsAdmin(checkAdmin());
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(t); window.removeEventListener('storage', onStorage); };
  }, []);

  // Lắng nghe hội thoại admin đang mở (trang chat báo qua CustomEvent)
  useEffect(() => {
    const onView = (e: Event) => { viewingRef.current = (e as CustomEvent<string | null>).detail ?? null; };
    window.addEventListener('webcafe-chat-viewing', onView);
    return () => window.removeEventListener('webcafe-chat-viewing', onView);
  }, []);

  const notify = (c: Conv) => {
    // đang mở xem đúng hội thoại đó -> không toast (đã có highlight), vẫn kêu "ting"
    if (viewingRef.current !== c.userId) {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev.slice(-3), { id, userId: c.userId, username: c.username, text: c.lastMessage }]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 7000);
      if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
        try { new Notification(`Tin nhắn mới từ ${c.username}`, { body: c.lastMessage }); } catch { /* ignore */ }
      }
    }
    if (soundOn()) playChatBeep();
  };

  /* Poll dự phòng khi WebSocket chưa kết nối (phát hiện tin nhắn mới qua số lượng unread tăng).
     Khi WS đã nối, mỗi sự kiện sẽ gọi poll() ngay nên không cần poll định kỳ. */
  useEffect(() => {
    if (!isAdmin) return;
    let alive = true;
    const seed = async () => {
      try {
        const res = await apiFetch('/api/chat/admin/conversations');
        if (res.ok && alive) {
          const data: Conv[] = await res.json();
          // lần đầu: chỉ ghi nhận, không bắn thông báo cho tin cũ
          data.forEach(c => prevUnread.current.set(c.userId, c.unread || 0));
        }
      } catch { /* im lặng */ }
    };
    const poll = async () => {
      try {
        const res = await apiFetch('/api/chat/admin/conversations');
        if (!res.ok || !alive) return;
        const data: Conv[] = await res.json();
        let total = 0;
        const seen = new Set<string>();
        data.forEach(c => {
          seen.add(c.userId);
          total += c.unread || 0;
          const prev = prevUnread.current.get(c.userId) ?? 0;
          if (c.unread > prev) notify(c);
          prevUnread.current.set(c.userId, c.unread || 0);
        });
        [...prevUnread.current.keys()].forEach(k => { if (!seen.has(k)) prevUnread.current.delete(k); });
        setTotalUnread(total);
      } catch { /* im lặng */ }
    };
    seed();
    pollRef.current = poll;
    if (wsUp) return () => { alive = false; }; // WS đang chạy -> không poll định kỳ
    const t = setInterval(() => { if (!document.hidden) poll(); }, 5000);
    const onVisible = () => { if (!document.hidden) poll(); };
    window.addEventListener('focus', onVisible);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      clearInterval(t);
      window.removeEventListener('focus', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, wsUp]);

  /* WebSocket: có sự kiện chat -> kiểm tra ngay qua API,
     tái dùng logic phát hiện unread tăng (toast/âm thanh/browser notification) sẵn có */
  useEffect(() => {
    if (!isAdmin) return;
    return subscribeChatEvents(() => { pollRef.current(); });
  }, [isAdmin]);

  /* Đếm tin chưa đọc trên tiêu đề tab (giữ nguyên tiêu đề gốc của trang) */
  useEffect(() => {
    const clean = document.title.replace(/^\(\d+\)\s*/, '');
    document.title = totalUnread > 0 ? `(${totalUnread}) ${clean}` : clean;
  }, [totalUnread]);

  if (!isAdmin) return null;

  const openChat = (userId: string) => {
    setToasts(prev => prev.filter(x => x.userId !== userId));
    navigate(`/admin?tab=chat&user=${encodeURIComponent(userId)}`);
  };

  return (
    <>
      <style>{`@keyframes chatToastIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: none; } }`}</style>
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1300, display: 'flex',
        flexDirection: 'column', gap: 10, width: 330, maxWidth: 'calc(100vw - 40px)' }}>
        {toasts.map(t => (
          <div key={t.id} onClick={() => openChat(t.userId)}
            style={{ background: '#fff', borderRadius: 14, padding: '12px 14px', cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(59,47,37,.25)', border: `1px solid ${C.line}`,
              borderLeft: `4px solid ${C.sienna}`, animation: 'chatToastIn .25s ease',
              display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.sienna, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
              {(t.username || '?')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.coffee }}>Tin nhắn mới từ {t.username}</div>
              <div style={{ fontSize: 13, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{t.text}</div>
              <div style={{ fontSize: 11, color: C.sienna, marginTop: 4, fontWeight: 600 }}>Bấm để mở hội thoại →</div>
            </div>
            <button onClick={e => { e.stopPropagation(); setToasts(prev => prev.filter(x => x.id !== t.id)); }}
              style={{ border: 'none', background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
          </div>
        ))}
      </div>
    </>
  );
}