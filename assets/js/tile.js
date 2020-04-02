import {Graphics} from 'pixi.js';
import ViewableObject from './viewable-object';
import Grid from './grid';
import Cell from './cell';

/**
 * A cell within the world.
 */
export default class Tile extends ViewableObject {

  // Constants
  static COLOR_GRASS = '7fcd91';
  static COLOR_ROAD = '5b5656';
  static COLOR_RESIDENTIAL_ZONE = '639a67';

  // Class properties
  #grid;
  #x;
  #y;
  #cell;

  constructor(grid, x, y, cell) {
    super();

    this.#grid = grid;
    this.#x = x;
    this.#y = y;
    this.#cell = cell;

    this.updateTileGraphic();
  }

  updateTileGraphic() {

    let fillColor = '0x';

    switch (this.#cell.terrainType) {
      case Cell.TERRAIN_TYPE_GRASS:
        fillColor += Tile.COLOR_GRASS;
        break;
      case Cell.TERRAIN_TYPE_ROAD:
        fillColor += Tile.COLOR_ROAD;
        break;
    }

    switch (this.#cell.zoneType) {
      case Cell.ZONE_TYPE_RESIDENTIAL:
        fillColor += Tile.COLOR_RESIDENTIAL_ZONE;
        break;
    }

    // Rectangle
    const rectangle = new Graphics();
    rectangle.lineStyle(1, 0x4d4646, 0.1);
    rectangle.beginFill(fillColor);
    rectangle.drawRect(0, 0, Grid.TILE_WIDTH, Grid.TILE_HEIGHT);
    rectangle.endFill();
    rectangle.x = this.#x;
    rectangle.y = this.#y;
    rectangle.interactive = true;

    rectangle.on('mousedown', (e) => this.#grid.onTileClick(e, this));

    this.graphics = [rectangle];
  }

  // Getters and setters -------------------------------------------------------

  get x() {
    return this.#x;
  }

  set x(value) {
    this.#x = value;
  }

  get cell() {
    return this.#cell;
  }

}
