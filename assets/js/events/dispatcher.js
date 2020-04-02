import Event from './event';

export default class Dispatcher {

  #events;

  constructor() {
    this.#events = [];
  }

  createEvent(eventName){
    this.#events.push(new Event(eventName));
  }

  registerListener(eventName, callable){
    let event = this.findEventObject(eventName);
    if(event === false){
      this.createEvent(eventName);
      event = this.findEventObject(eventName);
    }
    event.addRegistrant(callable);
  }

  dispatch(eventName, args){
    const event = this.findEventObject(eventName);
    event.trigger(args);
  }

  findEventObject(eventName){
    for(const event of this.#events){
      if(event.name === eventName){
        return event;
      }
    }
    return false;
  }
}