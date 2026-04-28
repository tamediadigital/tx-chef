

# TX Chef

 :pizza: :hamburger: 

> The Daily menus for [Werdino](https://clients.eurest.ch/de/tamediazuerich/menu), [Le Scoop](https://www.eurest.ch/tamedia-lausanne), and [Bubenberg](https://clients.eurest.ch/dzz/de/Bubenberg) translated to English and delivered straight to Slack via AWS Lambda

:trophy:

> *"TX Chef is the most important Slack Integration of the 21st century"*  
> ~ Chuck Norris, Inventor of Slack, the Internet and the 21st century



## Serverless

> :bulb: The main Lambda function is found in `handler.js`

> :bulb: All the serverless configs can be found in serverless.yml

### Getting Started

1. Make sure you have the Serverless framework installed globally: `npm install -g serverless`
2. You should have an AWS profile named `tamedia` with the appropriate permissions to create lambdas via the serverless framework (and use AWS Translate)

```
  serverless config credentials --provider aws --key <KEY> --secret <SECRET> --profile tamedia
```

1. Save two files named `.env.dev` (for `--stage dev`) and `.env.prod` (for `--stage prod`) in the project root. Serverless loads `.env.<stage>` first when `useDotenv: true` (see `serverless.yml`); if that file is missing, it falls back to `.env`.

:bulb: **Note:** You can assign more than one webhook per variable by separating the URLs with **commas** (no spaces).

```
WERDINO_TAMEDIA_WEBHOOK_ADDRESS=https://hooks.slack.com/services/...
LE_SCOOP_WEBHOOK_ADDRESS=https://hooks.slack.com/services/...
BUBENBERG_WEBHOOK_ADDRESS=https://hooks.slack.com/services/...
```

### Deploy to AWS Lambda

Serverless will do a lot of magic with the `deploy` command, including wrapping your function in a `.zip` directory and uploading to S3 (and uploaded to AWS Lambda), configuring CloudWatch, configuring IAM, etc:

```
$ npx serverless deploy --stage dev
$ npx serverless deploy --stage prod
```

### Reading the Logs

```
$ npx serverless logs --function run --tail
```

### Deploy the Function Locally for Testing

:bulb: Running locally will apply the `dev` stage by default

```
ENVIRONMENT=local SLS_DEBUG=* npx serverless invoke local --function run --stage dev
```

### Debugging

It is sometimes easier to test the full flow with fixture data instead of trying to use the real thing (like if you are trying to troubleshoot problems on a weekend, and the menu pages don't have valid menu data to test with). For this, you can use the following environment variables when you are deploying the function locally:

- `DEBUG_EUREST` uses `__test__/fixtures/werdino.html` instead of scraping the real Eurest (Werdino-style) page (`helpers/eurest.js`).
- `DEBUG_ATRIUM` uses `__test__/fixtures/bkw-atrium.html` instead of scraping the real Atrium / BKW page (`helpers/bkw-atrium.js`).

