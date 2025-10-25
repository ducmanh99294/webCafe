package com.example.webcafe.service;

import com.example.webcafe.model.Table;
import com.example.webcafe.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TableService {

    @Autowired
    private TableRepository tableRepository;

    // Lấy tất cả bàn
    public List<Table> getAllTables() {
        return tableRepository.findAll();
    }

    // Lấy thông tin 1 bàn theo ID
    public Optional<Table> getTableById(String id) {
        return tableRepository.findById(id);
    }

    // Tạo mới 1 bàn
    public Table createTable(Table table) {
        return tableRepository.save(table);
    }

    // Cập nhật thông tin bàn
    public Table updateTable(String id, Table updatedTable) {
        return tableRepository.findById(id)
                .map(existing -> {
                    existing.setNumber(updatedTable.getNumber());
                    existing.setSeats(updatedTable.getSeats());
                    existing.setStatus(updatedTable.getStatus());
                    existing.setX(updatedTable.getX());
                    existing.setY(updatedTable.getY());
                    return tableRepository.save(existing);
                })
                .orElse(null);
    }

    // Xóa bàn
    public void deleteTable(String id) {
        tableRepository.deleteById(id);
    }

//    // ✅ Cập nhật trạng thái bàn (occupied)
//    public Table updateTableStatus(String id, Status status) {
//        return tableRepository.findById(id)
//                .map(existing -> {
//                    existing.setStatus(occupied);
//                    return tableRepository.save(existing);
//                })
//                .orElse(null);
//    }
}
