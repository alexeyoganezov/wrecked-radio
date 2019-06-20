/**
 * Implements communication channel used by [[WreckedRadio]].
 *
 * Under usual circumstances this module's content **shouldn't be used directly**. Consider using
 * [[WreckedRadio]] class instead.
 *
 * For more information check out [[Channel]] class documentation.
 */

/**
 * Shape of functions that handle events.
 * @param payload - Arbitrary data passed with the event.
 * @returns Returned value is completely ignored by the library and can be used only for testing
 * purposes.
 */
interface IEventHandler {
  (payload?: any): any;
}

/**
 * Shape of functions, that handle requests.
 * @param payload - Arbitrary data passed with the request.
 * @returns Response data that will be passed back to the requester.
 */
interface IRequestHandler {
  (payload?: any): any;
}

/**
 * Shape of the list of registered event handlers. Keys are event names and values are arrays of
 * event handlers.
 *
 * Implemented in [[Channel.events]].
 */
interface IEventHandlerContainer {
  [key: string]: IEventHandler[];
}

/**
 * Shape of the list of registered request handlers. Keys are request names and values are request
 * handlers.
 *
 * Implemented in [[Channel.requests]].
 */
interface IRequestHandlerContainer {
  [key: string]: IRequestHandler;
}

/**
 * Shape of functions that unregister event handler.
 *
 * Implemented in [[Channel.on]].
 */
interface IUnsubscribe {
  (): void;
}

/**
 * This class implements a communication channel that can be used for message passing (both events
 * and requests).
 *
 * For channel instantiation you should use WreckedRadio class since it allows you to manage them
 * more easily.
 *
 * ```
 * import WreckedRadio from 'wrecked-radio';
 * const radio = new WreckedRadio();
 * const channel = radio.channel('my-channel-name');
 * ```
 *
 * When you just want to notify external systems about an event you should use "on" and "trigger"
 * methods:
 *
 * ```
 * // Somewhere in event subscriber:
 * channel.on('user-login-success', user => console.log(`Oh, hi ${user.name}`);
 *
 * // Somewhere in event publisher:
 * channel.trigger('user-login-success', { name: 'Mark' });
 * ```
 *
 * In case you want to send a command to some external system and get some data back you should use
 * "request" and "reply" methods:
 *
 * ```
 * // Somewhere in command processor:
 * channel.reply('get-greeting', user => `Oh, hi ${user.name}`);
 *
 * // Somewhere else:
 * const greeting = channel.request('get-greeting', { name: 'Mark' });
 * ```
 */
class Channel {
  /**
   * The list of registered event handlers.
   */
  private readonly events: IEventHandlerContainer = {};
  /**
   * The list of registered request handlers.
   */
  private readonly requests: IRequestHandlerContainer = {};
  /**
   * Send a request to the channel.
   * @param requestName - Name of the request you want to make.
   * @param payload - Any additional data that will be passed to the request handler.
   * @returns Arbitrary data provided by request handler.
   */
  public request<P>(requestName: string, payload?: P): any {
    const requestHandler = this.requests[requestName];
    if (requestHandler) {
      return requestHandler(payload);
    }
    throw new Error(`WreckedRadio: the request "${requestName}" has no registered handler`);
  }
  /**
   * Add a request handler to the channel.
   * @param requestName - Name of the request that you're going to handle.
   * @param requestHandler - A function that accepts a request (its name and payload), process it
   * and returns some data back to the requester.
   * @returns Current channel that you can use for method chaining.
   */
  public reply(requestName: string, requestHandler: IRequestHandler): Channel {
    this.requests[requestName] = requestHandler;
    return this;
  }
  /**
   * Remove request handler from the channel.
   * @param requestName - The request name that shouldn't be handled anymore.
   * @returns Current channel that you can use for method chaining.
   */
  public stopReplying(requestName: string): Channel {
    delete this.requests[requestName];
    return this;
  }
  /**
   * Add an event handler (subscriber) to the channel.
   * @param eventName - Event name you're going to listen.
   * @param eventHandler - The function that handles events with specified name.
   * @returns The function that unregisters provided event handler when called.
   */
  public on(eventName: string, eventHandler: IEventHandler): IUnsubscribe {
    const eventListeners = this.events[eventName] || (this.events[eventName] = []);
    eventListeners.push(eventHandler);
    return function unsubscribe(): void {
      const index = eventListeners.indexOf(eventHandler);
      eventListeners.splice(index, 1);
    };
  }
  /**
   * Trigger an event on the channel.
   * @param eventName - Event name you're going to send.
   * @param payload - Additional data that describes the event and is necessary for proper event
   * handling.
   */
  public trigger<P>(eventName: string, payload?: P): void {
    const eventListeners = this.events[eventName];
    if (eventListeners) {
      eventListeners.forEach((handler: IEventHandler) => handler(payload));
    }
  }
}

export default Channel;
