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

import Vehicle, { Direction, TurningStates } from './Vehicle';
import Game from './Game';
import Grid from './Grid';
import Cell from './Cell';

/**
 * Represents a vehicle travelling from one cell to another, with a determined path and a current location.
 */
export default class TravelTrip {
    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game: Game;
    private _startingCellID: number;
    private _destinationCellID: number;
    private _path: number[];
    private _currentCellID: number;
    private _vehicle: Vehicle;

    constructor(game: Game, startingCellID: number, destinationCellID: number, path: number[]) {
        this._game = game;
        this._startingCellID = startingCellID;
        this._destinationCellID = destinationCellID;
        this._path = path;
        this._currentCellID = startingCellID;
        this._vehicle = new Vehicle(this, this._game.spritesheet);
    }

    advance(): boolean {
        // Find the next Cell to which to advance
        let currentPathIndex = this._path.indexOf(this._currentCellID);
        const nextCellID = this._path[currentPathIndex + 1];

        // Set the next Cell as the current Cell now (and save the current as past)
        const pastCell = this._game.map.getCellByID(this._currentCellID);
        this._currentCellID = nextCellID;
        const currentCell = this._game.map.getCellByID(this._currentCellID);

        // Get the "future" Cell (one step ahead of the now-current Cell)
        currentPathIndex = this._path.indexOf(this._currentCellID);
        const futureCellID = this._path[currentPathIndex + 1];

        // If there's no future Cell (i.e. we're approaching our destination)
        if (!futureCellID) {
            this.end();
            return false;
        }

        const futureCell = this._game.map.getCellByID(futureCellID);
        this.updateVehicle(pastCell, currentCell, futureCell);

        return true;
    }

    updateVehicle(pastCell: Cell, currentCell: Cell, futureCell: Cell): void {
        // Determine the direction from here to the future Cell
        const direction = this.determineDirection(pastCell, currentCell, futureCell);
        this._vehicle.direction = direction;
        const turningState = this.determineTurningState(pastCell, currentCell, futureCell);
        this._vehicle.turningState = turningState;

        this._vehicle.tileX = currentCell.tile.x;
        this._vehicle.tileY = currentCell.tile.y;

        const scaledTileHeight = Grid.TILE_HEIGHT * Game.SPRITE_SCALE,
            scaledTileWidth = Grid.TILE_WIDTH * Game.SPRITE_SCALE;
        const laneOffset1 = 11 * Game.SPRITE_SCALE - 4,
            laneOffset2 = 25 * Game.SPRITE_SCALE - 4;

        if (direction === Direction.South) {
            this._vehicle.graphic.x = currentCell.tile.x + laneOffset1;
            this._vehicle.graphic.y = currentCell.tile.y;
        } else if (direction === Direction.SouthWest) {
            if (turningState === TurningStates.ToSouthFromWest) {
                this._vehicle.graphic.x = currentCell.tile.x + scaledTileWidth;
                this._vehicle.graphic.y = currentCell.tile.y + laneOffset1;
            } else if (turningState === TurningStates.ToWestFromSouth) {
                this._vehicle.graphic.x = currentCell.tile.x + laneOffset1;
                this._vehicle.graphic.y = currentCell.tile.y;
            }
        } else if (direction === Direction.SouthEast) {
            if (turningState === TurningStates.ToSouthFromEast) {
                this._vehicle.graphic.x = currentCell.tile.x;
                this._vehicle.graphic.y = currentCell.tile.y + laneOffset2;
            } else if (turningState === TurningStates.ToEastFromSouth) {
                this._vehicle.graphic.x = currentCell.tile.x + laneOffset1;
                this._vehicle.graphic.y = currentCell.tile.y;
            }
        } else if (direction === Direction.North) {
            this._vehicle.graphic.x = currentCell.tile.x + laneOffset2;
            this._vehicle.graphic.y = currentCell.tile.y + scaledTileHeight;
        }else if(direction === Direction.NorthWest) {
            if (turningState === TurningStates.ToNorthFromWest) {
                this._vehicle.graphic.x = currentCell.tile.x + scaledTileWidth;
                this._vehicle.graphic.y = currentCell.tile.y + laneOffset1;
            } else if (turningState === TurningStates.ToWestFromNorth) {
                this._vehicle.graphic.x = currentCell.tile.x + laneOffset2;
                this._vehicle.graphic.y = currentCell.tile.y + scaledTileHeight;
            }
        }else if(direction === Direction.NorthEast) {
            if (turningState === TurningStates.ToNorthFromEast) {
                this._vehicle.graphic.x = currentCell.tile.x;
                this._vehicle.graphic.y = currentCell.tile.y + laneOffset2;
            } else if (turningState === TurningStates.ToEastFromNorth) {
                this._vehicle.graphic.x = currentCell.tile.x + laneOffset2;
                this._vehicle.graphic.y = currentCell.tile.y + scaledTileHeight;
            }
        } else if (direction === Direction.West) {
            this._vehicle.graphic.x = currentCell.tile.x + scaledTileWidth;
            this._vehicle.graphic.y = currentCell.tile.y + laneOffset1;
        } else if (direction === Direction.East) {
            this._vehicle.graphic.x = currentCell.tile.x;
            this._vehicle.graphic.y = currentCell.tile.y + laneOffset2;
        }
    }

