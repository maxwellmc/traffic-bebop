import {Graphics, Text} from 'pixi.js';
import ViewableObject from './viewable-object';
import Toolbar from './toolbar';

/**
 * Selected by the user to manipulate the world.
 */
export default class Tool extends ViewableObject {

  // Constants
  static FILL_COLOR = 0xeeeeee;
  static LINE_COLOR = 0xdedede;
  static TEXT_COLOR = 0xc10000;

  // Class properties
  #id;
  #label;

  constructor(id, label, x, y) {
    super();
    this.#id = id;
    this.#label = label;

    // Rectangle
    const rectangle = new Graphics();
    rectangle.lineStyle(4, Tool.LINE_COLOR, 1);
    rectangle.beginFill(Tool.FILL_COLOR);
    rectangle.drawRect(0, 0, Toolbar.TOOL_WIDTH, Toolbar.TOOL_HEIGHT);
    rectangle.endFill();
    rectangle.x = x;
    rectangle.y = y;
    rectangle.interactive = true;

    this.graphics = this.graphics.concat(rectangle);

    // Text
    const text = new Text(this.#label, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: Tool.TEXT_COLOR,
      align: 'center',
    });
    text.x = x + 5;
    text.y = y + 5;
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
