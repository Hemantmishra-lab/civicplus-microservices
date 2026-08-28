# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# 1. Copy the root parent POM
COPY pom.xml .

# 2. Copy the POM files of ALL sibling modules so Maven can map the reactor project structure
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

# 3. Copy the actual source code ONLY for the shared library and the target service
COPY common-library/src common-library/src
COPY config-server/src config-server/src

# 4. Build only config-server and its dependent modules (-am)
RUN --mount=type=cache,target=/root/.m2 mvn -pl config-server -am clean package -DskipTests

# Stage 2: Serve
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Extract the compiled jar from the builder stage
COPY --from=builder /app/config-server/target/*.jar app.jar

ENTRYPOINT ["java", "-Xmx256m", "-Xms64m", "-jar", "app.jar"]
