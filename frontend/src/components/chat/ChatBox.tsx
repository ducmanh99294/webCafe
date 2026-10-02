// components/chat/ChatBox.tsx
// Giao diện chat tối ưu: header, timestamp, date divider, auto-scroll thông minh,
// optimistic send, retry khi lỗi, empty state, skeleton loading.
// Tương thích ngược: <ChatBox path mine /> vẫn chạy như cũ (không header).
import { useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch } from '../../api/base';

export interface ChatMessage {
  id: number | string;
  senderRole: 'USER' | 'ADMIN';
  content: string;
  createdAt?: string | number[];
  read?: boolean;          // true = người nhận đã đọc
  _temp?: boolean;
  _failed?: boolean;
}

interface ChatBoxProps {
  path: string;
  mine: 'USER' | 'ADMIN';
  title?: string;          // có title -> hiện header (phía user)
  subtitle?: string;
  onClose?: () => void;
  onLatestId?: (id: number | string) => void; // widget dùng để tính badge chưa đọc
  unreadIds?: Array<number | string>;         // id các tin cần highlight "chưa đọc" (phía admin)
  onMessages?: (msgs: ChatMessage[]) => void; // báo danh sách tin nhắn sau mỗi lần tải
  onDeleteMessage?: (id: number | string) => Promise<void> | void; // hiện nút × trên tin của mình
}

/* ---------- helpers ---------- */
function toDate(v: any): Date | null {
  if (!v) return null;
  if (Array.isArray(v)) {
    const [y, mo, d, h = 0, mi = 0, s = 0] = v;
    return new Date(y, mo - 1, d, h, mi, s);
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}
const fmtTime = (v: any) => {
  const d = toDate(v);
  return d ? d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
};
function dayLabel(v: any): string {
  const d = toDate(v);
  if (!d) return '';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const day = new Date(d); day.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - day.getTime()) / 86400000);
  if (diff === 0) return 'Hôm nay';
  if (diff === 1) return 'Hôm qua';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/* ---------- icons (SVG inline, không phụ thuộc thư viện) ---------- */
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const DownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const CoffeeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

/* ---------- palette ---------- */
const C = {
  coffee: '#4B3B2B',
  sienna: '#A0522D',
  siennaDark: '#8A4526',
  cream: '#F5F0E6',
  creamLight: '#FAF7F1',
  line: '#EAE3D5',
  text: '#3B2F25',
  muted: '#9A8C7D',
  danger: '#C0392B',
};

