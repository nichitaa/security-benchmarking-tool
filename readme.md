> CS-2021 SBT
>
> FAF 192 Y3-S1
>
> Pasecinic Nichita



Security benchmarking tool made with:

- Electron 
- React - TS ( UI library - antd)
- Express (multer for file storage)
- MongoDB (mongoose odm)

-----------------------------------------

##### [Lab - 1 Importing  Compliance  Audit  Policies](./tasks/CS_lab1.pdf)

##### [Lab - 2 Creating  Custom  Audit  Policies](./tasks/CS_lab2.pdf)

##### [Lab - 3 **Auditing**  a  Workstation](./tasks/CS_lab3.pdf)

****

##### To run it

```bash
create new folder where to clone the project && and open it with cmd

$ git clone https://github.com/nichitaa/CS-Labs
$ # install dependencies
$ cd app\electron-ts 
$ yarn install # or npm install

$ cd app\express-api
$ yarn install # or npm install

$ # create .env file
$ cd app\express-api
$ echo MONGODB_UR > .env

add MONGODB connection string to .env file
(ex: MONGODB_URL=mongodb+srv://<YOUR_DB_USER>:<USER_PASSWORD>@cluster0.ccfyk.mongodb.net/cs-faf?retryWrites=true&w=majority)

$ # run 
$ cd app\express-api
$ yarn dev # npm run dev

$ cd app\electron-ts
$ yarn dev # npm run dev
```



##### Demo

#####  [ lab1 - lab2 ]

![recording1](https://github.com/nichitaa/CS-Labs/blob/main/recordings/recording1.gif)

**[ lab1 - lab2 - lab3 ]**

![recording1](https://github.com/nichitaa/CS-Labs/blob/main/recordings/gif2.gif)
