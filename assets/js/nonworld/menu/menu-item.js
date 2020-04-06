import ViewableObject from '../../viewable-object';
import Toolbar from '../toolbar';

export default class MenuItem extends ViewableObject {

  // Constants
  static FILL_COLOR = 0xeeeeee;
  static LINE_COLOR = 0xdedede;
  static TEXT_COLOR = 0xc10000;
  static WIDTH = 70;
  static HEIGHT = 30;

  // Class properties
  #menu;
  #id;
  #label;
  #x;
  #y;

  constructor(menu, id, label, x, y) {
    super();
    this.#menu = menu;
    this.#id = id;
    this.#label = label;
    this.#x = x;
    this.#y = y;
  }

  generateGraphics(){

    // Rectangle
    const rectangle = ViewableObject.generateRectangle(4, MenuItem.LINE_COLOR, 1, MenuItem.FILL_COLOR, MenuItem.WIDTH, MenuItem.HEIGHT, this.#x, this.#y);

    rectangle.on('mousedown', () => this.#menu.onMenuItemClick(this));

    this.graphics = [rectangle];

    // Text
    const text = ViewableObject.generateText(this.#label, 12, MenuItem.TEXT_COLOR, this.#x + 5, this.#y + 5)

    this.graphics = this.graphics.concat(text);
  }

  // Getters and setters -------------------------------------------------------

  get id() {
    return this.#id;
  }

  set id(value) {
    this.#id = value;
  }

  get label() {
    return this.#label;
  }

  set label(value) {
    this.#label = value;
  }
}
