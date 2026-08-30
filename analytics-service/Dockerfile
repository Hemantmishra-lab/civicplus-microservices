# Stage 1: Build stage using Maven and Temurin JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy root pom.xml to optimize layer caching
COPY pom.xml .

# Copy all child module POM files to satisfy Maven reactor validation
COPY common-library/pom.xml common-library/
COPY config-server/pom.xml config-server/
COPY discovery-server/pom.xml discovery-server/
COPY api-gateway/pom.xml api-gateway/
COPY auth-service/pom.xml auth-service/
COPY user-service/pom.xml user-service/
COPY complaint-service/pom.xml complaint-service/
COPY department-service/pom.xml department-service/
COPY media-service/pom.xml media-service/
COPY notification-service/pom.xml notification-service/
COPY analytics-service/pom.xml analytics-service/

# Copy source code only for common-library and analytics-service
COPY common-library/src common-library/src
COPY analytics-service/src analytics-service/src

# Build analytics-service and its dependency (common-library) using Maven build cache
RUN --mount=type=cache,target=/root/.m2 mvn -pl analytics-service -am clean package -DskipTests

# Stage 2: Minimal runtime image using Temurin JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root system group and user for security compliance
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the built compiled artifact from builder stage
COPY --from=builder /app/analytics-service/target/*.jar app.jar

ENTRYPOINT ["java", "-Xmx256m", "-Xms64m", "-jar", "app.jar"]