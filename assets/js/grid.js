import ViewableObject from './viewable-object';
import Tile from './tile';
import Toolbar from './nonworld/toolbar';
import Game from './game';
import Cell from './cell';
import Map from './map';

/**
 * Visually represents the Map, as translated to an arrangement of
 * viewable Tiles.
 */
export default class Grid extends ViewableObject {

  // Constants
  static TILE_WIDTH = 40;
  static TILE_HEIGHT = 40;
  static TILE_LABEL_DICTIONARY = {
    [Cell.TERRAIN_TYPE_GRASS]: 'Grass',
    [Cell.TERRAIN_TYPE_ROAD]: 'Road',
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
    this.#startingX = (appWidth / 2) - ((Map.MAP_COLS * Grid.TILE_WIDTH) / 2);
    this.#startingY = (appHeight / 2) - ((Map.MAP_ROWS * Grid.TILE_HEIGHT) / 2);
    this.#tiles = [];

    this.generateGraphics();
  }

  generateGraphics() {
    let x = this.#startingX;
    let y = this.#startingY;

    for (let row = 0; row < Map.MAP_ROWS; row++) {
      for (let col = 0; col < Map.MAP_COLS; col++) {

        // Find the Cell for this row/column combination
        const cell = this.#game.map.findCellByRowColumn(row, col);

        // Create a new Tile for it
        const tile = new Tile(this, x, y, cell);

        // Add the Tile to our list
        this.#tiles = this.#tiles.concat(tile);

        x += Grid.TILE_WIDTH;
      }
      y += Grid.TILE_HEIGHT;
      x = this.#startingX;
    }
  }

  updateGraphics() {

    for(const tile of this.#tiles){
      tile.updateTileGraphic();
    }

  }

  onTileClick(e, tile) {

    console.log(
        'onTileClick before: ' + Grid.TILE_LABEL_DICTIONARY[tile.cell.terrainType]);
    switch(this.#game.toolInUse.id){
      case Toolbar.ROAD_TOOL:
        tile.cell.terrainType = Cell.TERRAIN_TYPE_ROAD;
        this.#game.eventDispatcher.dispatch(Game.EVENT_MONEY_DEDUCTED, -10);
        break;
      case Toolbar.BULLDOZE_TOOL:
        tile.cell.terrainType = Cell.TERRAIN_TYPE_GRASS;
        break;
      case Toolbar.RESIDENTIAL_ZONE_TOOL:
        tile.cell.terrainType = Cell.TERRAIN_TYPE_GRASS;
        tile.cell.zoneType = Cell.ZONE_TYPE_RESIDENTIAL;
        this.#game.eventDispatcher.dispatch(Game.EVENT_MONEY_DEDUCTED, -100);
        break;
    }
    console.log(
        'onTileClick after: ' + Grid.TILE_LABEL_DICTIONARY[tile.cell.terrainType]);
  }

  // Getters and setters -------------------------------------------------------

  get tiles() {
    return this.#tiles;
  }

  set tiles(value) {
    this.#tiles = value;
  }
}
