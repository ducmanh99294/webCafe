package com.example.webcafe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
// auto chay report khi den' gio`
@EnableScheduling
public class WebCafeApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebCafeApplication.class, args);
    }
}
