import ViewableObject from '../../viewable-object';
import Menubar from './menubar';
import MenuItem from "./menu-item";

/**
 * Selected by the user to manipulate the game state.
 */
export default abstract class Menu extends ViewableObject {

  // Constants
  public static readonly HEIGHT = 40;
  public static readonly WIDTH = 100;
  public static readonly FILL_COLOR = 0xbcbabb;
  public static readonly LINE_COLOR = 0xdedede;
  public static readonly TEXT_COLOR = 0x010000;

  // Class properties
  protected _menubar: Menubar;
  protected _x: number;
  protected _y: number;
  protected _open: boolean;
  protected _label: string;
  protected _items: MenuItem[];

  /**
   *
   * @param {Menubar} menubar
   */
  protected constructor(menubar: Menubar) {
    super();
    this._menubar = menubar;
    this._x = 0;
    this._y = 0;
    this._open = false;
    this._label = '';
    this._items = [];

    this.generateGraphics();
  }

  generateGraphics(): void{

    // Rectangle
    const rectangle = ViewableObject.generateRectangle(4, Menu.LINE_COLOR, 1, Menu.FILL_COLOR, Menu.WIDTH, Menu.HEIGHT, 0, 0);

    rectangle.on('mousedown', () => this.onMenuClick());

    this._graphics = [rectangle];

    // Text
    const text = ViewableObject.generateText(this._label, 24, Menu.TEXT_COLOR, this._x + 5, this._y + 5);

    this._graphics = this.graphics.concat(text);
  }

  onMenuClick(): void{
    this.toggleOpen();
  }

  toggleOpen(): void{
    this._open = !this._open;
  }

  abstract onMenuItemClick(menuItem: MenuItem): void;

  // Getters and setters -------------------------------------------------------

  get x(): number {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value) {
    this._y = value;
  }

  get open(): boolean {
    return this._open;
  }

  set open(value) {
    this._open = value;
  }

  get label(): string {
    return this._label;
  }

  set label(value) {
    this._label = value;
  }

  get items(): MenuItem[] {
    return this._items;
  }

  set items(value) {
    this._items = value;
  }
}
