# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Optimize layer caching: Copy root pom.xml
COPY pom.xml .

# Create placeholder directories to pass Maven module validation
RUN mkdir config-server discovery-server api-gateway auth-service user-service complaint-service department-service media-service notification-service analytics-service common-library

# Optimize layer caching: Copy common-library and build it first
COPY common-library/pom.xml common-library/
COPY common-library/src common-library/src
RUN --mount=type=cache,target=/root/.m2 mvn -pl common-library clean install -DskipTests

# Copy specific service pom and resolve dependencies
COPY api-gateway/pom.xml api-gateway/
COPY api-gateway/src api-gateway/src

# Build the specific service
RUN --mount=type=cache,target=/root/.m2 mvn -pl api-gateway clean package -DskipTests

# Stage 2: Serve
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Extract from builder stage
COPY --from=builder /app/api-gateway/target/*.jar app.jar

ENTRYPOINT ["java", "-Xmx256m", "-Xms64m", "-jar", "app.jar"]
