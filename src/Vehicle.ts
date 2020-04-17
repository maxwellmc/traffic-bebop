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

import { Container, LoaderResource, Sprite } from 'pixi.js';
import TravelTrip from './TravelTrip';
import Cell from './Cell';
import GameState from './GameState';
import Tile from './Tile';
import Grid from './Grid';
import Game from './Game';
import { Speeds, SpeedUtil } from './Speed';

export enum Direction {
    North,
    South,
    East,
    West,
    NorthEast,
    NorthWest,
    SouthEast,
    SouthWest,
}

enum VehicleSpriteFiles {
    VehicleRightLane = 'car1-rl.png',
    VehicleLeftLane = 'car1-ll.png',
}

export default class Vehicle {
    private _travelTrip: TravelTrip;
    private _tileX: number;
    private _tileY: number;
    private _spritesheet: LoaderResource;
    private _graphic: Sprite;
    private _isOnStage: boolean;
    private _direction: Direction;

    constructor(travelTrip: TravelTrip, spritesheet: LoaderResource) {
        this._travelTrip = travelTrip;
        this._spritesheet = spritesheet;
        this._isOnStage = false;

        this._graphic = new Sprite(this._spritesheet.textures[VehicleSpriteFiles.VehicleRightLane]);
        this._direction = Direction.South;

        this._graphic.scale.set(Game.SPRITE_SCALE);
        this._graphic.anchor.set(0.5);
    }

    updateGraphics(deltaMS: number, speed: Speeds): void {
        const gameDayTimePassed = deltaMS / GameState.GAME_DAYS_IN_MILLISECONDS,
            scaledGameDayTimePassed = gameDayTimePassed * SpeedUtil.getMultiplier(speed),
            scaledTileHeight = Grid.TILE_HEIGHT * Game.SPRITE_SCALE,
            scaledTileWidth = Grid.TILE_WIDTH * Game.SPRITE_SCALE;
        switch (this._direction) {
            case Direction.South:
                this.setSpriteToSouth();
                this._graphic.y = this._graphic.y + scaledTileHeight * scaledGameDayTimePassed;
                break;
            case Direction.East:
                this.setSpriteToEast();
                this._graphic.x = this._graphic.x + scaledTileWidth * scaledGameDayTimePassed;
                break;
            case Direction.North:
                this._graphic.y = this._graphic.y - scaledTileHeight * scaledGameDayTimePassed;
                this.setSpriteToNorth();
                break;
            case Direction.West:
                this.setSpriteToWest();
                this._graphic.x = this._graphic.x - scaledTileWidth * scaledGameDayTimePassed;
                break;
        }
    }

    setSpriteToEast(): void {
        this._graphic.angle = 90;
    }

    setSpriteToWest(): void {
        this._graphic.angle = -90;
    }

    setSpriteToNorth(): void {
        this._graphic.angle = 0;
    }

    setSpriteToSouth(): void {
        this._graphic.angle = 180;
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get tileX(): number {
        return this._tileX;
    }

    set tileX(value: number) {
        this._tileX = value;
    }

    get tileY(): number {
        return this._tileY;
    }

    set tileY(value: number) {
        this._tileY = value;
    }

    get graphic(): Sprite {
        return this._graphic;
    }

    set graphic(value: Sprite) {
        this._graphic = value;
    }

    get isOnStage(): boolean {
        return this._isOnStage;
    }

    set isOnStage(value: boolean) {
        this._isOnStage = value;
    }

    get direction(): Direction {
        return this._direction;
    }

    set direction(value: Direction) {
        this._direction = value;
    }
}
