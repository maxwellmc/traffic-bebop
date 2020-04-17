/*
 * Traffic Bebop - A traffic management web game
 * Copyright (C) 2020  Max McMahon
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as PIXI from 'pixi.js';
import Toolbar from './nonworld/tool/Toolbar';
import Grid from './Grid';
import HUD from './nonworld/hud/HUD';
import GameState from './GameState';
import GameMap from './GameMap';
import Menubar from './nonworld/menu/Menubar';
import * as EventEmitter from 'eventemitter3';
import Tool from './nonworld/tool/Tool';
import ViewableObject from './ViewableObject';
import Simulator from './Simulator';
import {Speeds} from './Speed';

export enum GameEvents {
    MoneyDeducted = 'money.deducted',
    TimeIncreased = 'time.increased',
    SpeedSet = 'speed.set',
}

/**
 * Manages the Pixi Application, the game loop, and calling the draw-ers.
 */
export default class Game {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly APP_WIDTH = 1200;
    public static readonly APP_HEIGHT = 1000;
    public static readonly SPRITE_SCALE = 2;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _debug: boolean;
    private _ticker: PIXI.Ticker;
    private _renderer: PIXI.Renderer;
    private _stage: PIXI.Container;
    private _gameState: GameState;
    private _eventEmitter: EventEmitter;
    private _map: GameMap;
    private _simulator: Simulator;
    private _spritesheet: PIXI.LoaderResource;
    private _grid: Grid;
    private _menubar: Menubar;
    private _toolbar: Toolbar;
    private _toolInUse: Tool;
    private _hud: HUD;

    constructor() {
        this._debug = false;

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
        this._map = new GameMap();
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
        this._eventEmitter.emit(GameEvents.TimeIncreased, this._ticker.deltaMS);

        this.updateGrid();
        this.updateTraffic(this._ticker.deltaMS);
        this.updateToolbar();
        this.updateHUD();
        this.updateMenubar();
        this._renderer.render(this._stage);
    }

    drawGrid(): void {
        this._stage.addChild(this._grid.grid);
        for (const tile of this._grid.tiles) {
            tile.generateGraphics();
            this._grid.grid.addChild(tile.container);
            this._grid.grid.addChild(tile.debugContainer);
        }
    }

    updateGrid(): void {
        for (const tile of this._grid.tiles) {
            tile.updateGraphics();
        }
    }

    updateTraffic(deltaMS: number): void {
        // Only update if we're not paused
        if(this._gameState.speed !== Speeds.Paused) {
            for (const trip of this._gameState.travelTrips) {
                if (!trip.vehicle.isOnStage) {
                    this._grid.grid.addChild(trip.vehicle.graphic);
                    trip.vehicle.isOnStage = true;
                }
                trip.vehicle.updateGraphics(deltaMS, this._gameState.speed);
            }
        }
    }

    drawToolbar(): void {
        this._toolbar.generateGraphics();
        // Set the default "tool in use"
        this._toolInUse = this._toolbar.tools[0];
        for (const tool of this._toolbar.tools) {
            tool.generateGraphics();
            this._stage.addChild(tool.background);
            this._stage.addChild(tool.foreground);
        }
    }

    updateToolbar(): void {
        for (const tool of this._toolbar.tools) {
            tool.updateGraphics();
        }
    }

    drawHUD(): void {
        // Draw the Hud
        for (const graphic of this._hud.graphics) {
            this._stage.addChild(graphic);
        }

        // Draw the Hud items
        for (const hudItem of this._hud.items) {
            this._stage.addChild(hudItem.graphic);
        }
    }

    updateHUD(): void {
        // Redraw the Hud items
        for (const hudItem of this._hud.items) {
            hudItem.updateGraphics();
        }
    }

    drawMenubar(): void {
        for (const menu of this._menubar.menus) {
            menu.generateGraphics();
            this._stage.addChild(menu.background);
            this._stage.addChild(menu.foreground);
        }
    }

    updateMenubar(): void {
        for (const menu of this._menubar.menus) {
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

    get debug(): boolean {
        return this._debug;
    }

    set debug(value: boolean) {
        this._debug = value;
    }

    get renderer(): PIXI.Renderer {
        return this._renderer;
    }

    get stage(): PIXI.Container {
        return this._stage;
    }

    get gameState(): GameState {
        return this._gameState;
    }

    get eventEmitter(): EventEmitter {
        return this._eventEmitter;
    }

    get map(): GameMap {
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
