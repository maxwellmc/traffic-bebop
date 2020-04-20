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
import {GridEvents} from '../../Events';

export default class ViewMenu extends Menu {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly ITEMS = [
        {
            id: 0,
            label: 'Grid',
        },
        {
            id: 1,
            label: 'Zoom In',
        },
        {
            id: 2,
            label: 'Zoom Out',
        },
    ];

    constructor(menubar: Menubar) {
        super(menubar);
        this._label = 'View';

        // Create the MenuItems
        for (const item of ViewMenu.ITEMS) {
            this._items.push(new MenuItem(this, item.id, item.label));
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
        switch (menuItem.id) {
            case 0:
                this._menubar.game.eventEmitter.emit(GridEvents.GridLayerToggled);
                break;
            case 1:
                this._menubar.game.eventEmitter.emit(GridEvents.ZoomedIn);
                break;
            case 2:
                this._menubar.game.eventEmitter.emit(GridEvents.ZoomedOut);
                break;
        }
    }
}
