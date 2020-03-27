export default class Event {

  #name;
  #registrants;

  constructor(name) {
    this.#name = name;
    this.#registrants = [];
  }

  addRegistrant(registrant){
    this.#registrants.push(registrant);
  }

  trigger(args){
    for(const registrant of this.#registrants){
      registrant(args);
    }
  }

  // Getters and setters -------------------------------------------------------

  get name(){
    return this.#name;
  }
}
