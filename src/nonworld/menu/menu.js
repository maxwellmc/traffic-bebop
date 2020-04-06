import ViewableObject from '../../viewable-object';
import {Graphics, Text} from 'pixi.js';
import Menubar from './menubar';

/**
 * Selected by the user to manipulate the game state.
 */
export default class Menu extends ViewableObject {

  // Constants
  static HEIGHT = 40;
  static WIDTH = 100;
  static FILL_COLOR = 0xbcbabb;
  static LINE_COLOR = 0xdedede;
  static TEXT_COLOR = 0x010000;

  // Class properties
  /** @type Menubar */
  _menubar;
  _x;
  _y;
  _open;
  _label;
  /** @type {MenuItem[]} */
  _items;

  /**
   *
   * @param {Menubar} menubar
   */
  constructor(menubar) {
    super();
    this._menubar = menubar;
    this._x = 0;
    this._y = 0;
    this._open = false;
    this._label = '';
    this._items = [];

    this.generateGraphics();
  }

  generateGraphics(){

    // Rectangle
    const rectangle = ViewableObject.generateRectangle(4, Menu.LINE_COLOR, 1, Menu.FILL_COLOR, Menu.WIDTH, Menu.HEIGHT, 0, 0);

    rectangle.on('mousedown', () => this.onMenuClick());

    this.graphics = [rectangle];

    // Text
    const text = ViewableObject.generateText(this._label, 24, Menu.TEXT_COLOR, this._x + 5, this._y + 5);

    this.graphics = this.graphics.concat(text);
  }

  onMenuClick(){
    this.toggleOpen();
  }

  toggleOpen(){
    this._open = !this._open;
  }

  onMenuItemClick(){
    throw new Error('Implementation required');
  }

  // Getters and setters -------------------------------------------------------

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
  }

  get open() {
    return this._open;
  }

  set open(value) {
    this._open = value;
  }

  get label() {
    return this._label;
  }

  set label(value) {
    this._label = value;
  }

  get items() {
    return this._items;
  }

  set items(value) {
    this._items = value;
  }
}
