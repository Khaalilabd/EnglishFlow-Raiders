@echo off
echo ========================================
echo  Microservices Demo - Demarrage Complet
echo  Avec Systeme de Roles
echo ========================================
echo.

echo [INFO] Verification des prerequis...
echo.

echo [1/10] Demarrage Eureka Server (Port 8761)...
start "Eureka Server" cmd /k "cd eureka-server && echo Demarrage Eureka Server... && mvn spring-boot:run"
echo Attente de 20 secondes pour Eureka...
timeout /t 20 /nobreak
echo.

echo [2/10] Demarrage API Gateway (Port 8080)...
start "API Gateway" cmd /k "cd api-gateway && echo Demarrage API Gateway... && mvn spring-boot:run"
echo Attente de 15 secondes pour Gateway...
timeout /t 15 /nobreak
echo.

echo [3/10] Demarrage Auth Service (Port 8081)...
echo IMPORTANT: Ce service cree automatiquement 3 utilisateurs de test
start "Auth Service" cmd /k "cd auth-service && echo Demarrage Auth Service... && mvn spring-boot:run"
timeout /t 10 /nobreak
echo.

echo [4/10] Demarrage Courses Service (Port 8082)...
start "Courses Service" cmd /k "cd courses-service && echo Demarrage Courses Service... && mvn spring-boot:run"
timeout /t 5 /nobreak
echo.

echo [5/10] Demarrage Student Service (Port 8083)...
start "Student Service" cmd /k "cd student-service && echo Demarrage Student Service... && mvn spring-boot:run"
timeout /t 5 /nobreak
echo.

echo [6/10] Demarrage Complaints Service (Port 8084)...
start "Complaints Service" cmd /k "cd complaints-service && echo Demarrage Complaints Service... && mvn spring-boot:run"
timeout /t 5 /nobreak
echo.

echo [7/10] Demarrage Clubs Service (Port 8085)...
start "Clubs Service" cmd /k "cd clubs-service && echo Demarrage Clubs Service... && mvn spring-boot:run"
timeout /t 5 /nobreak
echo.

echo [8/10] Demarrage Quiz Service (Port 8086)...
start "Quiz Service" cmd /k "cd quiz-service && echo Demarrage Quiz Service... && mvn spring-boot:run"
timeout /t 5 /nobreak
echo.

echo [9/10] Verification des services sur Eureka...
echo Attente de 10 secondes supplementaires...
timeout /t 10 /nobreak
echo.

echo [10/10] Demarrage du Frontend Angular (Port 4200)...
start "Frontend Angular" cmd /k "cd frontend && echo Demarrage Frontend... && ng serve"
echo.

echo ========================================
echo  TOUS LES SERVICES SONT EN COURS DE DEMARRAGE!
echo ========================================
echo.
echo URLs d'acces:
echo - Frontend:      http://localhost:4200
echo - API Gateway:   http://localhost:8080
echo - Eureka:        http://localhost:8761
echo.
echo Utilisateurs de test:
echo.
echo ADMIN (Acces complet):
echo   Username: admin
echo   Password: admin123
echo.
echo TUTOR (Gestion etudiants + inscriptions):
echo   Username: tutor
echo   Password: tutor123
echo.
echo STUDENT (Acces limite):
echo   Username: student
echo   Password: student123
echo.
echo ========================================
echo  Attendez 1-2 minutes que tous les services
echo  soient completement demarres avant d'acceder
echo  au frontend.
echo ========================================
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul
