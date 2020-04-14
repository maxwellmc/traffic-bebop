import { DisplayObject, Graphics, Text } from 'pixi.js';

export default abstract class ViewableObject {
    protected _graphics: DisplayObject[];

    protected constructor() {
        this._graphics = [];
    }

    abstract generateGraphics(): void;

    removeGraphic(graphic: DisplayObject): void {
        // Actually remove the item from the array
        const index = this._graphics.indexOf(graphic);
        if (index > -1) {
            this._graphics = this._graphics.splice(index, 1);
        }

        // Destroy the DisplayObject in Pixi
        graphic.destroy();
    }

    removeAllGraphics(): void {
        // Get a reference to the graphics
        const graphics = this._graphics;

        // Clear the array
        this._graphics = [];

        // Destroy the DisplayObjects in Pixi
        for (const graphic of graphics) {
            graphic.destroy();
        }
    }

    static generateRectangle(lineWidth, lineColor, lineAlpha, fillColor, width, height, x, y): Graphics {
        const rectangle = new Graphics();
        rectangle.lineStyle(lineWidth, lineColor, lineAlpha);
        rectangle.beginFill(fillColor);
        rectangle.drawRect(0, 0, width, height);
        rectangle.endFill();
        rectangle.x = x;
        rectangle.y = y;
        rectangle.interactive = true;
        return rectangle;
    }

    static generateText(actualText, fontSize, fillColor, x, y): Text {
        const text = new Text(actualText, {
            fontFamily: 'Arial',
            fontSize: fontSize,
            fill: fillColor,
            align: 'center',
        });
        text.x = x;
        text.y = y;
        return text;
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get graphics(): DisplayObject[] {
        return this._graphics;
    }

    set graphics(value) {
        this._graphics = value;
    }
}
