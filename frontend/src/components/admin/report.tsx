// AdminReports.js
import  { useState, useEffect } from 'react';
import '../../assets/css/admin/report.css';
import { apiFetch } from '../../api/base'; 
import { denyAndRedirect, notify } from '../../utils/notify';

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<any>([]);
  const [orders, setOrders] = useState<any>([]);
  const [dayReports, setDayReports] = useState<any>([]);
  const [monthReports, setMonthReports] = useState<any>([]);
  const [compareReports, setCompareReports] = useState<any>([]);
  const [productReport, setProductReport] = useState<any>([]);
  // const api = 'http://localhost:8080'
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")

  useEffect(() => {
if (role !== 'ADMIN' || !token) {
  denyAndRedirect();
  return;
}
    fetchReport();
    fetchTopSellProduct();
    fetchReportByDay();
    fetchReportByMonth();
    fetchCompareReport();
    fetchOrders();
  }, []);

  const fetchReport = async () => {
    try{
      const res = await apiFetch(`/api/report/admin`)
    if(res.ok){
      const data = await res.json();
      setReports(data)
    } 
    } catch (err) {
      console.log(err)
    } 
  }

  const fetchTopSellProduct = async () => {
    try {
      const res = await apiFetch(`/api/products/sellCount`)
      if(res.ok) {
        const data = await res.json()
        setProductReport(data)      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchCompareReport = async () => {
    const date = new Date();
    const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    try {
      const res = await apiFetch(`/api/report/admin/compare/${day}`)
      if(res.ok) {
        const data = await res.json()
        setCompareReports(data);
        console.log(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchReportByDay = async () => {
    setLoading(true);
    const date = new Date();
    const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    console.log(day)
    try {
      const res = await apiFetch(`/api/report/admin/${day}`)
      if(res.ok) {
        const data = await res.json()
        setDayReports(data)
        setLoading(false)
      }
    } catch (err) {
      console.log(err)
    } 
  }

  const fetchReportByMonth = async () => {
    setLoading(true);
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1
    try {
      const res = await apiFetch(`/api/report/admin/${year}/${month}`)
      if(res.ok) {
        const data = await res.json()
        setMonthReports(data)
        console.log(data)
        setLoading(false)
      }
    } catch (err) {
      console.log(err)
    } 
  }

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/orders/admin`);
      if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatNumber = (number: any) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  const getChangeClass = (change: any) => {
    return change >= 0 ? 'positive' : 'negative';
  };

  const exportReport = () => {
    // In real app, this would generate and download Excel/PDF report
    notify.info('Report export is currently under development.');
  };

  const printReport = () => {
    window.print();
  };
  const totalMonthlyRevenue = monthReports.reduce((sum: any, day: any) => sum + day.totalRevenue, 0);
  const totalRevenue = reports.reduce((sum: any, day: any) => sum + day.totalRevenue, 0);
  const totalOrder = orders.filter((order: any) => order.status === "completed");
  return (
    <div className="admin-reports">

        <main className="dashboard-main">
          <div className="reports-main">
            <div className="reports-header">
              <h2 className="reports-title">Báo Cáo Doanh Thu</h2>
              <div className="reports-actions">
                <button className="print-btn" onClick={printReport}>
                  🖨️ In Báo Cáo
                </button>
                <button className="export-btn" onClick={exportReport}>
                  📤 Xuất Excel
                </button>
              </div>
            </div>
            {loading ? (
              'đang tải'
            ) : (
<>
            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-icon revenue">💰</div>
                <div className="summary-value">{formatPrice(totalRevenue)}</div>
                <div className="summary-label">Tổng Doanh Thu</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon orders">📦</div>
                <div className="summary-value">{formatNumber(totalOrder.length)}</div>
                <div className="summary-label">Tổng Đơn Hàng</div>
              </div>
            </div>

            {/* Detailed Reports */}
            <div className="detailed-reports">
              <div className="report-card">
                <div className="report-header">
                  <h3 className="report-title">Sản Phẩm Bán Chạy</h3>
                  <a href="#products" className="view-details">Xem tất cả</a>
                </div>
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Tên Sản Phẩm</th>
                      <th className="product-rank">Đã Bán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productReport.map((product: any) => (
                      <tr key={product.id}>
                        <td className="product-name">{product.name}</td>
                        <td className="product-revenue">{product.sellCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="report-card">
                <div className="report-header">
                  <h3 className="report-title">Báo cáo hôm qua</h3>
                  <a href="#products" className="view-details">Xem chi tiết</a>
                </div>
                <table className="products-table">
                  <thead>
                    <tr>
                      <td className="product-name">doanh thu</td>
                      <td className="product-revenue">{dayReports.totalRevenue}</td>
                    </tr>
                    <tr>
                      <td className="product-name">tên sản phẩm</td>
                      <td className="product-rank">đã bán được</td>
                    </tr>
                  </thead>
                  <tbody>                   
                  {dayReports.revenueByProduct && Object.entries(dayReports.revenueByProduct).length > 0 ? (
                          Object.entries(dayReports.revenueByProduct).map(([name, price]) => (
                            <tr key={name}>
                              <td className="product-name">{name}</td>
                              <td className="product-revenue">{(price as any).toLocaleString()}₫</td>
                            </tr>
                  ))
                  ) : (
                    <div>...</div>
                  )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparison Section */}
            <div className="comparison-section">
              <h3 style={{ color: '#4B3B2B', marginBottom: '20px', fontSize: '1.3rem' }}>
                So Sánh Với Kỳ Trước
              </h3>
              <div className="comparison-grid">
                <div className="comparison-item">
                  <div className="comparison-period">tháng này bán được</div>
                  <div className="comparison-value">{formatNumber(totalMonthlyRevenue)}</div>
                  <div className="comparison-label">Doanh thu</div>
                  <div className={`comparison-change ${getChangeClass(compareReports.percentChange)}`}>
                    {compareReports.percentChange}%
                  </div>
                </div>
                <div className="comparison-item">
                  <div className="comparison-period">hôm qua bán được</div>
                  <div className="comparison-value">{formatNumber(dayReports.totalRevenue)}</div>
                  <div className="comparison-label">Doanh thu</div>
                </div>
              </div>
            </div>
</>
            )}
          
          </div>
        </main>

    </div>
  );
};

export default AdminReports;