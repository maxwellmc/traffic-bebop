import ViewableObject from './viewable-object';
import Grid from './grid';
import Cell from './cell';

/**
 * A cell within the world.
 */
export default class Tile extends ViewableObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly COLOR_GRASS = '7fcd91';
    public static readonly COLOR_ROAD = '5b5656';
    public static readonly COLOR_RESIDENTIAL_ZONE = '639a67';

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _grid: Grid;
    private _x: number;
    private _y: number;
    private _cell: Cell;

    constructor(grid: Grid, x: number, y: number, cell: Cell) {
        super();

        this._grid = grid;
        this._x = x;
        this._y = y;
        this._cell = cell;

        this.generateGraphics();
    }

    generateGraphics(): void {
        let fillColor = '0x';

        switch (this._cell.terrainType) {
            case Cell.TERRAIN_TYPE_GRASS:
                fillColor += Tile.COLOR_GRASS;
                break;
            case Cell.TERRAIN_TYPE_ROAD:
                fillColor += Tile.COLOR_ROAD;
                break;
        }

        switch (this._cell.zoneType) {
            case Cell.ZONE_TYPE_RESIDENTIAL:
                fillColor += Tile.COLOR_RESIDENTIAL_ZONE;
                break;
        }

        // Rectangle
        const rectangle = ViewableObject.generateRectangle(
            1,
            0x4d4646,
            0.1,
            fillColor,
            Grid.TILE_WIDTH,
            Grid.TILE_HEIGHT,
            this._x,
            this._y,
        );

        rectangle.on('mousedown', (e) => this._grid.onTileClick(e, this));

        this._graphics = [rectangle];
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
