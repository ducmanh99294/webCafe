// components/chat/ChatBox.tsx
import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../../api/base';

export default function ChatBox({ path, mine }: { path: string; mine: 'USER' | 'ADMIN' }) {
  const [msgs, setMsgs] = useState<any[]>([]);
  const [text, setText] = useState('');
  const bottom = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const res = await apiFetch(path);
      if (res.ok) setMsgs(await res.json());
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [path]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs.length]);

  const send = async () => {
    const content = text.trim();
    if (!content) return;
    setText('');
    const res = await apiFetch(path, { method: 'POST', body: JSON.stringify({ content }) });
    if (res.ok) load();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.map(m => (
          <div key={m.id} style={{
            alignSelf: m.senderRole === mine ? 'flex-end' : 'flex-start',
            background: m.senderRole === mine ? '#A0522D' : '#F5F0E6',
            color: m.senderRole === mine ? '#fff' : '#4B3B2B',
            padding: '8px 12px', borderRadius: 12, maxWidth: '75%', wordBreak: 'break-word'
          }}>{m.content}</div>
        ))}
        <div ref={bottom} />
      </div>
      <div style={{ display: 'flex', gap: 8, padding: 10, borderTop: '1px solid #E8E2D6' }}>
        <input value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Nhập tin nhắn..." style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
        <button onClick={send} style={{ background: '#A0522D', color: '#fff', border: 'none', padding: '0 16px', borderRadius: 8, cursor: 'pointer' }}>Gửi</button>
      </div>
    </div>
  );
}