import * as PIXI from 'pixi.js';
import Toolbar from './toolbar';
import Grid from './grid';
import HUD from './hud';
import GameState from './game-state';
import Dispatcher from './events/dispatcher';

/**
 * Manages the Pixi Application, the game loop, and calling the draw-ers.
 */
export default class Game {

  // Constants
  static appWidth = 1200;
  static appHeight = 1000;
  static EVENT_MONEY_DEDUCTED = 'money.deducted';

  // Class properties
  #renderer;
  #stage;
  #gameState;
  #eventDispatcher;
  #grid;
  #toolbar;
  #toolInUse;
  #hud;

  constructor() {

    this.#renderer = new PIXI.Renderer({
      width: Game.appWidth,
      height: Game.appHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
    });
    this.#stage = new PIXI.Container();
    this.#gameState = new GameState();
    this.#eventDispatcher = new Dispatcher();
    this.#grid = new Grid(this, Game.appWidth, Game.appHeight);
    this.#toolbar = new Toolbar(this);
    this.#hud = new HUD(this, this.#gameState, Game.appWidth, Game.appHeight);

    // Set the default "tool in use"
    this.#toolInUse = this.#toolbar.tools[0];
  }

  init() {
    console.log('init');

    // Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(this.#renderer.view);

    const _this = this;

    console.log('init - loading');
    PIXI.Loader.shared.load(() => _this.load());
  }

  load() {
    console.log('load');

    //Start the game loop
    const ticker = new PIXI.Ticker();
    ticker.add(delta => this.gameLoop(delta));
    ticker.start();
  }

  gameLoop(delta) {
    this.drawGrid();
    this.drawToolbar();
    this.drawHUD();
    this.#renderer.render(this.#stage);
  }

  drawGrid() {
    for (const tile of this.#grid.tiles) {
      for (const graphic of tile.graphics) {
        this.#stage.addChild(graphic);
      }
    }
  }

  drawToolbar() {
    for (const tool of this.#toolbar.tools) {
      for (const graphic of tool.graphics) {
        this.#stage.addChild(graphic);
      }
    }
  }

  drawHUD() {
    // Draw the HUD
    for (const graphic of this.#hud.graphics) {
      this.#stage.addChild(graphic);
    }

    // Draw the HUD items
    for (const hudItem of this.#hud.items) {
      for (const graphic of hudItem.graphics) {
        this.#stage.addChild(graphic);
      }
    }
  }

  onDragStart(event) {
    console.log('onDragStart');
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  onDragEnd() {
    console.log('onDragEnd');
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
  }

  onDragMove() {
    if (this.dragging) {
      console.log('onDragMove');
      const newPosition = this.data.getLocalPosition(this.parent);
      this.position.x = newPosition.x;
      this.position.y = newPosition.y;
    }
  }

  // Getters and setters -------------------------------------------------------

  get gameState() {
    return this.#gameState;
  }

  get eventDispatcher() {
    return this.#eventDispatcher;
  }

  get toolInUse() {
    return this.#toolInUse;
  }

  set toolInUse(value) {
    this.#toolInUse = value;
  }
}

console.log('foo');
const game = new Game();
game.init();
