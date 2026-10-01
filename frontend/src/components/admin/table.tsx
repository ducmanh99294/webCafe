// SeatManagement.js - Bổ sung thêm
import { useState, useEffect } from 'react';
import '../../assets/css/admin/table.css';
import { apiFetch } from '../../api/base'; 
import { denyAndRedirect } from '../../utils/notify';

const SeatManagement = () => {
  const [roomElements, setRoomElements] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tables, setTables] = useState<any[]>([]);
  const [formData, _setFormData] = useState<any>({
    number: generateRandomTableCode(),
    seats: 3,
    status: 'available',
    x: 0,
    y: 0,
  });

  // const api = 'http://localhost:8080'
  const token = localStorage.getItem('token');
  const role = localStorage.getItem("role");

  useEffect(() => {    
if (role !== 'ADMIN' || !token) {
  denyAndRedirect();
  return;
}

    const initialRoomElements = [
      { id: 'reception1', type: 'reception', x: 50, y: 30, width: 200, height: 60, label: 'QUẦY LỄ TÂN' },
      { id: 'window1', type: 'window', x: 0, y: 110, width: 15, height: 200 },
      { id: 'window2', type: 'window', x: 400, y: 480, width: 180, height: 15 },
      { id: 'window3', type: 'window', x: 100, y: 480, width: 180, height: 15 },
      { id: 'window4', type: 'window', x: 760, y: 110, width: 15, height: 200 },
      { id: 'mainWalkway1', type: 'walkway', x: 340, y: 60, width: 20, height: 430 },
      { id: 'mainWalkway2', type: 'walkway', x: 690, y: 360, width: 20, height: 130 },
      { id: 'sideWalkway1', type: 'walkway', x: 0, y: 350, width: 780, height: 20 },
      { id: 'sideWalkway2', type: 'walkway', x: 250, y: 50, width: 530, height: 20 },
      { id: 'entrance1', type: 'entrance', x: 650, y: 460, width: 100, height: 30, label: 'Lối vào' },
    ];

    setRoomElements(initialRoomElements);
    fetchTables();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTables = async () => {
    try {
      const res = await apiFetch(`/api/tables`);
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (err) {
      console.log('Error fetching tables:', err);
    }
  };

  const handleAddTable = async () => {
    try {
      const res = await apiFetch(`/api/admin/tables`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setTables((prev) => [...prev, data]);
      }
    } catch (err) {
      console.log('Error adding table:', err);
    }
  };

  const handleUpdateTable = async (table: any) => {

    try {
      const res = await apiFetch(`/api/tables/${table.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          number: table.number,
          seats: table.seats,
          status: table.status,
          x: table.x,
          y: table.y
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTables((prev) => prev.map((t) => (t.id === table.id ? updated : t)));
      }
    } catch (err) {
      console.log('Error updating table:', err);
    }
  };

  const handleUpdateStatusTable = async (table: any, sta: string) => {
        console.log(JSON.stringify({         number: table.number,
          seats: table.seats,
          status: sta,
          x: table.x,
          y: table.y  },null,2))
    try {
      const res = await apiFetch(`/api/tables/${table.id}`, {
        method: 'PUT',
        body: JSON.stringify({           
          number: table.number,
          seats: table.seats,
          status: sta,
          x: table.x,
          y: table.y  
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTables((prev) => prev.map((t) => (t.id === table.id ? updated : t)));
      }
    } catch (err) {
      console.log('Error updating status:', err);
    }
  };

  const handleDeleteTable = async (table: any) => {
    console.log(table)
    try {
      const res = await apiFetch(`/api/tables/admin/${table.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTables((prev) => prev.filter((t) => t.id !== table.id));
        console.log("sc")
      }
    } catch (err) {
      console.log('Error deleting table:', err);
    }
  };

  const handleSeatDrag = (tableId: string, clientX: number, clientY: number) => {
    const seatMap = document.querySelector('.seat-map');
    if (!seatMap) return;
    const rect = seatMap.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setTables((prev) =>
        prev.map((t) => (t.id === tableId ? { ...t, x: x - 12, y: y - 12 } : t))
      );
    }
  };

  const handleMouseDown = (tableId: string, e: MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (e: MouseEvent) => handleSeatDrag(tableId, e.clientX, e.clientY);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  function generateRandomTableCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 9) + 1; // 1–9
    return `${randomLetter}${randomNumber}`;
  }
  const handleSeatClick = (table: any, e: any) => {
    e.stopPropagation();
    setSelectedTable(table);
    setSelectedElement(null);
  };

  const handleElementClick = (element: any, e: any) => {
    e.stopPropagation();
    setSelectedElement(element);
    setSelectedTable(null);
  };

  const handleMapClick = () => {
    setSelectedTable(null);
    setSelectedElement(null);
  };

  const formatDate = (date: Date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
    return date.toLocaleDateString('vi-VN', options);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString('vi-VN');

  useEffect(() => {
    const container = document.querySelector('.seat-map-container') as HTMLElement;
    const map = document.querySelector('.seat-map') as HTMLElement;

    const resize = () => {
      if (!container || !map) return;
      const scale = Math.min(container.clientWidth / 780, 1);
      map.style.transform = `scale(${scale})`;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="dashboard">
   <div className="main-content">
        <div className="content-header">
          <div className="header-top">
            <h2>Quản Lý Chỗ Ngồi</h2>
            <div className="date-time">
              {formatDate(currentTime)}<br />
              {formatTime(currentTime)}
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary">
              <span>+</span> Thêm Khu Vực
            </button>
            <button className="btn btn-secondary">
              📊 Xuất Báo Cáo
            </button>
          </div>
        </div>

        <div className="seat-management">
          {/* Seat Map */}
          <div className="seat-map-container">
            <div 
              className="seat-map"
              onDragOver={(e) => e.preventDefault()}
              onClick={handleMapClick}
            >
              {/* Các thành phần phòng */}
              {roomElements.map(element => (
                <div
                  key={element.id}
                  className={`room-element ${element.type} ${element.shape || ''} ${selectedElement?.id === element.id ? 'selected' : ''}`}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                  }}
                  onClick={(e) => handleElementClick(element, e)}
                  title={element.label || element.type}
                >
                  {element.label}
                </div>
              ))}

              {/* Các chỗ ngồi */}
              {tables.map(seat => (
                <div
                  key={seat.id}
                  className={`seat-dot ${seat.status} ${selectedTable?.id === seat.id ? 'selected' : ''}`}
                  style={{ left: `${seat.x}px`, top: `${seat.y}px` }}
                  onMouseDown={(e) => handleMouseDown(seat.id, e as any)}
                  onClick={(e) => handleSeatClick(seat, e)}
                  title={`${seat.number} - ${seat.status === 'available' ? 'Còn trống' : seat.status === 'unavailable' ? 'Đã có người' : 'Đã đặt trước'}`}
                >
                  {seat.number}
                </div>
              ))}
            </div>
          </div>

          {/* Control Panel */}
          <div className="control-panel">
            <div className="panel-section">
              <h3>Chú Thích</h3>
              <div className="legend">
                <div className="legend-item">
                  <div className="legend-color available"></div>
                  <span>Còn trống</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color occupied"></div>
                  <span>Đã có người</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color reserved"></div>
                  <span>Đã đặt trước</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color window"></div>
                  <span>Cửa sổ</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color walkway"></div>
                  <span>Lối đi</span>
                </div>
              </div>
            </div>

            <div className="panel-section">
              <h3>Thao Tác Nhanh</h3>
              <div className="quick-actions">
                <button 
                  className="action-btn" 
                  onClick={() => handleUpdateStatusTable(selectedTable,'available')}
                  disabled={!selectedTable}
                >
                  Đánh dấu trống
                </button>
                <button 
                  className="action-btn" 
                  onClick={() => handleUpdateStatusTable(selectedTable,'unavailable')}
                  disabled={!selectedTable}
                >
                  Đánh dấu có người
                </button>
                <button 
                  className="action-btn" 
                  onClick={() => handleUpdateStatusTable(selectedTable,'reserve')}
                  disabled={!selectedTable}
                >
                  Đánh dấu đặt trước
                </button>
                <button 
                  className="action-btn" 
                  onClick={handleAddTable}
                >
                  Thêm chỗ ngồi
                </button>
                <button 
                  className="action-btn" 
                  onClick={() => handleDeleteTable(selectedTable)}
                  disabled={!selectedTable}
                >
                  Xóa chỗ ngồi
                </button>
                <button 
                  className="action-btn"
                  onClick={() => handleUpdateTable(selectedTable)}
                  disabled={!selectedTable}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>

            {/* Selected Info */}
            {selectedTable && (
              <div className="panel-section">
                <h3>Thông Tin Chỗ Ngồi</h3>
                <div className="seat-info">
                  <h4>Chỗ ngồi {selectedTable.number}</h4>
                  <div className="seat-details">
                    <div><strong>Trạng thái:</strong> {
                      selectedTable.status === 'available' ? 'Còn trống' :
                      selectedTable.status === 'occupied' ? 'Đã có người' : 'Đã đặt trước'
                    }</div>
                    <div><strong>Vị trí:</strong> ({Math.round(selectedTable.x)}px, {Math.round(selectedTable.y)}px)</div>
                    <div><strong>Khu vực:</strong> {selectedTable.group}</div>
                    <div><strong>ID:</strong> {selectedTable.id}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="panel-section">
              <h3>Thống Kê</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number total">{tables.length}</div>
                  <div className="stat-label">Tổng số chỗ</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number available">{tables.filter((emp: any)  => emp.status === 'available').length}</div>
                  <div className="stat-label">Còn trống</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number occupied">{tables.filter((e: any) => e.status === 'unavailable').length }</div>
                  <div className="stat-label">Đã có người</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{tables.filter((e: any) => e.status === 'reserve').length}</div>
                  <div className="stat-label">Đặt trước</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatManagement;