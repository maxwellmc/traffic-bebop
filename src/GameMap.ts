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

import Cell, { StructureTypes, TerrainTypes, ZoneTypes } from './Cell';

/**
 * Represents the (not necessarily viewable) arrangement of cells in terms of rows and columns.
 */
export default class GameMap {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly ROWS = 20;
    public static readonly COLS = 30;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _map: Cell[][];

    constructor() {
        this._map = [];

        let id = 0;
        for (let row = 0; row < GameMap.ROWS; row++) {
            const rowItems = [];
            for (let col = 0; col < GameMap.COLS; col++) {
                // Add a cell with a default terrain of grass
                rowItems.push(new Cell(this, id, row, col, TerrainTypes.Grass));
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
    findCellsByStructure(structureType: StructureTypes): Cell[] {
        const matchingCells = [];
        for (let row = 0; row < GameMap.ROWS; row++) {
            for (let col = 0; col < GameMap.COLS; col++) {
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
    findCellsByZoneAndStructure(zoneType: ZoneTypes, structureType: StructureTypes): Cell[] {
        const matchingCells = [];
        for (let row = 0; row < GameMap.ROWS; row++) {
            for (let col = 0; col < GameMap.COLS; col++) {
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
