// components/admin/chat.tsx
import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/base';
import ChatBox from '../chat/ChatBox';

const AdminChat = () => {
  const [convs, setConvs] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const load = async () => {
    const res = await apiFetch('/api/chat/admin/conversations');
    if (res.ok) setConvs(await res.json());
  };
  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t); }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: '70vh', background: '#fff', borderRadius: 15, overflow: 'hidden' }}>
      <div style={{ borderRight: '1px solid #E8E2D6', overflowY: 'auto' }}>
        {convs.map(c => (
          <div key={c.userId} onClick={() => setSelected(c.userId)}
            style={{ padding: 14, cursor: 'pointer', background: selected === c.userId ? '#F5F0E6' : 'transparent' }}>
            <strong>{c.username}</strong>
            {c.unread > 0 && <span style={{ background: '#A0522D', color: '#fff', borderRadius: 10, padding: '0 8px', marginLeft: 8 }}>{c.unread}</span>}
            <div style={{ fontSize: 13, color: '#777', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMessage}</div>
          </div>
        ))}
      </div>
      {selected
        ? <ChatBox key={selected} path={`/api/chat/admin/${selected}`} mine="ADMIN" />
        : <div style={{ margin: 'auto', color: '#999' }}>Chọn một cuộc trò chuyện</div>}
    </div>
  );
};
export default AdminChat;