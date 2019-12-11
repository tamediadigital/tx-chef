![](media/hamburger300x300.png)

# Werdino & Bubenberg Daily

:pizza: :hamburger: 

> The [Werdino daily menu](https://clients.eurest.ch/de/tamediazuerich/menu) and the [Bubenberg daily menu](https://clients.eurest.ch/dzz/de/Bubenberg) in English and German, delivered straight to Slack via AWS Lambda

:trophy:

> _"Werdino and Bubenberg Daily are the most important Slack Integrations of the 21st century"_   
~ Chuck Norris, Inventor of Slack, the Internet and the 21st century

![](media/screenshot.png)

## Serverless

> :bulb: The main Lambda function is found in `handler.js`

> :bulb: All the serverless configs can be found in serverless.yml

### Getting Started

1. Make sure you have the Serverless framework installed globally: `npm install -g serverless`
2. Save two files named `config/config.dev.json` and `config.prod.json` with the following structure:

:bulb: **Note:** You can have more than one webhook assigned for Werdino or Bubenberg, you just need to seperate the multiple webhook addresses with a comma

```
{
    "WERDINO_WEBHOOK_ADDRESSES": "<COMMA_DELIMITED_WEBHOOK_ADDRESSES>",
    "BUBENBERG_WEBHOOK_ADDRESSES": "<COMMA_DELIMITED_WEBHOOK_ADDRESSES>"
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
SLS_DEBUG=* serverless invoke local --function runWerdino
```


