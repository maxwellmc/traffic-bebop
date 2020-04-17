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

import Vehicle, { Direction } from './Vehicle';
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
        console.log('advance');

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

        // Update the Vehicle
        this._vehicle.tileX = currentCell.tile.x;
        this._vehicle.tileY = currentCell.tile.y;
        const scaledTileHeight = Grid.TILE_HEIGHT * Game.SPRITE_SCALE,
            scaledTileWidth = Grid.TILE_WIDTH * Game.SPRITE_SCALE,
            scaledTileCenterWidth = scaledTileWidth / 2,
            scaledTileCenterHeight = scaledTileHeight / 2;
        if (direction === Direction.South) {
            this._vehicle.graphic.x = currentCell.tile.x + scaledTileCenterWidth;
            this._vehicle.graphic.y = currentCell.tile.y + scaledTileCenterHeight;
        } else if (direction === Direction.North) {
            this._vehicle.graphic.x = currentCell.tile.x + scaledTileCenterWidth;
            this._vehicle.graphic.y = currentCell.tile.y + scaledTileHeight;
        } else if (direction === Direction.West) {
            this._vehicle.graphic.x = currentCell.tile.x + scaledTileWidth - this.vehicle.graphic.width;
            this._vehicle.graphic.y = currentCell.tile.y + scaledTileCenterHeight;
        } else if (direction === Direction.East) {
            this._vehicle.graphic.x = currentCell.tile.x + scaledTileWidth;
            this._vehicle.graphic.y = currentCell.tile.y + scaledTileCenterHeight;
        }
    }

    determineDirection(pastCell: Cell, currentCell: Cell, futureCell: Cell): Direction {
        return currentCell.determineDirectionOfNeighbor(futureCell);
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
