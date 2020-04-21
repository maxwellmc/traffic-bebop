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
import MenuItem from './MenuItem';
import Menubar from './Menubar';
import { Speeds } from '../../Speed';
import { GameEvents } from '../../Events';

export default class SpeedMenu extends Menu {
    constructor(menubar: Menubar) {
        super(menubar);
        this._label = 'Speed';

        // Create the MenuItems
        for (let i = 0; i < Object.keys(Speeds).length / 2; i++) {
            this._items.push(new MenuItem(this, i, Speeds[i]));
        }
    }

    setGraphicsPositioning(): void {
        // Set the MenuItems' positionings
        for (const [index, item] of this._items.entries()) {
            item.x = this._x + Menu.TEXT_X_OFFSET;
            item.y = Menu.HEIGHT + index * MenuItem.HEIGHT;
        }
    }

    onMenuItemClick(menuItem: MenuItem): void {
        super.onMenuItemClick(menuItem);
        switch (menuItem.id) {
            case Speeds.Paused:
                this._menubar.game.eventEmitter.emit(GameEvents.SpeedSet, Speeds.Paused);
                break;
            case Speeds.Normal:
                this._menubar.game.eventEmitter.emit(GameEvents.SpeedSet, Speeds.Normal);
                break;
            case Speeds.Fast:
                this._menubar.game.eventEmitter.emit(GameEvents.SpeedSet, Speeds.Fast);
                break;
        }
    }
}
