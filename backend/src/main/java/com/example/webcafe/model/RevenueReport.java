package com.example.webcafe.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.Map;

@Document(collection = "reports")
public class RevenueReport {
    @Id
    private String id;
    private LocalDate date;
    private double totalRevenue;
    private Map<String, Double> revenueByProduct;

    public RevenueReport() {}

    public RevenueReport(LocalDate date, double totalRevenue, Map<String, Double> revenueByProduct) {
        this.date = date;
        this.totalRevenue = totalRevenue;
        this.revenueByProduct = revenueByProduct;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Map<String, Double> getRevenueByProduct() { return revenueByProduct; }
    public void setRevenueByProduct(Map<String, Double> revenueByProduct) { this.revenueByProduct = revenueByProduct; }
}
