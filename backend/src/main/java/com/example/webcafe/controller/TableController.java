package com.example.webcafe.controller;

import com.example.webcafe.model.Table;
import com.example.webcafe.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class TableController {

    @Autowired
    private TableService tableService;

    // Lấy tất cả bàn
    @GetMapping
    public ResponseEntity<List<Table>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    // Lấy bàn theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTableById(@PathVariable String id) {
        return tableService.getTableById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Thêm bàn mới
    @PostMapping("/admin")
    public ResponseEntity<Table> createTable(@RequestBody Table table) {
        Table newTable = tableService.createTable(table);
        return ResponseEntity.ok(newTable);
    }

    // Cập nhật bàn
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTable(@PathVariable String id, @RequestBody Table updatedTable) {
        Table result = tableService.updateTable(id, updatedTable);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    // Xóa bàn
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteTable(@PathVariable String id) {
        tableService.deleteTable(id);
        return ResponseEntity.ok("Đã xóa bàn thành công");
    }
}
