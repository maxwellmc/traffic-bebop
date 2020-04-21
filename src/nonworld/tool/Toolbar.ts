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

import Tool from './Tool';
import Game from '../../Game';
import Menubar from '../menu/Menubar';
import {ToolbarEvents} from '../../Events';

export enum Tools {
    Select,
    Road,
    Bulldoze,
    ZoneResidential,
    ZoneCommercial,
}

/**
 * A non-world container for Tools.
 */
export default class Toolbar {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly TOOLBAR_STARTING_X = 24;
    public static readonly TOOLBAR_STARTING_Y = Menubar.HEIGHT + 24;
    public static readonly TOOL_WIDTH = 110;
    public static readonly TOOL_HEIGHT = 32;
    public static readonly SPRITE_SCALE = 2;

    public static readonly TOOLS = [
        {
            id: Tools.Select,
            label: 'Select',
        },
        {
            id: Tools.Road,
            label: 'Road',
        },
        {
            id: Tools.Bulldoze,
            label: 'Bulldoze',
        },
        {
            id: Tools.ZoneResidential,
            label: 'Residential',
        },
        {
            id: Tools.ZoneCommercial,
            label: 'Commercial',
        },
    ];

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game: Game;
    private _tools: Tool[];

    constructor(game: Game) {
        this._game = game;
        this._tools = [];

        // Add the Tools
        for (let i = 0; i < Toolbar.TOOLS.length; i++) {
            const tool = Toolbar.TOOLS[i];
            this.addTool(new Tool(this, tool.id, tool.label, this._game.spritesheet));
        }
    }

    generateGraphics(): void {
        // FIXME
    }

    setGraphicsPositioning(): void {
        let x = Toolbar.TOOLBAR_STARTING_X,
            y = Toolbar.TOOLBAR_STARTING_Y;

        for (const tool of this._tools) {
            tool.x = x;
            tool.y = y;
            y += Toolbar.TOOL_HEIGHT * Toolbar.SPRITE_SCALE;
        }
    }

    addTool(tool): void {
        this._tools.push(tool);
    }

    onToolClick(e, tool): void {

        // Set the "tool in use" to the clicked Tool
        this._game.toolInUse = tool;

        // Emit an event so that others can know we were clicked
        this._game.eventEmitter.emit(ToolbarEvents.Clicked);
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get game(): Game {
        return this._game;
    }

    set game(value) {
        this._game = value;
    }

    get tools(): Tool[] {
        return this._tools;
    }

    set tools(value) {
        this._tools = value;
    }
}
