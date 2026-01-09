# 배포 가이드

## 개요

이 문서는 townE 시스템을 실제 운영 환경에 배포하기 위한 완전한 가이드를 제공합니다.

## 1. 시스템 요구사항

### 1.1 서버 사양 (최소)

- **OS**: Linux (Ubuntu 18.04+ 또는 CentOS 7+)
- **CPU**: 2 Core 이상
- **Memory**: 4GB 이상
- **Disk**: 50GB 이상 (SSD 권장)
- **Network**: 100Mbps 이상

### 1.2 소프트웨어 요구사항

- **Java**: JDK 1.8 이상
- **Database**: MariaDB 10.3+ 또는 MySQL 5.7+
- **Web Server**: Apache Tomcat 8.5+ 또는 9.0+
- **Build Tool**: Maven 3.6+
- **Reverse Proxy**: Nginx 1.18+ (선택사항)

## 2. 환경 설정

### 2.1 Java 설치

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-8-jdk

# CentOS/RHEL
sudo yum install java-1.8.0-openjdk java-1.8.0-openjdk-devel

# 버전 확인
java -version
javac -version
```

### 2.2 MariaDB 설치

```bash
# Ubuntu/Debian
sudo apt install mariadb-server mariadb-client

# CentOS/RHEL
sudo yum install mariadb-server mariadb

# 서비스 시작
sudo systemctl start mariadb
sudo systemctl enable mariadb

# 보안 설정
sudo mysql_secure_installation
```

### 2.3 데이터베이스 생성

```bash
# MariaDB 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE townE DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 사용자 생성 및 권한 부여
CREATE USER 'townE'@'localhost' IDENTIFIED BY 'townE';
GRANT ALL PRIVILEGES ON townE.* TO 'townE'@'localhost';
FLUSH PRIVILEGES;

# DDL 스크립트 실행
mysql -u townE -p townE < /path/to/04_Database_DDL_Script.sql
```

### 2.4 Apache Tomcat 설치

```bash
# Tomcat 9 다운로드
cd /opt
sudo wget https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.65/bin/apache-tomcat-9.0.65.tar.gz
sudo tar -xzf apache-tomcat-9.0.65.tar.gz
sudo mv apache-tomcat-9.0.65 tomcat9
sudo chown -R tomcat:tomcat /opt/tomcat9

# 환경 변수 설정
sudo vi /etc/profile.d/tomcat.sh
```

```bash
# /etc/profile.d/tomcat.sh 내용
export CATALINA_HOME=/opt/tomcat9
export PATH=$PATH:$CATALINA_HOME/bin
```

```bash
# 적용
source /etc/profile.d/tomcat.sh

# systemd 서비스 파일 생성
sudo vi /etc/systemd/system/tomcat.service
```

```ini
[Unit]
Description=Apache Tomcat 9
After=network.target

[Service]
Type=forking
User=tomcat
Group=tomcat
Environment="JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64"
Environment="CATALINA_PID=/opt/tomcat9/temp/tomcat.pid"
Environment="CATALINA_HOME=/opt/tomcat9"
Environment="CATALINA_BASE=/opt/tomcat9"
ExecStart=/opt/tomcat9/bin/startup.sh
ExecStop=/opt/tomcat9/bin/shutdown.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
# 서비스 시작
sudo systemctl daemon-reload
sudo systemctl start tomcat
sudo systemctl enable tomcat
```

### 2.5 Maven 설치

```bash
# Maven 다운로드
cd /opt
sudo wget https://archive.apache.org/dist/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz
sudo tar -xzf apache-maven-3.6.3-bin.tar.gz
sudo mv apache-maven-3.6.3 maven

# 환경 변수 설정
sudo vi /etc/profile.d/maven.sh
```

```bash
# /etc/profile.d/maven.sh 내용
export M2_HOME=/opt/maven
export PATH=$PATH:$M2_HOME/bin
```

```bash
# 적용
source /etc/profile.d/maven.sh
mvn -version
```

## 3. 애플리케이션 빌드

### 3.1 소스 코드 준비

```bash
# 프로젝트 디렉토리로 이동
cd /path/to/townE

# Git에서 클론 (예시)
git clone https://github.com/your-repo/townE.git
cd townE
```

### 3.2 설정 파일 수정

#### 3.2.1 context-datasource.xml 수정

```xml
<!-- 운영 환경 DB 정보로 변경 -->
<property name="url" value="jdbc:mariadb://localhost:3306/townE?zeroDateTimeBehavior=convertToNull&amp;useUnicode=true&amp;characterEncoding=utf8mb4"/>
<property name="username" value="townE"/>
<property name="password" value="실제_비밀번호"/>
```

#### 3.2.2 log4j2.xml 수정

```xml
<!-- 로그 파일 경로 설정 -->
<RollingFile name="FileAppender" fileName="/var/log/townE/townE.log"
             filePattern="/var/log/townE/townE-%d{yyyy-MM-dd}-%i.log">
```

### 3.3 빌드 실행

```bash
# 의존성 다운로드 및 컴파일
mvn clean install -DskipTests

