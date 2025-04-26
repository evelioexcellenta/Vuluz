FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

COPY 'target/Vuluz-0.0.1-SNAPSHOT.jar' app.jar
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

ENTRYPOINT ["java", "-jar", "app.jar"]