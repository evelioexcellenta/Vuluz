FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

COPY build/libs/*.jar app.jar
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

ENTRYPOINT ["java", "-jar", "app.jar"]