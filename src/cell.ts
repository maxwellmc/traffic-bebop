/**
 * Represents a location on a Map, with a terrain type and optionally the game
 * piece that it is hosting.
 */
import Map from './map';

export default class Cell {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly TERRAIN_TYPE_GRASS = 0;
    public static readonly ZONE_TYPE_UNZONED = 0;
    public static readonly ZONE_TYPE_RESIDENTIAL = 1;
    public static readonly STRUCTURE_TYPE_EMPTY = 0;
    public static readonly STRUCTURE_TYPE_ROAD = 1;
    public static readonly STRUCTURE_TYPE_HOUSE = 2;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _map: Map;
    private _terrainType: number;
    private _zoneType: number;
    private _structureType: number;

    constructor(map: Map, terrainType: number) {
        this._map = map;
        this._terrainType = terrainType;
        this._zoneType = Cell.ZONE_TYPE_UNZONED;
        this._structureType = Cell.STRUCTURE_TYPE_EMPTY;
    }

    getLeftNeighbor(): Cell | null {
        const row = this._map.getRowByCell(this),
            col = this._map.getColByCell(this);

        return this._map.getCellByRowColumn(row, col - 1);
    }

    getRightNeighbor(): Cell | null {
        const row = this._map.getRowByCell(this),
            col = this._map.getColByCell(this);

        return this._map.getCellByRowColumn(row, col + 1);
    }

    getTopNeighbor(): Cell | null {
        const row = this._map.getRowByCell(this),
            col = this._map.getColByCell(this);

        return this._map.getCellByRowColumn(row - 1, col);
    }

    getBottomNeighbor(): Cell | null {
        const row = this._map.getRowByCell(this),
            col = this._map.getColByCell(this);

        return this._map.getCellByRowColumn(row + 1, col);
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

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get map(): Map {
        return this._map;
    }

    set map(value: Map) {
        this._map = value;
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
