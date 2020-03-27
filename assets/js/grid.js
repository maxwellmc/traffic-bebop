import ViewableObject from './viewable-object';
import Tile from './tile';
import Toolbar from './toolbar';
import Game from './game';

/**
 * The arrangement of world Tiles.
 */
export default class Grid extends ViewableObject {

  // Constants
  static GRID_ROWS = 24;
  static GRID_COLS = 24;
  static TILE_WIDTH = 40;
  static TILE_HEIGHT = 40;
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
    // Center the grid in the app
    this.#startingX = (appWidth / 2) - ((Grid.GRID_ROWS * Grid.TILE_WIDTH) / 2);
    this.#startingY = (appHeight / 2) - ((Grid.GRID_ROWS * Grid.TILE_HEIGHT) / 2);
    this.#tiles = [];

    this.generateGraphics();
  }

  generateGraphics() {
    let x = this.#startingX;
    let y = this.#startingY;

    for (let i = 0; i < Grid.GRID_ROWS; i++) {
      for (let j = 0; j < Grid.GRID_COLS; j++) {
        const tile = new Tile(this, x, y);
        this.#tiles = this.#tiles.concat(tile);

        x += Grid.TILE_WIDTH;
      }
      y += Grid.TILE_HEIGHT;
      x = this.#startingX;
    }
  }

  onTileClick(e) {

    const tile = this.findTileByGraphic(e.currentTarget);

    console.log(
        'onTileClick before: ' + Grid.TILE_LABEL_DICTIONARY[tile.tileType]);
    switch(this.#game.toolInUse.id){
      case Toolbar.ROAD_TOOL:
        tile.tileType = Grid.TILE_TYPE_ROAD;
        this.#game.eventDispatcher.dispatch(Game.EVENT_MONEY_DEDUCTED, -10);
        break;
      case Toolbar.BULLDOZE_TOOL:
        tile.tileType = Grid.TILE_TYPE_GRASS;
        break;
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
