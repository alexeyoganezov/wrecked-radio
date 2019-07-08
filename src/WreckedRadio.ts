import Channel from './Channel';

export interface IWreckedRadio {
  channel(channelName: string): Channel;
}

/**
 * The library entry point that manages communication channels.
 *
 * Usage example:
 *
 * ```
 * import WreckedRadio from 'wrecked-radio';
 *
 * const radio = new WreckedRadio();
 * const firstChannel = radio.channel('first-channel');
 * const secondChannel = radio.channel('second-channel');
 * ```
 *
 * See also [[Channel]] class documentation.
 */
class WreckedRadio implements IWreckedRadio {
  /**
   * The list of already existing channels.
   */
  private channels = new Map();
  /**
   * Get a channel with provided name or create a new one if the channel with specified name doesn't
   * exist.
   * @param channelName - Name of the channel you want to get. Should represent a topic of messages
   * that will be passed through it.
   * @returns The channel with provided name that can be used for messaging.
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
