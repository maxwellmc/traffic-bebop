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

import DisplayObject = PIXI.DisplayObject;

export default abstract class AbstractSingleGraphicObject {
    protected _background: DisplayObject;
    protected _foreground: DisplayObject;

    get background(): PIXI.DisplayObject {
        return this._background;
    }

    set background(value: PIXI.DisplayObject) {
        this._background = value;
    }

    get foreground(): PIXI.DisplayObject {
        return this._foreground;
    }

    set foreground(value: PIXI.DisplayObject) {
        this._foreground = value;
    }
}
