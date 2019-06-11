# WreckedRadio

[![CircleCI](https://img.shields.io/circleci/build/github/frankendux/wrecked-radio.svg)](https://circleci.com/gh/frankendux/wrecked-radio)
[![Coverage Status](https://img.shields.io/coveralls/github/frankendux/wrecked-radio.svg)](https://coveralls.io/github/frankendux/wrecked-radio)

WreckedRadio is a message bus that implements both [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) and [request-reply](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) patterns:

- It's written with modern TypeScript
- Fully covered with tests
- As tiny as possible
- Dependency free

*Heavily inspired by [backbone.radio](https://github.com/marionettejs/backbone.radio).*

## Getting started

### Installation

`yarn add wrecked-radio`

or

`npm install --save wrecked-radio`

### Instantiating message bus and channels

```javascript
const radio = new WreckedRadio();
const firstChannel = radio.channel('first-channel');
const secondChannel = radio.channel('second-channel');
```

### Event passing

```javascript
// Somewhere in event subscriber:
channel.on('user-login-success', user => console.log(`Oh, hi ${user.name}`);

// Somewhere in event publisher:
channel.trigger('user-login-success', { name: 'Mark' });
```

### Request passing

```javascript
// Somewhere in command processor:
channel.reply('get-greeting', user => `Oh, hi ${user.name}`);

// Somewhere else:
const greeting = channel.request('get-greeting', { name: 'Mark' });
```
