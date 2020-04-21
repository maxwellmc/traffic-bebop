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

import Toolbar, { Tools } from './Toolbar';
import { LoaderResource, Sprite } from 'pixi.js';
import AbstractTwoGraphicObject from '../../AbstractTwoGraphicObject';

enum ToolSpriteFiles {
    Background = 'tool-bg.png',
    BackgroundDepressed = 'tool-bg-d.png',
    Select = 'tool-select.png',
    Road = 'tool-road.png',
    Bulldoze = 'tool-bulldoze.png',
    ZoneResidential = 'tool-residential.png',
    ZoneCommercial = 'tool-commercial.png',
}

/**
 * Selected by the user to manipulate individual cells in the world.
 */
export default class Tool extends AbstractTwoGraphicObject {
    /* Constants ---------------------------------------------------------------------------------------------------- */

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _toolbar: Toolbar;
    private _id: number;
    private _label: string;
    private _x: number;
    private _y: number;
    private _spritesheet: LoaderResource;

    constructor(toolbar: Toolbar, id: number, label: string, spritesheet: LoaderResource) {
        super();
        this._toolbar = toolbar;
        this._id = id;
        this._label = label;
        this._spritesheet = spritesheet;
    }

    generateGraphics(): void {
        let filename = ToolSpriteFiles.Background;
        // Show the tool as depressed if it's the one in use
        if (this._toolbar.game.toolInUse === this) {
            filename = ToolSpriteFiles.BackgroundDepressed;
        }

        const backgroundGraphic = new Sprite(this._spritesheet.textures[filename]);
        backgroundGraphic.x = this._x;
        backgroundGraphic.y = this._y;
        backgroundGraphic.scale.set(Toolbar.SPRITE_SCALE);
        backgroundGraphic.interactive = true;

        backgroundGraphic.on('mousedown', (e) => this._toolbar.onToolClick(e, this));
        backgroundGraphic.on('touchstart', (e) => this._toolbar.onToolClick(e, this));

        this._background = backgroundGraphic;

        let spriteFilename;
        switch (this._id) {
            case Tools.Select:
                spriteFilename = ToolSpriteFiles.Select;
                break;
            case Tools.Road:
                spriteFilename = ToolSpriteFiles.Road;
                break;
            case Tools.Bulldoze:
                spriteFilename = ToolSpriteFiles.Bulldoze;
                break;
            case Tools.ZoneResidential:
                spriteFilename = ToolSpriteFiles.ZoneResidential;
                break;
            case Tools.ZoneCommercial:
                spriteFilename = ToolSpriteFiles.ZoneCommercial;
                break;
        }

        const toolGraphic = new Sprite(this._spritesheet.textures[spriteFilename]);
        toolGraphic.x = this._x;
        toolGraphic.y = this._y;
        toolGraphic.scale.set(Toolbar.SPRITE_SCALE);
        toolGraphic.interactive = true;

        toolGraphic.on('mousedown', (e) => this._toolbar.onToolClick(e, this));
        toolGraphic.on('touchstart', (e) => this._toolbar.onToolClick(e, this));

        this._foreground = toolGraphic;
    }

    updateGraphics(): void {
        // Show the tool as depressed if it's the one in use
        const background = this._background as Sprite;
        if (this._toolbar.game.toolInUse === this) {
            background.texture = this._spritesheet.textures[ToolSpriteFiles.BackgroundDepressed];
        } else {
            background.texture = this._spritesheet.textures[ToolSpriteFiles.Background];
        }
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

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }
}
