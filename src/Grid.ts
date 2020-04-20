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

import Tile from './Tile';
import { Tools } from './nonworld/tool/Toolbar';
import Game from './Game';
import { StructureTypes, TerrainTypes, ZoneTypes } from './Cell';
import GameMap from './GameMap';
import { Container, Point } from 'pixi.js';
import InteractionEvent = PIXI.interaction.InteractionEvent;
import InteractionData = PIXI.interaction.InteractionData;
import {GameEvents, GridEvents} from './Events';

/**
 * Visually represents the GameMap, as translated to an arrangement of viewable Tiles.
 */
export default class Grid {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly GRID_MARGIN = 50; // Will be scaled by the zoom level
    public static readonly TILE_WIDTH = 32;
    public static readonly TILE_HEIGHT = 32;
    public static readonly TOOL_COSTS: Record<number, number> = {
        [Tools.Road]: -10,
        [Tools.ZoneResidential]: -100,
        [Tools.ZoneCommercial]: -150,
    };

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game: Game;
    private _grid: Container;
    private _startingX: number;
    private _startingY: number;
    private _width: number;
    private _height: number;
    private _tiles: Tile[];
    // Whether the user is currently dragging their cursor
    private _dragging: boolean;
    private _dragEvent: InteractionData;
    // The Tiles we are considering to be currently in the dragging zone
    private _draggingTiles: Tile[];
    private _dragFirstX: number;
    private _dragFirstY: number;
    private _dragLastX: number;
    private _dragLastY: number;
    private _showGridLayer: boolean;

    constructor(game: Game) {
        this._game = game;
        this._grid = new Container();
        this._startingX = 0;
        this._startingY = 0;
        this._tiles = [];
        this._dragging = false;
        this._draggingTiles = [];
        this._showGridLayer = true;

        // Center the grid in the app
        this._width = GameMap.COLS * (Grid.TILE_WIDTH * Game.SPRITE_SCALE);
        this._height = GameMap.ROWS * (Grid.TILE_HEIGHT * Game.SPRITE_SCALE);

        // Set up the listeners for cursor interactions with the Grid
        this._grid.interactive = true;
        this._grid
            // Events for cursor start
            .on('mousedown', (e) => this.onCursorStart(e))
            .on('touchstart', (e) => this.onCursorStart(e))
            // Events for cursor end
            .on('mouseup', () => this.onCursorEnd())
            .on('mouseupoutside', () => this.onCursorEnd())
            .on('touchend', () => this.onCursorEnd())
            .on('touchendoutside', () => this.onCursorEnd())
            // Events for cursor move
            .on('mousemove', () => this.onCursorMove())
            .on('touchmove', () => this.onCursorMove());

        // Listen for when the Grid layer is toggled
        this._game.eventEmitter.on(GridEvents.GridLayerToggled, () => this.onGridLayerToggled());
    }

    generateGraphics(): void {
        let x = this._startingX;
        let y = this._startingY;

        // Create a Tile for every Cell in the game
        for (let row = 0; row < GameMap.ROWS; row++) {
            for (let col = 0; col < GameMap.COLS; col++) {
                // Find the Cell for this row/column combination
                const cell = this._game.gameMap.getCellByRowColumn(row, col);

                // Create a new Tile for it
                const tile = new Tile(this, x, y, cell, this._game.spritesheet);

                // Let the Cell have a reference to the Tile
                cell.tile = tile;

                // Add the Tile to our list
                this._tiles = this._tiles.concat(tile);

                x += Grid.TILE_WIDTH * Game.SPRITE_SCALE;
            }
            y += Grid.TILE_HEIGHT * Game.SPRITE_SCALE;
            x = this._startingX;
        }
    }

    /**
     * Takes an array of Tiles and applies the current tool to all of them.
     *
     * @param tiles
     */
    applyToolToTiles(tiles: Tile[]): void {
        for (const tile of tiles) {
            this.applyToolToTile(tile);
        }
    }

