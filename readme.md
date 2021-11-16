> CS-2021 SBT
>
> FAF 192 Y3-S1
>
> Pasecinic Nichita



Security benchmarking tool made with:

- Electron 
- React - TS ( UI library - antd)
- Express (multer for file storage)
- PassportJS (for OAuth authentication - Google, GitHub, Twitter)
- MongoDB (mongoose odm)

-----------------------------------------

##### [1 - Importing  Compliance  Audit  Policies](./tasks/CS_Lab1.pdf)

##### [2 - Creating  Custom  Audit  Policies](./tasks/CS_Lab2.pdf)

##### [3 - Auditing  a  Workstation](./tasks/CS_Lab3.pdf)

##### [4 - Enforcing a Policy](./tasks/CS_Lab4.pdf)

##### [5 - Enforcing a Policy (cont'd)](./tasks/CS_Lab5.pdf)

##### [6 - SSO Security](./tasks/CS_Lab6.pdf)

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

$ # create .env file in direcotry app\express-api
$ # the following keys must be added
$ # MONGODB_URL=YOUR_MONGO_DB_URL
$ # GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
$ # GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
$ # GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
$ # GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
$ # TWITTER_CONSUMER_KEY=YOUR_TWITTER_CONSUMER_KEY
$ # TWITTER_CONSUMER_SECRET=YOUR_TWITTER_CONSUMER_SECRET

$ # run the app
$ cd app\express-api
$ npm run dev # yarn dev (on: http://localhost:8080)

$ cd app\electron-ts
$ npm run dev # yarn dev (on: http://loclahost:3000)
```



##### Demo

#####  [ lab1 - lab2 ]

![recording1](https://github.com/nichitaa/CS-Labs/blob/main/recordings/recording1.gif)

**[ lab1 - lab2 - lab3 ]**

Scan result are represented as icons, where green checkbox is a passed test, red - failed, yellow is warning this means that the values from expected are not the same but still is valid the optional "CAN_NOT_BE_NULL" || "CAN_BE_NULL"

![recording2](https://github.com/nichitaa/CS-Labs/blob/main/recordings/gif3.gif)

**[ lab 4 - lab5 ]**

As a backup system, the application will export all current system registry key : HKLM, HKCU, HKCR, HKU and HKCC to a folder on desktop (ex: `regedit-backup1632761699`). In case something is wrong with the process, user can always rollback to the previous registry keys and import those files by opening them. The user can apply a single fix on just a single item from list and immediately see the scan result for it and once the toggle switch "select all failed items" is true, then the user can run a batch fix for all of the failed items, as well live results are immediately displayed 

![recording4](https://github.com/nichitaa/CS-Labs/blob/main/recordings/lab4.gif)

**[ lab 6 ]**

Added OAuth authentication, the providers are Google, Twitter and GitHub. The raw `passportjs` provided user data can be directly view on main screen

![recording6](https://github.com/nichitaa/CS-Labs/blob/main/recordings/lab6.gif)

#### [ ***Video - Full app demo!*** ](./recordings/fulldemo.mp4)
