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

import GameMap from './GameMap';

export enum TerrainTypes {
    Grass,
}

export enum ZoneTypes {
    Unzoned,
    Residential,
    Commercial,
}

export enum StructureTypes {
    Empty,
    Road,
    House,
    Business,
}

/**
 * Represents a location on a GameMap, with a terrain type and optionally the game piece that it is hosting.
 */
export default class Cell {
    /* Constants ---------------------------------------------------------------------------------------------------- */

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _map: GameMap;
    private _id: number;
    private _row: number;
    private _col: number;
    private _terrainType: number;
    private _zoneType: number;
    private _structureType: number;

    constructor(map: GameMap, id: number, row: number, col: number, terrainType: number) {
        this._map = map;
        this._id = id;
        this._row = row;
        this._col = col;
        this._terrainType = terrainType;
        this._zoneType = ZoneTypes.Unzoned;
        this._structureType = StructureTypes.Empty;
    }

    getLeftNeighbor(): Cell | null {
        return this._map.getCellByRowColumn(this._row, this._col - 1);
    }

    getRightNeighbor(): Cell | null {
        return this._map.getCellByRowColumn(this._row, this._col + 1);
    }

    getTopNeighbor(): Cell | null {
        return this._map.getCellByRowColumn(this._row - 1, this._col);
    }

    getBottomNeighbor(): Cell | null {
        return this._map.getCellByRowColumn(this._row + 1, this._col);
    }

    doesLeftNeighborHaveStructure(structureType: StructureTypes): boolean {
        return this.getLeftNeighbor().structureType === structureType;
    }

    doesRightNeighborHaveStructure(structureType: StructureTypes): boolean {
        return this.getRightNeighbor().structureType === structureType;
    }

    doesTopNeighborHaveStructure(structureType: StructureTypes): boolean {
        return this.getTopNeighbor().structureType === structureType;
    }

    doesBottomNeighborHaveStructure(structureType: StructureTypes): boolean {
        return this.getBottomNeighbor().structureType === structureType;
    }

    doesAnyNeighborHaveStructure(structureType: StructureTypes): boolean {
        return (
            this.doesLeftNeighborHaveStructure(structureType) ||
            this.doesRightNeighborHaveStructure(structureType) ||
            this.doesTopNeighborHaveStructure(structureType) ||
            this.doesBottomNeighborHaveStructure(structureType)
        );
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get map(): GameMap {
        return this._map;
    }

    set map(value: GameMap) {
        this._map = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get row(): number {
        return this._row;
    }

    set row(value: number) {
        this._row = value;
    }

    get col(): number {
        return this._col;
    }

    set col(value: number) {
        this._col = value;
    }

    get terrainType(): number {
        return this._terrainType;
    }

    set terrainType(value) {
        this._terrainType = value;
    }

    get zoneType(): number {
        return this._zoneType;
    }

    set zoneType(value) {
        this._zoneType = value;
    }

    get structureType(): number {
        return this._structureType;
    }

    set structureType(value: number) {
        this._structureType = value;
    }
}
