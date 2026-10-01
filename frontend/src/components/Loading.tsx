import '../assets/css/loading.css';

export default function Loading({ text = 'Đang tải...' }: { text?: string }) {
  return (
    <div className="loading-wrap">
      <div className="loading-spinner" />
      <span>{text}</span>
    </div>
  );
}