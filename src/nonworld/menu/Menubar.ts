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

import Menu from './Menu';
import SpeedMenu from './SpeedMenu';
import Game from '../../Game';

/**
 * A non-world container for Menus.
 */
export default class Menubar {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly STARTING_X = 0;
    public static readonly STARTING_Y = 0;
    public static readonly HEIGHT = 40;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game: Game;
    private _menus: Menu[];

    constructor(game: Game) {
        this._game = game;
        this._menus = [new SpeedMenu(this)];

        this.generateGraphics();
    }

    generateGraphics(): void {
        const x = Menubar.STARTING_X;
        let y = Menubar.STARTING_Y;

        for (let i = 0; i < this._menus.length; i++) {
            const menu = this._menus[i];
            menu.x = x;
            menu.y = y;
            y += Menubar.HEIGHT;
        }
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get game(): Game {
        return this._game;
    }

    set game(value) {
        this._game = value;
    }

    get menus(): Menu[] {
        return this._menus;
    }

    set menus(value) {
        this._menus = value;
    }
}
