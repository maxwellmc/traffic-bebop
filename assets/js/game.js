import {Application, Loader} from 'pixi.js';
import Toolbar from './toolbar';
import Grid from './grid';

/**
 * Manages the Pixi Application, the game loop, and calling the draw-ers.
 */
class Game {

  // Constants
  static appWidth = 1200;
  static appHeight = 1000;

  // Class properties
  #app;
  #grid;
  #toolbar;
  #toolInUse;

  constructor() {
    this.#grid = new Grid(this, Game.appWidth, Game.appHeight);
    this.#toolbar = new Toolbar(this);

    // Set the default "tool in use"
    this.#toolInUse = this.#toolbar.tools[0];
  }

  init() {
    console.log('init');

    // Create a Pixi Application
    this.#app = new Application({
      width: Game.appWidth,
      height: Game.appHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
    });

    // Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(this.#app.view);

    const _this = this;

    console.log('init - loading');
    Loader.shared.load(() => _this.load());
  }

  load() {
    console.log('load');

    //Start the game loop
    this.#app.ticker.add(delta => this.gameLoop(delta));
  }

  gameLoop(delta) {
    this.drawGrid();
    this.drawToolbar();
  }

  drawGrid() {
    for (const tile of this.#grid.tiles) {
      for (const graphic of tile.graphics) {
        this.#app.stage.addChild(graphic);
      }
    }
  }

  drawToolbar() {
    for (const tool of this.#toolbar.tools) {
      for (const graphic of tool.graphics) {
        this.#app.stage.addChild(graphic);
      }
    }
  }

  onDragStart(event) {
    console.log('onDragStart');
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  onDragEnd() {
    console.log('onDragEnd');
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
  }

  onDragMove() {
    if (this.dragging) {
      console.log('onDragMove');
      const newPosition = this.data.getLocalPosition(this.parent);
      this.position.x = newPosition.x;
      this.position.y = newPosition.y;
    }
  }

  // Getters and setters -------------------------------------------------------

  get toolInUse() {
    return this.#toolInUse;
  }

  set toolInUse(value) {
    this.#toolInUse = value;
  }
}

console.log('foo');
const game = new Game();
game.init();
