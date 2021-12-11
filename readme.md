> CS-2021 SBT - Security Benchmarking Tool
>
> FAF 192 Y3-S1
>
> Pasecinic Nichita



### **Tech Stack**

- [Electron](https://www.electronjs.org/) - for building cross-platform desktop apps (the app is configured to run in browser too)
- [React with TS](https://react-typescript-cheatsheet.netlify.app/) - for UI ([antd](https://ant.design/) components)
- [Express](https://expressjs.com/) - for our NodeJS api ([multer](https://github.com/expressjs/multer) for file storage, [crypto](https://nodejs.org/api/crypto.html) used for encryption / decryption)
- [PassportJS](http://www.passportjs.org/) - for OAuth authentication (providers Google, GitHub, Twitter)
- [MongoDB](https://docs.mongodb.com/) - application database ([mongoose](https://mongoosejs.com/) odm)
- [Nodemailer](https://nodemailer.com/about/) - sending emails (email confirmation)

----

### **Topics**

* **[1 - Importing  Compliance  Audit  Policies](./tasks/CS_Lab1.pdf)**
* **[2 - Creating  Custom  Audit  Policies](./tasks/CS_Lab2.pdf)**
* **[3 - Auditing  a  Workstation](./tasks/CS_Lab3.pdf)**
* **[4 - Enforcing a Policy](./tasks/CS_Lab4.pdf)**
* **[5 - Enforcing a Policy (cont'd)](./tasks/CS_Lab5.pdf)**
* **[6 - SSO Security](./tasks/CS_Lab6.pdf)**
* **[7 - Database Security](./tasks/CS_Lab7.pdf)**
* **[8 - Email Confirmation](./tasks/CS_Lab8.pdf)**

------

### **Get Started**

```bash
$ # clone the project
$ git clone https://github.com/nichitaa/CS-Labs
$
$ # install dependencies (electron deps)
$ cd app\electron-ts 
$ npm install # or yarn install
$
$ # install dependencies (express api)
$ cd app\express-api
$ npm install 
$
$ # run the app (api should start first)
$ cd app\express-api
$ npm run dev # available on http://localhost:8080
$
$ # run the desktop app
$ cd app\electron-ts
$ npm run dev # will open desktop app
$ # but the app could be open in browser too on: http://loclahost:3000
```

------

### **Environment variables**

The `API` requires several environment variables to be configured in order to run locally on your machine. Please create the `.env` file in the root of the `express API`  (folder:  `\app\express-api` ) with your specific configurations

```
MONGODB_URL= # mongo db connection url

GOOGLE_CLIENT_ID= # google client id
GOOGLE_CLIENT_SECRET= # google client secret

GITHUB_CLIENT_ID= # github client id
GITHUB_CLIENT_SECRET= # github client secret 

TWITTER_CONSUMER_KEY= # twitter api key
TWITTER_CONSUMER_SECRET= # twitter secret key

SMTP_HOST = # e.g. smtp.gmail.com
SMTP_PORT = # defaults to 587
SMTP_FROM_NAME = # emails will be send with this name
SMTP_AUTH_USER = # email will be send from this email address
SMTP_AUTH_PASS = # nodemailer.createTransport password for email provider

```

-----

### **Demos**

##### [1 - Importing  Compliance  Audit  Policies](./tasks/CS_Lab1.pdf)

* Importing an audit file
* Parsing it to a JSON structure and saving it as a mongodb document
* Saving the document on the local server (`uploads` folder)

##### [2 - Creating  Custom  Audit  Policies](./tasks/CS_Lab2.pdf)

* Displaying each policy item in a separate section
* Select / deselect a custom policy item from an audit document
* Search bar for quick search an audit custom item by attribute value
* Select / deselect all custom items in one click
* Create and save and display in the app a new policy with selected custom items under a new name

![recording1](https://github.com/nichitaa/CS-Labs/blob/main/recordings/recording1.gif)



##### [3 - Auditing  a  Workstation](./tasks/CS_Lab3.pdf)

* Perform an audit of the workstation, using the selected custom items
* Display the scan results as icons, where green checkbox is a passed  test, red - failed, yellow is warning this means that the values from  expected are not the same but still is valid the optional  "CAN_NOT_BE_NULL" || "CAN_BE_NULL"

![recording2](https://github.com/nichitaa/CS-Labs/blob/main/recordings/gif3.gif)



##### [4 - Enforcing a Policy](./tasks/CS_Lab4.pdf)

* As a backup system, the application will export all current system  registry key : HKLM, HKCU, HKCR, HKU and HKCC to a folder on desktop  (ex: `regedit-backup1632761699`)
* Apply a single fix (enforce), on a single failed custom item 
* Apply a batch fix over all failed items
* Live results

##### [5 - Enforcing a Policy (cont'd)](./tasks/CS_Lab5.pdf)

* Adding more custom items rule types that can be enforced by the system

![recording4](https://github.com/nichitaa/CS-Labs/blob/main/recordings/lab4.gif)



##### [6 - SSO Security](./tasks/CS_Lab6.pdf)

* Adding user authentication with SSO
* PassportJS (SSO providers are Google, GitHub and Twitter)
* The raw data from `passportjs` is displayed on the UI as a JSON structure

![recording6](https://github.com/nichitaa/CS-Labs/blob/main/recordings/lab6.gif)



**[7 - Database Security](./tasks/CS_Lab7.pdf)**

* Some of the fields (e.g. audit `filename`) is saved as an encrypted value in database (`aes-256-ctr` algorithm)

* The email confirmation token used for user email verification is encrypted as well

* ```json
  "token": {
  	"iv": "7b54d294024a965daed91065f86b83f0",
  	"content": "c84a154d23bf78a6ccc61127c44beb1626880e7c"
  }
  ```

**[8 - Email Confirmation](./tasks/CS_Lab8.pdf)**

* Registered users have the possibility to verify their email address (extracted from SSO providers)
* The verification tokens are encrypted and stored together with a user mapping in a mongodb collection 
* `Nodemailer` is used for sending email via our `express` api
* Token confirmation page is server side rendered
* The electron SBT app will display the current status of the user email verification



# **[Download full app demo ?](https://github.com/nichitaa/CS-Labs/blob/main/recordings/demo.mp4)**
