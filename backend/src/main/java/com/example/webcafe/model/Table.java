package com.example.webcafe.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tables")
public class Table {

    @Id
    private String id;

    private String number; // Ví dụ: "A1", "B3"
    private int seats; // Số chỗ ngồi
    private Status status; // true = đang có khách
    private int x;
    private int y;

    public enum Status {
        available, unavailable, reserve;
    }
    public Table() {}

    public Table(String number, int seats, Status status, int x, int y) {
        this.number = number;
        this.seats = seats;
        this.status = status;
        this.x = x;
        this.y = y;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public int getSeats() { return seats; }
    public void setSeats(int seats) { this.seats = seats; }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}
