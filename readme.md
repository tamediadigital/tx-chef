![](media/hamburger300x300.png)

# TX Chef

:pizza: :hamburger: 

> The Daily menus for [Werdino](https://clients.eurest.ch/de/tamediazuerich/menu), [Bubenberg](https://clients.eurest.ch/dzz/de/Bubenberg), [Bern Zentweg](https://www.eurest.ch/dzb), [Bussigny](https://www.eurest.ch/cil), [Le Scoop](https://www.eurest.ch/tamedia-lausanne) and [BKW Atrium](https://bkw-bern.sv-restaurant.ch/de/menuplan) translated to English and delivered straight to Slack via AWS Lambda


:trophy:

> _"TX Chef is the most important Slack Integration of the 21st century"_   
~ Chuck Norris, Inventor of Slack, the Internet and the 21st century

![](media/screenshot.png)

## Serverless

> :bulb: The main Lambda function is found in `handler.js`

> :bulb: All the serverless configs can be found in serverless.yml

### Getting Started

1. Make sure you have the Serverless framework installed globally: `npm install -g serverless`
2. You should have an AWS profile named `tamedia` with the appropriate permissions to create lambdas via the serverless framework (and use AWS Translate)
```
  serverless config credentials --provider aws --key <KEY> --secret <SECRET> --profile tamedia
```
3. Save two files named `config/config.dev.json` and `config.prod.json` with the following structure:

:bulb: **Note:** You can have more than one webhook assigned, you just need to seperate the multiple webhook addresses with a comma

```
{
  "WERDINO_WEBHOOK_ADDRESSES": "https://hooks.slack.com/services/...",
  "BUBENBERG_WEBHOOK_ADDRESSES": "https://hooks.slack.com/services/...",
  "BERN_ZENTWEG_WEBHOOK_ADDRESSES": "https://hooks.slack.com/services/...",
	"BUSSIGNY_WEBHOOK_ADDRESSES": "https://hooks.slack.com/services/...",
	"LE_SCOOP_WEBHOOK_ADDRESSES": "https://hooks.slack.com/services/...",
	"BKW_ATRIUM_WEBHOOK_ADDRESSES": "https://hooks.slack.com/services/..."
}
```

### Deploy to AWS Lambda

Serverless will do a lot of magic with the `deploy` command, including wrapping your function in a `.zip` directory and uploading to S3 (and uploaded to AWS Lambda), configuring CloudWatch, configuring IAM, etc:

```
$ serverless deploy --stage dev
$ serverless deploy --stage prod
```

### Reading the Logs

```
$ serverless logs --function runWerdino --tail
```

### Deploy the Function Locally for Testing

:bulb: Running locally will apply the `dev` stage by default
```
SLS_DEBUG=* serverless invoke local --function runWerdino --stage dev
```


