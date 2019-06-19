/**
 * This module contains everything that's necessary for Channel implementation.
 *
 * Under usual circumstances this module **shouldn't be used directly**, so please consider using
 * WreckedRadio class/module instead.
 *
 * For more information check out "Channel" class documentation.
 */

/**
 * Shape of functions, that handles events.
 */
type IEventHandler = (payload?: any) => any;

/**
 * Shape of functions, that handles request.
 */
type IRequestHandler = (payload?: any) => any;

/**
 * Shape of a list of registered event handlers.
 */
interface IEventHandlerContainer {
  [key: string]: IEventHandler[];
}

/**
 * Shape of a list of registered request handlers.
 */
interface IRequestHandlerContainer {
  [key: string]: IRequestHandler;
}

/**
 * Shape of functions, that unregister event handler.
 */
type IUnsubscribe = () => void;

/**
 * Implements a communication channel that can be used for message passing (both events and
 * requests).
 *
 * For channel instantiation you should use WreckedRadio class since it allows you to manage them
 * more easily:
 *
 * ```
 * import WreckedRadio from 'wrecked-radio';
 * const myChannel = WreckedRadio.channel('my-channel-name');
 * ```
 *
 * When you just want to notify external systems about some happened event you should use on/trigger
 * methods, for example:
 *
 * ```
 * // Somewhere in event subscriber:
 * channel.on('user-login-success', user => console.log(`Oh, hi ${user.name}`);
 *
 * // Somewhere in event publisher:
 * channel.trigger('user-login-success', { name: 'Mark' });
 * ```
 *
 * In case you want to give a command to some external system and get some data back you should use
 * request/reply methods, for example:
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
   * A list of registered event handlers (event subscribers)
   */
  private readonly events: IEventHandlerContainer = {};
  /**
   * A list of registered request handlers (request/command subscribers)
   */
  private readonly requests: IRequestHandlerContainer = {};
  /**
   * Send a request to the channel.
   * @param requestName Name of a request you want to make. Request handler with the same name
   * should be registered before making a request.
   * @param payload Additional data that describes a request and is necessary for proper request
   * handling
   * @returns Arbitrary value provided by request handler
   */
  public request<P>(requestName: string, payload?: P): any {
    const requestHandler = this.requests[requestName];
    if (requestHandler) {
      return requestHandler(payload);
    }
    throw new Error(`WreckedRadio: the request "${requestName}" has no registered handler`);
  }
  /**
   * Add request handler to the channel.
   * @param requestName Name of a request that you're going to handle.
   * @param requestHandler A function that accepts a request (its name and payload), process it and
   * returns some data back to the requester.
   * @returns Current channel that you can use for method chaining
   */
  public reply(requestName: string, requestHandler: IRequestHandler): Channel {
    this.requests[requestName] = requestHandler;
    return this;
  }
  /**
   * Remove request handler from the channel.
   * @param requestName A request name that shouldn't be handled anymore.
   * @returns Current channel that you can use for method chaining
   */
  public stopReplying(requestName: string): Channel {
    delete this.requests[requestName];
    return this;
  }
  /**
   * Add an event handler (subscriber) to the channel.
   * @param eventName Event name you're going to listen.
   * @param eventHandler A function that handles events with specified name.
   * @returns A function that unregisters provided event handler.
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
   * @param eventName Event name you're going to send.
   * @param payload Additional data that describes an event and is necessary for proper event
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
