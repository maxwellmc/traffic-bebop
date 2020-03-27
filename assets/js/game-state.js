/**
 * Represents the properties of the game as they exist right now.
 */
export default class GameState {

  // Constants
  static STARTING_MONEY = 1000000;

  // Class properties
  #money;

  constructor() {
    this.#money = GameState.STARTING_MONEY;
  }

  // Getters and setters -------------------------------------------------------

  get money(){
    return this.#money;
  }

  set money(value){
    this.#money = value;
  }
}
