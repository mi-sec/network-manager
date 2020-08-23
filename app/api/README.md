# template-api

Template Node.js Express API

- [getting started](#getting-started)
    - [cloning and setup](#cloning-and-setup)
    - [development startup](#development-startup)
	- [api testing](#api-testing)
	- [starting for production](#starting-for-production)
- [auxiliary](#auxiliary)
- [CHANGELOG](#changelog)

<hr/>

### [getting started](#top)

the following applications are required to run in `production`:
- [Node.js](https://nodejs.org/en/download/) (recommended: `v12.18.3`)
- [PM2](https://github.com/Unitech/pm2/releases/) (recommended: `v4.4.0`)

##### [cloning and setup](#top)

```
# clone full-stack template
git clone git@github.com:mi-sec/template-api.git
cd template-api/
```

##### [development startup](#top)

```
npm i
npm start
```

##### [api testing](#top)

```
npm i
npm test
```

##### [starting for production](#top)

```
pm2 start ecosystem.config.js --env production
```

api will be accessible at `http://localhost/api/` by default

### [auxiliary](#top)

**API testing**:

For testing API things, import the Postman collection in the `api` folder.
Environment should be set for:

- PROTOCOL: `http`
- HOSTNAME: `localhost`
- PORT: `80`
- PATH: `/api`


### [CHANGELOG](#top)

**v1.0.0**
- initial release