    /**
     * Alters a Tile's underlying Cell based on the current "tool in use".
     *
     * @param tile
     */
    applyToolToTile(tile): boolean {
        switch (this._game.toolInUse.id) {
            case Tools.Select:
                // Return true to propagate this event up to the grid
                return true;
            case Tools.Road:
                if (tile.cell.zoneType !== ZoneTypes.Unzoned || tile.cell.structureType !== StructureTypes.Empty) {
                    break;
                }
                tile.cell.structureType = StructureTypes.Road;
                this._game.eventEmitter.emit(GameEvents.MoneyDeducted, Grid.TOOL_COSTS[Tools.Road]);
                break;
            case Tools.Bulldoze:
                if (tile.cell.structureType !== StructureTypes.Empty) {
                    tile.cell.structureType = StructureTypes.Empty;
                } else {
                    tile.cell.zoneType = ZoneTypes.Unzoned;
                }
                break;
            case Tools.ZoneResidential:
                if (tile.cell.zoneType !== ZoneTypes.Unzoned || tile.cell.structureType !== StructureTypes.Empty) {
                    break;
                }
                tile.cell.terrainType = TerrainTypes.Grass;
                tile.cell.zoneType = ZoneTypes.Residential;
                this._game.eventEmitter.emit(GameEvents.MoneyDeducted, Grid.TOOL_COSTS[Tools.ZoneResidential]);
                break;
            case Tools.ZoneCommercial:
                if (tile.cell.zoneType !== ZoneTypes.Unzoned || tile.cell.structureType !== StructureTypes.Empty) {
                    break;
                }
                tile.cell.terrainType = TerrainTypes.Grass;
                tile.cell.zoneType = ZoneTypes.Commercial;
                this._game.eventEmitter.emit(GameEvents.MoneyDeducted, Grid.TOOL_COSTS[Tools.ZoneCommercial]);
                break;
        }
    }

    /**
     * Handles the `mousedown` and `touchstart` cursor events.
     * These events always start a "drag" event, even if the user doesn't actually drag.
     *
     * @param event
     */
    onCursorStart(event: InteractionEvent): void {
        // Store a reference to the data (because of multitouch)
        this._dragEvent = event.data;
        this._dragging = true;
        this._dragFirstX = event.data.global.x;
        this._dragFirstY = event.data.global.y;
        this._dragLastX = this._dragFirstX;
        this._dragLastY = this._dragFirstY;

        // Call `onCursorMove` in case this is a single, non-moving click, and not a drag motion
        this.onCursorMove();
    }

    /**
     * Handles the `mouseup`, `mouseupoutside`, `touchend`, and `touchendoutside` cursor events.
     * These events always end a "drag" event.
     */
    onCursorEnd(): void {
        this._dragging = false;
        this._dragEvent = null;

        // Apply the "tool in use" to these tiles
        this.applyToolToTiles(this._draggingTiles);

        // Reset the array of tiles in the drag event
        this._draggingTiles = [];
    }

    /**
     * Handles the `mousemove` and `touchmove` cursor events.
     * Depending on the "tool in use", there are different effects of a cursor movement.
     */
    onCursorMove(): void {
        // If we're dragging
        if (this._dragging) {
            // If we're dragging with the Select tool
            if (this._game.toolInUse.id === Tools.Select) {
                const movementX = this._dragEvent.global.x - this._dragLastX,
                    movementY = this._dragEvent.global.y - this._dragLastY,
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

                // Set the "last" coordinates to these for the next move
                this._dragLastX = this._dragEvent.global.x;
                this._dragLastY = this._dragEvent.global.y;
            } else if (this._game.toolInUse.id === Tools.Road) {
                // We're dragging with the road tool
                const draggingTiles = this.findDraggingTilesForLine();
                if (draggingTiles) {
                    this._draggingTiles = draggingTiles;
                }
            } else if (
                this._game.toolInUse.id === Tools.ZoneResidential ||
                this._game.toolInUse.id === Tools.ZoneCommercial ||
                this._game.toolInUse.id === Tools.Bulldoze
            ) {
                // We're dragging with a zoning or bulldozing tools
                const draggingTiles = this.findDraggingTilesForRectangle();
                if (draggingTiles) {
                    this._draggingTiles = draggingTiles;
                }
            } else {
                // We're dragging with a tool that affects individual structures/zones on tiles
                const point = new Point(this._dragEvent.global.x, this._dragEvent.global.y),
                    hit = this._game.renderer.plugins.interaction.hitTest(point),
                    hitXYArray = hit.name.split(',');
                this.addDraggingTile(this.findTileByXY(Number(hitXYArray[0]), Number(hitXYArray[1])));
            }
        }
    }

