# 프로젝트 구조 및 설정 파일 가이드

## 개요

이 문서는 townE 시스템을 처음부터 구축하기 위한 프로젝트 구조와 모든 설정 파일을 제공합니다.

## 1. 프로젝트 구조

### 1.1 Maven 프로젝트 구조

```
townE/
├── pom.xml                                    # Maven 빌드 설정
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── kr/co/nubiz/
│   │   │       ├── admin/                     # 관리자 기능
│   │   │       │   ├── member/                # 회원 관리
│   │   │       │   ├── site/                  # 사이트 관리
│   │   │       │   │   ├── menu/              # 메뉴 관리
│   │   │       │   │   ├── content/           # 컨텐츠 관리
│   │   │       │   │   ├── board/             # 게시판 관리
│   │   │       │   │   └── layout/            # 레이아웃 관리
│   │   │       │   └── programs/              # 프로그램 모듈
│   │   │       ├── home/                      # 사용자 화면
│   │   │       │   ├── member/                # 회원 기능
│   │   │       │   ├── site/                  # 사이트 기능
│   │   │       │   └── programs/              # 프로그램 기능
│   │   │       ├── common/                    # 공통 기능
│   │   │       │   ├── security/              # 보안
│   │   │       │   ├── utils/                 # 유틸리티
│   │   │       │   ├── interceptor/           # 인터셉터
│   │   │       │   └── mybatis/               # MyBatis 커스텀
│   │   │       └── app/                       # 앱 API
│   │   ├── resources/
│   │   │   ├── log4j2.xml                    # 로깅 설정
│   │   │   ├── logging.properties            # 로깅 속성
│   │   │   └── nubiz/
│   │   │       ├── message/                  # 메시지 리소스
│   │   │       ├── spring/                   # Spring 설정
│   │   │       │   ├── context-common.xml
│   │   │       │   ├── context-datasource.xml
│   │   │       │   ├── context-mapper.xml
│   │   │       │   ├── context-security.xml
│   │   │       │   └── context-transaction.xml
│   │   │       └── sqlmap/                   # MyBatis Mapper XML
│   │   │           ├── admin/
│   │   │           ├── home/
│   │   │           └── sql-mapper-config.xml
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   ├── web.xml                   # 웹 애플리케이션 설정
│   │       │   ├── config/
│   │       │   │   └── nubiz/
│   │       │   │       ├── springmvc/
│   │       │   │       │   └── dispatcher-servlet.xml
│   │       │   │       └── tiles/
│   │       │   │           └── tiles.xml
│   │       │   └── jsp/
│   │       │       ├── tiles/                 # Tiles 템플릿
│   │       │       └── view/                  # JSP 뷰
│   │       ├── resources/                    # 정적 리소스
│   │       └── home.jsp                      # 홈페이지 진입점
│   └── test/
│       └── java/
└── target/                                   # 빌드 결과물
```

## 2. Maven 설정 (pom.xml)