    determineDirection(pastCell: Cell, currentCell: Cell, futureCell: Cell): Direction {
        const directionPastToCurrent = pastCell.determineDirectionOfNeighbor(currentCell);
        const directionCurrentToFuture = currentCell.determineDirectionOfNeighbor(futureCell);

        if (
            (directionPastToCurrent === Direction.South && directionCurrentToFuture === Direction.West) ||
            (directionPastToCurrent === Direction.West && directionCurrentToFuture === Direction.South)
        ) {
            return Direction.SouthWest;
        }
        if (
            (directionPastToCurrent === Direction.South && directionCurrentToFuture === Direction.East) ||
            (directionPastToCurrent === Direction.East && directionCurrentToFuture === Direction.South)
        ) {
            return Direction.SouthEast;
        }
        if (
            (directionPastToCurrent === Direction.North && directionCurrentToFuture === Direction.West) ||
            (directionPastToCurrent === Direction.West && directionCurrentToFuture === Direction.North)
        ) {
            return Direction.NorthWest;
        }
        if (
            (directionPastToCurrent === Direction.North && directionCurrentToFuture === Direction.East) ||
            (directionPastToCurrent === Direction.East && directionCurrentToFuture === Direction.North)
        ) {
            return Direction.NorthEast;
        }

        return directionCurrentToFuture;
    }

    determineTurningState(pastCell: Cell, currentCell: Cell, futureCell: Cell): TurningStates {
        const directionPastToCurrent = pastCell.determineDirectionOfNeighbor(currentCell);
        const directionCurrentToFuture = currentCell.determineDirectionOfNeighbor(futureCell);

        if (directionPastToCurrent === Direction.South && directionCurrentToFuture === Direction.West) {
            return TurningStates.ToWestFromSouth;
        }
        if (directionPastToCurrent === Direction.West && directionCurrentToFuture === Direction.South) {
            return TurningStates.ToSouthFromWest;
        }
        if (directionPastToCurrent === Direction.South && directionCurrentToFuture === Direction.East) {
            return TurningStates.ToEastFromSouth;
        }
        if (directionPastToCurrent === Direction.East && directionCurrentToFuture === Direction.South) {
            return TurningStates.ToSouthFromEast;
        }
        if (directionPastToCurrent === Direction.North && directionCurrentToFuture === Direction.West) {
            return TurningStates.ToWestFromNorth;
        }
        if (directionPastToCurrent === Direction.West && directionCurrentToFuture === Direction.North) {
            return TurningStates.ToNorthFromWest;
        }
        if (directionPastToCurrent === Direction.North && directionCurrentToFuture === Direction.East) {
            return TurningStates.ToEastFromNorth;
        }
        if (directionPastToCurrent === Direction.East && directionCurrentToFuture === Direction.North) {
            return TurningStates.ToNorthFromEast;
        }

        return TurningStates.NotTurning;
    }

    end(): void {
        this._vehicle.graphic.destroy();
        this._vehicle.graphic = null;
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

    get game(): Game {
        return this._game;
    }

    get startingCellID(): number {
        return this._startingCellID;
    }

    get destinationCellID(): number {
        return this._destinationCellID;
    }

    get path(): number[] {
        return this._path;
    }

    get currentCellID(): number {
        return this._currentCellID;
    }

    get vehicle(): Vehicle {
        return this._vehicle;
    }
}