    /**
     * Using the current cursor position and the first cursor position when the "drag" event started,
     * this finds all the Tiles in between those two positions, locking the search into a straight line.
     */
    findDraggingTilesForLine(): Tile[] {
        // Get the coordinates of the mouse at this moment
        const currentX = this._dragEvent.global.x,
            currentY = this._dragEvent.global.y,
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

    /**
     * Using the current cursor position and the first cursor position when the "drag" event started,
     * this finds all the Tiles in between those two positions, locking the search into a rectangle.
     */
    findDraggingTilesForRectangle(): Tile[] {
        // Get the coordinates of the mouse at this moment
        const currentX = this._dragEvent.global.x,
            currentY = this._dragEvent.global.y;

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

    /**
     * Given the parameters of a "bounding box", this find all the Tiles that intersect with that bounding box.
     *
     * @param boundingBoxX
     * @param boundingBoxY
     * @param boundingBoxWidth
     * @param boundingBoxHeight
     */
    findInsersectingTiles(boundingBoxX, boundingBoxY, boundingBoxWidth, boundingBoxHeight): Tile[] {
        const intersectingTiles = [];
        // Loop through each Tile to find ones that intersect with our bounding box
        for (const tile of this._tiles) {
            if (
                Grid.areRectanglesIntersecting(
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

    /**
     * A generic function for seeing if two rectangles (described by their X position, Y position, width, and height)
     * intersect with each other at any point.
     *
     * @param r1X
     * @param r1Y
     * @param r1W
     * @param r1H
     * @param r2X
     * @param r2Y
     * @param r2W
     * @param r2H
     */
    static areRectanglesIntersecting(
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

    /**
     * Finds the one Tile with the matching X and Y position.
     * Note that this does not check if the Tile *contains* that point; it only matches the Tile's "starting" point.
     *
     * @param x
     * @param y
     */
    findTileByXY(x: number, y: number): Tile | null {
        for (const tile of this._tiles) {
            if (tile.x === x && tile.y === y) {
                return tile;
            }
        }
        return null;
    }

    /**
     * Adds the provided Tile to the `draggingTiles` list.
     *
     * @param tile
     */
    addDraggingTile(tile: Tile): void {
        // Return if null
        if (tile === null) {
            return;
        }
        // Return if the list already contains this Tile
        for (const existingTile of this._draggingTiles) {
            if (existingTile === tile) {
                return;
            }
        }
        this._draggingTiles.push(tile);
    }

    /**
     * Determines if the provided Tile is currently in the `draggingTiles` list.
     *
     * @param tile
     */
    isTileInDrag(tile: Tile): boolean {
        for (const existingTile of this._draggingTiles) {
            if (existingTile === tile) {
                return true;
            }
        }
        return false;
    }

    onGridLayerToggled(): void {
        this._showGridLayer = !this._showGridLayer;
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

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get tiles(): Tile[] {
        return this._tiles;
    }

    set tiles(value) {
        this._tiles = value;
    }

    get showGridLayer(): boolean {
        return this._showGridLayer;
    }

    set showGridLayer(value: boolean) {
        this._showGridLayer = value;
    }
}
