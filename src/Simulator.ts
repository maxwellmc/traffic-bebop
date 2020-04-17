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

import Cell, { StructureTypes, ZoneTypes } from './Cell';
import GameMap from './GameMap';
import { Pathfinder } from './Pathfinding';
import Game from './Game';
import TravelTrip from './TravelTrip';

/**
 * Handles the changes to the Map each tick, based on set logic and varying amounts of randomness.
 * The goal is to simulate real-world traffic and economic fluctuations.
 */
export default class Simulator {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly MOVE_IN_CHANCE = 50;
    public static readonly MOVE_IN_ROAD_CUTOFF = 2;
    public static readonly MOVE_IN_ROAD_EXPONENTIATION_OPERAND = 4;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game: Game;

    constructor(game) {
        this._game = game;
    }

    /* Simulators --------------------------------------------------------------------------------------------------- */

    /**
     * Runs the individual simulating functions for each domain (e.g. real estate, traffic).
     */
    simulate(): void {
        console.log('simulate');
        const map = this._game.map;

        // Simulate real estate
        this.simulateResidentialRealEstate(map);
        this.simulateCommercialRealEstate(map);

        // Simulate traffic
        this.simulateResidentialTraffic(map);
        this.advanceTravelTrips();
    }

    /**
     * Simulates people moving in and out of residences.
     *
     * @param map
     */
    simulateResidentialRealEstate(map: GameMap): void {
        const emptyResidentialCells = map.findCellsByZoneAndStructure(ZoneTypes.Residential, StructureTypes.Empty);
        // Loop through each empty residential zone
        for (const emptyResidentialCell of emptyResidentialCells) {
            // Determine if this cell should be "moved into"
            if (this.shouldResidentMoveIn(emptyResidentialCell)) {
                emptyResidentialCell.structureType = StructureTypes.House;
            }
        }
    }

    /**
     * Simulates businesses moving in and out of commercial buildings.
     *
     * @param map
     */
    simulateCommercialRealEstate(map: GameMap): void {
        const emptyCommercialCells = map.findCellsByZoneAndStructure(ZoneTypes.Commercial, StructureTypes.Empty);
        // Loop through each empty commercial zone
        for (const emptyCommercialCell of emptyCommercialCells) {
            // Determine if this cell should be "moved into"
            if (this.shouldBusinessMoveIn(emptyCommercialCell)) {
                emptyCommercialCell.structureType = StructureTypes.Business;
            }
        }
    }

    simulateResidentialTraffic(map: GameMap): void {
        const houseCells = map.findCellsByStructure(StructureTypes.House);
        // Loop through each occupied residential Cell
        for (const houseCell of houseCells) {
            // Determine if this resident should travel to another lot
            if (this.shouldResidentTravel(houseCell)) {
                console.log('shouldtravel');
                // Find a random commercial destination
                const destinationCell = this._game.map.findRandomCellByZoneAndStructure(
                    ZoneTypes.Commercial,
                    StructureTypes.Business,
                );
                if (destinationCell) {
                    this.startTravelTrip(houseCell, destinationCell);
                }
            }
        }
    }

    startTravelTrip(startingCell: Cell, destinationCell: Cell): void {
        console.log('startTravelTrip');
        const graph = Pathfinder.generateGraphFromMap(this._game.map, true);
        const path = Pathfinder.findShortestPathWithOneDestinationWithDijkstra(
            graph,
            startingCell.id,
            destinationCell.id,
        );
        const travelTrip = new TravelTrip(this._game, startingCell.id, destinationCell.id, path);
        this._game.gameState.travelTrips.add(travelTrip);
        console.log('path', path);
    }

    advanceTravelTrips(): void {
        if (!this._game.gameState.travelTrips.size) {
            return;
        }

        console.log('advanceTravelTrips');
        for (const trip of this._game.gameState.travelTrips) {
            if (!trip.advance()) {
                // If advancing returned false, then that was the end of this trip
                this._game.gameState.travelTrips.delete(trip);
            }
        }
    }

    /* Chance Determiners ------------------------------------------------------------------------------------------- */

    /**
     * Determines whether an individual residential Cell should be "moved into" during this simulation tick.
     *
     * @param cell
     */
    shouldResidentMoveIn(cell: Cell): boolean {
        // Only even consider moving in if we're within so many tiles of a road
        const nearestRoadDistance = this.calculateNearestRoadDistance(cell, this._game.map);
        if (nearestRoadDistance < Simulator.MOVE_IN_ROAD_CUTOFF) {
            let chance = Simulator.MOVE_IN_CHANCE;
            // Decrease our chances by how far we are from a road (i.e. the further, the worse)
            chance *= nearestRoadDistance ** Simulator.MOVE_IN_ROAD_EXPONENTIATION_OPERAND;
            return Simulator.randomInt(chance) === 0;
        }
        return false;
    }

    /**
     * Determines whether an individual commercial Cell should be "moved into" during this simulation tick.
     *
     * @param cell
     */
    shouldBusinessMoveIn(cell: Cell): boolean {
        // Only even consider moving in if we're within so many tiles of a road
        const nearestRoadDistance = this.calculateNearestRoadDistance(cell, this._game.map);
        if (nearestRoadDistance < Simulator.MOVE_IN_ROAD_CUTOFF) {
            let chance = Simulator.MOVE_IN_CHANCE;
            // Decrease our chances by how far we are from a road (i.e. the further, the worse)
            chance *= nearestRoadDistance ** Simulator.MOVE_IN_ROAD_EXPONENTIATION_OPERAND;
            return Simulator.randomInt(chance) === 0;
        }
        return false;
    }

    shouldResidentTravel(cell: Cell): boolean {
        // TODO
        return Simulator.randomInt(50) === 0;
    }

    /* -------------------------------------------------------------------------------------------------------------- */

    /**
     * Given a starting Cell and a GameMap, this finds the travel time to the nearest road Cell.
     *
     * @param cell
     * @param gameMap
     */
    calculateNearestRoadDistance(cell: Cell, gameMap: GameMap): number {
        // Create a Graph of the GameMap
        const graph = Pathfinder.generateGraphFromMap(gameMap);
        // Find all the Cells with roads
        const cellsWithRoads = gameMap.findCellsByStructure(StructureTypes.Road);
        const cellsWithRoadsIds = [];
        // Convert the array of Cells to an array of just the Cells' IDs
        cellsWithRoads.forEach((cell) => {
            cellsWithRoadsIds.push(cell.id);
        });

        // Find the shortest time to any road
        const shortestTime = Pathfinder.findShortestTimeWithMultipleDestinationsWithDijkstra(
            graph,
            graph.nodes[cell.id],
            cellsWithRoadsIds,
        );

        // Return the length of the shortest time
        return shortestTime;
    }

    /**
     * Mirrors the functionality of Java's Random's `nextInt(int bound)` function.
     * Returns a random integer, with a minimum of 0 and a maximum as provided.
     * The minimum is inclusive and the maximum is exclusive.
     *
     * @param max
     */
    static randomInt(max): number {
        max = Math.floor(max);
        return Math.floor(Math.random() * max);
    }
}
