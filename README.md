# ๐ค ๋ ์จ ํจ์ ์ปค๋ฎค๋ํฐ, ์จ๋่กฃ

![](./readme-imgs/tempclothes.gif)

## โ๏ธ ํ๋ก์ ํธ ์๊ฐ

ํ ๋ฒ์ฏค ์ผ๊ธฐ ์๋ณด๋ฅผ ๋ณด๊ณ  ์ท์ ์์๋ค๊ฐ ๋ค์ ์ง์ ๋์์จ ์ ๋, ์์ ์ง์ด ๋์ด๋ ์ ๋ ์์ ๊ฒ์๋๋ค.

๋, ์ด๋ค ์ท์ ์์์ง ๊ณ ๋ฏผํ๋๋ผ ๊ฝค ๋ง์ ์๊ฐ์ ์ท์ฅ ์์์ ๋ณด๋ด๊ธฐ๋ ํ์ ๊ฒ์๋๋ค.

๊ธฐ์์ฒญ์ด๋ ์ดํ์์ ์ ํด์ฃผ๋ ์ซ์ ๋ฐ์ดํฐ๋ง์ผ๋ก๋ ๋ ์จ์ ๋ง๋ ์ท์ ์๊ธฐ ์ด๋ ค์์ก์ต๋๋ค.

์จ๋่กฃ๋ ๊ทธ๋ฐ ๋น์ ์ ๊ณ ๋ฏผ์ ๋์ด์ฃผ๊ธฐ ์ํด ํ์ด๋ฌ์ต๋๋ค.

---

## ๐ ๋ชฉ์ฐจ

