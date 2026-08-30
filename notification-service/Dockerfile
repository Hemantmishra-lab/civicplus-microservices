# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Optimize layer caching: Copy root pom.xml
COPY pom.xml .

# Copy all child module POMs to satisfy Maven reactor validation
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

# Copy source code only for the target service and shared library
COPY common-library/src common-library/src
COPY notification-service/src notification-service/src

# Build the specific service and its dependencies (-am flag builds common-library automatically)
RUN --mount=type=cache,target=/root/.m2 mvn -pl notification-service -am clean package -DskipTests

# Stage 2: Serve
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Extract from builder stage
COPY --from=builder /app/notification-service/target/*.jar app.jar

ENTRYPOINT ["java", "-Xmx256m", "-Xms64m", "-jar", "app.jar"]