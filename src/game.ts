import * as PIXI from 'pixi.js';
import Toolbar from './nonworld/toolbar';
import Grid from './grid';
import HUD from './nonworld/hud';
import GameState from './game-state';
import Map from './map';
import Menubar from './nonworld/menu/menubar';
import * as EventEmitter from 'eventemitter3';
import Tool from './nonworld/tool';
import ViewableObject from './viewable-object';
import Simulator from './simulator';

/**
 * Manages the Pixi Application, the game loop, and calling the draw-ers.
 */
export default class Game {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly APP_WIDTH = 1200;
    public static readonly APP_HEIGHT = 1000;
    public static readonly SPRITE_SCALE = 2;
    public static readonly EVENT_MONEY_DEDUCTED = 'money.deducted';
    public static readonly EVENT_TIME_INCREASED = 'time.increased';
    public static readonly EVENT_SPEED_SET = 'speed.set';

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _ticker: PIXI.Ticker;
    private _renderer: PIXI.Renderer;
    private _stage: PIXI.Container;
    private _gameState: GameState;
    private _eventEmitter: EventEmitter;
    private _map: Map;
    private _simulator: Simulator;
    private _spritesheet: PIXI.LoaderResource;
    private _grid: Grid;
    private _menubar: Menubar;
    private _toolbar: Toolbar;
    private _toolInUse: Tool;
    private _hud: HUD;

    constructor() {
        // Set Pixi settings
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        this._ticker = new PIXI.Ticker();
        this._renderer = new PIXI.Renderer({
            width: Game.APP_WIDTH,
            height: Game.APP_HEIGHT,
            antialias: true,
            transparent: false,
            resolution: 1,
        });
        this._stage = new PIXI.Container();
        this._eventEmitter = new EventEmitter();
        this._gameState = new GameState(this);
        this._map = new Map();
        this._simulator = new Simulator(this);
        this._grid = new Grid(this, Game.APP_WIDTH, Game.APP_HEIGHT);
        this._menubar = new Menubar(this);
        this._toolbar = new Toolbar(this);
        this._hud = new HUD(this, this._gameState, Game.APP_WIDTH, Game.APP_HEIGHT);
    }

    init(): void {
        console.log('init');
        // Add the canvas that Pixi automatically created to the HTML document
        document.body.appendChild(this._renderer.view);

        PIXI.Loader.shared.add('dist/assets/sprites.json').load(() => this.load());
    }

    load(): void {
        // Keep a reference to the spritesheet
        this._spritesheet = PIXI.Loader.shared.resources['dist/assets/sprites.json'];

        // Draw the initial graphics
        this._grid.generateGraphics();
        this.drawGrid();
        this.drawToolbar();
        this.drawHUD();
        this.drawMenubar();

        // Start the game loop
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
        this._stage.addChild(this._grid.grid);
        for (const tile of this._grid.tiles) {
            tile.generateGraphics();
            for (const graphic of tile.graphics) {
                this._grid.grid.addChild(graphic);
            }
        }
    }

    updateGrid(): void {
        for (const tile of this._grid.tiles) {
            Game.replaceGraphics(this._grid.grid, tile);
        }
    }

    drawToolbar(): void {
        this._toolbar.generateGraphics();
        // Set the default "tool in use"
        this._toolInUse = this._toolbar.tools[0];
        for (const tool of this._toolbar.tools) {
            tool.generateGraphics();
            for (const graphic of tool.graphics) {
                this._stage.addChild(graphic);
            }
        }
    }

    updateToolbar(): void {
        for (const tool of this._toolbar.tools) {
            Game.replaceGraphics(this._stage, tool);
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
        // Redraw the Hud
        Game.replaceGraphics(this._stage, this._hud);
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
            // If this menu is open
            if (menu.open) {
                for (const item of menu.items) {
                    Game.replaceGraphics(this._stage, item);
                }
            } else if (menu.items.length > 0) {
                for (const item of menu.items) {
                    if (item.graphics.length > 0) {
                        // The menu isn't open, but there's a menu item with graphics, so remove them
                        item.removeAllGraphics();
                    }
                }
            }
        }
    }

    static replaceGraphics(stage: PIXI.Container, viewableObject: ViewableObject): void {
        // Remove the existing graphics
        viewableObject.removeAllGraphics();

        // Generate the new graphics
        viewableObject.generateGraphics();

        // Individually add each new graphic to the stage
        for (const graphic of viewableObject.graphics) {
            stage.addChild(graphic);
        }
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get renderer(): PIXI.Renderer {
        return this._renderer;
    }

    get gameState(): GameState {
        return this._gameState;
    }

    get eventEmitter(): EventEmitter {
        return this._eventEmitter;
    }

    get map(): Map {
        return this._map;
    }

    get simulator(): Simulator {
        return this._simulator;
    }

    get spritesheet(): PIXI.LoaderResource {
        return this._spritesheet;
    }

    get toolInUse(): Tool {
        return this._toolInUse;
    }

    set toolInUse(value) {
        this._toolInUse = value;
    }
}

const game = new Game();
game.init();
