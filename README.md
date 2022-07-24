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

---

## 프로젝트 명세 및 기술 발표
- 프로젝트 명세 :
  - https://leo3179.notion.site/7a84562be1bf4809a1d5b825ca1d8ab8
- 기술 발표 :
  - https://www.youtube.com/watch?v=K2kqhS9XQbc

<br>

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
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/graphql-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/docker-icon.svg">
  &nbsp&nbsp
<img alt= "icon" wide="60" height="60" src ="https://symbols.getvecta.com/stencil_89/37_nestjs-icon.a67daec196.svg">
  &nbsp&nbsp
  <img alt= "icon" wide="60" height="60" src ="https://images.velog.io/images/dunde/post/51c56207-0c4b-4bd7-a223-6437ee7586f1/1_9hwcv7fEVKEw5LyWFok-lA.jpg">
  &nbsp&nbsp

</p>


  <hr>
</hr>

## ERD 설계

![](readme-imgs/%EC%98%A8%EB%8F%84%EC%9D%98%20ERD.png)

<hr>
</hr>

## Data-Flow

![](/readme-imgs/온도의%20dataflow.001.png)

<hr>
</hr>

## Data Pipeline

![](/readme-imgs/dataflow.001.png)

## API 설계

- Nest.js
- Code-first build
- graphql build : module - resolver - service (social-login, health-checking => controller)
- TypeORM

<hr>
</hr>

## 기능 명세서

[온도衣 기능명세서](https://docs.google.com/spreadsheets/d/1e6NoL06xnfxkcbL8yyFnORKwNP7KJ3nIz8Rm7LORrG4/edit#gid=0)

<hr>
</hr>

## 폴더 구조

![](/readme-imgs/api최종.png)

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

<hr>
</hr>

## .env 설정

1. kubernetes 환경 변수로 설정
2. 소셜 로그인 keys(naver,google,kakao)
3. gcp storage keys
4. email,sms,IMP keys
5. open weather API key

<hr>
</hr>

<br>

# Information

## 고재형

- Role : `Team Member`
- Position : `Backend`, `Presenter`
- Stack : `JavaScript` `TypeScript` `Nodejs` `Nestjs` `TypeORM` `Axios` `Docker` `Redis` `gitHub` `MySQL`
- Works : User CRUD, 결제기능, 로그인/로그아웃, 실시간채팅, 댓글/대댓글 구현, ERD설계
- Contact :
  - email: jaehyeong1586@gmail.com
  - github: [https://github.com/KoJaeHyeong](https://github.com/KoJaeHyeong)
  - blog: [https://velog.io/@ko1586](https://velog.io/@ko1586)

<hr>
</hr>

## 김태영

- Role : `Team Member`
- Position : `Backend`, `Git`
- Stack : `JavaScript` , `TypeScript`, `TypeORM`, `Nodejs`, `Nestjs`, `MySQL`, `Axios`, `expressjs`, `Docker`, `Redis`, `Kubernetes`, `GCP`, `Github`
- Works : Feed CRUD, Feed 좋아요 CRU, Feed 태그 CRU, Feed 이미지 CRUD, File Upload, CronTab, Region&Weather apis, K8s 서버 배포, 자료 제작

- Contact :

  - email: leo3179@naver.com
  - github: [https://github.com/leokim1178](https://github.com/leokim1178)
  - blog: https://story0tae.tistory.com/

- Tech-Presentation : https://www.youtube.com/watch?v=K2kqhS9XQbc

<hr>
</hr>
<!-- Markdown link & img dfn's -->
