import Cell from './cell';

/**
 * Represents the (not necessarily viewable) arrangement of cells
 * in terms of rows and columns.
 */
export default class Map {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly MAP_ROWS = 20;
    public static readonly MAP_COLS = 30;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _map: Cell[][];

    constructor() {
        this._map = [];

        for (let row = 0; row < Map.MAP_ROWS; row++) {
            const rowItems = [];
            for (let col = 0; col < Map.MAP_COLS; col++) {
                // Add a cell with a default terrain of grass
                rowItems.push(new Cell(this, Cell.TERRAIN_TYPE_GRASS));
            }
            this._map.push(rowItems);
        }
    }

    getCellByRowColumn(row: number, col: number): Cell {
        return this._map[row][col];
    }

    getRowByCell(cell: Cell): number | null {
        for (let row = 0; row < Map.MAP_ROWS; row++) {
            for (let col = 0; col < Map.MAP_COLS; col++) {
                if (this._map[row][col] === cell) {
                    return row;
                }
            }
        }
        return null;
    }

    getColByCell(cell: Cell): number | null {
        for (let row = 0; row < Map.MAP_ROWS; row++) {
            for (let col = 0; col < Map.MAP_COLS; col++) {
                if (this._map[row][col] === cell) {
                    return col;
                }
            }
        }
        return null;
    }

    findCellsByZoneAndStructure(zoneType: number, structureType: number): Cell[] {
        const matchingCells = [];
        for (let row = 0; row < Map.MAP_ROWS; row++) {
            for (let col = 0; col < Map.MAP_COLS; col++) {
                const cell = this.getCellByRowColumn(row, col);
                if (cell.zoneType === zoneType && cell.structureType === structureType) {
                    matchingCells.push(cell);
                }
            }
        }
        return matchingCells;
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get map(): Cell[][] {
        return this._map;
    }

    set map(value) {
        this._map = value;
    }
}
