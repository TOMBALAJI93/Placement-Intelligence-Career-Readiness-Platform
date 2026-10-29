package com.antigravity.snowflake.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Properties;

@Component
public class SnowflakeConnectionVerifier {

    private static final Logger log = LoggerFactory.getLogger(SnowflakeConnectionVerifier.class);

    private final SnowflakeProperties snowflakeProperties;

    public SnowflakeConnectionVerifier(SnowflakeProperties snowflakeProperties) {
        this.snowflakeProperties = snowflakeProperties;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void verifyConnectionOnStartup() {
        log.info("Initiating automatic Snowflake JDBC connection verification...");

        String url = snowflakeProperties.getUrl();
        String username = snowflakeProperties.getUsername();

        boolean isPlaceholder = url == null 
                || url.contains("<your-account>") 
                || url.contains("xy12345") 
                || username == null 
                || username.contains("<your-username>") 
                || username.contains("YOUR_SNOWFLAKE_USER");

        if (isPlaceholder) {
            log.warn("""
                    
                    ===================================================================
                    ⚠️ SNOWFLAKE CONNECTION CONFIGURATION WARNING:
                    Snowflake properties in application.yml currently contain placeholder values.
                    - URL: {}
                    - Username: {}
                    - Database: {} (Schema: {})
                    To connect to a live Snowflake instance, update application.yml or set environment variables:
                      SNOWFLAKE_URL, SNOWFLAKE_USERNAME, SNOWFLAKE_PASSWORD
                    The ingestion service will use the local fallback engine until credentials are provided.
                    ===================================================================
                    """, url, username, snowflakeProperties.getDatabase(), snowflakeProperties.getSchema());
            return;
        }

        Properties props = new Properties();
        props.put("user", snowflakeProperties.getUsername());
        props.put("password", snowflakeProperties.getPassword());
        props.put("warehouse", snowflakeProperties.getWarehouse());
        props.put("db", snowflakeProperties.getDatabase());
        props.put("schema", snowflakeProperties.getSchema());
        props.put("role", snowflakeProperties.getRole());

        try (Connection conn = DriverManager.getConnection(url, props);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT CURRENT_USER(), CURRENT_ROLE(), CURRENT_DATABASE(), CURRENT_SCHEMA(), CURRENT_WAREHOUSE();")) {

            if (rs.next()) {
                String currentUser = rs.getString(1);
                String currentRole = rs.getString(2);
                String currentDatabase = rs.getString(3);
                String currentSchema = rs.getString(4);
                String currentWarehouse = rs.getString(5);

                log.info("""
                        
                        ===================================================================
                        ✅ SNOWFLAKE JDBC CONNECTION ESTABLISHED SUCCESSFULLY!
                        - User:      {}
                        - Role:      {}
                        - Database:  {}
                        - Schema:    {}
                        - Warehouse: {}
                        - URL:       {}
                        ===================================================================
                        """, currentUser, currentRole, currentDatabase, currentSchema, currentWarehouse, url);
            }
        } catch (Exception e) {
            log.error("""
                    
                    ===================================================================
                    ❌ SNOWFLAKE CONNECTION VERIFICATION FAILED:
                    - Error: {}
                    - Cause: Please check your Snowflake URL, Username, Password, Warehouse, or Network Access.
                    ===================================================================
                    """, e.getMessage(), e);
        }
    }
}
