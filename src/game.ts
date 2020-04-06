import * as PIXI from 'pixi.js';
import Toolbar from './nonworld/toolbar';
import Grid from './grid';
import HUD from './nonworld/hud';
import GameState from './game-state';
import Map from './map';
import Menubar from './nonworld/menu/menubar';
import * as EventEmitter from 'eventemitter3';
import Tool from "./nonworld/tool";

// This block is to get the PixiJS Chrome devtool to work
// PIXI.useDeprecated();
// window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
// window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({PIXI: PIXI});

/**
 * Manages the Pixi Application, the game loop, and calling the draw-ers.
 */
export default class Game {

  // Constants
  public static readonly appWidth = 1200;
  public static readonly appHeight = 1000;
  public static readonly EVENT_MONEY_DEDUCTED = 'money.deducted';
  public static readonly EVENT_TIME_INCREASED = 'time.increased';
  public static readonly EVENT_SPEED_SET = 'speed.set';

  // Class properties
  private _ticker: PIXI.Ticker;
  private _renderer;
  private _stage: PIXI.Container;
  private _gameState;
  private _eventEmitter: EventEmitter;
  private _map;
  private _grid;
  private _menubar;
  private _toolbar;
  private _toolInUse;
  private _hud;

  constructor() {

    this._ticker = new PIXI.Ticker();
    this._renderer = new PIXI.Renderer({
      width: Game.appWidth,
      height: Game.appHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
    });
    this._stage = new PIXI.Container();
    this._eventEmitter = new EventEmitter();
    this._gameState = new GameState(this);
    this._map = new Map();
    this._grid = new Grid(this, Game.appWidth, Game.appHeight);
    this._menubar = new Menubar(this);
    this._toolbar = new Toolbar(this);
    this._hud = new HUD(this, this._gameState, Game.appWidth, Game.appHeight);

    // Set the default "tool in use"
    this._toolInUse = this._toolbar.tools[0];

    this._grid.generateGraphics();
    this.drawGrid();
    this.drawToolbar();
    this.drawHUD();
    this.drawMenubar();
  }

  init(): void {
    console.log('init');

    // Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(this._renderer.view);

    console.log('init - loading');
    PIXI.Loader.shared.load(() => this.load());
  }

  load(): void {
    console.log('load');

    //Start the game loop
    this._ticker.add((delta) => this.gameLoop(delta));
    this._ticker.start();
  }

  gameLoop(delta): void {

    // Dispatch an event that the time has increased
    this._eventEmitter.emit(Game.EVENT_TIME_INCREASED, this._ticker.deltaMS);

    this.updateGrid();
    this.updateToolbar();
    this.updateHUD();
    this.updateMenubar();
    this._renderer.render(this._stage);
  }

  drawGrid(): void {
    for (const tile of this._grid.tiles) {
      tile.updateTileGraphic();
      for (const graphic of tile.graphics) {
        this._stage.addChild(graphic);
      }
    }
  }

  updateGrid(): void {
    for (const tile of this._grid.tiles) {
      const oldGraphic = tile.graphics[0];
      tile.updateTileGraphic();
      oldGraphic.destroy();
      const newGraphic = tile.graphics[0];
      this._stage.addChild(newGraphic);
    }
  }

  drawToolbar(): void {
    for (const tool of this._toolbar.tools) {
      for (const graphic of tool.graphics) {
        this._stage.addChild(graphic);
      }
    }
  }

  updateToolbar(): void {
    for (const tool of this._toolbar.tools) {
      const oldGraphic1 = tool.graphics[0];
      const oldGraphic2 = tool.graphics[1];
      tool.generateGraphics();
      oldGraphic1.destroy();
      oldGraphic2.destroy();
      const newGraphic1 = tool.graphics[0];
      const newGraphic2 = tool.graphics[1];
      this._stage.addChild(newGraphic1);
      this._stage.addChild(newGraphic2);
    }
  }

  drawHUD(): void {
    // Draw the Hud
    for (const graphic of this._hud.graphics) {
      this._stage.addChild(graphic);
    }

    // Draw the Hud items
    for (const hudItem of this._hud.items) {
      for (const graphic of hudItem.graphics) {
        this._stage.addChild(graphic);
      }
    }
  }

  updateHUD(): void {
    // Redraw the Hud items
    for (const hudItem of this._hud.items) {
      const oldGraphic = hudItem.graphics[0];
      hudItem.generateGraphics();
      oldGraphic.destroy();
      this._hud.setGraphicsPositioning();
      const newGraphic = hudItem.graphics[0];
      this._stage.addChild(newGraphic);
    }
  }

  drawMenubar(): void {
    for (const menu of this._menubar.menus) {
      for (const graphic of menu.graphics) {
        this._stage.addChild(graphic);
      }
    }
  }

  updateMenubar(): void {
    for (const menu of this._menubar.menus) {
      Game.replaceGraphics(this._stage, menu);
      if(menu.open){
        for (const item of menu.items) {
          Game.replaceGraphics(this._stage, item);
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
  static replaceGraphics(stage, viewableObject): void{

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

  get gameState(): GameState {
    return this._gameState;
  }

  get eventDispatcher(): EventEmitter {
    return this._eventEmitter;
  }

  get map(): Map {
    return this._map;
  }

  get toolInUse(): Tool {
    return this._toolInUse;
  }

  set toolInUse(value) {
    this._toolInUse = value;
  }
}

console.log('foo');
const game = new Game();
game.init();
