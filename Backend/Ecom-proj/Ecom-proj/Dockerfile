# Use the official OpenJDK 21 image
FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper and project files
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Make the Maven wrapper executable
RUN chmod +x ./mvnw

# Copy the source code
COPY src ./src

# Download dependencies and build the application
RUN ./mvnw dependency:go-offline
RUN ./mvnw clean install -DskipTests

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "target/Ecom-proj-0.0.1-SNAPSHOT.jar"]