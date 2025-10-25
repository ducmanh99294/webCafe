package com.example.webcafe.controller;

import com.example.webcafe.model.RevenueReport;
import com.example.webcafe.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/report/admin")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping
    public List<RevenueReport> getAllRevenues() {
        return reportService.getAllRevenues();
    }
    // Tạo doanh thu test thủ công (vd: /api/revenue/generate?date=2025-10-08)
    @PostMapping("/generate")
    public RevenueReport generateRevenue(@RequestBody Map<String, String> body) {
        String date = body.get("date");
        LocalDate parsedDate = LocalDate.parse(date);
        return reportService.generateDailyRevenue(parsedDate);
    }

    // So sánh doanh thu hôm nay và hôm qua
    @GetMapping("/compare/{date}")
    public Map<String, Object> compareRevenue(@PathVariable String date) {
        LocalDate parsedDate = LocalDate.parse(date);
        return reportService.compareRevenue(parsedDate);
    }

    @GetMapping("/{date}")
    public RevenueReport getRevenueByDate(@PathVariable String date) {
        LocalDate parsedDate = LocalDate.parse(date);
        return reportService.getRevenueByDate(parsedDate);
    }

    @GetMapping("/{year}/{month}")
    public List<RevenueReport> getRevenueByMonth(@PathVariable int year, @PathVariable int month) {
        return reportService.getRevenuesByMonth(year, month);
    }
}
