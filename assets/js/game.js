import * as PIXI from 'pixi.js';
import Toolbar from './nonworld/toolbar';
import Grid from './grid';
import HUD from './nonworld/hud';
import GameState from './game-state';
import Dispatcher from './events/dispatcher';
import Map from './map';
import Menubar from './nonworld/menu/menubar';

// This block is to get the PixiJS Chrome devtool to work
PIXI.useDeprecated();
window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({PIXI: PIXI});

/**
 * Manages the Pixi Application, the game loop, and calling the draw-ers.
 */
export default class Game {

  // Constants
  static appWidth = 1200;
  static appHeight = 1000;
  static EVENT_MONEY_DEDUCTED = 'money.deducted';
  static EVENT_TIME_INCREASED = 'time.increased';
  static EVENT_SPEED_SET = 'speed.set';

  // Class properties
  /** @type PIXI.Ticker */
  #ticker;
  #renderer;
  /** @type PIXI.Container */
  #stage;
  #gameState;
  #eventDispatcher;
  #map;
  #grid;
  #menubar;
  #toolbar;
  #toolInUse;
  #hud;

  constructor() {

    this.#ticker = new PIXI.Ticker();
    this.#renderer = new PIXI.Renderer({
      width: Game.appWidth,
      height: Game.appHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
    });
    this.#stage = new PIXI.Container();
    this.#eventDispatcher = new Dispatcher();
    this.#gameState = new GameState(this);
    this.#map = new Map();
    this.#grid = new Grid(this, Game.appWidth, Game.appHeight);
    this.#menubar = new Menubar(this);
    this.#toolbar = new Toolbar(this);
    this.#hud = new HUD(this, this.#gameState, Game.appWidth, Game.appHeight);

    // Set the default "tool in use"
    this.#toolInUse = this.#toolbar.tools[0];

    this.#grid.generateGraphics();
    this.drawGrid();
    this.drawToolbar();
    this.drawHUD();
    this.drawMenubar();
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
    this.#ticker.add((delta) => this.gameLoop(delta));
    this.#ticker.start();
  }

  gameLoop(delta) {

    // Dispatch an event that the time has increased
    this.#eventDispatcher.dispatch(Game.EVENT_TIME_INCREASED, this.#ticker.deltaMS);

    this.updateGrid();
    this.updateToolbar();
    this.updateHUD();
    this.updateMenubar();
    this.#renderer.render(this.#stage);
  }

  drawGrid() {
    for (const tile of this.#grid.tiles) {
      tile.updateTileGraphic();
      for (const graphic of tile.graphics) {
        this.#stage.addChild(graphic);
      }
    }
  }

  updateGrid() {
    for (const tile of this.#grid.tiles) {
      const oldGraphic = tile.graphics[0];
      tile.updateTileGraphic();
      oldGraphic.destroy();
      const newGraphic = tile.graphics[0];
      this.#stage.addChild(newGraphic);
    }
  }

  drawToolbar() {
    for (const tool of this.#toolbar.tools) {
      for (const graphic of tool.graphics) {
        this.#stage.addChild(graphic);
      }
    }
  }

  updateToolbar() {
    for (const tool of this.#toolbar.tools) {
      const oldGraphic1 = tool.graphics[0];
      const oldGraphic2 = tool.graphics[1];
      tool.generateGraphics();
      oldGraphic1.destroy();
      oldGraphic2.destroy();
      const newGraphic1 = tool.graphics[0];
      const newGraphic2 = tool.graphics[1];
      this.#stage.addChild(newGraphic1);
      this.#stage.addChild(newGraphic2);
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

  updateHUD() {
    // Redraw the HUD items
    for (const hudItem of this.#hud.items) {
      const oldGraphic = hudItem.graphics[0];
      hudItem.generateGraphics();
      oldGraphic.destroy();
      this.#hud.setGraphicsPositioning();
      const newGraphic = hudItem.graphics[0];
      this.#stage.addChild(newGraphic);
    }
  }

  drawMenubar() {
    for (const menu of this.#menubar.menus) {
      for (const graphic of menu.graphics) {
        this.#stage.addChild(graphic);
      }
    }
  }

  updateMenubar() {
    for (const menu of this.#menubar.menus) {
      Game.replaceGraphics(this.#stage, menu);
      if(menu.open){
        for (const item of menu.items) {
          Game.replaceGraphics(this.#stage, item);
        }
      }else if(menu.items.length > 0){
        for (const item of menu.items) {
          if(item.graphics.length > 0) {
            item.removeAllGraphics();
          }
        }
      }
    }
  }

  /**
   *
   * @param {PIXI.Container} stage
   * @param {ViewableObject} viewableObject
   */
  static replaceGraphics(stage, viewableObject){

    // Remove the existing graphics
    viewableObject.removeAllGraphics();

    // Generate the new graphics
    viewableObject.generateGraphics();

    // Individually add each new graphic to the stage
    for (const graphic of viewableObject.graphics) {
      stage.addChild(graphic);
    }
  }

  // Getters and setters -------------------------------------------------------

  get gameState() {
    return this.#gameState;
  }

  get eventDispatcher() {
    return this.#eventDispatcher;
  }

  get map() {
    return this.#map;
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
