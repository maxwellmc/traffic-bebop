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
    public static readonly TINT_RESIDENTIAL_ZONE = 0x5fedba;
    public static readonly TINT_STRUCTURE_HOUSE = 0x21bf39;

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
                if(this._cell.zoneType === Cell.ZONE_TYPE_RESIDENTIAL) {
                    // Add the zone sprite
                    const zoneGraphic = new Sprite(this._spritesheet.textures['zone-r.png']);
                    zoneGraphic.x = this._x;
                    zoneGraphic.y = this._y;
                    zoneGraphic.alpha = 0.7;
                    zoneGraphic.scale.set(Game.SPRITE_SCALE);
                    zoneGraphic.interactive = true;
                    tileGraphics.push(zoneGraphic);
                }
            }

            if (this._cell.structureType === Cell.STRUCTURE_TYPE_ROAD) {
                const roadGraphic = new Sprite(this._spritesheet.textures['road-y.png']);
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
