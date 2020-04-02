/**
 * Represents a location on a Map, with a terrain type and optionally the game
 * piece that it is hosting.
 */
export default class Cell {

  // Constants
  static TERRAIN_TYPE_GRASS = 0;
  static TERRAIN_TYPE_ROAD = 1;
  static ZONE_TYPE_RESIDENTIAL = 0;

  // Class properties
  #terrainType;
  #zoneType;
  #gamePiece;

  constructor(terrainType) {
    this.#terrainType = terrainType;
  }

  // Getters and setters -------------------------------------------------------

  get terrainType() {
    return this.#terrainType;
  }

  set terrainType(value) {
    this.#terrainType = value;
  }

  get zoneType() {
    return this.#zoneType;
  }

  set zoneType(value) {
    this.#zoneType = value;
  }
}
