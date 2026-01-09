# GitHub 저장소 연동 가이드

## 1. GitHub 저장소 생성

1. GitHub 웹사이트에 로그인: https://github.com
2. 우측 상단의 **+** 버튼 클릭 → **New repository** 선택
3. 저장소 정보 입력:
   - Repository name: `maeul-e` (또는 원하는 이름)
   - Description: `townE 리뉴얼 프로젝트`
   - Public 또는 Private 선택
   - **Initialize this repository with a README** 체크 해제 (이미 로컬에 README가 있음)
4. **Create repository** 클릭

## 2. 원격 저장소 추가 및 푸시

GitHub에서 저장소를 생성한 후, 아래 명령어를 실행하세요:

```bash
# 원격 저장소 추가 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/maeul-e.git

# 또는 SSH를 사용하는 경우
git remote add origin git@github.com:YOUR_USERNAME/maeul-e.git

# 브랜치 이름을 main으로 변경 (이미 완료됨)
git branch -M main

# 원격 저장소에 푸시
git push -u origin main
```

## 3. 인증 설정

### HTTPS 사용 시
- GitHub Personal Access Token이 필요합니다
- 토큰 생성: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- 권한: `repo` 체크
- 푸시 시 사용자명과 토큰 입력

### SSH 사용 시
- SSH 키가 GitHub에 등록되어 있어야 합니다
- SSH 키 생성 및 등록 가이드: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## 4. 확인

푸시가 완료되면 GitHub 저장소 페이지에서 파일들이 표시됩니다.

## 5. 향후 작업 흐름

```bash
# 변경사항 추가
git add .

# 커밋
git commit -m "커밋 메시지"

# 푸시
git push origin main
```

## 주의사항

- `.env` 파일은 `.gitignore`에 포함되어 있어 커밋되지 않습니다
- 민감한 정보(DB 비밀번호, API 키 등)는 절대 커밋하지 마세요
- `node_modules/`, `target/` 등 빌드 산출물도 자동으로 제외됩니다
