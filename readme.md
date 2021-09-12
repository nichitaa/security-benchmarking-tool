> CS-2021
>
> FAF 192 Y3-S1
>
> Pasecinic Nichita



#### Lab-1 (06-09-2021)

Desktop app made with:

- Electron 
- React - TS ( UI library - antd)
- Express (multer for file storage)
- MongoDB (mongoose odm)

##### To run this project

```bash
create new folder where to clone the project && and open it with cmd

$ git clone .
$ cd lab-1\electron-ts 
$ yarn install ( or npm i )

$ cd lab-1\express-api
$ yarn install ( or npm i )

create .env file
$ cd lab-1\express-api
$ echo MONGODB_UR > .env
add MONGODB connection string to .env file
(ex: MONGODB_URL=mongodb+srv://<YOUR_DB_USER>:<USER_PASSWORD>@cluster0.ccfyk.mongodb.net/cs-faf?retryWrites=true&w=majority)

run application
$ cd lab-1\express-api
$ yarn dev ( or npm run dev )

$ cd lab-1\electron-ts
$ yarn dev ( or npm run dev )
```



##### app recordings:

![recording1](https://github.com/nichitaa/CS-Labs/blob/main/recordings/recording1.gif)
