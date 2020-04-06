/**
 * Represents a location on a Map, with a terrain type and optionally the game
 * piece that it is hosting.
 */
export default class Cell {

  // Constants
  public static readonly TERRAIN_TYPE_GRASS = 0;
  public static readonly TERRAIN_TYPE_ROAD = 1;
  public static readonly ZONE_TYPE_RESIDENTIAL = 0;

  // Class properties
  private _terrainType: number;
  private _zoneType: number;
  private _gamePiece; // TODO

  constructor(terrainType: number) {
    this._terrainType = terrainType;
  }

  // Getters and setters -------------------------------------------------------

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
}
