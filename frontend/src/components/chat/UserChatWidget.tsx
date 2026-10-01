// components/chat/UserChatWidget.tsx
import { useState } from 'react';
import ChatBox from './ChatBox';

export default function UserChatWidget() {
  const [open, setOpen] = useState(false);
  if (!localStorage.getItem('userId') || localStorage.getItem('role') === 'ADMIN') return null;

  return (
    <>
      {open && (
        <div style={{ position: 'fixed', bottom: 80, right: 20, width: 340, height: 440, background: '#fff',
          borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,.2)', zIndex: 1100, overflow: 'hidden' }}>
          <ChatBox path="/api/chat/me" mine="USER" />
        </div>
      )}
      <button onClick={() => setOpen(!open)} style={{ position: 'fixed', bottom: 20, right: 70, width: 48, height: 48,
        borderRadius: '50%', background: '#4B3B2B', color: '#fff', border: 'none', fontSize: 20, cursor: 'pointer', zIndex: 1100 }}>💬</button>
    </>
  );
}