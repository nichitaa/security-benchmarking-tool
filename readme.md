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

##### [Lab - 1 Importing  Compliance  Audit  Policies](./tasks/CS_Lab1.pdf)

##### [Lab - 2 Creating  Custom  Audit  Policies](./tasks/CS_Lab2.pdf)

##### [Lab - 3 **Auditing**  a  Workstation](./tasks/CS_Lab3.pdf)

#### [Lab 4 - 5: Enforcing multiple audit policies](./tasks/CS_Lab4.pdf)

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

Scan result are represented as icons, where green checkbox is a passed test, red - failed, yellow is warning this means that the values from expected are not the same but still is valid the optional "CAN_NOT_BE_NULL" || "CAN_BE_NULL"

![recording2](https://github.com/nichitaa/CS-Labs/blob/main/recordings/gif3.gif)

**[ lab 4 - 5 ]**

As a backup system, the application will export all current system registry key : HKLM, HKCU, HKCR, HKU and HKCC to a folder on desktop (ex: `regedit-backup1632761699`). In case something is wrong with the process, user can always rollback to the previous registry keys and import those files by opening them. The user can apply a single fix on just a single item from list and immediately see the scan result for it and once the toggle switch "select all failed items" is true, then the user can run a batch fix for all of the failed items, as well live results are immediately displayed 

![recording4](https://github.com/nichitaa/CS-Labs/blob/main/recordings/lab4.gif)


#### [ Video ](./recordings/screerecording.mp4)
