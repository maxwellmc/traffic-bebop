import ViewableObject from './viewable-object';
import Tile from './tile';
import Toolbar from './nonworld/toolbar';
import Game from './game';
import Cell from './cell';
import Map from './map';
import { Container } from 'pixi.js';

/**
 * Visually represents the Map, as translated to an arrangement of
 * viewable Tiles.
 */
export default class Grid extends ViewableObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly GRID_MARGIN = 50; // Will be scaled by the zoom level
    public static readonly TILE_WIDTH = 32;
    public static readonly TILE_HEIGHT = 32;
    public static readonly TILE_LABEL_DICTIONARY = {
        [Cell.TERRAIN_TYPE_GRASS]: 'Grass',
    };

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game: Game;
    private _grid: Container;
    private _startingX: number;
    private _startingY: number;
    private _width: number;
    private _height: number;
    private _tiles: Tile[];
    private _dragging: boolean;
    private _dragEvent;

    constructor(game: Game, appWidth: number, appHeight: number) {
        super();

        this._game = game;
        this._grid = new Container();
        this._startingX = 0;
        this._startingY = 0;
        this._tiles = [];
        this._dragging = false;

        // Center the grid in the app
        this._width = Map.MAP_COLS * (Grid.TILE_WIDTH * Game.SPRITE_SCALE);
        this._height = Map.MAP_ROWS * (Grid.TILE_HEIGHT * Game.SPRITE_SCALE);
        this._grid.x = appWidth / 2 - this._width / 2;
        this._grid.y = appHeight / 2 - this._height / 2;

        this._grid.interactive = true;
        this._grid
            // events for drag start
            .on('mousedown', (e) => this.onDragStart(e))
            .on('touchstart', (e) => this.onDragStart(e))
            // events for drag end
            .on('mouseup', () => this.onDragEnd())
            .on('mouseupoutside', () => this.onDragEnd())
            .on('touchend', () => this.onDragEnd())
            .on('touchendoutside', () => this.onDragEnd())
            // events for drag move
            .on('mousemove', () => this.onDragMove())
            .on('touchmove', () => this.onDragMove());
    }

    generateGraphics(): void {
        let x = this._startingX;
        let y = this._startingY;

        for (let row = 0; row < Map.MAP_ROWS; row++) {
            for (let col = 0; col < Map.MAP_COLS; col++) {
                // Find the Cell for this row/column combination
                const cell = this._game.map.getCellByRowColumn(row, col);

                // Create a new Tile for it
                const tile = new Tile(this, x, y, cell, this._game.spritesheet);

                // Add the Tile to our list
                this._tiles = this._tiles.concat(tile);

                x += Grid.TILE_WIDTH * Game.SPRITE_SCALE;
            }
            y += Grid.TILE_HEIGHT * Game.SPRITE_SCALE;
            x = this._startingX;
        }
    }

    updateGraphics(): void {
        for (const tile of this._tiles) {
            tile.generateGraphics();
        }
    }

    onTileClick(e, tile): boolean {
        switch (this._game.toolInUse.id) {
            case Toolbar.SELECT_TOOL:
                // Return true to propagate this event up to the grid
                return true;
            case Toolbar.ROAD_TOOL:
                tile.cell.structureType = Cell.STRUCTURE_TYPE_ROAD;
                this._game.eventEmitter.emit(Game.EVENT_MONEY_DEDUCTED, -10);
                break;
            case Toolbar.BULLDOZE_TOOL:
                tile.cell.structureType = Cell.STRUCTURE_TYPE_EMPTY;
                break;
            case Toolbar.RESIDENTIAL_ZONE_TOOL:
                tile.cell.terrainType = Cell.TERRAIN_TYPE_GRASS;
                tile.cell.zoneType = Cell.ZONE_TYPE_RESIDENTIAL;
                this._game.eventEmitter.emit(Game.EVENT_MONEY_DEDUCTED, -100);
                break;
        }
    }

    onDragStart(event): void {
        // If the "select" tool isn't in use, then return
        if(this._game.toolInUse.id !== Toolbar.SELECT_TOOL){
            return;
        }

        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this._dragEvent = event.data;
        this._dragging = true;
    }

    onDragEnd(): void {
        this._dragging = false;
        // set the interaction data to null
        this._dragEvent = null;
    }

    onDragMove(): void {
        if (this._dragging) {
            const movementX = this._dragEvent.originalEvent.movementX,
                movementY = this._dragEvent.originalEvent.movementY,
                scaledMargin = Grid.GRID_MARGIN * Game.SPRITE_SCALE,
                targetX = this._grid.x + movementX,
                targetY = this._grid.y + movementY;

            // If we won't go beyond the margin
            if(targetX < scaledMargin && targetX + this._width - this._game.renderer.width + scaledMargin > 0 ) {
                this._grid.x += movementX;
            }
            if(targetY < scaledMargin && targetY + this._height - this._game.renderer.height + scaledMargin > 0 ) {
                this._grid.y += movementY;
            }
        }
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get grid(): PIXI.Container {
        return this._grid;
    }

    set grid(value: PIXI.Container) {
        this._grid = value;
    }

    get tiles(): Tile[] {
        return this._tiles;
    }

    set tiles(value) {
        this._tiles = value;
    }
}
