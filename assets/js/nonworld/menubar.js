import Menu from './menu';

/**
 * A non-world container for Menus.
 */
export default class Menubar {

  // Constants
  static STARTING_X = 0;
  static STARTING_Y = 0;
  static HEIGHT = 40;
  static SPEED_MENU = 0;
  static MENUS = [
    {
      'id': Menubar.SPEED_MENU,
      'label': 'Speed',
    },
  ];

  // Class properties
  #game;
  /** @type array */
  #menus;

  constructor(game) {

    this.#game = game;
    this.#menus = [];

    this.generateGraphics();
  }

  generateGraphics() {
    let x = Menubar.STARTING_X;
    let y = Menubar.STARTING_Y;

    for (let i = 0; i < Menubar.MENUS.length; i++) {
      const menu = Menubar.MENUS[i];
      this.addMenu(new Menu(this, menu.id, menu.label, x, y));
      y += Menubar.HEIGHT;
    }
  }

  addMenu(menu) {
    this.#menus.push(menu);
  }

  onMenuClick(e, menu) {
    console.log('onMenuClick: ' + menu);
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
