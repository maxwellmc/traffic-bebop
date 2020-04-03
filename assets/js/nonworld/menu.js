import ViewableObject from '../viewable-object';
import {Graphics, Text} from 'pixi.js';
import Menubar from './menubar';

/**
 * Selected by the user to manipulate the game state.
 */
export default class Menu extends ViewableObject {

  // Constants
  static HEIGHT = 40;
  static WIDTH = 100;
  static FILL_COLOR = 0xeeeeee;
  static LINE_COLOR = 0xdedede;
  static TEXT_COLOR = 0xc10000;

  // Class properties
  /** @type Menubar */
  #menubar;
  #id;
  #label;
  #x;
  #y;

  constructor(menubar, id, label, x, y) {
    super();
    this.#menubar = menubar;
    this.#id = id;
    this.#label = label;
    this.#x = x;
    this.#y = y;

    this.generateGraphics();
  }

  generateGraphics(){

    // Rectangle
    const rectangle = ViewableObject.generateRectangle(4, Menu.LINE_COLOR, 1, Menu.FILL_COLOR, Menu.WIDTH, Menu.HEIGHT, 0, 0);

    rectangle.on('mousedown', (e) => this.#menubar.onMenuClick(e, this));

    this.graphics = [rectangle];

    // Text
    const text = ViewableObject.generateText(this.#label, 24, Menu.TEXT_COLOR, this.#x + 5, this.#y + 5);

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
