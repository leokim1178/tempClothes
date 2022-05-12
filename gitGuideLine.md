# git repo 운영 가이드라인

## 탑 레포지토리

요약 : codecamp 레포(원본)
frontend : https://github.com/code-bootcamp/f6b2-team1-client
backend : https://github.com/code-bootcamp/f6b2-team1-server
admin : 범기
maintain : 태영, 영택

## 미드 레포지토리

요약 : 깃 관리자 레포(git 관리자용)
frontend : https://github.com/code-bootcamp/f6b2-team1-client-mid
backend : https://github.com/code-bootcamp/f6b2-team1-server-mid
admin : 태영, 영택
read : 범기, 재형, 한솔, 태영, 영택
upstream : 탑 레포지토리
origin : 미드 레포지토리

## 바텀 레포지토리

요약 : 작업용 레포 (팀원당 하나씩)
예시 : https://github.com/code-bootcamp/f6b2-team1-server-leo(자신영어이름)
upstream : 미드 레포지토리
origin : 바텀 레포지토리

# checklist

1. 왼쪽 상단에서 세번째 소스 제어 오픈
2. 타 작업과 충돌 파일이 있는지 확인(수정할 파일이 있을시 관련 내용 곧바로 전달 - discord)
3. gcp 관련 json이 소스 제어 상 들어가 있는지 확인

## bottom 레포지토리 사용법

1. 미드 레포지토리 fork
2. git clone <githuburl>
3. cd <해당폴더>
4. git remote -v 확인
   1. upstream이 없을 경우
   2. git remote add upstream <미드 레포지토리>
   3. git remote -v 해서 확인
      - upstream과 origin이 정상적으로 나오는지
5. git branch 해서 develop이 있는지 확인
6. git checkout develop
   1. git checkout -b feat/( 작업의 최상위 폴더명 )
   2. 작업과 커밋 시작
7. 작업완료시
   1. git push origin feat/( 작업의 최상위 폴더명 )
8. github page로 들어가 new pull request 로 들어갑니다.(compare & pull request 아닙니다)
   1. base repository (왼쪽) : 미드 레포지토리 , base : develop
   2. head repository (오른쪽) : 바텀 레포지토리 , base : feat/( 작업의 최상위 폴더명 or 작업의 최상위 폴더명/파일이름(확장자없이))

## mid 레포지토리 사용법

1.  git checkout develop
2.  git checkout -b feat/( 작업의 최상위 폴더명 )
3.  작업과 커밋 시작
4.  작업 완료시
    1.  git checkout develop
    2.  git merge <feat브랜치명>
5.  git push origin develop
6.  도착한 PR들 검토 후 merge

- release 브랜치는 feat와 같은 방식으로 하면 됩니다
-

# 초기 설정

1. 탑 레포지토리 fork
2. git clone <github url>
3. cd <해당폴더>
4. git remote -v
   1. origin, upstream 확인
5. git checkout master
   1. git checkout -b develop
6. git checkout develop

- 환경 구축 후 master에 커밋🚀

1. 핫픽스 브랜치 만들기
   1. git checkout master
   2. git checkout -b hotfix
2. 릴리즈 브랜치 만들기
   1. git checkout develop
   2. git checkout -b release

# Branch/ Pull Request형식

# master branch & develop branch

명칭 변경 금지

# release branch

rel/( 작업의 최상위 폴더명 )

# feature branch

feat/( 작업의 최상위 폴더명 )

- 중복 브랜치일시 숫자 추가
- ex) feat/( 작업의 최상위 폴더명)2

## 백엔드 커밋 기준

- 커밋 기준
  - 한 apis 폴더 내에서는 entity와 m-r-s 생성, 수정, 삭제 별로 커밋
  - apis폴더 외에 있어서는 생성, 수정, 삭제 별로 커밋
  - 커밋은 구동 테스트를 거친 후에 할 것
  - 솔직히 까먹어도 상관없음ㅋ
- commit title : 작업 내용 (한글)
- commit comment : **작업한 주요 파일 기재** 및 자유롭게 comment

## 기능 생성/수정/삭제 (가장 많이 쓸 깃모지들입니다)

<!-- 수정,삭제가 모두 이루어졌을 경우 수정만 사용합니다 -->

✨ :sparkles: 새 기능 생성

🎨 :art: 코드/파일 수정

🔥 :fire: 코드/파일 삭제

## 릴리즈 / 핫픽스용

🐛 :bug: 버그 수정

🚑 :ambulance: 긴급 수정

📝 :memo: 문서 추가/수정

🔖 :bookmark: 릴리즈/버전 태그 Release / Version tags.

## pull Request 및 merge

- merge 전 🔀 아이콘만 추가
  🔀 (자동 생성 merge 커밋타이틀)
- mid 관리자와 top 관리자는 PR 받기 전 신경써주십시오

## 백엔드용 깃모지

<!-- TDD -->

✅ :white_check_mark: 테스트 추가/수정 Add or update tests.

<!-- CI 배포 수정 -->

💚 :green_heart: CI 빌드 수정 Fix CI Build.

👷 :construction_worker: CI 빌드 시스템 추가/수정 Add or update CI build system.

## 프로젝트 완료 후

♻️ :recycle: 코드 리팩토링 Refactor code.

## 기타 깃모지

💄 :lipstick: UI/스타일 파일 추가/수정

💩 :poop: 똥싼 코드

👽 :alien: 외부 API 변화로 인한 수정

💡 :bulb: 주석 추가/수정

🍻 :beers: 술 취해서 쓴 코드

🙈 :see_no_evil: .gitignore 추가/수정
