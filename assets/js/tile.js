import {Graphics} from 'pixi.js';
import ViewableObject from './viewable-object';
import Grid from './grid';

/**
 * A cell within the world.
 */
export default class Tile extends ViewableObject {

  // Constants
  static COLOR_GRASS = '7fcd91';
  static COLOR_ROAD = '5b5656';

  // Class properties
  #grid;
  #x;
  #y;
  #tileType;

  constructor(grid, x, y) {
    super();

    this.#grid = grid;
    this.#x = x;
    this.#y = y;

    // Set the defaullt tile to grass
    this.#tileType = Grid.TILE_TYPE_GRASS;

    this.updateTileGraphic();
  }

  updateTileGraphic() {

    let fillColor = '0x';

    switch (this.#tileType) {
      case Grid.TILE_TYPE_GRASS:
        fillColor += Tile.COLOR_GRASS;
        break;
      case Grid.TILE_TYPE_ROAD:
        fillColor += Tile.COLOR_ROAD;
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

    rectangle.on('mousedown', (e) => this.#grid.onTileClick(e));

    this.graphics = [rectangle];
  }

  // Getters and setters -------------------------------------------------------

  get x() {
    return this.#x;
  }

  set x(value) {
    this.#x = value;
  }

  get tileType() {
    return this.#tileType;
  }

  set tileType(value) {
    this.#tileType = value;

    this.updateTileGraphic();
  }
}
