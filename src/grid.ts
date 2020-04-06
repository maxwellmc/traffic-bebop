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
  public static readonly TILE_WIDTH = 40;
  public static readonly TILE_HEIGHT = 40;
  public static readonly TILE_LABEL_DICTIONARY = {
    [Cell.TERRAIN_TYPE_GRASS]: 'Grass',
    [Cell.TERRAIN_TYPE_ROAD]: 'Road',
  };

  // Class properties
  private _game: Game;
  private _startingX: number;
  private _startingY: number;
  private _tiles: Tile[];

  constructor(game: Game, appWidth: number, appHeight: number) {
    super();

    this._game = game;
    // Center the grid in the app
    this._startingX = (appWidth / 2) - ((Map.MAP_COLS * Grid.TILE_WIDTH) / 2);
    this._startingY = (appHeight / 2) - ((Map.MAP_ROWS * Grid.TILE_HEIGHT) / 2);
    this._tiles = [];

    this.generateGraphics();
  }

  generateGraphics(): void {
    let x = this._startingX;
    let y = this._startingY;

    for (let row = 0; row < Map.MAP_ROWS; row++) {
      for (let col = 0; col < Map.MAP_COLS; col++) {

        // Find the Cell for this row/column combination
        const cell = this._game.map.findCellByRowColumn(row, col);

        // Create a new Tile for it
        const tile = new Tile(this, x, y, cell);

        // Add the Tile to our list
        this._tiles = this._tiles.concat(tile);

        x += Grid.TILE_WIDTH;
      }
      y += Grid.TILE_HEIGHT;
      x = this._startingX;
    }
  }

  updateGraphics(): void {

    for(const tile of this._tiles){
      tile.updateTileGraphic();
    }

  }

  onTileClick(e, tile): void {

    console.log(
        'onTileClick before: ' + Grid.TILE_LABEL_DICTIONARY[tile.cell.terrainType]);
    switch(this._game.toolInUse.id){
      case Toolbar.ROAD_TOOL:
        tile.cell.terrainType = Cell.TERRAIN_TYPE_ROAD;
        this._game.eventDispatcher.emit(Game.EVENT_MONEY_DEDUCTED, -10);
        break;
      case Toolbar.BULLDOZE_TOOL:
        tile.cell.terrainType = Cell.TERRAIN_TYPE_GRASS;
        break;
      case Toolbar.RESIDENTIAL_ZONE_TOOL:
        tile.cell.terrainType = Cell.TERRAIN_TYPE_GRASS;
        tile.cell.zoneType = Cell.ZONE_TYPE_RESIDENTIAL;
        this._game.eventDispatcher.emit(Game.EVENT_MONEY_DEDUCTED, -100);
        break;
    }
    console.log(
        'onTileClick after: ' + Grid.TILE_LABEL_DICTIONARY[tile.cell.terrainType]);
  }

  // Getters and setters -------------------------------------------------------

  get tiles(): Tile[] {
    return this._tiles;
  }

  set tiles(value) {
    this._tiles = value;
  }
}
