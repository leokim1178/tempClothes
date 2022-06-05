# 날씨 패션 커뮤니티, 온도衣

<p align="center">
<img src="https://capsule-render.vercel.app/api?&type=waving&color=timeAuto&height=180&section=header&text=BackEnd&fontSize=50&animation=fadeIn&fontAlignY=45" />
  </p>

## 프로젝트 소개

한 번쯤 일기 예보를 보고 옷을 입었다가 다시 집에 돌아온 적도, 손에 짐이 늘어난 적도 있을 것입니다.

또, 어떤 옷을 입을지 고민하느라 꽤 많은 시간을 옷장 앞에서 보내기도 했을 것입니다.

기상청이나 어플에서 전해주는 숫자 데이터만으로는 날씨에 맞는 옷을 입기 어려워졌습니다.

온도衣는 그런 당신의 고민을 덜어주기 위해 태어났습니다.

<br>

## 배포 주소

```sh
dev: https://team01.leo3179.shop/graphql
prod: https://server.t1dreamers.shop/graphql
```

## 기술 스택

<br>
<div align='center'> 🖥&nbsp&nbsp&nbsp사용한 기술 스택</div>
<br>
<p align="center">
📑&nbsp&nbsp&nbsp구성 언어
  </p>
<p align="center">
<img alt= "icon" wide="80" height="80" src ="https://techstack-generator.vercel.app/js-icon.svg">
<img alt= "icon" wide="80" height="80" src ="https://techstack-generator.vercel.app/ts-icon.svg">
  </p>
 <p align="center">
🏠&nbsp&nbsp&nbsp데이터베이스
  </p>
<p align="center">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/mysql-icon.svg"> 
&nbsp&nbsp&nbsp
<img alt= "icon" wide="60" height="60" src ="https://cdn4.iconfinder.com/data/icons/redis-2/1451/Untitled-2-512.png">

  </p>
   <p align="center">
🚀&nbsp&nbsp&nbsp배포
  </p>
<p align="center">
<img alt= "icon" wide="60" height="60" src ="https://techstack-generator.vercel.app/kubernetes-icon.svg">
&nbsp
&nbsp
&nbsp
<img alt= "icon" wide="60" height="60" src="https://lirp.cdn-website.com/aa0ef369/dms3rep/multi/opt/google-cloud-icon-570w.png">
  </p>
    </p>
       <p align="center">
🏖&nbsp&nbsp&nbspWith...
  </p>
<p align="center">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/restapi-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/graphql-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/docker-icon.svg">
  &nbsp&nbsp
<img alt= "icon" wide="60" height="60" src ="https://symbols.getvecta.com/stencil_89/37_nestjs-icon.a67daec196.svg">
  &nbsp&nbsp

</p>
<p align="center">
<img alt= "icon" wide="60" height="60" src ="https://nesoy.github.io/assets/posts/20170413/1.PNG">
  </p>

## ERD 설계

![](readme-imgs/최종%20ERD.png)

## Data-Flow

![](/readme-imgs/온도의%20dataflow.001.png)

## Data Pipeline

![](/readme-imgs/dataflow.001.png)

## API 설계

- Nest.js
- Code-first build
- graphql build : module - resolver - service (social-login, health-checking => controller)
- TypeORM

## 기능 명세서

[온도衣 기능명세서](https://docs.google.com/spreadsheets/d/1e6NoL06xnfxkcbL8yyFnORKwNP7KJ3nIz8Rm7LORrG4/edit#gid=0)

## 프로젝트 설치 및 실행 방법

```sh
# 설치
gcp kubenetes를 통해 설치

# graphql docs를 참고하여 api endpoint를 통해 프론트로 연결
https://server.t1dreamers.shop/graphql

# 소셜 로그인 endpoint
https://server.t1dreamers.shop/login/naver
https://server.t1dreamers.shop/login/kakao
https://server.t1dreamers.shop/login/google

#업데이트 방법
git add .
gitmoji -c "update this project"
git push origin develop (Cloud-Build CI/CD)

```

## 업데이트 내역

## 폴더 구조

![](/readme-imgs/backend%20dataflow.001.png)

```
🏠 tempClothes project
├─ README.md
├─ backend
│  ├─ README.md
│  ├─ 🌩 cloudBuilds
│  │  ├─ cloudbuild.dev.yaml
│  │  └─ cloudbuild.prod.yaml
│  ├─ 🐳 Dockerfile
│  ├─ 🐳 docker-compose.dev.yaml
│  ├─ 🐳 docker-compose.prod.yaml
│  ├─ 🐳 docker-compose.yaml
│  ├─ 🎒 package.json
│  └─ src
│     ├─ 🍇 apis
│     │  ├─ app : health checker
│     │  ├─ auth : 로그인,로그아웃,소셜로그인 api
│     │  ├─ chat : 채팅 api
│     │  ├─ comment : 댓글, 대댓글 api
│     │  ├─ cron : 크론 탭
│     │  ├─ feed : 피드 api
│     │  ├─ feedImg : 피드 이미지 api
│     │  ├─ feedLike : 피드 좋아요 api
│     │  ├─ feedTag : 피드 태그 api
│     │  ├─ file : 파일 업로드 api
│     │  ├─ iamport : iamport service
│     │  ├─ payment : 결제 api
│     │  ├─ region : 지역 & 날씨 api
│     │  └─ user : 유저 api
│     ├─ 👑 app.module.ts
│     ├─ commons
│     │  ├─ auth : auth strategies & guards
│     │  └─ filter : exception filter
│     └─ main.ts
├─ gitGuideLine.md
└─ static : test htmls
```

## .env 설정

1. kubernetes 환경 변수로 설정
2. 소셜 로그인 keys(naver,google,kakao)
3. gcp storage keys
4. email,sms,IMP keys
5. open weather API key

## 정보

블로그 : [leoKim's velog](https://story0tae.tistory.com/)
<br>
email : leo3179@naver.com

<!-- Markdown link & img dfn's -->
