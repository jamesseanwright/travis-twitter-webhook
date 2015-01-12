# Twitter Webhook for Travis CI [[![Build Status](https://travis-ci.org/jamesseanwright/travis-twitter-webhook.svg)](https://travis-ci.org/jamesseanwright/travis-twitter-webhook)](https://travis-ci.org/jamesseanwright/jamesswright.co.uk)

Just a quick project using TDD to post Travis CI Webhook notifications to Twitter.

## Usage
I'll add some instructions when I'm not completely shattered. I've integrated it for my current WIP website, [jamesswright.co.uk](https://github.com/jamesseanwright/jamesswright.co.uk). Check out the `.travis.yml` file in the root of that repo to see how I've integrated it with this. Here's an example tweet:

<blockquote class="twitter-tweet" lang="en"><p>Build 25 of <a href="https://twitter.com/hashtag/jamesswright?src=hash">#jamesswright</a>.co.uk has passed: <a href="https://t.co/JJMujJr6jC">https://t.co/JJMujJr6jC</a></p>&mdash; James Wright (@JamesSWrightWeb) <a href="https://twitter.com/JamesSWrightWeb/status/554441547841024002">January 12, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## Unit Tests
Run `npm i` and then `npm test` as per usual.