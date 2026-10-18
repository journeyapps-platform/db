# Journey DB

Journey database SDK and supporting workspace packages. Customers use `@ja-platform/db`.

## Workspace layout

- `packages/db`: database SDK (`@ja-platform/db`)
- `packages/day`: date values (`@ja-platform/day`)
- `packages/evaluator`: expression evaluation
- `packages/parser-common`: shared parser functionality
- `packages/parser-schema`: schema parsing
- `packages/types`: shared types

The legacy `journeyapps` wrapper has been removed. Import SDK exports such as `Database`, `OnlineDB`, and `Day` directly from `@ja-platform/db`.

## Simple DB Usage

1. Get the module from yarn

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

Use Node 24 for development (`nvm install && nvm use`). The DB, evaluator, and parser packages require Node `^22.18.0 || >=24.11.0` because they depend on Babel 8.

CI runs the same `pnpm test` suite, including browser tests, on Node 22, 24, and 26 using a GitHub Actions matrix.

1. clone and run `pnpm install` in the repository root
2. run `pnpm build` to build.
3. run `pnpm test` to run all the unit tests.
