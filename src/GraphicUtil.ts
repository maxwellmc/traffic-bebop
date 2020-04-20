/*
 * Traffic Bebop - A traffic management web game
 * Copyright (C) 2020  Max McMahon
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Graphics, Text } from 'pixi.js';
import Game from './Game';

export default class GraphicUtil {
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
            fontFamily: Game.FONT_FAMILY,
            fontSize: fontSize,
            fill: fillColor,
            align: 'center',
        });
        text.x = x;
        text.y = y;
        return text;
    }
}
