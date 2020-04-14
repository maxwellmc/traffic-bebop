import Cell from './Cell';

/**
 * Represents the (not necessarily viewable) arrangement of cells in terms of rows and columns.
 */
export default class GameMap {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly MAP_ROWS = 20;
    public static readonly MAP_COLS = 30;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _map: Cell[][];

    constructor() {
        this._map = [];

        let id = 0;
        for (let row = 0; row < GameMap.MAP_ROWS; row++) {
            const rowItems = [];
            for (let col = 0; col < GameMap.MAP_COLS; col++) {
                // Add a cell with a default terrain of grass
                rowItems.push(new Cell(this, id, row, col, Cell.TERRAIN_TYPE_GRASS));
                id++;
            }
            this._map.push(rowItems);
        }
    }

    /**
     * Finds a Cell at the provided row and column.
     *
     * @param row
     * @param col
     */
    getCellByRowColumn(row: number, col: number): Cell | null {
        if (this._map[row] && this._map[row][col]) {
            return this._map[row][col];
        }
        return null;
    }

    /**
     * Finds all Cells with the provided structure type.
     *
     * @param structureType
     */
    findCellsByStructure(structureType: number): Cell[] {
        const matchingCells = [];
        for (let row = 0; row < GameMap.MAP_ROWS; row++) {
            for (let col = 0; col < GameMap.MAP_COLS; col++) {
                const cell = this.getCellByRowColumn(row, col);
                if (cell.structureType === structureType) {
                    matchingCells.push(cell);
                }
            }
        }
        return matchingCells;
    }

    /**
     * Finds all Cells with the provided zone and structure type.
     *
     * @param zoneType
     * @param structureType
     */
    findCellsByZoneAndStructure(zoneType: number, structureType: number): Cell[] {
        const matchingCells = [];
        for (let row = 0; row < GameMap.MAP_ROWS; row++) {
            for (let col = 0; col < GameMap.MAP_COLS; col++) {
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
