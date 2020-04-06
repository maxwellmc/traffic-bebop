import Game from './game';

/**
 * Represents the properties of the game as they exist right now.
 */
export default class GameState {

  // Constants
  public static readonly STARTING_MONEY = 1000000;
  public static readonly EVENT_MONEY_CHANGED = 'game-state.money';
  public static readonly EVENT_TIME_CHANGED = 'game-state.time';
  public static readonly EVENT_SPEED_CHANGED = 'game-state.speed';
  public static readonly SPEED_PAUSED = 0;
  public static readonly SPEED_NORMAL = 1;
  public static readonly SPEEDS_DICTIONARY = {
    [GameState.SPEED_PAUSED]: 'Paused',
    [GameState.SPEED_NORMAL]: 'Normal'
  };

  // Class properties
  private _game: Game;
  private _money: number;
  private _time: number;
  private _speed: number;

  constructor(game: Game) {
    this._game = game;
    this._money = GameState.STARTING_MONEY;
    this._time = 0;
    this._speed = GameState.SPEED_PAUSED;

    // Listen for events that should update the state
    this._game.eventEmitter.on(Game.EVENT_MONEY_DEDUCTED, (args) => this.onMoneyUpdated(args));
    this._game.eventEmitter.on(Game.EVENT_TIME_INCREASED, (args) => this.onTimeIncreased(args));
    this._game.eventEmitter.on(Game.EVENT_SPEED_SET, (args) => this.onSpeedSet(args));
  }

  onMoneyUpdated(amount: number): void{
    this._money += amount;
    this._game.eventEmitter.emit(GameState.EVENT_MONEY_CHANGED, this._money);
  }

  onTimeIncreased(milliseconds: number): void{
    // We scale the real-life milliseconds based on the current game speed
    this._time += milliseconds * this._speed;
    this._game.eventEmitter.emit(GameState.EVENT_TIME_CHANGED, this._time);
  }

  onSpeedSet(speed: number): void{
    this._speed = speed;
    this._game.eventEmitter.emit(GameState.EVENT_SPEED_CHANGED, this._speed);
  }

  // Getters and setters -------------------------------------------------------

  get money(): number{
    return this._money;
  }

  set money(value){
    this._money = value;
  }

  get time(): number{
    return this._time;
  }

  set time(value){
    this._time = value;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(value: number) {
    this._speed = value;
  }
}