- [๐ค ๋ ์จ ํจ์ ์ปค๋ฎค๋ํฐ, ์จ๋่กฃ](#-๋ ์จ-ํจ์-์ปค๋ฎค๋ํฐ-์จ๋่กฃ)
  - [โ๏ธ ํ๋ก์ ํธ ์๊ฐ](#๏ธ-ํ๋ก์ ํธ-์๊ฐ)
  - [๐ ๋ชฉ์ฐจ](#-๋ชฉ์ฐจ)
  - [๐ ํ๋ก์ ํธ ์คํ ๋ฐ ํ์คํธ](#-ํ๋ก์ ํธ-์คํ-๋ฐ-ํ์คํธ)
  - [๐ฉ ํ๋ก์ ํธ ์์ธ ๋ฐ ๊ธฐ์  ๋ฐํ](#-ํ๋ก์ ํธ-์์ธ-๋ฐ-๊ธฐ์ -๋ฐํ)
  - [๐น ์๋ฒ,DB ์ค๊ณ](#-์๋ฒdb-์ค๊ณ)
  - [๐ป ๊ธฐ์  ์คํ](#-๊ธฐ์ -์คํ)
  - [๐พ ERD ์ค๊ณ](#-erd-์ค๊ณ)
  - [๐ Data-Flow](#-data-flow)
  - [๐  Data Pipeline](#-data-pipeline)
  - [๐ ๊ธฐ๋ฅ ๋ช์ธ์](#-๊ธฐ๋ฅ-๋ช์ธ์)
  - [๐ ํด๋ ๊ตฌ์กฐ](#-ํด๋-๊ตฌ์กฐ)
  - [๐ ENV](#-env)
  - [๐งโ๐ป ํ์](#-ํ์)
    - [๊ณ ์ฌํ](#๊ณ ์ฌํ)
    - [๊นํ์](#๊นํ์)

---

## ๐ ํ๋ก์ ํธ ์คํ ๋ฐ ํ์คํธ

- local์์ ํ์คํธ ๐ก

- ์คํ ๋ช๋ น์ด

```
git clone https://github.com/leokim1178/camp-tempClothes
cd backend
# .env ์ถ๊ฐ
docker compose build
docker compose up
```

- graphql์์ ํ์คํธํ๊ธฐ
  - http://localhost:3000/graphql

---

## ๐ฉ ํ๋ก์ ํธ ์์ธ ๋ฐ ๊ธฐ์  ๋ฐํ

- ํ๋ก์ ํธ ์์ธ :
  - https://leo3179.notion.site/7a84562be1bf4809a1d5b825ca1d8ab8
- ๊ธฐ์  ๋ฐํ :
  - https://www.youtube.com/watch?v=K2kqhS9XQbc

---

## ๐น ์๋ฒ,DB ์ค๊ณ

- [API ๋ชฉ๋ก](./readme-imgs/api์ต์ข.png)
- Nest.js
- Code-first build
- graphql build : module - resolver - service (social-login, health-checking => controller)
- TypeORM

---

## ๐ป ๊ธฐ์  ์คํ

<div align="center">
๐&nbsp&nbsp&nbsp๊ตฌ์ฑ ์ธ์ด
<br>
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
  <img src="https://img.shields.io/badge/typescript-02569B?style=for-the-badge&logo=typescript&logoColor=white"> 
  </div>

<div align="center">
  ๐  &nbsp&nbsp ์๋ฒ
  <br>
  <img src="https://img.shields.io/badge/nestjs-D33A3F?style=for-the-badge&logo=nestjs&logoColor=white">
  <img src="https://img.shields.io/badge/docker-3c90e5?style=for-the-badge&logo=docker&logoColor=white"> 
  <img src="https://img.shields.io/badge/graphql-C74199?style=for-the-badge&logo=graphql&logoColor=white">
  </div>

   <div align="center">
๐&nbsp&nbsp&nbsp ๋ฐฐํฌ
<br>
  <img src="https://img.shields.io/badge/kubernetes-396EDC?style=for-the-badge&logo=kubernetes&logoColor=white">
    <img src="https://img.shields.io/badge/gcp-d44a33?style=for-the-badge&logo=googlecloud&logoColor=yellow">
  </div>

 <div align="center">
๐พ&nbsp&nbsp&nbsp ๋ฐ์ดํฐ
<br>
  <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/redis-c03b28?style=for-the-badge&logo=redis&logoColor=white"> 
  </div>

 <div align="center">
๐&nbsp&nbsp&nbsp ์ฑํ
<br>
  <img src="https://img.shields.io/badge/socket.io-ffffff?style=for-the-badge&logo=socket.io&logoColor=black">
<br>
</div>

---

## [๐พ ERD ์ค๊ณ](readme-imgs/%EC%98%A8%EB%8F%84%EC%9D%98%20ERD.png)

---

## [๐ Data-Flow](./readme-imgs/%EC%98%A8%EB%8F%84%EC%9D%98%20dataflow.001.png)

---

## [๐  Data Pipeline](./readme-imgs/dataflow.001.png)

---

## ๐ ๊ธฐ๋ฅ ๋ช์ธ์

[์จ๋่กฃ ๊ธฐ๋ฅ๋ช์ธ์](https://docs.google.com/spreadsheets/d/1e6NoL06xnfxkcbL8yyFnORKwNP7KJ3nIz8Rm7LORrG4/edit#gid=0)

---

## ๐ ํด๋ ๊ตฌ์กฐ

```
๐  tempClothes project
โโ README.md
โโ backend
โ  โโ README.md
โ  โโ ๐ฉ cloudBuilds
โ  โ  โโ cloudbuild.dev.yaml
โ  โ  โโ cloudbuild.prod.yaml
โ  โโ ๐ณ Dockerfile
โ  โโ ๐ณ docker-compose.dev.yaml
โ  โโ ๐ณ docker-compose.prod.yaml
โ  โโ ๐ณ docker-compose.yaml
โ  โโ ๐ package.json
โ  โโ src
โ     โโ ๐ apis
โ     โ  โโ app : health checker
โ     โ  โโ auth : ๋ก๊ทธ์ธ,๋ก๊ทธ์์,์์๋ก๊ทธ์ธ api
โ     โ  โโ chat : ์ฑํ api
โ     โ  โโ comment : ๋๊ธ, ๋๋๊ธ api
โ     โ  โโ cron : ํฌ๋ก  ํญ
โ     โ  โโ feed : ํผ๋ api
โ     โ  โโ feedImg : ํผ๋ ์ด๋ฏธ์ง api
โ     โ  โโ feedLike : ํผ๋ ์ข์์ api
โ     โ  โโ feedTag : ํผ๋ ํ๊ทธ api
โ     โ  โโ file : ํ์ผ ์๋ก๋ api
โ     โ  โโ iamport : iamport service
โ     โ  โโ payment : ๊ฒฐ์  api
โ     โ  โโ region : ์ง์ญ & ๋ ์จ api
โ     โ  โโ user : ์ ์  api
โ     โโ ๐ app.module.ts
โ     โโ commons
โ     โ  โโ auth : auth strategies & guards
โ     โ  โโ filter : exception filter
โ     โโ main.ts
โโ gitGuideLine.md
โโ static : test htmls
```

<hr>
</hr>

## ๐ ENV

```
ACCESS_TOKEN_KEY=
REFRESH_TOKEN_KEY=

IMP_KEY=
IMP_SECRET=

STORAGE_BUCKET=
STORAGE_KEY_FILENAME
STORAGE_PROJECT_ID=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=

OPEN_WEATHER_APP_ID=

SMS_APP_KEY=
SMS_X_SECRET_KEY=
SMS_SENDER=

EMAIL_APP_KEY=
EMAIL_X_SECRET_KEY=
EMAIL_SENDER=

DATABASE_HOST=
DATABASE_NAME=
REDIS_URL=
```

---

## ๐งโ๐ป ํ์

### ๊ณ ์ฌํ

- Role : `Team Member`
- Position : `Backend`, `Presenter`
- Stack : `JavaScript` `TypeScript` `Nodejs` `Nestjs` `TypeORM` `Axios` `Docker` `Redis` `gitHub` `MySQL`
- Works : User CRUD, ๊ฒฐ์ ๊ธฐ๋ฅ, ๋ก๊ทธ์ธ/๋ก๊ทธ์์, ์ค์๊ฐ์ฑํ, ๋๊ธ/๋๋๊ธ ๊ตฌํ, ERD์ค๊ณ
- Contact :
  - email: jaehyeong1586@gmail.com
  - github: [https://github.com/KoJaeHyeong](https://github.com/KoJaeHyeong)
  - blog: [https://velog.io/@ko1586](https://velog.io/@ko1586)

<hr>
</hr>

### ๊นํ์

- Role : `Team Member`
- Position : `Backend`, `Git`
- Stack : `JavaScript` , `TypeScript`, `TypeORM`, `Nodejs`, `Nestjs`, `MySQL`, `Axios`, `expressjs`, `Docker`, `Redis`, `Kubernetes`, `GCP`, `Github`
- Works : Feed CRUD, Feed ์ข์์ CRU, Feed ํ๊ทธ CRU, Feed ์ด๋ฏธ์ง CRUD, File Upload, CronTab, Region&Weather apis, K8s ์๋ฒ ๋ฐฐํฌ, ์๋ฃ ์ ์

- Contact :

  - email: leo3179@naver.com
  - github: [https://github.com/leokim1178](https://github.com/leokim1178)
  - blog: https://story0tae.tistory.com/

- Tech-Presentation : https://www.youtube.com/watch?v=K2kqhS9XQbc

---

<!-- Markdown link & img dfn's -->
