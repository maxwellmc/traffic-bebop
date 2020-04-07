/**
 * Represents a location on a Map, with a terrain type and optionally the game
 * piece that it is hosting.
 */
export default class Cell {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly TERRAIN_TYPE_GRASS = 0;
    public static readonly TERRAIN_TYPE_ROAD = 1;
    public static readonly ZONE_TYPE_UNZONED = 0;
    public static readonly ZONE_TYPE_RESIDENTIAL = 1;
    public static readonly STRUCTURE_TYPE_EMPTY = 0;
    public static readonly STRUCTURE_TYPE_HOUSE = 1;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _terrainType: number;
    private _zoneType: number;
    private _structureType: number;

    constructor(terrainType: number) {
        this._terrainType = terrainType;
        this._zoneType = Cell.ZONE_TYPE_UNZONED;
        this._structureType = Cell.STRUCTURE_TYPE_EMPTY;
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

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
