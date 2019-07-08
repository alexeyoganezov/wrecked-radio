import WreckedRadio from './WreckedRadio';
import Channel from './Channel';

test('Creates new channel when nonexistent channel name provided', () => {
  const radio = new WreckedRadio();
  const channel = radio.channel('channel');
  expect(channel).toBeInstanceOf(Channel);
});

test('Returns previously created channels when existing channel name provided', () => {
  const radio = new WreckedRadio();
  const channelOne = radio.channel('channel');
  const channelTwo = radio.channel('channel');
  expect(channelOne).toEqual(channelTwo);
});
