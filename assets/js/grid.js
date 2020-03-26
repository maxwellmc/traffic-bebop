import ViewableObject from './viewable-object';
import Tile from './tile';
import Toolbar from './toolbar';

export default class Grid extends ViewableObject {

  // Constants
  static numRows = 12;
  static numCols = 12;
  static cellWidth = 64;
  static cellHeight = 64;
  static TILE_TYPE_GRASS = 0;
  static TILE_TYPE_ROAD = 1;
  static TILE_LABEL_DICTIONARY = {
    [Grid.TILE_TYPE_GRASS]: 'Grass',
    [Grid.TILE_TYPE_ROAD]: 'Road',
  };

  // Class properties
  #game;
  #startingX;
  #startingY;
  #tiles;

  constructor(game, appWidth, appHeight) {
    super();

    this.#game = game;
    this.#startingX = (appWidth / 2) - ((Grid.numRows * Grid.cellWidth) / 2);
    this.#startingY = (appHeight / 2) - ((Grid.numRows * Grid.cellHeight) / 2);
    this.#tiles = [];

    this.generateGraphics();
    console.log(Grid.TILE_LABEL_DICTIONARY);
  }

  generateGraphics() {
    let x = this.#startingX;
    let y = this.#startingY;

    for (let i = 0; i < Grid.numRows; i++) {
      for (let j = 0; j < Grid.numCols; j++) {
        const tile = new Tile(this, x, y);
        this.#tiles = this.#tiles.concat(tile);

        x += Grid.cellWidth;
      }
      y += Grid.cellHeight;
      x = this.#startingX;
    }
  }

  onTileClick(e) {

    const tile = this.findTileByGraphic(e.currentTarget);

    console.log(
        'onTileClick before: ' + Grid.TILE_LABEL_DICTIONARY[tile.tileType]);
    if (this.#game.toolInUse.id === Toolbar.ROAD_TOOL) {
      tile.tileType = Grid.TILE_TYPE_ROAD;
      tile.x = tile.x + 1;
      // tile.updateTileGraphic();
    }
    console.log(
        'onTileClick after: ' + Grid.TILE_LABEL_DICTIONARY[tile.tileType]);
  }

  /** @returns Tile */
  findTileByGraphic(graphic) {
    for (const tile of this.#tiles) {
      if (tile.graphics[0] === graphic) {
        return tile;
      }
    }
    return null;
  }

  // Getters and setters -------------------------------------------------------

  get tiles() {
    return this.#tiles;
  }

  set tiles(value) {
    this.#tiles = value;
  }
}
