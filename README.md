# WreckedRadio

[![CircleCI](https://img.shields.io/circleci/build/github/alexeyoganezov/wrecked-radio.svg)](https://circleci.com/gh/frankendux/wrecked-radio)
[![Coverage Status](https://img.shields.io/coveralls/github/alexeyoganezov/wrecked-radio.svg)](https://coveralls.io/github/frankendux/wrecked-radio)

WreckedRadio is a message bus implementation that supports both [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) and [request-reply](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) patterns.

- Written in modern TypeScript
- Fully covered with tests
- As tiny as possible
- Dependency free

*Heavily inspired by [backbone.radio](https://github.com/marionettejs/backbone.radio).*

## Getting started

### Installation

`yarn add wrecked-radio`

or

`npm install --save wrecked-radio`

### Import and instantiation

```javascript
import WreckedRadio from 'wrecked-radio';

const radio = new WreckedRadio();
const firstChannel = radio.channel('first-channel');
const secondChannel = radio.channel('second-channel');
```

### Event passing

```javascript
// Add event handler
channel.on('user-login-success', user => console.log(`Oh, hi ${user.name}`));

// Trigger an event
channel.trigger('user-login-success', { name: 'Mark' });

// Add and remove event handler
const unsubscribe = channel.on('user-login-success', () => null);
unsubscribe();
```

### Request passing

```javascript
// Add request handler
channel.reply('get-greeting', user => `Oh, hi ${user.name}`);

// Make a request
const greeting = channel.request('get-greeting', { name: 'Mark' });

// Remove request handler
channel.stopReplying('get-greeting');
```

## Links

[Detailed API Reference](https://23-160222506-gh.circle-artifacts.com/0/home/circleci/repo/docs/index.html)

## Licensing

[MIT License](https://github.com/frankendux/wrecked-radio/blob/master/LICENSE)
