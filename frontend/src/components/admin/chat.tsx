// components/admin/chat.tsx
// Trang chat phía admin: danh sách hội thoại + xóa hội thoại / xóa tin nhắn,
// highlight tin chưa đọc, tự đánh dấu đã đọc.
// Thông báo tin mới (toast/âm thanh/browser notification) do ChatNotifier toàn cục đảm nhiệm.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../../api/base';
import ChatBox, { ChatMessage } from '../chat/ChatBox';
import { playChatBeep } from './ChatNotifier';

interface Conv {
  userId: string;
  username: string;
  lastMessage: string;
  lastAt: any;
  unread: number;
}

const C = {
  coffee: '#4B3B2B', sienna: '#A0522D', cream: '#F5F0E6', creamLight: '#FAF7F1',
  line: '#EAE3D5', text: '#3B2F25', muted: '#9A8C7D', danger: '#C0392B',
};

/* ---------- helpers ---------- */
function toDate(v: any): Date | null {
  if (!v) return null;
  if (Array.isArray(v)) { const [y, mo, d, h = 0, mi = 0, s = 0] = v; return new Date(y, mo - 1, d, h, mi, s); }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}
function fmtLastAt(v: any): string {
  const d = toDate(v);
  if (!d) return '';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const day = new Date(d); day.setHours(0, 0, 0, 0);
  if (day.getTime() === today.getTime()) return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

/* Báo cho ChatNotifier biết admin đang mở xem hội thoại nào (để khỏi toast trùng) */
function setViewing(userId: string | null) {
  window.dispatchEvent(new CustomEvent('webcafe-chat-viewing', { detail: userId }));
}

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const BellIcon = ({ off }: { off?: boolean }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    {off && <line x1="2" y1="2" x2="22" y2="22" />}
  </svg>
);
const SoundIcon = ({ off }: { off?: boolean }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    {off
      ? <><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>
      : <><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></>}
  </svg>
);

export default function AdminChat() {
  const [convs, setConvs] = useState<Conv[]>([]);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [unreadIds, setUnreadIds] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(() => { try { return localStorage.getItem('webcafe_chat_sound') !== 'off'; } catch { return true; } });
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(() => ('Notification' in window ? Notification.permission : 'denied'));
  const [searchParams] = useSearchParams();

  const markReadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const knownIds = useRef(new Set<string>());
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const totalUnread = convs.reduce((s, c) => s + (c.unread || 0), 0);
  const selectedConv = convs.find(c => c.userId === selected);
  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? convs.filter(c => c.username.toLowerCase().includes(needle) || c.lastMessage.toLowerCase().includes(needle))
    : convs;

  /* ---------- tải danh sách hội thoại (poll 5s) ---------- */
  const loadConvs = useCallback(async () => {
    try {
      const res = await apiFetch('/api/chat/admin/conversations');
      if (res.ok) setConvs(await res.json());
    } catch { /* im lặng */ }
  }, []);
  useEffect(() => {
    loadConvs();
    const t = setInterval(loadConvs, 5000);
    return () => clearInterval(t);
  }, [loadConvs]);

  /* Rời trang chat -> báo không còn xem hội thoại nào */
  useEffect(() => () => setViewing(null), []);

  /* ---------- đánh dấu đã đọc (debounce 2s sau khi admin xem) ---------- */
  const markReadSoon = useCallback((userId: string) => {
    if (markReadTimer.current) clearTimeout(markReadTimer.current);
    markReadTimer.current = setTimeout(async () => {
      try {
        await apiFetch(`/api/chat/admin/${userId}/read`, { method: 'POST' });
        const res = await apiFetch('/api/chat/admin/conversations');
        if (res.ok) setConvs(await res.json());
      } catch { /* ignore */ }
    }, 2000);
  }, []);

  /* ---------- chọn hội thoại: lấy tin chưa đọc để highlight ---------- */
  const select = useCallback(async (c: Conv) => {
    setSelected(c.userId);
    setViewing(c.userId);
    setUnreadIds([]);
    knownIds.current = new Set();
    try {
      const res = await apiFetch(`/api/chat/admin/${c.userId}`);
      if (res.ok) {
        const msgs: ChatMessage[] = await res.json();
        const ids = msgs.filter(m => m.senderRole === 'USER' && !m.read).map(m => String(m.id));
        setUnreadIds(ids);
        msgs.forEach(m => knownIds.current.add(String(m.id)));
        if (ids.length) markReadSoon(c.userId);
      }
    } catch { /* ignore */ }
    const r2 = await apiFetch('/api/chat/admin/conversations');
    if (r2.ok) setConvs(await r2.json());
  }, [markReadSoon]);
  const selectRef = useRef(select);
  selectRef.current = select;

  /* Bấm vào toast thông báo -> tự mở đúng hội thoại (?user=...) */
  useEffect(() => {
    const userParam = searchParams.get('user');
    if (!userParam) return;
    const c = convs.find(x => x.userId === userParam);
    if (c && selectedRef.current !== c.userId) selectRef.current(c);
  }, [searchParams, convs]);

  /* ---------- ChatBox báo tin nhắn sau mỗi lần poll: highlight tin mới ---------- */
  const handleMessages = (msgs: ChatMessage[]) => {
    const sid = selectedRef.current;
    if (!sid) return;
    const fresh = msgs.filter(m => m.senderRole === 'USER' && !m.read && !knownIds.current.has(String(m.id)));
    if (fresh.length) {
      fresh.forEach(m => knownIds.current.add(String(m.id)));
      setUnreadIds(prev => {
        const s = new Set(prev);
        fresh.forEach(m => s.add(String(m.id)));
        return [...s];
      });
      markReadSoon(sid);
    }
  };

  /* ---------- xóa hội thoại ---------- */
  const delConv = async (userId: string) => {
    try {
      const res = await apiFetch(`/api/chat/admin/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setConvs(prev => prev.filter(c => c.userId !== userId));
        if (selectedRef.current === userId) { setSelected(null); setViewing(null); setUnreadIds([]); }
      } else alert('Không xóa được cuộc trò chuyện');
    } catch { alert('Không xóa được cuộc trò chuyện'); }
    setConfirmDel(null);
  };

  /* ---------- xóa 1 tin nhắn ---------- */
  const delMsg = async (id: number | string) => {
    const res = await apiFetch(`/api/chat/admin/message/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setUnreadIds(prev => prev.filter(x => x !== String(id)));
      setRefreshKey(k => k + 1); // reload ChatBox
    } else alert('Không xóa được tin nhắn');
  };

  const enableNotif = async () => {
    if (!('Notification' in window)) { alert('Trình duyệt không hỗ trợ thông báo'); return; }
    try { setNotifPerm(await Notification.requestPermission()); } catch { /* ignore */ }
  };

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        .conv-row .conv-del { opacity: 0; transition: opacity .15s; }
        .conv-row:hover .conv-del { opacity: 1; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', height: '72vh', minHeight: 480,
        background: '#fff', borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.line}`,
        boxShadow: '0 4px 20px rgba(75,59,43,.06)' }}>

        {/* ===== Cột trái: danh sách hội thoại ===== */}
        <div style={{ borderRight: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '12px 14px 8px', borderBottom: `1px solid ${C.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: C.coffee, display: 'flex', alignItems: 'center', gap: 8 }}>
                Tin nhắn
                {totalUnread > 0 && (
                  <span style={{ background: C.danger, color: '#fff', fontSize: 11, fontWeight: 700,
                    borderRadius: 999, padding: '2px 9px' }}>{totalUnread}</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => { const v = !soundOn; setSoundOn(v); try { localStorage.setItem('webcafe_chat_sound', v ? 'on' : 'off'); } catch {} if (v) playChatBeep(); }}
                  title={soundOn ? 'Tắt âm báo (áp dụng mọi trang)' : 'Bật âm báo (áp dụng mọi trang)'}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: soundOn ? C.sienna : C.muted, padding: 6, borderRadius: 8 }}>
                  <SoundIcon off={!soundOn} />
                </button>
                <button onClick={enableNotif}
                  title={notifPerm === 'granted' ? 'Đã bật thông báo trình duyệt' : notifPerm === 'denied' ? 'Trình duyệt đã chặn thông báo' : 'Bật thông báo trình duyệt'}
                  style={{ border: 'none', background: notifPerm === 'granted' ? C.cream : 'transparent', cursor: 'pointer',
                    color: notifPerm === 'granted' ? C.sienna : C.muted, padding: 6, borderRadius: 8 }}>
                  <BellIcon off={notifPerm !== 'granted'} />
                </button>
              </div>
            </div>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm theo tên / nội dung…"
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: 10,
                border: `1px solid ${C.line}`, fontSize: 13, outline: 'none', background: C.creamLight }} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>
                {q ? 'Không tìm thấy hội thoại nào' : 'Chưa có cuộc trò chuyện nào'}
              </div>
            )}
            {filtered.map(c => {
              const isSel = selected === c.userId;
              const hasUnread = c.unread > 0;
              return (
                <div key={c.userId} className="conv-row"
                  onClick={() => select(c)}
                  style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center',
                    background: isSel ? C.cream : hasUnread ? '#FFFDF7' : 'transparent',
                    borderLeft: `3px solid ${isSel ? C.sienna : hasUnread ? '#E8A33D' : 'transparent'}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: hasUnread ? C.sienna : C.coffee, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 16 }}>
                    {(c.username || '?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                      <strong style={{ fontSize: 14, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        fontWeight: hasUnread ? 800 : 600 }}>{c.username}</strong>
                      <span style={{ fontSize: 11, color: hasUnread ? C.sienna : C.muted, flexShrink: 0, fontWeight: hasUnread ? 700 : 400 }}>
                        {fmtLastAt(c.lastAt)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 2 }}>
                      <div style={{ fontSize: 13, color: hasUnread ? C.text : '#777', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: hasUnread ? 600 : 400 }}>
                        {c.lastMessage}
                      </div>
                      {hasUnread && (
                        <span style={{ background: C.danger, color: '#fff', borderRadius: 999, padding: '1px 8px',
                          fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{c.unread}</span>
                      )}
                    </div>
                  </div>
                  {confirmDel === c.userId ? (
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => delConv(c.userId)} title="Xác nhận xóa"
                        style={{ border: 'none', background: C.danger, color: '#fff', borderRadius: 8,
                          padding: '5px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Xóa</button>
                      <button onClick={() => setConfirmDel(null)} title="Hủy"
                        style={{ border: `1px solid ${C.line}`, background: '#fff', color: C.text, borderRadius: 8,
                          padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}>Hủy</button>
                    </div>
                  ) : (
                    <button className="conv-del" title="Xóa cuộc trò chuyện"
                      onClick={e => { e.stopPropagation(); setConfirmDel(c.userId); }}
                      style={{ border: 'none', background: 'transparent', color: C.muted, cursor: 'pointer',
                        padding: 6, borderRadius: 8, flexShrink: 0 }}>
                      <TrashIcon />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Cột phải: khung chat ===== */}
        {selected ? (
          <ChatBox
            key={`${selected}:${refreshKey}`}
            path={`/api/chat/admin/${selected}`}
            mine="ADMIN"
            title={selectedConv?.username || 'Khách hàng'}
            subtitle="Cuộc trò chuyện với khách"
            unreadIds={unreadIds}
            onMessages={handleMessages}
            onDeleteMessage={delMsg}
          />
        ) : (
          <div style={{ margin: 'auto', textAlign: 'center', color: C.muted }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>💬</div>
            <div style={{ fontWeight: 600, color: C.coffee }}>Chọn một cuộc trò chuyện</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Tin nhắn mới từ khách sẽ báo ở mọi trang</div>
          </div>
        )}
      </div>
    </div>
  );
}