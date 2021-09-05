> CS-2021
>
> FAF 192 Y3-S1
>
> Pasecinic Nichita



#### Lab-1 (06-09-2021)

Desktop app made with:

- Electron 
- React ( UI library - antd)
- TypeScript
- Electron-Forge / Webpack
- Express
- MongoDB (mongoose odm)

`to run application localy:`

`1. clone rep (git clone)`

`2. cd lab1\electron-app and run yarn install (or use npm install)`

`3. cd lab1\express-api and run yarn install`

`4. create .env file in folder lab1\express-api`

`5. create new mongodb cluster and add new database (cs-faf)  `

`5. create new env variable in .env file (mongodb connection string): MONGODB_URL=mongodb+srv://<YOUR_DB_USER>:<USER_PASSWORD>@cluster0.ccfyk.mongodb.net/cs-faf?retryWrites=true&w=majority`

`6. cd lab1\express-api and run yarn dev (will start a dev server on 8080)`

`7. cd lab1\electron-app and run yarn start (electron-forge will start the electron application in dev mode)`



