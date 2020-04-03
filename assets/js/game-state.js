import Game from './game';

/**
 * Represents the properties of the game as they exist right now.
 */
export default class GameState {

  // Constants
  static STARTING_MONEY = 1000000;
  static EVENT_MONEY_CHANGED = 'game-state.money';
  static EVENT_TIME_CHANGED = 'game-state.time';
  static SPEED_PAUSED = 0;
  static SPEED_NORMAL = 1;

  // Class properties
  #game;
  #money;
  #time;
  #speed;

  constructor(game) {
    this.#game = game;
    this.#money = GameState.STARTING_MONEY;
    this.#time = 0;
    this.#speed = GameState.SPEED_PAUSED;

    // Listen for events that should update the state
    this.#game.eventDispatcher.registerListener(Game.EVENT_MONEY_DEDUCTED, (args) => this.onMoneyUpdated(args));
    this.#game.eventDispatcher.registerListener(Game.EVENT_TIME_INCREASED, (args) => this.onTimeIncreased(args));
  }

  onMoneyUpdated(amount){
    this.#money += amount;
    this.#game.eventDispatcher.dispatch(GameState.EVENT_MONEY_CHANGED, this.#money);
  }

  onTimeIncreased(milliseconds){
    this.#time += milliseconds;
    this.#game.eventDispatcher.dispatch(GameState.EVENT_TIME_CHANGED, this.#time);
  }

  // Getters and setters -------------------------------------------------------

  get money(){
    return this.#money;
  }

  set money(value){
    this.#money = value;
  }

  get time(){
    return this.#time;
  }

  set time(value){
    this.#time = value;
  }
}
