import HUDItem from './hud-item';
import ViewableObject from './viewable-object';
import {Graphics} from "pixi.js";
import Toolbar from './toolbar';
import Game from './game';
import GameState from './game-state';

/**
 * The heads-up display to show the game state to the user.
 */
export default class HUD extends ViewableObject {

  // Constants
  static HEIGHT = 48;
  static FILL_COLOR = 0x2f89fc;

  // Class properties
  #game;
  #items;
  #gameState;
  #startingX;
  #startingY;

  constructor(game, gameState, appWidth, appHeight) {
    super();

    this.#game = game;
    this.#gameState = gameState;
    this.#startingX = 0;
    this.#startingY = appHeight - HUD.HEIGHT;

    this.#items = [
      new HUDItem('Money', this.#gameState.money),
      new HUDItem('Days', this.#gameState.time)
    ];

    this.generateGraphics(this.#startingX, this.#startingY, appWidth, HUD.HEIGHT);

    this.setGraphicsPositioning();

    // Update the money graphic when it changes
    this.#game.eventDispatcher.registerListener(GameState.EVENT_MONEY_CHANGED, (args) => this.onMoneyChanged(args));

    // Update the game time graphic when it changes
    this.#game.eventDispatcher.registerListener(GameState.EVENT_TIME_CHANGED, (args) => this.onTimeChanged(args));
  }

  generateGraphics(x, y, width, height){
    // Rectangle
    const rectangle = new Graphics();
    rectangle.beginFill(HUD.FILL_COLOR);
    rectangle.drawRect(x, y, width, height);
    rectangle.endFill();

    this.graphics = [rectangle];
  }

  setGraphicsPositioning() {
    let x = this.#startingX + 30;
    let y = this.#startingY + 10;

    for (let i = 0; i < this.#items.length; i++) {
      const hudItem = this.#items[i];
      hudItem.changeX(x + (70 * i));
      hudItem.changeY(y);
      x += HUDItem.WIDTH;
    }
  }

  onMoneyChanged(amount){
    this.#items[0].value = amount;
  }

  onTimeChanged(milliseconds){
    this.#items[1].value = Math.round(milliseconds / 2000);
  }

  // Getters and setters -------------------------------------------------------

  get game(){
    return this.#game;
  }

  get items(){
    return this.#items;
  }
}
