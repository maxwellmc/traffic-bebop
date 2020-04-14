import ViewableObject from '../../ViewableObject';
import Menu from './Menu';

export default class MenuItem extends ViewableObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly FILL_COLOR = 0xeeeeee;
    public static readonly LINE_COLOR = 0xdedede;
    public static readonly TEXT_COLOR = 0xc10000;
    public static readonly WIDTH = 70;
    public static readonly HEIGHT = 30;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _menu: Menu;
    private _id: number;
    private _label: string;
    private _x: number;
    private _y: number;

    constructor(menu: Menu, id: number, label: string, x: number, y: number) {
        super();
        this._menu = menu;
        this._id = id;
        this._label = label;
        this._x = x;
        this._y = y;
    }

    generateGraphics(): void {
        // Rectangle
        const rectangle = ViewableObject.generateRectangle(
            4,
            MenuItem.LINE_COLOR,
            1,
            MenuItem.FILL_COLOR,
            MenuItem.WIDTH,
            MenuItem.HEIGHT,
            this._x,
            this._y,
        );

        rectangle.on('mousedown', () => this._menu.onMenuItemClick(this));

        this._graphics = [rectangle];

        // Text
        const text = ViewableObject.generateText(this._label, 12, MenuItem.TEXT_COLOR, this._x + 5, this._y + 5);

        this._graphics = this.graphics.concat(text);
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

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
