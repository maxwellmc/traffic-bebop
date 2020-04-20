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
import Simulator from './Simulator';
import { Speeds } from './Speed';
import MenuItem from './nonworld/menu/MenuItem';
import { GameEvents } from './Events';

/**
 * Manages the Pixi Application, the game loop, and calling the draw-ers.
 */
export default class Game {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly FONT_FAMILY = 'VT323';

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _debug: boolean;
    private _ticker: PIXI.Ticker;
    private _renderer: PIXI.Renderer;
    private _stage: PIXI.Container;
    private _gameState: GameState;
    private _eventEmitter: EventEmitter;
    private _gameMap: GameMap;
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
            antialias: false,
            transparent: false,
            resolution: 1,
        });
        this._stage = new PIXI.Container();
        this._eventEmitter = new EventEmitter();
        this._gameState = new GameState(this);
        this._gameMap = new GameMap();
        this._simulator = new Simulator(this);
    }

    init(): void {
        // Add the PixiJS renderer view
        document.querySelector('#resize-frame').appendChild(this._renderer.view);
        this.resize();

        PIXI.Loader.shared.add('dist/assets/sprites.json').load(() => this.load());
    }

    load(): void {
        // Keep a reference to the spritesheet
        this._spritesheet = PIXI.Loader.shared.resources['dist/assets/sprites.json'];

        // Initialize the things that needed the spritesheet
        this._grid = new Grid(this);
        this._menubar = new Menubar(this);
        this._toolbar = new Toolbar(this);
        this._hud = new HUD(this, this._gameState);

        // Size out the viewport for the first time
        this.sizeViewport();

        // Draw the initial graphics
        this.drawInitialGraphics();

        // Listen for window resize events
        window.addEventListener('resize', () => this.resize());

        // Start the game loop
        this._ticker.add(() => this.gameLoop());
        this._ticker.start();

        // Listen for changes to the scale
        this._grid.game.eventEmitter.on(GameEvents.ScaleChanged, () => this.onScaleChanged());
    }

    drawInitialGraphics(): void {
        this._grid.generateGraphics();
        this._grid.setupGridListeners();
        this.drawGrid();
        this.drawToolbar();
        this.drawHUD();
        this.drawMenubar();
    }

    sizeViewport(): void {
        this._grid.grid.x = this._renderer.screen.width / 2 - this._grid.width / 2;
        this._grid.grid.y = this._renderer.screen.height / 2 - this._grid.height / 2;
    }

    resize(): void {
        // Get the parent
        const parent = this._renderer.view.parentElement;

        // Resize the renderer
        this._renderer.resize(parent.clientWidth, parent.clientHeight);

        // Resize the HUD
        if (this._hud) {
            this._hud.graphic.destroy();
            this._hud.generateGraphics();
            this._hud.setGraphicsPositioning();
            this.drawHUD();
        }

        // Resize the Menubar
        if (this._menubar) {
            this._menubar.graphic.destroy();
            this._menubar.generateGraphics();
            this._menubar.setGraphicsPositioning();
            this.drawMenubar();
        }
    }

    gameLoop(): void {
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
        }
    }

    updateGrid(): void {
        for (const tile of this._grid.tiles) {
            tile.updateGraphics();
        }
    }

    updateTraffic(deltaMS: number): void {
        // Only update if we're not paused
        if (this._gameState.speed !== Speeds.Paused) {
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
        this._toolbar.setGraphicsPositioning();
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
        this._stage.addChild(this._hud.graphic);

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
        // Draw the Menubar
        this._menubar.generateGraphics();
        this._menubar.setGraphicsPositioning();
        this._stage.addChild(this._menubar.graphic);

        // Draw the Menus in the Menubar
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
                    this.removeMenuItem(item);
                    item.generateGraphics();
                    this._stage.addChild(item.background);
                    this._stage.addChild(item.foreground);
                }
            } else if (menu.items.length > 0) {
                for (const item of menu.items) {
                    if (item.background || item.foreground) {
                        // The menu isn't open, but there's a menu item with graphics, so remove them
                        this.removeMenuItem(item);
                    }
                }
            }
        }
    }

    removeMenuItem(item: MenuItem): void {
        if (item.background) {
            item.background.destroy();
            item.background = null;
        }
        if (item.foreground) {
            item.foreground.destroy();
            item.foreground = null;
        }
    }

    onScaleChanged(): void {
        // Stop the ticker so that we don't try to update while resetting the stage
        this._ticker.stop();

        // Reset the stage
        this._stage.destroy();
        this._stage = new PIXI.Container();

        // Draw the initial graphics all over again
        this.drawInitialGraphics();

        // Resume the ticker
        this._ticker.start();
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

    get gameMap(): GameMap {
        return this._gameMap;
    }

    get simulator(): Simulator {
        return this._simulator;
    }

    get spritesheet(): PIXI.LoaderResource {
        return this._spritesheet;
    }

    get grid(): Grid {
        return this._grid;
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