# WAR 파일 생성 확인
ls -lh target/townE-3.5.0.war
```

## 4. 배포

### 4.1 Tomcat 배포 디렉토리 준비

```bash
# 배포 디렉토리 생성
sudo mkdir -p /opt/tomcat9/webapps/townE
sudo chown -R tomcat:tomcat /opt/tomcat9/webapps/townE

# 업로드 디렉토리 생성
sudo mkdir -p /var/www/townE/upload
sudo chown -R tomcat:tomcat /var/www/townE/upload

# 로그 디렉토리 생성
sudo mkdir -p /var/log/townE
sudo chown -R tomcat:tomcat /var/log/townE
```

### 4.2 WAR 파일 배포

```bash
# 방법 1: WAR 파일 직접 배포
sudo cp target/townE-3.5.0.war /opt/tomcat9/webapps/townE.war
sudo chown tomcat:tomcat /opt/tomcat9/webapps/townE.war

# 방법 2: 압축 해제하여 배포
cd /opt/tomcat9/webapps
sudo unzip townE-3.5.0.war -d townE
sudo chown -R tomcat:tomcat townE
```

### 4.3 Tomcat 설정

#### 4.3.1 server.xml 수정

```bash
sudo vi /opt/tomcat9/conf/server.xml
```

```xml
<!-- Connector 설정 -->
<Connector port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443"
           URIEncoding="UTF-8" />

<!-- Context 설정 -->
<Context path="/townE" docBase="townE" reloadable="false">
    <Resources cachingAllowed="true" cacheMaxSize="100000" />
</Context>
```

#### 4.3.2 context.xml 수정

```bash
sudo vi /opt/tomcat9/conf/context.xml
```

```xml
<Context>
    <!-- 리소스 캐싱 -->
    <Resources cachingAllowed="true" cacheMaxSize="100000" />
    
    <!-- 세션 설정 -->
    <Manager className="org.apache.catalina.session.StandardManager"
             maxActiveSessions="1000"
             sessionIdLength="32" />
</Context>
```

#### 4.3.3 setenv.sh 생성

```bash
sudo vi /opt/tomcat9/bin/setenv.sh
```

```bash
#!/bin/sh
export JAVA_OPTS="-Xms512m -Xmx2048m -XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m -XX:+UseG1GC -Dfile.encoding=UTF-8"
export CATALINA_OPTS="-Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom"
```

```bash
sudo chmod +x /opt/tomcat9/bin/setenv.sh
```

### 4.4 서비스 재시작

```bash
# Tomcat 재시작
sudo systemctl restart tomcat

# 상태 확인
sudo systemctl status tomcat

# 로그 확인
tail -f /opt/tomcat9/logs/catalina.out
```

## 5. Nginx 리버스 프록시 설정 (선택사항)

### 5.1 Nginx 설치

```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### 5.2 Nginx 설정

```bash
sudo vi /etc/nginx/sites-available/townE
```

```nginx
upstream tomcat {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name your-domain.com;
    
    # 로그 설정
    access_log /var/log/nginx/townE_access.log;
    error_log /var/log/nginx/townE_error.log;
    
    # 파일 업로드 크기 제한
    client_max_body_size 1G;
    
    # 정적 파일 직접 서빙
    location /resources/ {
        alias /opt/tomcat9/webapps/townE/resources/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location /upload/ {
        alias /var/www/townE/upload/;
        expires 7d;
    }
    
    # Tomcat 프록시
    location / {
        proxy_pass http://tomcat;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 타임아웃 설정
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/townE /etc/nginx/sites-enabled/

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

## 6. SSL 인증서 설정 (선택사항)

### 6.1 Let's Encrypt 인증서 발급

```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx

# 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 설정
sudo certbot renew --dry-run
```

## 7. 방화벽 설정

### 7.1 UFW 설정 (Ubuntu)

```bash
# 기본 정책 설정
sudo ufw default deny incoming
sudo ufw default allow outgoing

# SSH 허용
sudo ufw allow ssh

# HTTP/HTTPS 허용
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 방화벽 활성화
sudo ufw enable
sudo ufw status
```

### 7.2 firewalld 설정 (CentOS)

```bash
# HTTP/HTTPS 허용
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https

# 방화벽 재로드
sudo firewall-cmd --reload
```

## 8. 모니터링 설정

### 8.1 로그 로테이션 설정

```bash
sudo vi /etc/logrotate.d/townE
```

```
/var/log/townE/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 tomcat tomcat
    sharedscripts
    postrotate
        systemctl reload tomcat > /dev/null 2>&1 || true
    endscript
}
```

### 8.2 시스템 모니터링

```bash
# 시스템 리소스 모니터링
sudo apt install htop
htop

# 디스크 사용량 확인
df -h

# 메모리 사용량 확인
free -h

# 프로세스 확인
ps aux | grep java
```

## 9. 백업 전략

### 9.1 데이터베이스 백업

```bash
# 백업 스크립트 생성
sudo vi /usr/local/bin/townE-backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backup/townE"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="townE"
DB_USER="townE"
DB_PASS="your_password"

