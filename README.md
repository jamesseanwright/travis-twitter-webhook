# Twitter Webhook for Travis CI [[![Build Status](https://travis-ci.org/jamesseanwright/travis-twitter-webhook.svg)](https://travis-ci.org/jamesseanwright/travis-twitter-webhook)](https://travis-ci.org/jamesseanwright/jamesswright.co.uk)
<blockquote class="twitter-tweet" lang="en"><p>Build 25 of <a href="https://twitter.com/hashtag/jamesswright?src=hash">#jamesswright</a>.co.uk has passed: <a href="https://t.co/JJMujJr6jC">https://t.co/JJMujJr6jC</a></p>&mdash; James Wright (@JamesSWrightWeb) <a href="https://twitter.com/JamesSWrightWeb/status/554441547841024002">January 12, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Just a quick webhook project using TDD to tweet Travis CI build notifications.

## Usage
To begin with, [fork](https://github.com/jamesseanwright/travis-twitter-webhook/fork) and clone the repository. You'll want to find a public host, such as [Heroku](https://www.heroku.com/) or [Cloudnode](http://cloudno.de/), if you can't host it yourself.

Run `npm i` to install the required dependencies.

### Setting up Twitter authorization
Before configuring the server, you'll need to create and authorise a new Twitter app:

1. Go to [apps.twitter.com](https://apps.twitter.com) and sign in with the Twitter account from which the tweets will be published
2. Click the *Create New App* button.
3. Complete the form with the appropriate information. For the website, you could list the production website which you're building with Travis
4. Click *Create your Twitter application*
5. To enable the app to receive HTTP POST requests, click the *Permissions* tab, choose *Read and Write*, and click *Update Settings*
6. Click the *Keys and Access Tokens* tab
7. Under the *Your Access Token* header, click *Create my access token*

You should be returned to the *Keys and Access Tokens* tab with the necessary information to tweet via the webhook.

### Configuring the server
The server is configured via these environment variables:

* `WEBHOOK_PORT` - the HTTP port on which the server should run. Defaults to 3000 if unspecified
* `TRAVIS_TOKEN` - the authorization token associated with your Travis CI account. If you're logged in, you can find it [here](https://travis-ci.org/profile/info)
* `CONSUMER_KEY` - the *Consumer Key (API Key)* listed in the *Keys and Access Tokens* of your Twitter app
* `CONSUMER_SECRET` - the *Consumer Secret (API Secret)* listed in the *Keys and Access Tokens* of your Twitter app
* `ACCESS_TOKEN_KEY` - the *Access Token* listed under *Your Access Token* in the *Keys and Access Tokens* of your Twitter app
* `ACCESS_TOKEN_SECRET` - the Access Token Secret* listed under *Your Access Token* in the *Keys and Access Tokens* of your Twitter app

Configure these appropriately. [Here](http://superuser.com/questions/284342/what-are-path-and-other-environment-variables-and-how-can-i-set-or-use-them/284351#284351)'s a good guide to setting environment variables across operating systems. Most modern cloud hosting services will permit you to set these via a CLI or a web interface.

Start the server, either via your host or by running `node server`.

### The final step - configuring the Travis webhook
In your *.travis.yml* file, you can really easily integrate with the webhook:
```
notifications:
  webhooks: http://your-webhook.com/ 
```

There's no additional route to specify as the server's root endpoint handles the requests. You just need to specify the host's URL as above.

Read [this guide](http://docs.travis-ci.com/user/notifications/#Webhook-notification) for more advanced integrations.

You now should be good to go. Whenever you make a new build, it should tweet depending upon your configuration. With the most basic configuration as above, it will tweet on both the success and failure of your build.

## Authorisation
This webhook is compliant with Travis' [authorisation](http://docs.travis-ci.com/user/notifications/#Authorization-for-Webhooks) mechanism, so only a request triggered by Travis for one of your own repositories will be accepted.

## Responses
Although these are ignored by Travis, there are some response bodies to aid with debugging. Error messages are returned with the respective status code and the following body format:
```
{ "error": "some message" }
```
### HTTP 200 - Success
Returned when the tweet was successfully posted, with the following body:
```
{ "result": "success" }
```

### HTTP 400 - Invalid payload
Returned when the required properties in Travis' payload are missing.

### HTTP 401 - Incorrect `TRAVIS_TOKEN`
Returned when the `TRAVIS_TOKEN` env variable is incorrect, or the `Authorization`/`Travis-Repo-Slug` headers are invalid.

### HTTP 500  - Twitter API error
Returned when the POST to Twitter's `statuses/update` endpoint failed. This can occur when the API keys are set incorrectly or when the API has detected a duplicate tweet.

##Contributions
I'd be more than happy to accept contributions to this webhook. Just create an issue or a pull request. Please write tests for your code where possible.

## Unit Tests
Simply run `npm test`.
