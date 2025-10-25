package com.example.webcafe.repository;

import com.example.webcafe.model.RevenueReport;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReportRepository extends MongoRepository<RevenueReport, String> {
    RevenueReport findByDate(LocalDate date);
    List<RevenueReport> findByDateBetween(LocalDate startDate,LocalDate endDate);
}
