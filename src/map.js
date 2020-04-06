import Cell from './cell';

/**
 * Represents the (not necessarily viewable) arrangement of cells
 * in terms of rows and columns.
 */
export default class Map {

  // Constants
  static MAP_ROWS = 20;
  static MAP_COLS = 20;

  // Class properties
  #map;

  constructor() {
    this.#map = [];

    for (let row = 0; row < Map.MAP_ROWS; row++) {
      let rowItems = [];
      for (let col = 0; col < Map.MAP_COLS; col++) {
        // Add a cell with a default terrain of grass
        rowItems.push(new Cell(Cell.TERRAIN_TYPE_GRASS));
      }
      this.#map.push(rowItems);
    }
  }

  findCellByRowColumn(row, col){
    return this.#map[row][col];
  }

  // Getters and setters -------------------------------------------------------

  get map() {
    return this.#map;
  }

  set map(value) {
    this.#map = value;
  }
}
