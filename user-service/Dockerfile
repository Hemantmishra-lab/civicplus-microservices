# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Optimize layer caching: Copy root pom.xml
COPY pom.xml .

# Optimize layer caching: Copy common-library and build it first
COPY common-library/pom.xml common-library/
COPY common-library/src common-library/src
RUN --mount=type=cache,target=/root/.m2 mvn -pl common-library clean install -DskipTests

# Copy specific service pom and resolve dependencies
COPY user-service/pom.xml user-service/
COPY user-service/src user-service/src

# Build the specific service
RUN --mount=type=cache,target=/root/.m2 mvn -pl user-service clean package -DskipTests

# Stage 2: Serve
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Extract from builder stage
COPY --from=builder /app/user-service/target/*.jar app.jar

ENTRYPOINT ["java", "-Xmx256m", "-Xms64m", "-jar", "app.jar"]
