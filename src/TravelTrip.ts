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

import Vehicle, { Directions, TurningStates } from './Vehicle';
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

    /**
     * Moves the trip forward in time, which involves changing its current cell to the next one
     * in the predetermined path.
     * Returns false if the trip should be considered over/ended.
     */
    advance(): boolean {
        // Find the next Cell to which to advance
        let currentPathIndex = this._path.indexOf(this._currentCellID);
        const nextCellID = this._path[currentPathIndex + 1];

        // Set the next Cell as the current Cell now (and save the current as past)
        const pastCell = this._game.gameMap.getCellByID(this._currentCellID);
        this._currentCellID = nextCellID;
        const currentCell = this._game.gameMap.getCellByID(this._currentCellID);

        // Get the "future" Cell (one step ahead of the now-current Cell)
        currentPathIndex = this._path.indexOf(this._currentCellID);
        const futureCellID = this._path[currentPathIndex + 1];

        // If there's no future Cell (i.e. we're approaching our destination)
        if (!futureCellID) {
            this.end();
            return false;
        }

        const futureCell = this._game.gameMap.getCellByID(futureCellID);
        this.updateVehicle(pastCell, currentCell, futureCell);

        return true;
    }

    /**
     * Updates the Vehicle's state, including its current direction, turning state, and the X and Y it should use.
     *
     * @param pastCell The Cell the Vehicle was just on
     * @param currentCell The Cell the Vehicle is currently on
     * @param futureCell The Cell the Vehicle is expected to be on in the next advancement of the trip
     */
    updateVehicle(pastCell: Cell, currentCell: Cell, futureCell: Cell): void {
        // Determine the direction from here to the future Cell
        const direction = this.determineDirection(pastCell, currentCell, futureCell);
        this._vehicle.direction = direction;
        // Determine the turning state if we're in the middle of a turn
        const turningState = this.determineTurningState(pastCell, currentCell, futureCell);
        this._vehicle.turningState = turningState;

        this._vehicle.tileX = currentCell.tile.x;
        this._vehicle.tileY = currentCell.tile.y;

        const scaledTileHeight = Grid.TILE_HEIGHT * this._game.grid.scale,
            scaledTileWidth = Grid.TILE_WIDTH * this._game.grid.scale,
            laneOffset1 = 11 * this._game.grid.scale - 4,
            laneOffset2 = 25 * this._game.grid.scale - 4;

        // Determine the graphical placement of the Vehicle sprite based on its current direction and turning state
        if (direction === Directions.South) {
            this._vehicle.graphic.x = currentCell.tile.x + laneOffset1;
            this._vehicle.graphic.y = currentCell.tile.y;
        } else if (direction === Directions.SouthWest) {
            if (turningState === TurningStates.ToSouthFromWest) {
                this._vehicle.graphic.x = currentCell.tile.x + scaledTileWidth;
                this._vehicle.graphic.y = currentCell.tile.y + laneOffset1;
            } else if (turningState === TurningStates.ToWestFromSouth) {
                this._vehicle.graphic.x = currentCell.tile.x + laneOffset1;
                this._vehicle.graphic.y = currentCell.tile.y;
            }
        } else if (direction === Directions.SouthEast) {
            if (turningState === TurningStates.ToSouthFromEast) {
                this._vehicle.graphic.x = currentCell.tile.x;
                this._vehicle.graphic.y = currentCell.tile.y + laneOffset2;
            } else if (turningState === TurningStates.ToEastFromSouth) {
                this._vehicle.graphic.x = currentCell.tile.x + laneOffset1;
                this._vehicle.graphic.y = currentCell.tile.y;
            }
        } else if (direction === Directions.North) {
            this._vehicle.graphic.x = currentCell.tile.x + laneOffset2;
            this._vehicle.graphic.y = currentCell.tile.y + scaledTileHeight;
        } else if (direction === Directions.NorthWest) {
            if (turningState === TurningStates.ToNorthFromWest) {
                this._vehicle.graphic.x = currentCell.tile.x + scaledTileWidth;
                this._vehicle.graphic.y = currentCell.tile.y + laneOffset1;
            } else if (turningState === TurningStates.ToWestFromNorth) {
                this._vehicle.graphic.x = currentCell.tile.x + laneOffset2;
                this._vehicle.graphic.y = currentCell.tile.y + scaledTileHeight;
            }
        } else if (direction === Directions.NorthEast) {
            if (turningState === TurningStates.ToNorthFromEast) {
                this._vehicle.graphic.x = currentCell.tile.x;
                this._vehicle.graphic.y = currentCell.tile.y + laneOffset2;
            } else if (turningState === TurningStates.ToEastFromNorth) {
                this._vehicle.graphic.x = currentCell.tile.x + laneOffset2;
                this._vehicle.graphic.y = currentCell.tile.y + scaledTileHeight;
            }
        } else if (direction === Directions.West) {
            this._vehicle.graphic.x = currentCell.tile.x + scaledTileWidth;
            this._vehicle.graphic.y = currentCell.tile.y + laneOffset1;
        } else if (direction === Directions.East) {
            this._vehicle.graphic.x = currentCell.tile.x;
            this._vehicle.graphic.y = currentCell.tile.y + laneOffset2;
        }
    }

    /**
     * Determines the direction for the Vehicle based on its past, current, and future Cells.
     *
     * @param pastCell
     * @param currentCell
     * @param futureCell
     */
    determineDirection(pastCell: Cell, currentCell: Cell, futureCell: Cell): Directions {
        const directionPastToCurrent = pastCell.determineDirectionOfNeighbor(currentCell);
        const directionCurrentToFuture = currentCell.determineDirectionOfNeighbor(futureCell);

        if (
            (directionPastToCurrent === Directions.South && directionCurrentToFuture === Directions.West) ||
            (directionPastToCurrent === Directions.West && directionCurrentToFuture === Directions.South)
        ) {
            return Directions.SouthWest;
        }
        if (
            (directionPastToCurrent === Directions.South && directionCurrentToFuture === Directions.East) ||
            (directionPastToCurrent === Directions.East && directionCurrentToFuture === Directions.South)
        ) {
            return Directions.SouthEast;
        }
        if (
            (directionPastToCurrent === Directions.North && directionCurrentToFuture === Directions.West) ||
            (directionPastToCurrent === Directions.West && directionCurrentToFuture === Directions.North)
        ) {
            return Directions.NorthWest;
        }
        if (
            (directionPastToCurrent === Directions.North && directionCurrentToFuture === Directions.East) ||
            (directionPastToCurrent === Directions.East && directionCurrentToFuture === Directions.North)
        ) {
            return Directions.NorthEast;
        }

        return directionCurrentToFuture;
    }

    /**
     * Determines the turning state for the Vehicle based on its past, current, and future Cells.
     *
     * @param pastCell
     * @param currentCell
     * @param futureCell
     */
    determineTurningState(pastCell: Cell, currentCell: Cell, futureCell: Cell): TurningStates {
        const directionPastToCurrent = pastCell.determineDirectionOfNeighbor(currentCell);
        const directionCurrentToFuture = currentCell.determineDirectionOfNeighbor(futureCell);

        if (directionPastToCurrent === Directions.South && directionCurrentToFuture === Directions.West) {
            return TurningStates.ToWestFromSouth;
        }
        if (directionPastToCurrent === Directions.West && directionCurrentToFuture === Directions.South) {
            return TurningStates.ToSouthFromWest;
        }
        if (directionPastToCurrent === Directions.South && directionCurrentToFuture === Directions.East) {
            return TurningStates.ToEastFromSouth;
        }
        if (directionPastToCurrent === Directions.East && directionCurrentToFuture === Directions.South) {
            return TurningStates.ToSouthFromEast;
        }
        if (directionPastToCurrent === Directions.North && directionCurrentToFuture === Directions.West) {
            return TurningStates.ToWestFromNorth;
        }
        if (directionPastToCurrent === Directions.West && directionCurrentToFuture === Directions.North) {
            return TurningStates.ToNorthFromWest;
        }
        if (directionPastToCurrent === Directions.North && directionCurrentToFuture === Directions.East) {
            return TurningStates.ToEastFromNorth;
        }
        if (directionPastToCurrent === Directions.East && directionCurrentToFuture === Directions.North) {
            return TurningStates.ToNorthFromEast;
        }

        return TurningStates.NotTurning;
    }

    /**
     * Finalizes the trip, which involves destroying its graphics.
     */
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