export default function ChatBox({ path, mine, title, subtitle, onClose, onLatestId, unreadIds, onMessages, onDeleteMessage }: ChatBoxProps) {
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [nearBottom, setNearBottom] = useState(true);
  const [hasNewBelow, setHasNewBelow] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const nearBottomRef = useRef(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const onLatestIdRef = useRef(onLatestId);
  onLatestIdRef.current = onLatestId;
  const onMessagesRef = useRef(onMessages);
  onMessagesRef.current = onMessages;
  const onDeleteMessageRef = useRef(onDeleteMessage);
  onDeleteMessageRef.current = onDeleteMessage;

  const unreadSet = useMemo(() => new Set((unreadIds ?? []).map(String)), [unreadIds]);

  const showHeader = Boolean(title || onClose);

  /* ---------- load ---------- */
  const load = async (silent = true) => {
    try {
      const res = await apiFetch(path);
      if (res.ok) {
        const data: ChatMessage[] = await res.json();
        data.sort((a, b) => (toDate(a.createdAt)?.getTime() ?? 0) - (toDate(b.createdAt)?.getTime() ?? 0));
        setMsgs(prev => {
          // giữ lại tin nhắn temp đang gửi / gửi lỗi
          const temps = prev.filter(m => m._temp);
          const merged = [...data];
          temps.forEach(t => { if (!merged.some(m => String(m.id) === String(t.id))) merged.push(t); });
          return merged;
        });
        const last = data[data.length - 1];
        if (last && onLatestIdRef.current) onLatestIdRef.current(last.id);
        if (onMessagesRef.current) onMessagesRef.current(data);
      }
    } catch { /* im lặng khi poll lỗi */ }
    finally { if (!silent) setLoading(false); }
  };

  useEffect(() => {
    setLoading(true);
    setMsgs([]);
    load(false).then(() => {
      // lần đầu: nhảy thẳng xuống cuối, không animation
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 1e9 }));
    });
    const t = setInterval(() => load(true), 3000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  /* ---------- smart auto-scroll ---------- */
  const prevLen = useRef(0);
  useEffect(() => {
    if (msgs.length === prevLen.current) return;
    const grew = msgs.length > prevLen.current;
    prevLen.current = msgs.length;
    if (!grew) return;
    if (nearBottomRef.current) {
      scrollRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' });
      setHasNewBelow(false);
    } else {
      const last = msgs[msgs.length - 1];
      if (last && last.senderRole !== mine && !last._temp) setHasNewBelow(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
    nearBottomRef.current = near;
    setNearBottom(near);
    if (near) setHasNewBelow(false);
  };
  const jumpToBottom = () => scrollRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' });

  /* ---------- send (optimistic) ---------- */
  const doSend = async (content: string, retryOf?: ChatMessage) => {
    const temp: ChatMessage = retryOf ?? {
      id: `temp-${Date.now()}`,
      senderRole: mine,
      content,
      createdAt: new Date().toISOString(),
      _temp: true,
    };
    if (!retryOf) {
      setMsgs(prev => [...prev, temp]);
      setText('');
      requestAnimationFrame(() => { if (inputRef.current) inputRef.current.style.height = 'auto'; });
    } else {
      setMsgs(prev => prev.map(m => (m.id === temp.id ? { ...m, _failed: false } : m)));
    }
    setSending(true);
    nearBottomRef.current = true;
    setNearBottom(true);
    try {
      const res = await apiFetch(path, { method: 'POST', body: JSON.stringify({ content }) });
      if (!res.ok) throw new Error('send failed');
      await load(true);
      setMsgs(prev => prev.filter(m => m.id !== temp.id));
    } catch {
      setMsgs(prev => prev.map(m => (m.id === temp.id ? { ...m, _failed: true } : m)));
    } finally {
      setSending(false);
    }
  };

  const send = () => {
    const content = text.trim();
    if (!content || sending) return;
    doSend(content);
  };

  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  /* ---------- render message list (có date divider) ---------- */
  const renderMsgs = () => {
    const out: React.ReactNode[] = [];
    let lastDay = '';
    msgs.forEach(m => {
      const day = dayLabel(m.createdAt);
      if (day && day !== lastDay) {
        lastDay = day;
        out.push(
          <div key={`day-${day}-${m.id}`} style={{ alignSelf: 'center', fontSize: 11, color: C.muted, background: '#EFE9DC', padding: '3px 12px', borderRadius: 999, margin: '6px 0' }}>
            {day}
          </div>
        );
      }
      const isMine = m.senderRole === mine;
      const hl = !isMine && unreadSet.has(String(m.id)); // tin chưa đọc -> highlight
      const canDelete = isMine && !m._temp && Boolean(onDeleteMessage);
      out.push(
        <div key={m.id}
          className="chat-msg"
          onClick={() => m._failed && doSend(m.content, m)}
          title={m._failed ? 'Gửi thất bại — bấm để thử lại' : undefined}
          style={{
            position: 'relative',
            alignSelf: isMine ? 'flex-end' : 'flex-start',
            display: 'flex', alignItems: 'flex-end', gap: 6,
            maxWidth: '82%', flexDirection: isMine ? 'row-reverse' : 'row',
            animation: 'chatMsgIn .25s ease', cursor: m._failed ? 'pointer' : 'default',
            opacity: m._temp && !m._failed ? 0.75 : 1,
          }}>
          {canDelete && (
            <button className="chat-del" title="Xóa tin nhắn"
              onClick={async e => {
                e.stopPropagation();
                if (!window.confirm('Xóa tin nhắn này?')) return;
                try { await onDeleteMessageRef.current?.(m.id); } catch { /* parent báo lỗi */ }
              }}
              style={{ position: 'absolute', top: -9, right: -9, width: 22, height: 22, borderRadius: '50%',
                background: '#fff', border: '1px solid #E5DCCB', color: '#B03A2E', fontSize: 13, lineHeight: 1,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 5px rgba(0,0,0,.18)', zIndex: 2, padding: 0 }}>
              ×
            </button>
          )}
          {!isMine && (
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.coffee, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CoffeeIcon />
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            {hl && (
              <div style={{ marginBottom: 3, textAlign: 'left' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', background: '#E8A33D',
                  padding: '2px 8px', borderRadius: 999, letterSpacing: '.4px' }}>MỚI</span>
              </div>
            )}
            <div style={{
              background: hl ? '#FFF9EC' : isMine ? `linear-gradient(135deg, ${C.sienna}, ${C.siennaDark})` : '#fff',
              color: isMine ? '#fff' : C.text,
              padding: '9px 13px',
              borderRadius: 16,
              borderBottomRightRadius: isMine ? 5 : 16,
              borderBottomLeftRadius: isMine ? 16 : 5,
              border: hl ? '1px solid #E8A33D' : isMine ? 'none' : `1px solid ${C.line}`,
              boxShadow: hl ? '0 0 0 3px rgba(232,163,61,.18)' : isMine ? '0 2px 8px rgba(160,82,45,.25)' : '0 1px 4px rgba(75,59,43,.08)',
              fontSize: 14, lineHeight: 1.45, wordBreak: 'break-word', whiteSpace: 'pre-wrap',
              ...(m._failed ? { border: `1px dashed ${C.danger}` } : {}),
            }}>
              {m.content}
              {m._failed && <div style={{ fontSize: 11, color: C.danger, marginTop: 4 }}>⚠ Không gửi được — bấm để thử lại</div>}
            </div>
            <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3, textAlign: isMine ? 'right' : 'left', padding: '0 4px' }}>
              {m._temp && !m._failed ? 'Đang gửi…' : fmtTime(m.createdAt)}
            </div>
          </div>
        </div>
      );
    });
    return out;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'inherit', color: C.text, position: 'relative' }}>
      <style>{`
        @keyframes chatMsgIn { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes chatSkeleton { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
        .chat-del { opacity: 0; transition: opacity .15s; }
        .chat-msg:hover .chat-del { opacity: 1; }
      `}</style>

      {/* Header — chỉ phía user */}
      {showHeader && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
          background: `linear-gradient(135deg, ${C.coffee}, #5D4A36)`, color: '#fff', flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CoffeeIcon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{title || 'Hỗ trợ trực tuyến'}</div>
            <div style={{ fontSize: 12, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
              {subtitle || 'Đang hoạt động • Thường trả lời trong vài phút'}
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} aria-label="Đóng chat"
              style={{ background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff', width: 32, height: 32,
                borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloseIcon />
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} onScroll={onScroll}
        style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8,
          background: C.creamLight }}>
        {loading ? (
          [70, 45, 60].map((w, i) => (
            <div key={i} style={{ alignSelf: i % 2 ? 'flex-end' : 'flex-start', width: `${w}%`, height: 38,
              borderRadius: 14, background: `linear-gradient(90deg, ${C.cream} 25%, #fff 50%, ${C.cream} 75%)`,
              backgroundSize: '400px 100%', animation: 'chatSkeleton 1.2s infinite linear' }} />
          ))
        ) : msgs.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: C.muted, padding: 20, animation: 'chatMsgIn .3s ease' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.cream, margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sienna }}>
              <CoffeeIcon />
            </div>
            <div style={{ fontWeight: 700, color: C.coffee, fontSize: 15, marginBottom: 4 }}>Xin chào!</div>
            <div style={{ fontSize: 13 }}>Bạn cần hỗ trợ gì hôm nay?<br />Hãy gửi tin nhắn cho chúng tôi nhé.</div>
          </div>
        ) : renderMsgs()}
      </div>

      {/* Nút "tin nhắn mới" khi đang xem tin cũ */}
      {hasNewBelow && !nearBottom && (
        <button onClick={jumpToBottom}
          style={{ position: 'absolute', bottom: 86, left: '50%', transform: 'translateX(-50%)',
            background: C.coffee, color: '#fff', border: 'none', borderRadius: 999, padding: '7px 14px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 14px rgba(0,0,0,.25)', animation: 'chatMsgIn .2s ease', zIndex: 5, whiteSpace: 'nowrap' }}>
          <DownIcon /> Tin nhắn mới
        </button>
      )}

      {/* Input */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: 10, background: '#fff',
        borderTop: `1px solid ${C.line}`, flexShrink: 0 }}>
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          onChange={onInput}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Nhập tin nhắn… (Enter để gửi)"
          style={{ flex: 1, resize: 'none', padding: '10px 14px', borderRadius: 20, border: `1px solid ${C.line}`,
            fontSize: 14, fontFamily: 'inherit', outline: 'none', maxHeight: 120, background: C.creamLight,
            color: C.text }}
          onFocus={e => (e.target.style.borderColor = C.sienna)}
          onBlur={e => (e.target.style.borderColor = C.line)}
        />
        <button onClick={send} disabled={!text.trim() || sending} aria-label="Gửi tin nhắn"
          style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: text.trim() && !sending ? 'pointer' : 'default',
            background: text.trim() && !sending ? `linear-gradient(135deg, ${C.sienna}, ${C.siennaDark})` : '#D8CFBE',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'transform .15s', transform: text.trim() && !sending ? 'scale(1)' : 'scale(.92)' }}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}