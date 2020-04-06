import ViewableObject from '../viewable-object';
import Toolbar from './toolbar';

/**
 * Selected by the user to manipulate individual cells in the world.
 */
export default class Tool extends ViewableObject {

  // Constants
  public static readonly FILL_COLOR = 0xeeeeee;
  public static readonly LINE_COLOR = 0xdedede;
  public static readonly TEXT_COLOR = 0xc10000;

  // Class properties
  private _toolbar: Toolbar;
  private _id: number;
  private _label: string;
  private _x: number;
  private _y: number;

  constructor(toolbar: Toolbar, id: number, label: string, x: number, y: number) {
    super();
    this._toolbar = toolbar;
    this._id = id;
    this._label = label;
    this._x = x;
    this._y = y;

    this.generateGraphics();
  }

  generateGraphics(): void{

    // Rectangle
    const rectangle = ViewableObject.generateRectangle(4, Tool.LINE_COLOR, 1, Tool.FILL_COLOR, Toolbar.TOOL_WIDTH, Toolbar.TOOL_HEIGHT, this._x, this._y);

    rectangle.on('mousedown', (e) => this._toolbar.onToolClick(e, this));

    this.graphics = [rectangle];

    // Text
    const text = ViewableObject.generateText(this._label, 24, Tool.TEXT_COLOR, this._x + 5, this._y + 5)

    this.graphics = this.graphics.concat(text);
  }

  // Getters and setters -------------------------------------------------------

  get id(): number {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get label(): string {
    return this._label;
  }

  set label(value) {
    this._label = value;
  }
}
