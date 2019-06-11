import Channel from './Channel';

export interface IWreckedRadio {
  channel(channelName: string): Channel;
}

/**
 * Implements a message bus. Each instance of this class represents a group of channels (topics) and
 * allows you to manage them.
 */
class WreckedRadio implements IWreckedRadio {
  /**
   * A list of already existing channels.
   */
  private channels = new Map();
  /**
   * Returns a channel with provided name that can be used for messaging. If a channel with
   * specified name doesn't exist it will be created.
   * @param channelName Name of a channel you want to get. Should represent a topic of messages that
   * will be passed through it.
   */
  public channel(channelName: string): Channel {
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName);
    }
    const channel = new Channel();
    this.channels.set(channelName, channel);
    return channel;
  }
}

export default WreckedRadio;