### 2.1 완전한 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>kr.co.nubiz</groupId>
    <artifactId>townE</artifactId>
    <packaging>war</packaging>
    <version>3.5.0</version>
    <name>townE</name>
    
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        
        <!-- Spring Framework -->
        <spring.version>4.0.9.RELEASE</spring.version>
        <spring.security.version>3.2.9.RELEASE</spring.security.version>
        
        <!-- eGovFramework -->
        <egovframework.rte.version>3.5.0</egovframework.rte.version>
        
        <!-- MyBatis -->
        <mybatis.version>3.2.8</mybatis.version>
        <mybatis-spring.version>1.2.2</mybatis-spring.version>
        
        <!-- Database -->
        <mariadb.version>1.7.2</mariadb.version>
        <mysql.version>5.1.39</mysql.version>
        
        <!-- Apache Commons -->
        <commons-dbcp.version>1.4</commons-dbcp.version>
        <commons-fileupload.version>1.2.1</commons-fileupload.version>
        <commons-io.version>2.4</commons-io.version>
        <commons-compress.version>1.0</commons-compress.version>
        
        <!-- JSON -->
        <jackson.version>2.5.1</jackson.version>
        <gson.version>2.7</gson.version>
        <json-simple.version>1.1.1</json-simple.version>
        
        <!-- Apache Tiles -->
        <tiles.version>3.0.5</tiles.version>
        
        <!-- 기타 -->
        <lombok.version>1.16.14</lombok.version>
        <log4j2.version>2.17.1</log4j2.version>
    </properties>
    
    <repositories>
        <repository>
            <id>mvn2</id>
            <url>https://repo1.maven.org/maven2/</url>
            <releases><enabled>true</enabled></releases>
            <snapshots><enabled>true</enabled></snapshots>
        </repository>
        <repository>
            <id>egovframe</id>
            <url>https://www.egovframe.go.kr/maven/</url>
            <releases><enabled>true</enabled></releases>
            <snapshots><enabled>false</enabled></snapshots>
        </repository>
    </repositories>
    
    <dependencies>
        <!-- ========== Spring Framework ========== -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aop</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aspects</artifactId>
            <version>${spring.version}</version>
        </dependency>
        
        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-web</artifactId>
            <version>${spring.security.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-config</artifactId>
            <version>${spring.security.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-taglibs</artifactId>
            <version>${spring.security.version}</version>
        </dependency>
        
        <!-- Spring Mobile -->
        <dependency>
            <groupId>org.springframework.mobile</groupId>
            <artifactId>spring-mobile-device</artifactId>
            <version>1.1.4.RELEASE</version>
        </dependency>
        
        <!-- ========== eGovFramework ========== -->
        <dependency>
            <groupId>egovframework.rte</groupId>
            <artifactId>egovframework.rte.ptl.mvc</artifactId>
            <version>${egovframework.rte.version}</version>
            <exclusions>
                <exclusion>
                    <groupId>commons-logging</groupId>
                    <artifactId>commons-logging</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>egovframework.rte</groupId>
            <artifactId>egovframework.rte.psl.dataaccess</artifactId>
            <version>${egovframework.rte.version}</version>
        </dependency>
        <dependency>
            <groupId>egovframework.rte</groupId>
            <artifactId>egovframework.rte.fdl.idgnr</artifactId>
            <version>${egovframework.rte.version}</version>
        </dependency>
        <dependency>
            <groupId>egovframework.rte</groupId>
            <artifactId>egovframework.rte.fdl.property</artifactId>
            <version>${egovframework.rte.version}</version>
        </dependency>
        <dependency>
            <groupId>egovframework.rte</groupId>
            <artifactId>egovframework.rte.fdl.security</artifactId>
            <version>${egovframework.rte.version}</version>
        </dependency>
        
        <!-- ========== MyBatis ========== -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>${mybatis.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>${mybatis-spring.version}</version>
        </dependency>
        
        <!-- ========== Database ========== -->
        <dependency>
            <groupId>org.mariadb.jdbc</groupId>
            <artifactId>mariadb-java-client</artifactId>
            <version>${mariadb.version}</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql.version}</version>
        </dependency>
        <dependency>
            <groupId>commons-dbcp</groupId>
            <artifactId>commons-dbcp</artifactId>
            <version>${commons-dbcp.version}</version>
        </dependency>
        
        <!-- ========== Apache Tiles ========== -->
        <dependency>
            <groupId>org.apache.tiles</groupId>
            <artifactId>tiles-jsp</artifactId>
            <version>${tiles.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.tiles</groupId>
            <artifactId>tiles-core</artifactId>
            <version>${tiles.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.tiles</groupId>
            <artifactId>tiles-api</artifactId>
            <version>${tiles.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.tiles</groupId>
            <artifactId>tiles-servlet</artifactId>
            <version>${tiles.version}</version>
        </dependency>
        
        <!-- ========== Servlet API ========== -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>2.5</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>jsp-api</artifactId>
            <version>2.1</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
        <dependency>
            <groupId>taglibs</groupId>
            <artifactId>standard</artifactId>
            <version>1.1.2</version>
        </dependency>
        
        <!-- ========== Apache Commons ========== -->
        <dependency>
            <groupId>commons-fileupload</groupId>
            <artifactId>commons-fileupload</artifactId>
            <version>${commons-fileupload.version}</version>
        </dependency>
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>${commons-io.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-compress</artifactId>
            <version>${commons-compress.version}</version>
        </dependency>
        
        <!-- ========== JSON ========== -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>${jackson.version}</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-core</artifactId>
            <version>${jackson.version}</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-annotations</artifactId>
            <version>${jackson.version}</version>
        </dependency>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>${gson.version}</version>
        </dependency>
        <dependency>
            <groupId>com.googlecode.json-simple</groupId>
            <artifactId>json-simple</artifactId>
            <version>${json-simple.version}</version>
        </dependency>
        <dependency>
            <groupId>net.sf.json-lib</groupId>
            <artifactId>json-lib</artifactId>
            <version>2.4</version>
            <classifier>jdk15</classifier>
        </dependency>
        
        <!-- ========== 유틸리티 ========== -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>net.coobird</groupId>
            <artifactId>thumbnailator</artifactId>
            <version>0.4.8</version>
        </dependency>
        <dependency>
            <groupId>net.sf.opencsv</groupId>
            <artifactId>opencsv</artifactId>
            <version>2.3</version>
        </dependency>
        <dependency>
            <groupId>org.apache.httpcomponents</groupId>
            <artifactId>httpclient</artifactId>
            <version>4.3.6</version>
        </dependency>
        <dependency>
            <groupId>com.google.zxing</groupId>
            <artifactId>javase</artifactId>
            <version>3.3.3</version>
        </dependency>
        <dependency>
            <groupId>com.drewnoakes</groupId>
            <artifactId>metadata-extractor</artifactId>
            <version>2.12.0</version>
        </dependency>
        
        <!-- ========== Excel ========== -->
        <dependency>
            <groupId>net.sf.jxls</groupId>
            <artifactId>jxls-core</artifactId>
            <version>1.0.6</version>
        </dependency>
        <dependency>
            <groupId>org.jxls</groupId>
            <artifactId>jxls-poi</artifactId>
            <version>1.0.13</version>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi</artifactId>
            <version>3.14</version>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>3.14</version>
        </dependency>
        
        <!-- ========== 기타 ========== -->
        <dependency>
            <groupId>com.google.firebase</groupId>
            <artifactId>firebase-admin</artifactId>
            <version>9.7.0</version>
        </dependency>
        <dependency>
            <groupId>javax.mail</groupId>
            <artifactId>mail</artifactId>
            <version>1.4.7</version>
        </dependency>
        <dependency>
            <groupId>org.twitter4j</groupId>
            <artifactId>twitter4j-core</artifactId>
            <version>4.0.4</version>
        </dependency>
        
        <!-- ========== 로깅 ========== -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>${log4j2.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
            <version>${log4j2.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j-impl</artifactId>
            <version>${log4j2.version}</version>
        </dependency>
        <dependency>
            <groupId>com.googlecode.log4jdbc</groupId>
            <artifactId>log4jdbc</artifactId>
            <version>1.2</version>
            <exclusions>
                <exclusion>
                    <groupId>org.slf4j</groupId>
                    <artifactId>slf4j-api</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>
    
    <build>
        <defaultGoal>install</defaultGoal>
        <directory>${basedir}/target</directory>
        <finalName>${project.artifactId}-${project.version}</finalName>
        
        <pluginManagement>
            <plugins>
                <!-- Maven Compiler Plugin -->
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.8.1</version>
                    <configuration>
                        <source>${java.version}</source>
                        <target>${java.version}</target>
                        <encoding>UTF-8</encoding>
                    </configuration>
                </plugin>
                
                <!-- Maven WAR Plugin -->
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-war-plugin</artifactId>
                    <version>3.2.2</version>
                    <configuration>
                        <warSourceExcludes>WEB-INF/jsp/view/site/</warSourceExcludes>
                        <packagingExcludes>WEB-INF/jsp/view/site/</packagingExcludes>
                    </configuration>
                </plugin>
                
                <!-- Tomcat Maven Plugin -->
                <plugin>
                    <groupId>org.apache.tomcat.maven</groupId>
                    <artifactId>tomcat7-maven-plugin</artifactId>
                    <version>2.2</version>
                    <configuration>
                        <port>8080</port>
                        <path>/</path>
                        <systemProperties>
                            <JAVA_OPTS>-Xms256m -Xmx768m -XX:MaxPermSize=256m</JAVA_OPTS>
                        </systemProperties>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
        
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## 3. 웹 애플리케이션 설정 (web.xml)

### 3.1 완전한 web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
         xmlns="http://java.sun.com/xml/ns/javaee" 
         xmlns:web="http://java.sun.com/xml/ns/javaee" 
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee 
         http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" 
         id="WebApp_ID" version="2.5">
    
    <display-name>townE</display-name>
    
    <!-- ========== Spring Context 설정 ========== -->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath*:nubiz/spring/context-*.xml</param-value>
    </context-param>
    
    <!-- Spring ContextLoaderListener -->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    
    <!-- Spring RequestContextListener (RequestContextHolder 사용) -->
    <listener>
        <listener-class>org.springframework.web.context.request.RequestContextListener</listener-class>
    </listener>
    
    <!-- ========== Spring MVC DispatcherServlet ========== -->
    <servlet>
        <servlet-name>action</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>/WEB-INF/config/nubiz/springmvc/dispatcher-servlet.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    
    <servlet-mapping>
        <servlet-name>action</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
    
    <!-- ========== Spring Security Filter ========== -->
    <filter>
        <filter-name>springSecurityFilterChain</filter-name>
        <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>springSecurityFilterChain</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    
    <!-- ========== Character Encoding Filter ========== -->
    <filter>
        <filter-name>encodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>encodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    
    <!-- ========== HTML Tag Filter (eGovFramework) ========== -->
    <filter>
        <filter-name>HTMLTagFilter</filter-name>
        <filter-class>egovframework.rte.ptl.mvc.filter.HTMLTagFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>HTMLTagFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    
    <!-- ========== Error Page 설정 ========== -->
    <error-page>
        <exception-type>java.lang.Throwable</exception-type>
        <location>/common/error.jsp</location>
    </error-page>
    <error-page>
        <error-code>403</error-code>
        <location>/common/403.jsp</location>
    </error-page>
    <error-page>
        <error-code>404</error-code>
        <location>/common/404.jsp</location>
    </error-page>
    <error-page>
        <error-code>500</error-code>
        <location>/common/500.jsp</location>
    </error-page>
    
    <!-- ========== Welcome File ========== -->
    <welcome-file-list>
        <welcome-file>home.jsp</welcome-file>
    </welcome-file-list>
</web-app>
```

## 4. Spring 설정 파일

### 4.1 context-datasource.xml (데이터소스 설정)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" 
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:jdbc="http://www.springframework.org/schema/jdbc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
       http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
       http://www.springframework.org/schema/jdbc  
       http://www.springframework.org/schema/jdbc/spring-jdbc-4.0.xsd">
    
    <!-- 데이터소스 설정 -->
    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
        <property name="driverClassName" value="org.mariadb.jdbc.Driver"/>
        <property name="url" value="jdbc:mariadb://${db.host}:${db.port}/${db.name}?zeroDateTimeBehavior=convertToNull&amp;useUnicode=true&amp;characterEncoding=utf8mb4"/>
        <property name="username" value="${db.username}"/>
        <property name="password" value="${db.password}"/>
        
        <!-- Connection Pool 설정 -->
        <property name="initialSize" value="5"/>
        <property name="maxActive" value="20"/>
        <property name="maxIdle" value="10"/>
        <property name="minIdle" value="5"/>
        <property name="maxWait" value="30000"/>
        
        <!-- Connection 검증 -->
        <property name="validationQuery" value="SELECT 1"/>
        <property name="testWhileIdle" value="true"/>
        <property name="timeBetweenEvictionRunsMillis" value="7200000"/>
        <property name="testOnBorrow" value="true"/>
        <property name="testOnReturn" value="false"/>
        
        <!-- Connection 풀 정리 -->
        <property name="removeAbandoned" value="true"/>
        <property name="removeAbandonedTimeout" value="300"/>
        <property name="logAbandoned" value="true"/>
    </bean>
</beans>
```

### 4.2 context-mapper.xml (MyBatis 설정)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" 
       xmlns:p="http://www.springframework.org/schema/p" 
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
       http://www.springframework.org/schema/beans/spring-beans-4.0.xsd">
    
    <!-- MyBatis SqlSessionFactory -->
    <bean id="sqlSession" class="kr.co.nubiz.common.mybatis.RefreshableSqlSessionFactoryBean" p:interval="1000">
        <property name="dataSource" ref="dataSource"/>
        <property name="configLocation" value="classpath:/nubiz/sqlmap/sql-mapper-config.xml"/>
        <property name="mapperLocations" value="classpath:/nubiz/sqlmap/**/mappers/*.xml"/>
    </bean>
    
    <!-- MyBatis Mapper 스캔 -->
    <bean class="egovframework.rte.psl.dataaccess.mapper.MapperConfigurer">
        <property name="basePackage" value="kr.co.nubiz.**.service.impl"/>
    </bean>
</beans>
```

### 4.3 context-transaction.xml (트랜잭션 설정)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
       http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
       http://www.springframework.org/schema/tx 
       http://www.springframework.org/schema/tx/spring-tx-4.0.xsd">
    
    <!-- 트랜잭션 매니저 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>
    
    <!-- 트랜잭션 어노테이션 활성화 -->
    <tx:annotation-driven transaction-manager="transactionManager"/>
</beans>
```

### 4.4 context-security.xml (Spring Security 설정)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans:beans xmlns="http://www.springframework.org/schema/security"
             xmlns:context="http://www.springframework.org/schema/context"
             xmlns:mvc="http://www.springframework.org/schema/mvc"
             xmlns:beans="http://www.springframework.org/schema/beans"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://www.springframework.org/schema/beans
             http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
             http://www.springframework.org/schema/mvc 
             http://www.springframework.org/schema/mvc/spring-mvc-3.2.xsd
             http://www.springframework.org/schema/security 
             http://www.springframework.org/schema/security/spring-security-3.2.xsd
             http://www.springframework.org/schema/context 
             http://www.springframework.org/schema/context/spring-context-3.2.xsd">
    
    <context:annotation-config/>
    
    <!-- 메서드 레벨 보안 활성화 -->
    <global-method-security pre-post-annotations="enabled" secured-annotations="enabled">
        <expression-handler ref="methodSecurityExpressionHandler"/>
    </global-method-security>
    
    <!-- 보안 제외 경로 -->
    <http pattern="/resources/**" security="none"/>
    <http pattern="/ebook/**" security="none"/>
    <http pattern="/favicon.ico" security="none"/>
    
    <!-- HTTP 보안 설정 -->
    <http auto-config="true" use-expressions="true" access-decision-manager-ref="accessDecisionManager">
        <!-- URL 패턴별 접근 제어 -->
        <intercept-url pattern="/admin/member/loginV.do" access="permitAll"/>
        <intercept-url pattern="/admin/**" access="hasRole('ROLE_USER')"/>
        
        <!-- 커스텀 필터 -->
        <custom-filter ref="requestContextFilter" before="FORM_LOGIN_FILTER"/>
        
        <!-- 폼 로그인 설정 -->
        <form-login login-page="/admin/member/loginV.do" 
                    always-use-default-target="false" 
                    authentication-success-handler-ref="authenticationSuccessHandler" 
                    authentication-failure-handler-ref="authenticationFailureHandler"/>
        
        <!-- 로그아웃 설정 -->
        <logout logout-success-url="/admin/member/loginV.do" 
                logout-url="/admin/member/logout.do" 
                invalidate-session="true"/>
        
        <!-- Remember Me -->
        <remember-me/>
        
        <!-- Expression Handler -->
        <expression-handler ref="defaultWebSecurityExpressionHandler"/>
        
        <!-- 세션 관리 -->
        <session-management>
            <concurrency-control max-sessions="1" error-if-maximum-exceeded="false"/>
        </session-management>
    </http>
    
    <!-- RequestContextFilter -->
    <beans:bean id="requestContextFilter" class="org.springframework.web.filter.RequestContextFilter"/>
    
    <!-- UserDetailsService -->
    <beans:bean id="userDetailService" class="kr.co.nubiz.common.security.service.UserDetailService">
        <beans:property name="roleHierarchy" ref="roleHierarchy"/>
    </beans:bean>
    
    <!-- Authentication Success Handler -->
    <beans:bean id="authenticationSuccessHandler" class="kr.co.nubiz.common.security.service.AuthenticationSuccess"/>
    
    <!-- Authentication Failure Handler -->
    <beans:bean id="authenticationFailureHandler" class="kr.co.nubiz.common.security.service.AuthenticationFail"/>
    
    <!-- Authentication Provider -->
    <beans:bean id="authenticationProvider" class="kr.co.nubiz.common.security.service.UserAuthenticationProvider">
        <beans:property name="userDetailsService" ref="userDetailService"/>
    </beans:bean>
    
    <!-- Authentication Manager -->
    <authentication-manager alias="authenticationManager">
        <authentication-provider ref="authenticationProvider"/>
    </authentication-manager>
    
    <!-- Access Decision Manager -->
    <beans:bean id="accessDecisionManager" class="org.springframework.security.access.vote.AffirmativeBased">
        <beans:property name="decisionVoters">
            <beans:list>
                <beans:bean class="org.springframework.security.web.access.expression.WebExpressionVoter">
                    <beans:property name="expressionHandler" ref="defaultWebSecurityExpressionHandler"/>
                </beans:bean>
                <beans:bean class="org.springframework.security.access.vote.AuthenticatedVoter"/>
            </beans:list>
        </beans:property>
    </beans:bean>
    
    <!-- Method Security Expression Handler -->
    <beans:bean id="methodSecurityExpressionHandler" class="org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler">
        <beans:property name="roleHierarchy" ref="roleHierarchy"/>
    </beans:bean>
    
    <!-- Web Security Expression Handler -->
    <beans:bean id="defaultWebSecurityExpressionHandler" class="org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler">
        <beans:property name="roleHierarchy" ref="roleHierarchy"/>
    </beans:bean>
    
    <!-- Role Hierarchy -->
    <beans:bean id="roleHierarchy" class="org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl">
        <beans:property name="hierarchy">
            <beans:value>
                ROLE_ADMIN > ROLE_USER
                ROLE_USER > ROLE_GUEST
                ROLE_GUEST > ROLE_ANONYMOUS
            </beans:value>
        </beans:property>
    </beans:bean>
</beans:beans>
```

### 4.5 dispatcher-servlet.xml (Spring MVC 설정)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" 
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:security="http://www.springframework.org/schema/security"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
       http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
       http://www.springframework.org/schema/context 
       http://www.springframework.org/schema/context/spring-context-4.0.xsd
       http://www.springframework.org/schema/mvc 
       http://www.springframework.org/schema/mvc/spring-mvc-4.0.xsd
       http://www.springframework.org/schema/security 
       http://www.springframework.org/schema/security/spring-security.xsd">
    
    <!-- Annotation Driven -->
    <mvc:annotation-driven>
        <mvc:argument-resolvers>
            <bean class="org.springframework.mobile.device.DeviceWebArgumentResolver"/>
        </mvc:argument-resolvers>
        <mvc:message-converters>
            <bean class="org.springframework.http.converter.StringHttpMessageConverter">
                <property name="supportedMediaTypes">
                    <list>
                        <value>text/html;charset=UTF-8</value>
                        <value>application/json;charset=UTF-8</value>
                    </list>
                </property>
            </bean>
            <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
                <property name="objectMapper">
                    <bean class="com.fasterxml.jackson.databind.ObjectMapper">
                        <property name="propertyNamingStrategy">
                            <bean class="com.fasterxml.jackson.databind.PropertyNamingStrategy.LowerCaseWithUnderscoresStrategy"/>
                        </property>
                    </bean>
                </property>
            </bean>
        </mvc:message-converters>
    </mvc:annotation-driven>
    
    <!-- Default Servlet Handler -->
    <mvc:default-servlet-handler/>
    
    <!-- Component Scan (Controller만) -->
    <context:component-scan base-package="kr.co.nubiz">
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Service"/>
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Repository"/>
    </context:component-scan>
    
    <!-- Interceptors -->
    <mvc:interceptors>
        <!-- Device Resolver Interceptor -->
        <mvc:interceptor>
            <mvc:mapping path="/**"/>
            <bean class="org.springframework.mobile.device.DeviceResolverHandlerInterceptor"/>
        </mvc:interceptor>
        
        <!-- Domain Check Interceptor -->
        <mvc:interceptor>
            <mvc:mapping path="/**"/>
            <mvc:exclude-mapping path="/admin/**"/>
            <mvc:exclude-mapping path="/download/**"/>
            <mvc:exclude-mapping path="/image/**"/>
            <mvc:exclude-mapping path="/resources/**"/>
            <mvc:exclude-mapping path="/css/**"/>
            <mvc:exclude-mapping path="/defaultSetting/**"/>
            <mvc:exclude-mapping path="/app/**"/>
            <mvc:exclude-mapping path="/ebook/**"/>
            <bean class="kr.co.nubiz.common.interceptor.DomainCheckHomeInterceptor"/>
        </mvc:interceptor>
        
        <!-- IP Check Interceptor -->
        <mvc:interceptor>
            <mvc:mapping path="/admin/member/loginV.do"/>
            <mvc:exclude-mapping path="/resources/**"/>
            <mvc:exclude-mapping path="/download/**"/>
            <mvc:exclude-mapping path="/image/**"/>
            <mvc:exclude-mapping path="/css/**"/>
            <mvc:exclude-mapping path="/app/**"/>
            <mvc:exclude-mapping path="/ebook/**"/>
            <bean class="kr.co.nubiz.common.interceptor.IpCheckInterceptor"/>
        </mvc:interceptor>
        
        <!-- App Check Interceptor -->
        <mvc:interceptor>
            <mvc:mapping path="/**"/>
            <mvc:exclude-mapping path="/admin/**"/>
            <mvc:exclude-mapping path="/download/**"/>
            <mvc:exclude-mapping path="/image/**"/>
            <mvc:exclude-mapping path="/resources/**"/>
            <mvc:exclude-mapping path="/css/**"/>
            <mvc:exclude-mapping path="/defaultSetting/**"/>
            <mvc:exclude-mapping path="/app/**"/>
            <mvc:exclude-mapping path="/ebook/**"/>
            <bean class="kr.co.nubiz.common.interceptor.AppCheckInterceptor"/>
        </mvc:interceptor>
    </mvc:interceptors>
    
    <!-- Request Mapping Handler Adapter -->
    <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
        <property name="webBindingInitializer">
            <bean class="kr.co.nubiz.common.cmmn.web.EgovBindingInitializer"/>
        </property>
    </bean>
    
    <!-- Locale Resolver -->
    <bean id="localeResolver" class="org.springframework.web.servlet.i18n.SessionLocaleResolver"/>
    
    <!-- Locale Change Interceptor -->
    <bean id="localeChangeInterceptor" class="org.springframework.web.servlet.i18n.LocaleChangeInterceptor">
        <property name="paramName" value="language"/>
    </bean>
    
    <!-- Exception Resolver -->
    <bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
        <property name="defaultErrorView" value="cmmn/egovError"/>
        <property name="exceptionMappings">
            <props>
                <prop key="org.springframework.dao.DataAccessException">cmmn/dataAccessFailure</prop>
                <prop key="org.springframework.transaction.TransactionException">cmmn/transactionFailure</prop>
                <prop key="egovframework.rte.fdl.cmmn.exception.EgovBizException">cmmn/egovError</prop>
                <prop key="org.springframework.security.AccessDeniedException">cmmn/egovError</prop>
            </props>
        </property>
    </bean>
    
    <!-- Tiles View Resolver -->
    <bean class="org.springframework.web.servlet.view.UrlBasedViewResolver" p:order="1"
          p:viewClass="org.springframework.web.servlet.view.tiles3.TilesView"/>
    
    <!-- Tiles Configurer -->
    <bean id="tilesConfigurer" class="org.springframework.web.servlet.view.tiles3.TilesConfigurer">
        <property name="definitions">
            <value>/WEB-INF/config/nubiz/tiles/tiles.xml</value>
        </property>
    </bean>
    
    <!-- Internal Resource View Resolver -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/jsp/view"/>
        <property name="suffix" value=".jsp"/>
        <property name="order" value="2"/>
    </bean>
    
    <!-- Multipart Resolver -->
    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <property name="defaultEncoding" value="UTF-8"/>
        <property name="maxUploadSize" value="1000000000"/>
        <property name="maxInMemorySize" value="1048576"/>
    </bean>
    
    <!-- Pagination Manager -->
    <bean id="imageRenderer" class="kr.co.nubiz.common.cmmn.web.EgovImgPaginationRenderer"/>
    <bean id="textRenderer" class="egovframework.rte.ptl.mvc.tags.ui.pagination.DefaultPaginationRenderer"/>
    <bean id="dmsRenderer" class="kr.co.nubiz.common.cmmn.web.DmsTextPaginationRenderer"/>
    <bean id="dmsRenderer2" class="kr.co.nubiz.common.cmmn.web.DmsTextPaginationRenderer2"/>
    
    <bean id="paginationManager" class="egovframework.rte.ptl.mvc.tags.ui.pagination.DefaultPaginationManager">
        <property name="rendererType">
            <map>
                <entry key="image" value-ref="imageRenderer"/>
                <entry key="text" value-ref="textRenderer"/>
                <entry key="dms" value-ref="dmsRenderer"/>
                <entry key="dms2" value-ref="dmsRenderer2"/>
            </map>
        </property>
    </bean>
</beans>
```

### 4.6 sql-mapper-config.xml (MyBatis 설정)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" 
"http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <settings>
        <!-- NULL 값도 Setter 호출 -->
        <setting name="callSettersOnNulls" value="true"/>
        <!-- 언더스코어를 카멜케이스로 자동 변환 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
        <!-- 지연 로딩 활성화 -->
        <setting name="lazyLoadingEnabled" value="true"/>
        <!-- 지연 로딩 시 집계 메서드 호출 -->
        <setting name="aggressiveLazyLoading" value="false"/>
        <!-- 기본 실행 타임아웃 -->
        <setting name="defaultStatementTimeout" value="25"/>
    </settings>
    
    <!-- Type Aliases -->
    <typeAliases>
        <!-- eGovFramework -->
        <typeAlias alias="egovMap" type="egovframework.rte.psl.dataaccess.util.EgovMap"/>
        
        <!-- Admin VO -->
        <typeAlias alias="memberVO" type="kr.co.nubiz.admin.member.service.MemberVO"/>
        <typeAlias alias="memberSiteVO" type="kr.co.nubiz.admin.member.service.MemberSiteVO"/>
        <typeAlias alias="siteMenuVO" type="kr.co.nubiz.admin.site.menu.service.MenuVO"/>
        <typeAlias alias="contentVO" type="kr.co.nubiz.admin.site.content.service.ContentVO"/>
        <typeAlias alias="boardVO" type="kr.co.nubiz.admin.site.board.service.BoardVO"/>
        <typeAlias alias="boardItemVO" type="kr.co.nubiz.admin.site.board.service.BoardItemVO"/>
        <typeAlias alias="searchBoardItemVO" type="kr.co.nubiz.admin.site.board.service.SearchBoardItemVO"/>
        <typeAlias alias="boardFileVO" type="kr.co.nubiz.admin.site.board.service.BoardFileVO"/>
        <typeAlias alias="boardCommentVO" type="kr.co.nubiz.admin.site.board.service.BoardCommentVO"/>
        <typeAlias alias="codeVO" type="kr.co.nubiz.admin.code.service.CodeVO"/>
        <typeAlias alias="siteVO" type="kr.co.nubiz.admin.adm.site.service.SiteVO"/>
        <typeAlias alias="layoutVO" type="kr.co.nubiz.admin.site.layout.service.LayoutVO"/>
        
        <!-- Home VO -->
        <typeAlias alias="memberHomeVO" type="kr.co.nubiz.home.member.service.MemberHomeVO"/>
        <typeAlias alias="siteMenuHomeVO" type="kr.co.nubiz.home.site.menu.service.MenuHomeVO"/>
        <typeAlias alias="boardHomeVO" type="kr.co.nubiz.home.site.board.service.BoardVO"/>
        <typeAlias alias="boardItemHomeVO" type="kr.co.nubiz.home.site.board.service.BoardItemVO"/>
        <typeAlias alias="searchBoardItemHomeVO" type="kr.co.nubiz.home.site.board.service.SearchBoardItemVO"/>
        
        <!-- Common VO -->
        <typeAlias alias="likeVO" type="kr.co.nubiz.home.programs.like.service.LikeVO"/>
        <typeAlias alias="commentVO" type="kr.co.nubiz.home.programs.comment.service.CommentVO"/>
    </typeAliases>
</configuration>
```

### 4.7 tiles.xml (Tiles 설정)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE tiles-definitions PUBLIC "-//Apache Software Foundation//DTD Tiles Configuration 2.1//EN"
"http://tiles.apache.org/dtds/tiles-config_2_1.dtd">

<tiles-definitions>
    <!-- ========== Admin Template ========== -->
    <definition name="adminNone" template="/WEB-INF/jsp/tiles/none/layout.jsp">
        <put-attribute name="content"/>
    </definition>
    
    <definition name="/admin/*_popup" extends="adminNone">
        <put-attribute name="content" value="/WEB-INF/jsp/view/admin/{1}_popup.jsp"/>
    </definition>
    
    <definition name="/admin/*/*_popup" extends="adminNone">
        <put-attribute name="content" value="/WEB-INF/jsp/view/admin/{1}/{2}_popup.jsp"/>
    </definition>
    
    <definition name="adminTemplate" template="/WEB-INF/jsp/tiles/admin/layout.jsp">
        <put-attribute name="header" value="/WEB-INF/jsp/tiles/admin/header.jsp"/>
        <put-attribute name="left" value="/WEB-INF/jsp/tiles/admin/left.jsp"/>
        <put-attribute name="content"/>
        <put-attribute name="footer" value="/WEB-INF/jsp/tiles/admin/footer.jsp"/>
    </definition>
    
    <definition name="/admin/*" extends="adminTemplate">
        <put-attribute name="content" value="/WEB-INF/jsp/view/admin/{1}.jsp"/>
    </definition>
    
    <definition name="/admin/*/*" extends="adminTemplate">
        <put-attribute name="content" value="/WEB-INF/jsp/view/admin/{1}/{2}.jsp"/>
    </definition>
    
    <definition name="/admin/*/*/*" extends="adminTemplate">
        <put-attribute name="content" value="/WEB-INF/jsp/view/admin/{1}/{2}/{3}.jsp"/>
    </definition>
    
    <!-- ========== Home Template ========== -->
    <definition name="userMainTemplate" template="/WEB-INF/jsp/tiles/home/mainLayout.jsp">
        <put-attribute name="header" value="/WEB-INF/jsp/tiles/home/header.jsp"/>
        <put-attribute name="left"/>
        <put-attribute name="content"/>
        <put-attribute name="footer" value="/WEB-INF/jsp/tiles/home/footer.jsp"/>
    </definition>
    
    <definition name="userContentTemplate" template="/WEB-INF/jsp/tiles/home/layout.jsp">
        <put-attribute name="header" value="/WEB-INF/jsp/tiles/home/header.jsp"/>
        <put-attribute name="left" value="/WEB-INF/jsp/tiles/home/left.jsp"/>
        <put-attribute name="content"/>
        <put-attribute name="footer" value="/WEB-INF/jsp/tiles/home/footer.jsp"/>
    </definition>
    
    <!-- 컨텐츠 페이지 -->
    <definition name="/site/*/content/*/*" extends="userContentTemplate">
        <put-attribute name="content" value="/WEB-INF/jsp/view/site/{1}/content/{2}/{3}.jsp"/>
    </definition>
    
    <!-- 게시판 페이지 -->
    <definition name="/home/board/*/*" extends="userContentTemplate">
        <put-attribute name="content" value="/WEB-INF/jsp/view/home/board/{1}/{2}.jsp"/>
    </definition>
    
    <!-- 프로그램 페이지 -->
    <definition name="/home/programs/*/*" extends="userContentTemplate">
        <put-attribute name="content" value="/WEB-INF/jsp/view/home/programs/{1}/{2}.jsp"/>
    </definition>
    
    <definition name="/home/programs/*/*/*" extends="userContentTemplate">
        <put-attribute name="content" value="/WEB-INF/jsp/view/home/programs/{1}/{2}/{3}.jsp"/>
    </definition>
    
    <definition name="/home/programs/*/*/*/*" extends="userContentTemplate">
        <put-attribute name="content" value="/WEB-INF/jsp/view/home/programs/{1}/{2}/{3}/{4}.jsp"/>
    </definition>
    
    <!-- 회원 페이지 -->
    <definition name="/home/member/*" extends="userContentTemplate">
        <put-attribute name="content" value="/WEB-INF/jsp/view/home/member/{1}.jsp"/>
    </definition>
</tiles-definitions>
```

## 5. 환경 변수 설정

### 5.1 application.properties (환경별 설정)

```properties
# 데이터베이스 설정
db.host=192.168.0.141
db.port=3306
db.name=townE
db.username=townE
db.password=townE

# 파일 업로드 설정
file.upload.path=/upload
file.upload.max.size=1048576000

# 세션 설정
session.timeout=1800

# 로깅 설정
logging.level.root=INFO
logging.level.kr.co.nubiz=DEBUG
```

### 5.2 환경별 설정 분리

**application-dev.properties** (개발 환경):
```properties
db.host=localhost
db.port=3306
db.name=townE_dev
db.username=root
db.password=root
```

**application-prod.properties** (운영 환경):
```properties
db.host=${DB_HOST}
db.port=${DB_PORT}
db.name=${DB_NAME}
db.username=${DB_USERNAME}
db.password=${DB_PASSWORD}
```

## 6. 로깅 설정

### 6.1 log4j2.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Appenders>
        <!-- Console Appender -->
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
        
        <!-- File Appender -->
        <RollingFile name="FileAppender" fileName="logs/townE.log"
                     filePattern="logs/townE-%d{yyyy-MM-dd}-%i.log">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
            <Policies>
                <TimeBasedTriggeringPolicy/>
                <SizeBasedTriggeringPolicy size="100MB"/>
            </Policies>
            <DefaultRolloverStrategy max="10"/>
        </RollingFile>
    </Appenders>
    
    <Loggers>
        <!-- Application Loggers -->
        <Logger name="kr.co.nubiz" level="DEBUG" additivity="false">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="FileAppender"/>
        </Logger>
        
        <!-- SQL Logging -->
        <Logger name="jdbc.sqltiming" level="DEBUG" additivity="false">
            <AppenderRef ref="Console"/>
        </Logger>
        
        <!-- Root Logger -->
        <Root level="INFO">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="FileAppender"/>
        </Root>
    </Loggers>
</Configuration>
```

## 7. 프로젝트 생성 가이드

### 7.1 단계별 생성 절차

1. **Maven 프로젝트 생성**
   ```bash
   mvn archetype:generate -DgroupId=kr.co.nubiz -DartifactId=townE -DarchetypeArtifactId=maven-archetype-webapp
   ```

2. **디렉토리 구조 생성**
   ```bash
   mkdir -p src/main/java/kr/co/nubiz/{admin,home,common,app}
   mkdir -p src/main/resources/nubiz/{spring,sqlmap,message}
   mkdir -p src/main/webapp/WEB-INF/{config/nubiz/{springmvc,tiles},jsp/{tiles,view}}
   ```

3. **설정 파일 복사**
   - 위의 모든 설정 파일을 해당 위치에 복사

4. **의존성 다운로드**
   ```bash
   mvn clean install
   ```

5. **데이터베이스 생성**
   - `04_Database_DDL_Script.md`의 DDL 실행

6. **애플리케이션 실행**
   ```bash
   mvn tomcat7:run
   ```

## 8. 주요 패키지 구조

### 8.1 패키지 명명 규칙

```
kr.co.nubiz
├── admin/              # 관리자 기능
│   ├── member/         # 회원 관리
│   ├── site/           # 사이트 관리
│   └── programs/       # 프로그램 모듈
├── home/               # 사용자 화면
│   ├── member/         # 회원 기능
│   ├── site/           # 사이트 기능
│   └── programs/       # 프로그램 기능
├── common/             # 공통 기능
│   ├── security/       # 보안
│   ├── utils/          # 유틸리티
│   ├── interceptor/    # 인터셉터
│   └── mybatis/        # MyBatis 커스텀
└── app/                # 앱 API
```

### 8.2 클래스 명명 규칙

- **Controller**: `*Controller.java` (예: `MemberController.java`)
- **Service**: `I*Service.java` (인터페이스), `*ServiceImpl.java` (구현체)
- **Mapper**: `I*Mapper.java` (인터페이스)
- **VO**: `*VO.java` (예: `MemberVO.java`)
- **Util**: `*Util.java` (예: `EncryptionUtil.java`)

## 9. 빌드 및 실행

### 9.1 빌드

```bash
# 전체 빌드
mvn clean install

# WAR 파일 생성
mvn clean package

# 테스트 제외 빌드
mvn clean install -DskipTests
```

### 9.2 실행

```bash
# Tomcat Maven Plugin 사용
mvn tomcat7:run

# 또는 WAR 파일을 Tomcat에 배포
cp target/townE-3.5.0.war $TOMCAT_HOME/webapps/
```

## 10. 주의사항

1. **환경 변수**: 운영 환경에서는 반드시 환경 변수 사용
2. **보안**: DB 비밀번호 등 민감 정보는 절대 소스 코드에 포함하지 않음
3. **문자셋**: 모든 파일은 UTF-8 인코딩 사용
4. **경로**: Windows와 Linux 경로 구분자 차이 주의 (`File.separator` 사용)

## 11. 다음 단계

이제 다음 문서를 참고하여 실제 구현을 진행하세요:
- `06_API_Specification.md` - REST API 명세
- `07_Implementation_Code_Examples.md` - 구현 코드 예시
- `08_Deployment_Guide.md` - 배포 가이드

