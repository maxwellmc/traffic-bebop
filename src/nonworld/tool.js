import {Graphics, Text} from 'pixi.js';
import ViewableObject from '../viewable-object';
import Toolbar from './toolbar';

/**
 * Selected by the user to manipulate individual cells in the world.
 */
export default class Tool extends ViewableObject {

  // Constants
  static FILL_COLOR = 0xeeeeee;
  static LINE_COLOR = 0xdedede;
  static TEXT_COLOR = 0xc10000;

  // Class properties
  #toolbar;
  #id;
  #label;
  #x;
  #y;

  constructor(toolbar, id, label, x, y) {
    super();
    this.#toolbar = toolbar;
    this.#id = id;
    this.#label = label;
    this.#x = x;
    this.#y = y;

    this.generateGraphics();
  }

  generateGraphics(){

    // Rectangle
    const rectangle = ViewableObject.generateRectangle(4, Tool.LINE_COLOR, 1, Tool.FILL_COLOR, Toolbar.TOOL_WIDTH, Toolbar.TOOL_HEIGHT, this.#x, this.#y);

    rectangle.on('mousedown', (e) => this.#toolbar.onToolClick(e, this));

    this.graphics = [rectangle];

    // Text
    const text = ViewableObject.generateText(this.#label, 24, Tool.TEXT_COLOR, this.#x + 5, this.#y + 5)

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
