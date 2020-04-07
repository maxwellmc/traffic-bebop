import Cell from './cell';

/**
 * Represents the (not necessarily viewable) arrangement of cells
 * in terms of rows and columns.
 */
export default class Map {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly MAP_ROWS = 20;
    public static readonly MAP_COLS = 20;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _map: Cell[][];

    constructor() {
        this._map = [];

        for (let row = 0; row < Map.MAP_ROWS; row++) {
            const rowItems = [];
            for (let col = 0; col < Map.MAP_COLS; col++) {
                // Add a cell with a default terrain of grass
                rowItems.push(new Cell(Cell.TERRAIN_TYPE_GRASS));
            }
            this._map.push(rowItems);
        }
    }

    findCellByRowColumn(row, col): Cell {
        return this._map[row][col];
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get map(): Cell[][] {
        return this._map;
    }

    set map(value) {
        this._map = value;
    }
}
