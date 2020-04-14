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

import GameMap from './GameMap';

/**
 * Represents a vehicle travelling from one cell to another, with a determined path and a current location.
 */
export default class TravelTrip {
    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _gameMap: GameMap;
    private _startingCellID: number;
    private _destinationCellID: number;
    private _path: number[];
    private _currentCellID: number;

    constructor(
        map: GameMap,
        startingCellID: number,
        destinationCellID: number,
        path: number[],
        currentCellID: number,
    ) {
        this._gameMap = map;
        this._startingCellID = startingCellID;
        this._destinationCellID = destinationCellID;
        this._path = path;
        this._currentCellID = currentCellID;
    }

    advance(): boolean {
        console.log('advance');
        // If we're at our destination
        if (this._currentCellID === this._destinationCellID) {
            this.end();
            return false;
        }

        // Remove the vehicle from the current Cell
        this._gameMap.getCellByID(this._currentCellID).vehicle = false;

        // Find the next Cell to which to advance
        const currentPathIndex = this._path.indexOf(this._currentCellID);
        const nextCellID = this._path[currentPathIndex + 1];

        // Set the next Cell as the current Cell now
        this._currentCellID = nextCellID;
        // Add the vehicle to the Cell
        this._gameMap.getCellByID(this._currentCellID).vehicle = true;

        return true;
    }

    end(): void {
        this._gameMap.getCellByID(this._currentCellID).vehicle = false;
    }

    /* Getters & Setters -------------------------------------------------------------------------------------------- */

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
}
