FROM ubuntu:latest AS build
LABEL authors="JuliusAdjeteySowah"

RUN apt-get update
RUN apt-get install -y openjdk-21-jdk maven
COPY . .

RUN mvn clean package -DskipTests

FROM openjdk:21-slim

COPY --from=build /target/*.jar app.jar

HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O- http://localhost:8000/health || exit 1

EXPOSE 8000

ENTRYPOINT ["java", "-jar", "app.jar"]