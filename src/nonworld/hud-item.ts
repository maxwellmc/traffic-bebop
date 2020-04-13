import { Text } from 'pixi.js';

export default class HUDItem {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly WIDTH = 100;
    public static readonly TEXT_COLOR = 0xf5f5f5;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _label: string;
    private _value: string;
    private _graphic: Text;

    constructor(label: string, value: string) {

        this._label = label;
        this._value = value;

        this.generateGraphics();
    }

    generateGraphics(): void {
        // Text
        this._graphic = new Text(this.generateFullText(), {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: HUDItem.TEXT_COLOR,
            align: 'center',
        });
    }

    updateGraphics(): void {
        this._graphic.text = this.generateFullText();
    }

    generateFullText(): string {
        return this._label + ': ' + this._value;
    }

    changeX(value): void {
        this._graphic.x = value;
    }

    changeY(value): void {
        this._graphic.y = value;
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get label(): string {
        return this._label;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }

    get graphic(): PIXI.Text {
        return this._graphic;
    }
}
