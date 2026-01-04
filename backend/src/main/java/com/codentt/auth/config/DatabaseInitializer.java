package com.codentt.auth.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Database initializer that creates the database if it doesn't exist.
 * This component runs early to ensure the database exists before Flyway tries to connect.
 */
@Slf4j
@Component
@Order(1) // Run early
public class DatabaseInitializer implements CommandLineRunner {

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5433/codentt_auth}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:postgres}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    private static boolean initialized = false;

    @PostConstruct
    public void init() {
        if (initialized) {
            return;
        }
        initialized = true;
        ensureDatabaseExists();
    }

    @Override
    public void run(String... args) {
        // Also run on CommandLineRunner as backup
        ensureDatabaseExists();
    }

    private void ensureDatabaseExists() {
        try {
            // Extract database name from URL
            String dbName = extractDatabaseName(datasourceUrl);
            String adminUrl = datasourceUrl.replace("/" + dbName, "/postgres");

            log.info("Checking if database '{}' exists...", dbName);

            // Connect to postgres database to check/create target database
            try (Connection conn = DriverManager.getConnection(adminUrl, username, password);
                 Statement stmt = conn.createStatement()) {

                // Check if database exists
                String checkSql = "SELECT 1 FROM pg_database WHERE datname = '" + dbName + "'";
                try (ResultSet rs = stmt.executeQuery(checkSql)) {
                    if (!rs.next()) {
                        // Database doesn't exist, create it
                        log.info("Database '{}' does not exist. Creating...", dbName);
                        String createSql = "CREATE DATABASE " + dbName;
                        stmt.executeUpdate(createSql);
                        log.info("✓ Database '{}' created successfully!", dbName);
                    } else {
                        log.info("✓ Database '{}' already exists.", dbName);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Could not auto-create database. Error: {}", e.getMessage());
            log.error("Please verify:");
            log.error("  1. PostgreSQL server is running");
            log.error("  2. Database 'codentt_auth' exists (create it in pgAdmin if needed)");
            log.error("  3. Username and password are correct");
            log.error("  4. You have permission to create databases");
            // Don't throw - let the application try to connect and show the real error
        }
    }

    private String extractDatabaseName(String url) {
        // Extract database name from JDBC URL
        // jdbc:postgresql://localhost:5433/codentt_auth
        int lastSlash = url.lastIndexOf('/');
        if (lastSlash > 0) {
            String dbPart = url.substring(lastSlash + 1);
            // Remove query parameters if any
            int questionMark = dbPart.indexOf('?');
            if (questionMark > 0) {
                return dbPart.substring(0, questionMark);
            }
            return dbPart;
        }
        return "codentt_auth"; // fallback
    }
}

