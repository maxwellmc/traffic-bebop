/**
 * Represents a location on a GameMap, with a terrain type and optionally the game
 * piece that it is hosting.
 */
import GameMap from './gameMap';

export default class Cell {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly TERRAIN_TYPE_GRASS = 0;
    public static readonly ZONE_TYPE_UNZONED = 0;
    public static readonly ZONE_TYPE_RESIDENTIAL = 1;
    public static readonly STRUCTURE_TYPE_EMPTY = 0;
    public static readonly STRUCTURE_TYPE_ROAD = 1;
    public static readonly STRUCTURE_TYPE_HOUSE = 2;

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
        this._zoneType = Cell.ZONE_TYPE_UNZONED;
        this._structureType = Cell.STRUCTURE_TYPE_EMPTY;
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

    doesLeftNeighborHaveStructure(structureType: number): boolean {
        return this.getLeftNeighbor().structureType === structureType;
    }

    doesRightNeighborHaveStructure(structureType: number): boolean {
        return this.getRightNeighbor().structureType === structureType;
    }

    doesTopNeighborHaveStructure(structureType: number): boolean {
        return this.getTopNeighbor().structureType === structureType;
    }

    doesBottomNeighborHaveStructure(structureType: number): boolean {
        return this.getBottomNeighbor().structureType === structureType;
    }

    doesAnyNeighborHaveStructure(structureType: number): boolean {
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
