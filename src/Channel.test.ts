import Channel from './Channel';

test('Registers event handlers and calls them properly', () => {
  const channel = new Channel();
  const eventHandler = jest.fn();
  channel.on('test-event', eventHandler);
  channel.trigger('test-event', { foo: 'bar' });
  expect(eventHandler.mock.calls.length).toBe(1);
  expect(eventHandler.mock.calls[0][0]).toEqual({
    foo: 'bar',
  });
});

test('Does not broadcast events', () => {
  const channel = new Channel();
  const eventHandlerOne = jest.fn();
  const eventHandlerTwo = jest.fn();
  channel.on('test-event-1', eventHandlerOne);
  channel.on('test-event-2', eventHandlerTwo);
  channel.trigger('test-event-1', {});
  expect(eventHandlerOne.mock.calls.length).toBe(1);
  expect(eventHandlerTwo.mock.calls.length).toBe(0);
});

test('Correctly unregisters event handlers', () => {
  const channel = new Channel();
  const eventHandler = jest.fn();
  const unsubscribe = channel.on('test-event', eventHandler);
  channel.trigger('test-event', {});
  unsubscribe();
  channel.trigger('test-event', {});
  expect(eventHandler.mock.calls.length).toBe(1);
});

test('Does not throw an error when trying to trigger an event that nobody listens', () => {
  const channel = new Channel();
  channel.trigger('nonexistent-event');
});

test('Registers request handlers and calls them properly', () => {
  const channel = new Channel();
  const requestHandler = jest.fn(payload => payload.number + 1);
  channel.reply('get-increased-number', requestHandler);
  const result = channel.request('get-increased-number', { number: 1 });
  expect(result).toBe(2);
});

test('Correctly unregister request handlers', () => {
  const channel = new Channel();
  const requestHandler = jest.fn(payload => payload.number + 1);
  channel.reply('get-increased-number', requestHandler);
  const firstResult = channel.request('get-increased-number', { number: 1 });
  expect(firstResult).toBe(2);
  channel.stopReplying('get-increased-number');
  expect(() => channel.request('get-increased-number', { number: 1 }))
    .toThrow(/^WreckedRadio:/);
});

test('Does not throw an error when trying to unregister a handler for nonexistent requests', () => {
  const channel = new Channel();
  channel.stopReplying('nonexistent-request');
});
