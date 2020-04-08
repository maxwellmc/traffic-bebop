import ViewableObject from './viewable-object';
import Grid from './grid';
import Cell from './cell';
import { LoaderResource, Sprite, Container } from 'pixi.js';
import Game from './game';

/**
 * A cell within the world.
 */
export default class Tile extends ViewableObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly SPRITE_FILE_ROAD_MIDDLE = 'road-m.png';
    public static readonly SPRITE_FILE_ROAD_X = 'road-x.png';
    public static readonly SPRITE_FILE_ROAD_X_LEFT = 'road-xl.png';
    public static readonly SPRITE_FILE_ROAD_X_RIGHT = 'road-xr.png';
    public static readonly SPRITE_FILE_ROAD_Y = 'road-y.png';
    public static readonly SPRITE_FILE_ROAD_Y_BOTTOM = 'road-yb.png';
    public static readonly SPRITE_FILE_ROAD_Y_TOP = 'road-yt.png';
    public static readonly SPRITE_FILE_ROAD_BOTTOM_LEFT = 'road-bl.png';
    public static readonly SPRITE_FILE_ROAD_BOTTOM_RIGHT = 'road-br.png';
    public static readonly SPRITE_FILE_ROAD_TOP_LEFT = 'road-tl.png';
    public static readonly SPRITE_FILE_ROAD_TOP_RIGHT = 'road-tr.png';
    public static readonly SPRITE_FILE_ROAD_INTERSECT_LEFT = 'road-il.png';
    public static readonly SPRITE_FILE_ROAD_INTERSECT_RIGHT = 'road-ir.png';
    public static readonly SPRITE_FILE_ROAD_INTERSECT_BOTTOM = 'road-ib.png';
    public static readonly SPRITE_FILE_ROAD_INTERSECT_TOP = 'road-it.png';
    public static readonly SPRITE_FILE_ROAD_INTERSECT_MIDDLE = 'road-im.png';

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _grid: Grid;
    private _x: number;
    private _y: number;
    private _cell: Cell;
    private _spritesheet: LoaderResource;

    constructor(grid: Grid, x: number, y: number, cell: Cell, spritesheet: LoaderResource) {
        super();

        this._grid = grid;
        this._x = x;
        this._y = y;
        this._cell = cell;
        this._spritesheet = spritesheet;

        this.generateGraphics();
    }

    generateGraphics(): void {
        const tileGraphics = [];

        if (this._cell.terrainType === Cell.TERRAIN_TYPE_GRASS) {
            const grassGraphic = new Sprite(this._spritesheet.textures['grass.png']);
            grassGraphic.x = this._x;
            grassGraphic.y = this._y;
            grassGraphic.scale.set(Game.SPRITE_SCALE);
            grassGraphic.interactive = true;

            grassGraphic.on('mousedown', (e) => this._grid.onTileClick(e, this));

            tileGraphics.push(grassGraphic);

            if (this._cell.structureType === Cell.STRUCTURE_TYPE_EMPTY) {
                if (this._cell.zoneType === Cell.ZONE_TYPE_RESIDENTIAL) {
                    // Add the zone sprite
                    const zoneGraphic = new Sprite(this._spritesheet.textures['zone-r.png']);
                    zoneGraphic.x = this._x;
                    zoneGraphic.y = this._y;
                    zoneGraphic.scale.set(Game.SPRITE_SCALE);
                    zoneGraphic.interactive = true;
                    tileGraphics.push(zoneGraphic);
                }
            }

            if (this._cell.structureType === Cell.STRUCTURE_TYPE_ROAD) {
                const roadFilename = this.determineRoadOrientation();

                const roadGraphic = new Sprite(this._spritesheet.textures[roadFilename]);
                roadGraphic.x = this._x;
                roadGraphic.y = this._y;
                roadGraphic.scale.set(Game.SPRITE_SCALE);
                roadGraphic.interactive = true;
                tileGraphics.push(roadGraphic);

                roadGraphic.on('mousedown', (e) => this._grid.onTileClick(e, this));
            } else if (this._cell.structureType === Cell.STRUCTURE_TYPE_HOUSE) {
                const houseGraphic = new Sprite(this._spritesheet.textures['house1.png']);
                houseGraphic.x = this._x;
                houseGraphic.y = this._y;
                houseGraphic.scale.set(Game.SPRITE_SCALE);
                houseGraphic.interactive = true;
                tileGraphics.push(houseGraphic);
            }

            // Add the grid sprite
            const gridGraphic = new Sprite(this._spritesheet.textures['grid.png']);
            gridGraphic.x = this._x;
            gridGraphic.y = this._y;
            gridGraphic.scale.set(Game.SPRITE_SCALE);
            gridGraphic.interactive = true;
            gridGraphic.on('mousedown', (e) => this._grid.onTileClick(e, this));
            tileGraphics.push(gridGraphic);
        }

        this._graphics = tileGraphics;
    }

    determineRoadOrientation(): string {
        const bottomIsRoad = this._cell.doesBottomNeighborHaveStructure(Cell.STRUCTURE_TYPE_ROAD),
            topIsRoad = this._cell.doesTopNeighborHaveStructure(Cell.STRUCTURE_TYPE_ROAD),
            leftIsRoad = this._cell.doesLeftNeighborHaveStructure(Cell.STRUCTURE_TYPE_ROAD),
            rightIsRoad = this._cell.doesRightNeighborHaveStructure(Cell.STRUCTURE_TYPE_ROAD);

        // If the cell to the left of us is a road
        if (leftIsRoad) {
            // If the cells to the left and top are roads
            if (topIsRoad) {
                // If the cells to the left, top, and bottom are roads
                if (bottomIsRoad) {
                    // If the cells to the left, top, bottom, and right are roads
                    if (rightIsRoad) {
                        // We need the "intersection-middle" sprite
                        return Tile.SPRITE_FILE_ROAD_INTERSECT_MIDDLE;
                    }
                    // We need the "intersection-right" sprite
                    return Tile.SPRITE_FILE_ROAD_INTERSECT_RIGHT;
                }
                // If the cells to the left, top, and right are roads
                if (rightIsRoad) {
                    // We need the "intersection-bottom" sprite
                    return Tile.SPRITE_FILE_ROAD_INTERSECT_BOTTOM;
                }
                // We need the "bottom-right" sprite
                return Tile.SPRITE_FILE_ROAD_BOTTOM_RIGHT;
            }
            // If the cells to the left and bottom are roads
            if (bottomIsRoad) {
                // If the cells to the left, bottom, and right are roads
                if (rightIsRoad) {
                    // We need the "intersection-top" sprite
                    return Tile.SPRITE_FILE_ROAD_INTERSECT_TOP;
                }
                // We need the "top-right" sprite
                return Tile.SPRITE_FILE_ROAD_TOP_RIGHT;
            }
            // If the cells to the left and right are roads
            if (rightIsRoad) {
                // We just need the horizontal sprite
                return Tile.SPRITE_FILE_ROAD_X;
            }
            // We need the "horizontal right" sprite
            return Tile.SPRITE_FILE_ROAD_X_RIGHT;
        }

        // If the cell to the right of us is a road
        if (rightIsRoad) {
            // If the cells to the right and top are roads
            if (topIsRoad) {
                // If the cells to the right, top, and bottom are roads
                if (bottomIsRoad) {
                    // We need the "intersection-left" sprite
                    return Tile.SPRITE_FILE_ROAD_INTERSECT_LEFT;
                }
                // We need the "bottom-left" sprite
                return Tile.SPRITE_FILE_ROAD_BOTTOM_LEFT;
            }
            // If the cells to the right and bottom are roads
            if (bottomIsRoad) {
                // We need the "top-right" sprite
                return Tile.SPRITE_FILE_ROAD_TOP_LEFT;
            }
            // We need the "horizontal left" sprite
            return Tile.SPRITE_FILE_ROAD_X_LEFT;
        }

        if (topIsRoad) {
            if (bottomIsRoad) {
                // We just need the vertical sprite
                return Tile.SPRITE_FILE_ROAD_Y;
            }
            // We need the "vertical bottom" sprite
            return Tile.SPRITE_FILE_ROAD_Y_BOTTOM;
        }
        if (bottomIsRoad) {
            // We need the "vertical top" sprite
            return Tile.SPRITE_FILE_ROAD_Y_TOP;
        }

        // No neighboring roads
        return Tile.SPRITE_FILE_ROAD_MIDDLE;
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get x(): number {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get cell(): Cell {
        return this._cell;
    }
}
