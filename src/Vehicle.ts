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

import { LoaderResource, Sprite } from 'pixi.js';
import TravelTrip from './TravelTrip';
import GameState from './GameState';
import Grid from './Grid';
import { Speeds, SpeedUtil } from './Speed';
import AbstractSingleGraphicObject from './AbstractSingleGraphicObject';

export enum Directions {
    North,
    South,
    East,
    West,
    NorthEast,
    NorthWest,
    SouthEast,
    SouthWest,
}

export enum TurningStates {
    NotTurning,
    // The vehicle is turning to start heading north when previously it was heading east
    ToNorthFromEast,
    ToNorthFromWest,
    ToSouthFromEast,
    ToSouthFromWest,
    ToEastFromNorth,
    ToEastFromSouth,
    ToWestFromNorth,
    ToWestFromSouth,
}

enum VehicleSpriteFiles {
    Car1 = 'car1.png',
}

export default class Vehicle extends AbstractSingleGraphicObject {
    private _travelTrip: TravelTrip;
    private _tileX: number;
    private _tileY: number;
    private _spritesheet: LoaderResource;
    private _isOnStage: boolean;
    private _direction: Directions;
    private _turningState: TurningStates;

    constructor(travelTrip: TravelTrip, spritesheet: LoaderResource) {
        super();
        this._travelTrip = travelTrip;
        this._spritesheet = spritesheet;
        this._isOnStage = false;
        this._turningState = TurningStates.NotTurning;

        this._graphic = new Sprite(this._spritesheet.textures[VehicleSpriteFiles.Car1]);
        this._direction = Directions.South;

        this._graphic.scale.set(this._travelTrip.game.grid.scale);
        (this._graphic as Sprite).anchor.set(0.5);
    }

    updateGraphics(deltaMS: number, speed: Speeds): void {
        const gameDayTimePassed = deltaMS / GameState.GAME_DAYS_IN_MILLISECONDS,
            scaledGameDayTimePassed = gameDayTimePassed * SpeedUtil.getMultiplier(speed),
            scaledTileHeight = Grid.TILE_HEIGHT * this._travelTrip.game.grid.scale,
            scaledTileWidth = Grid.TILE_WIDTH * this._travelTrip.game.grid.scale,
            wideTurnDivisor = 1.5,
            sharpTurnDivisor = 4;

        switch (this._direction) {
            case Directions.South:
                this._graphic.angle = -180;
                this._graphic.y = this._graphic.y + scaledTileHeight * scaledGameDayTimePassed;
                break;
            case Directions.SouthWest:
                this._graphic.angle = -135;
                if (this._turningState === TurningStates.ToSouthFromWest) {
                    this._graphic.x = this._graphic.x - (scaledTileWidth / wideTurnDivisor) * scaledGameDayTimePassed;
                    this._graphic.y = this._graphic.y + (scaledTileHeight / wideTurnDivisor) * scaledGameDayTimePassed;
                } else if (this._turningState === TurningStates.ToWestFromSouth) {
                    this._graphic.x = this._graphic.x - (scaledTileWidth / sharpTurnDivisor) * scaledGameDayTimePassed;
                    this._graphic.y = this._graphic.y + (scaledTileHeight / sharpTurnDivisor) * scaledGameDayTimePassed;
                }
                break;
            case Directions.SouthEast:
                this._graphic.angle = 135;
                if (this._turningState === TurningStates.ToSouthFromEast) {
                    this._graphic.x = this._graphic.x + (scaledTileWidth / sharpTurnDivisor) * scaledGameDayTimePassed;
                    this._graphic.y = this._graphic.y + (scaledTileHeight / sharpTurnDivisor) * scaledGameDayTimePassed;
                } else if (this._turningState === TurningStates.ToEastFromSouth) {
                    this._graphic.x = this._graphic.x + (scaledTileWidth / wideTurnDivisor) * scaledGameDayTimePassed;
                    this._graphic.y = this._graphic.y + (scaledTileHeight / wideTurnDivisor) * scaledGameDayTimePassed;
                }
                break;
            case Directions.East:
                this._graphic.angle = 90;
                this._graphic.x = this._graphic.x + scaledTileWidth * scaledGameDayTimePassed;
                break;
            case Directions.North:
                this._graphic.angle = 0;
                this._graphic.y = this._graphic.y - scaledTileHeight * scaledGameDayTimePassed;
                break;
            case Directions.NorthWest:
                this._graphic.angle = -45;
                if (this._turningState === TurningStates.ToNorthFromWest) {
                    this._graphic.x = this._graphic.x - (scaledTileWidth / sharpTurnDivisor) * scaledGameDayTimePassed;
                    this._graphic.y = this._graphic.y - (scaledTileHeight / sharpTurnDivisor) * scaledGameDayTimePassed;
                } else if (this._turningState === TurningStates.ToWestFromNorth) {
                    this._graphic.x = this._graphic.x - (scaledTileWidth / wideTurnDivisor) * scaledGameDayTimePassed;
                    this._graphic.y = this._graphic.y - (scaledTileHeight / wideTurnDivisor) * scaledGameDayTimePassed;
                }
                break;
            case Directions.NorthEast:
                this._graphic.angle = 45;
                if (this._turningState === TurningStates.ToNorthFromEast) {
                    this._graphic.x = this._graphic.x + (scaledTileWidth / wideTurnDivisor) * scaledGameDayTimePassed;
                    this._graphic.y = this._graphic.y - (scaledTileHeight / wideTurnDivisor) * scaledGameDayTimePassed;
                } else if (this._turningState === TurningStates.ToEastFromNorth) {
                    this._graphic.x = this._graphic.x + (scaledTileWidth / sharpTurnDivisor) * scaledGameDayTimePassed;
                    this._graphic.y = this._graphic.y - (scaledTileHeight / sharpTurnDivisor) * scaledGameDayTimePassed;
                }
                break;
            case Directions.West:
                this._graphic.angle = -90;
                this._graphic.x = this._graphic.x - scaledTileWidth * scaledGameDayTimePassed;
                break;
        }
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

    get isOnStage(): boolean {
        return this._isOnStage;
    }

    set isOnStage(value: boolean) {
        this._isOnStage = value;
    }

    get direction(): Directions {
        return this._direction;
    }

    set direction(value: Directions) {
        this._direction = value;
    }

    get turningState(): TurningStates {
        return this._turningState;
    }

    set turningState(value: TurningStates) {
        this._turningState = value;
    }
}
