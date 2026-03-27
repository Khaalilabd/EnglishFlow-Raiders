@echo off
echo ========================================
echo Demarrage de tous les services
echo ========================================
echo.

echo Demarrage de Eureka Server...
start "Eureka Server" cmd /k "cd backend\eureka-server && mvn spring-boot:run"
timeout /t 30 /nobreak

echo Demarrage de API Gateway...
start "API Gateway" cmd /k "cd backend\api-gateway && mvn spring-boot:run"
timeout /t 15 /nobreak

echo Demarrage de Auth Service (Node.js)...
start "Auth Service" cmd /k "cd backend\auth-service-node && npm run dev"
timeout /t 10 /nobreak

echo Demarrage de Courses Service...
start "Courses Service" cmd /k "cd backend\courses-service && mvn spring-boot:run"
timeout /t 10 /nobreak

echo Demarrage de Student Service...
start "Student Service" cmd /k "cd backend\student-service && mvn spring-boot:run"
timeout /t 10 /nobreak

echo Demarrage de Complaints Service...
start "Complaints Service" cmd /k "cd backend\complaints-service && mvn spring-boot:run"
timeout /t 10 /nobreak

echo Demarrage de Clubs Service...
start "Clubs Service" cmd /k "cd backend\clubs-service && mvn spring-boot:run"
timeout /t 10 /nobreak

echo Demarrage de Quiz Service...
start "Quiz Service" cmd /k "cd backend\quiz-service && mvn spring-boot:run"
timeout /t 10 /nobreak

echo.
echo ========================================
echo Tous les services sont en cours de demarrage !
echo ========================================
echo.
echo Services :
echo   - Eureka Server    : http://localhost:8761
echo   - API Gateway      : http://localhost:8080
echo   - Auth Service     : http://localhost:8081
echo   - Courses Service  : http://localhost:8082
echo   - Student Service  : http://localhost:8083
echo   - Complaints       : http://localhost:8084
echo   - Clubs Service    : http://localhost:8085
echo   - Quiz Service     : http://localhost:8086
echo.
echo Demarrage du Frontend Angular...
start "Frontend Angular" cmd /k "cd frontend && npm start"
echo.
echo Frontend : http://localhost:4200
echo.
pause
