import HUDItem from './hud-item';
import ViewableObject from '../viewable-object';
import {Graphics} from "pixi.js";
import Game from '../game';
import GameState from '../game-state';

/**
 * The heads-up display to show the game state to the user.
 */
export default class HUD extends ViewableObject {

  // Constants
  public static readonly HEIGHT = 48;
  public static readonly FILL_COLOR = 0x2f89fc;

  // Class properties
  private _game: Game;
  private _items: HUDItem[];
  private _gameState: GameState;
  private _startingX: number;
  private _startingY: number;

  constructor(game: Game, gameState: GameState, appWidth: number, appHeight: number) {
    super();

    this._game = game;
    this._gameState = gameState;
    this._startingX = 0;
    this._startingY = appHeight - HUD.HEIGHT;

    this._items = [
      new HUDItem('Money', String(this._gameState.money)),
      new HUDItem('Days', String(this._gameState.time)),
      new HUDItem('Speed', GameState.SPEEDS_DICTIONARY[this._gameState.speed]),
    ];

    this.generateGraphics();

    this.setGraphicsPositioning();

    // Update the money graphic when it changes
    this._game.eventEmitter.on(GameState.EVENT_MONEY_CHANGED, (args) => this.onMoneyChanged(args));

    // Update the game time graphic when it changes
    this._game.eventEmitter.on(GameState.EVENT_TIME_CHANGED, (args) => this.onTimeChanged(args));

    // Update the speed graphic when it changes
    this._game.eventEmitter.on(GameState.EVENT_SPEED_CHANGED, (args) => this.onSpeedChanged(args));
  }

  generateGraphics(): void{
    // Rectangle
    const rectangle = new Graphics();
    rectangle.beginFill(HUD.FILL_COLOR);
    rectangle.drawRect(this._startingX, this._startingY, Game.APP_WIDTH, HUD.HEIGHT);
    rectangle.endFill();

    this.graphics = [rectangle];
  }

  setGraphicsPositioning(): void {
    let x = this._startingX + 30;
    let y = this._startingY + 10;

    for (let i = 0; i < this._items.length; i++) {
      const hudItem = this._items[i];
      hudItem.changeX(x + (70 * i));
      hudItem.changeY(y);
      x += HUDItem.WIDTH;
    }
  }

  onMoneyChanged(amount: number): void{
    this._items[0].value = String(amount);
  }

  onTimeChanged(milliseconds: number): void{
    this._items[1].value = String(Math.round(milliseconds / 2000));
  }

  onSpeedChanged(speed): void{
    this._items[2].value = GameState.SPEEDS_DICTIONARY[speed];
  }

  // Getters and setters -------------------------------------------------------

  get game(): Game{
    return this._game;
  }

  get items(): HUDItem[]{
    return this._items;
  }
}