mkdir -p $BACKUP_DIR

# 데이터베이스 백업
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# 파일 압축
gzip $BACKUP_DIR/db_$DATE.sql

# 30일 이상 된 백업 삭제
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/db_$DATE.sql.gz"
```

```bash
sudo chmod +x /usr/local/bin/townE-backup.sh

# Cron 설정 (매일 새벽 2시)
sudo crontab -e
```

```
0 2 * * * /usr/local/bin/townE-backup.sh >> /var/log/townE-backup.log 2>&1
```

### 9.2 파일 백업

```bash
# 업로드 파일 백업 스크립트
sudo vi /usr/local/bin/townE-file-backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backup/townE/files"
SOURCE_DIR="/var/www/townE/upload"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 파일 백업
tar -czf $BACKUP_DIR/files_$DATE.tar.gz -C $SOURCE_DIR .

# 7일 이상 된 백업 삭제
find $BACKUP_DIR -name "files_*.tar.gz" -mtime +7 -delete

echo "File backup completed: $BACKUP_DIR/files_$DATE.tar.gz"
```

```bash
sudo chmod +x /usr/local/bin/townE-file-backup.sh

# Cron 설정 (매일 새벽 3시)
sudo crontab -e
```

```
0 3 * * * /usr/local/bin/townE-file-backup.sh >> /var/log/townE-file-backup.log 2>&1
```

## 10. 성능 튜닝

### 10.1 데이터베이스 튜닝

```bash
sudo vi /etc/mysql/mariadb.conf.d/50-server.cnf
```

```ini
[mysqld]
# 버퍼 풀 크기 (메모리의 70% 정도)
innodb_buffer_pool_size = 2G

# 연결 수
max_connections = 200

# 쿼리 캐시
query_cache_size = 64M
query_cache_type = 1

# 로그 설정
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 2
```

```bash
sudo systemctl restart mariadb
```

### 10.2 Tomcat 튜닝

```bash
sudo vi /opt/tomcat9/bin/setenv.sh
```

```bash
# JVM 힙 메모리 증가
export JAVA_OPTS="-Xms1024m -Xmx4096m -XX:MetaspaceSize=512m -XX:MaxMetaspaceSize=1024m -XX:+UseG1GC -XX:+UseStringDeduplication -Dfile.encoding=UTF-8"

# GC 로그 설정
export JAVA_OPTS="$JAVA_OPTS -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:/var/log/tomcat9/gc.log"
```

## 11. 문제 해결

### 11.1 일반적인 문제

#### 메모리 부족
```bash
# 메모리 사용량 확인
free -h
ps aux | grep java

# JVM 힙 메모리 증가 필요
```

#### 데이터베이스 연결 실패
```bash
# 연결 확인
mysql -u townE -p townE

# 방화벽 확인
sudo ufw status
```

#### 파일 업로드 실패
```bash
# 디렉토리 권한 확인
ls -la /var/www/townE/upload

# 디스크 공간 확인
df -h
```

### 11.2 로그 확인

```bash
# Tomcat 로그
tail -f /opt/tomcat9/logs/catalina.out
tail -f /opt/tomcat9/logs/localhost.log

# 애플리케이션 로그
tail -f /var/log/townE/townE.log

# Nginx 로그
tail -f /var/log/nginx/townE_access.log
tail -f /var/log/nginx/townE_error.log

# 시스템 로그
journalctl -u tomcat -f
```

## 12. 배포 체크리스트

- [ ] Java 설치 확인
- [ ] MariaDB 설치 및 데이터베이스 생성
- [ ] Tomcat 설치 및 설정
- [ ] 애플리케이션 빌드 완료
- [ ] WAR 파일 배포 완료
- [ ] 설정 파일 수정 완료
- [ ] 디렉토리 권한 설정 완료
- [ ] 방화벽 설정 완료
- [ ] Nginx 설정 완료 (선택사항)
- [ ] SSL 인증서 설정 완료 (선택사항)
- [ ] 백업 스크립트 설정 완료
- [ ] 모니터링 설정 완료
- [ ] 로그 확인 완료
- [ ] 성능 테스트 완료

## 13. 롤백 절차

### 13.1 애플리케이션 롤백

```bash
# 이전 버전 WAR 파일로 교체
sudo systemctl stop tomcat
sudo cp /backup/townE/previous_version.war /opt/tomcat9/webapps/townE.war
sudo systemctl start tomcat
```

### 13.2 데이터베이스 롤백

```bash
# 백업 파일로 복원
mysql -u townE -p townE < /backup/townE/db_20240101_120000.sql
```

## 14. 다음 단계

배포가 완료되면 다음을 확인하세요:
1. 애플리케이션 정상 동작 확인
2. 성능 모니터링 설정
3. 정기적인 백업 확인
4. 보안 업데이트 적용

## 15. 참고 자료

- [Apache Tomcat 공식 문서](https://tomcat.apache.org/)
- [MariaDB 공식 문서](https://mariadb.com/kb/en/documentation/)
- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [Spring Framework 공식 문서](https://spring.io/projects/spring-framework)

