import ViewableObject from './viewable-object';
import Tile from './tile';
import Toolbar from './nonworld/toolbar';
import Game from './game';
import Cell from './cell';
import GameMap from './gameMap';
import { Container, Point, DisplayObject } from 'pixi.js';

/**
 * Visually represents the GameMap, as translated to an arrangement of
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
    private _draggingTiles: Tile[];
    private _dragFirstX: number;
    private _dragFirstY: number;

    constructor(game: Game, appWidth: number, appHeight: number) {
        super();

        this._game = game;
        this._grid = new Container();
        this._startingX = 0;
        this._startingY = 0;
        this._tiles = [];
        this._dragging = false;
        this._draggingTiles = [];

        // Center the grid in the app
        this._width = GameMap.MAP_COLS * (Grid.TILE_WIDTH * Game.SPRITE_SCALE);
        this._height = GameMap.MAP_ROWS * (Grid.TILE_HEIGHT * Game.SPRITE_SCALE);
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

        for (let row = 0; row < GameMap.MAP_ROWS; row++) {
            for (let col = 0; col < GameMap.MAP_COLS; col++) {
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

    applyToolToTiles(tiles: Tile[]): void {
        for (const tile of tiles) {
            this.applyToolToTile(tile);
        }
    }

    applyToolToTile(tile): boolean {
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
        // Store a reference to the data (because of multitouch)
        this._dragEvent = event.data;
        this._dragging = true;
        this._dragFirstX = event.data.originalEvent.x;
        this._dragFirstY = event.data.originalEvent.y;

        // Call `onDragMove` because we're considering a single, non-moving click as a "drag"
        this.onDragMove();
    }

    onDragEnd(): void {
        this._dragging = false;
        // set the interaction data to null
        this._dragEvent = null;

        // Apply the "tool in use" to these tiles
        this.applyToolToTiles(this._draggingTiles);

        // Reset the array of tiles in the drag event
        this._draggingTiles = [];
    }

    onDragMove(): void {
        // If we're dragging
        if (this._dragging) {
            // If we're dragging with the Select tool
            if (this._game.toolInUse.id === Toolbar.SELECT_TOOL) {
                const movementX = this._dragEvent.originalEvent.movementX,
                    movementY = this._dragEvent.originalEvent.movementY,
                    scaledMargin = Grid.GRID_MARGIN * Game.SPRITE_SCALE,
                    targetX = this._grid.x + movementX,
                    targetY = this._grid.y + movementY;

                // If we won't go beyond the margins
                if (targetX < scaledMargin && targetX + this._width - this._game.renderer.width + scaledMargin > 0) {
                    this._grid.x += movementX;
                }
                if (targetY < scaledMargin && targetY + this._height - this._game.renderer.height + scaledMargin > 0) {
                    this._grid.y += movementY;
                }
            } else if (this._game.toolInUse.id === Toolbar.ROAD_TOOL) {
                // We're dragging with the road tool
                const draggingTiles = this.findDraggingTilesForLine();
                if (draggingTiles) {
                    this._draggingTiles = draggingTiles;
                }
            } else if (this._game.toolInUse.id === Toolbar.RESIDENTIAL_ZONE_TOOL) {
                // We're dragging with a zoning tool
                const draggingTiles = this.findDraggingTilesForRectangle();
                if (draggingTiles) {
                    this._draggingTiles = draggingTiles;
                }
            } else {
                // We're dragging with a tool that affects individual structures/zones on tiles
                const point = new Point(this._dragEvent.originalEvent.x, this._dragEvent.originalEvent.y),
                    hit = this._game.renderer.plugins.interaction.hitTest(point),
                    hitXYArray = hit.name.split(',');
                this.addDraggingTile(this.findTileByXY(Number(hitXYArray[0]), Number(hitXYArray[1])));
            }
        }
    }

    findDraggingTilesForLine(): Tile[] {
        // Get the coordinates of the mouse at this moment
        const currentX = this._dragEvent.originalEvent.x,
            currentY = this._dragEvent.originalEvent.y,
            absDiffX = Math.abs(this._dragFirstX - currentX),
            absDiffY = Math.abs(this._dragFirstY - currentY);

        // Make a bounding box for intersection-testing
        let boundingBoxX, boundingBoxY, boundingBoxWidth, boundingBoxHeight;
        if (absDiffX > absDiffY) {
            boundingBoxY = this._dragFirstY;
            boundingBoxHeight = 1;
            if (currentX < this._dragFirstX) {
                // We're moving to the left
                boundingBoxX = currentX;
                boundingBoxWidth = this._dragFirstX - currentX;
            } else {
                // We're moving to the right
                boundingBoxX = this._dragFirstX;
                boundingBoxWidth = currentX - this._dragFirstX;
            }
        } else {
            boundingBoxX = this._dragFirstX;
            boundingBoxWidth = 1;
            if (currentY < this._dragFirstY) {
                // We're moving up
                boundingBoxY = currentY;
                boundingBoxHeight = this._dragFirstY - currentY;
            } else {
                // We're moving down
                boundingBoxY = this._dragFirstY;
                boundingBoxHeight = currentY - this._dragFirstY;
            }
        }

        return this.findInsersectingTiles(boundingBoxX, boundingBoxY, boundingBoxWidth, boundingBoxHeight);
    }

    findDraggingTilesForRectangle(): Tile[] {
        // Get the coordinates of the mouse at this moment
        const currentX = this._dragEvent.originalEvent.x,
            currentY = this._dragEvent.originalEvent.y;

        // Make a bounding box for intersection-testing
        let boundingBoxX, boundingBoxY, boundingBoxWidth, boundingBoxHeight;
        if (currentX < this._dragFirstX) {
            // We're moving to the left
            boundingBoxX = currentX;
            boundingBoxWidth = this._dragFirstX - currentX;
        } else {
            // We're moving to the right
            boundingBoxX = this._dragFirstX;
            boundingBoxWidth = currentX - this._dragFirstX;
        }
        if (currentY < this._dragFirstY) {
            // We're moving up
            boundingBoxY = currentY;
            boundingBoxHeight = this._dragFirstY - currentY;
        } else {
            // We're moving down
            boundingBoxY = this._dragFirstY;
            boundingBoxHeight = currentY - this._dragFirstY;
        }

        return this.findInsersectingTiles(boundingBoxX, boundingBoxY, boundingBoxWidth, boundingBoxHeight);
    }

    findInsersectingTiles(boundingBoxX, boundingBoxY, boundingBoxWidth, boundingBoxHeight): Tile[] {
        const intersectingTiles = [];
        // Loop through each Tile to find ones that intersect with our bounding box
        for (const tile of this._tiles) {
            if (
                Grid.areContainersIntersecting(
                    tile.x + this._grid.x,
                    tile.y + this._grid.y,
                    Grid.TILE_WIDTH * Game.SPRITE_SCALE,
                    Grid.TILE_HEIGHT * Game.SPRITE_SCALE,
                    boundingBoxX,
                    boundingBoxY,
                    boundingBoxWidth,
                    boundingBoxHeight,
                )
            ) {
                intersectingTiles.push(tile);
            }
        }
        return intersectingTiles;
    }

    static areContainersIntersecting(
        r1X: number,
        r1Y: number,
        r1W: number,
        r1H: number,
        r2X: number,
        r2Y: number,
        r2W: number,
        r2H: number,
    ): boolean {
        return !(r2X > r1X + r1W || r2X + r2W < r1X || r2Y > r1Y + r1H || r2Y + r2H < r1Y);
    }

    findTileByXY(x: number, y: number): Tile | null {
        for (const tile of this._tiles) {
            if (tile.x === x && tile.y === y) {
                return tile;
            }
        }
        return null;
    }

    addDraggingTile(tile: Tile): void {
        if (tile === null) {
            return;
        }
        for (const existingTile of this._draggingTiles) {
            if (existingTile === tile) {
                return;
            }
        }
        this._draggingTiles.push(tile);
    }

    isTileInDrag(tile: Tile): boolean {
        for (const existingTile of this._draggingTiles) {
            if (existingTile === tile) {
                return true;
            }
        }
        return false;
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get game(): Game {
        return this._game;
    }

    set game(value: Game) {
        this._game = value;
    }

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
