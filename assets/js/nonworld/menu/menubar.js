import Menu from './menu';
import SpeedMenu from './speed-menu';

/**
 * A non-world container for Menus.
 */
export default class Menubar {

  // Constants
  static STARTING_X = 0;
  static STARTING_Y = 0;
  static HEIGHT = 40;
  static SPEED_MENU = 0;

  // Class properties
  #game;
  /** @type {Menu[]} */
  #menus;

  constructor(game) {

    this.#game = game;
    this.#menus = [
        new SpeedMenu(this)
    ];

    this.generateGraphics();
  }

  generateGraphics() {
    let x = Menubar.STARTING_X;
    let y = Menubar.STARTING_Y;

    for (let i = 0; i < this.#menus.length; i++) {
      const menu = this.#menus[i];
      menu.x = x;
      menu.y = y;
      y += Menubar.HEIGHT;
    }
  }

  addMenu(menu) {
    this.#menus.push(menu);
  }

  // Getters and setters -------------------------------------------------------

  get game() {
    return this.#game;
  }

  set game(value) {
    this.#game = value;
  }

  get menus() {
    return this.#menus;
  }

  set menus(value) {
    this.#menus = value;
  }
}
