package com.antigravity.snowflake.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "snowflake")
@Data
public class SnowflakeProperties {
    private String url = "jdbc:snowflake://xy12345.snowflakecomputing.com";
    private String username = "YOUR_SNOWFLAKE_USER";
    private String password = "YOUR_SNOWFLAKE_PASSWORD";
    private String warehouse = "COMPUTE_WH";
    private String database = "DEMO_DB";
    private String schema = "PUBLIC";
    private String role = "ACCOUNTADMIN";
}
