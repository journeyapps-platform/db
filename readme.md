# JourneyApps Platform Lib

The JourneyApps Platform database SDK, published as `@ja-platform/db`.

## Simple DB Usage

1. Install the database SDK with pnpm

    `pnpm add @ja-platform/db`

2. import the helper DB (my_script.js)

    ```javascript
    const { Database } = require("@ja-platform/db");
    async function run() {
        const db = await Database.instance({ baseUrl: 'http://test.test/api/v4/testaccount', token: process.env.API_TOKEN });

        // use the api as per documentation (https://docs.journeyapps.com/docs/app-database#section-usage)
        let user = await db.user.first();
        console.log(user.name);
    }
    run();
    ```

3. run the program via `node`

    `API_TOKEN=<some_token> node my_script.js`

## Code Installation

Use Node 24 for development (`nvm install && nvm use`). The database SDK requires Node `^22.19.0 || ^24.11.0 || >=26.0.0` because its parser dependencies use Babel 8.

CI runs `pnpm test` using the Node version in `.nvmrc`.

1. clone and run `pnpm install` in the repository root
2. run `pnpm build` to build.
3. run `pnpm test` to run all the unit tests.
