import Cell from './cell';
import GameMap from './gameMap';
import { Pathfinder } from './nonworld/pathfinding';

/**
 * Handles the changes to the map each tick, based on set logic and varying amounts of randomness.
 * The goal is to simulate real-world traffic and economic fluctuations.
 */
export default class Simulator {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly MOVE_IN_CHANCE = 100;
    public static readonly MOVE_IN_ROAD_CUTOFF = 4;
    public static readonly MOVE_IN_ROAD_EXPONENTIATION_OPERAND = 4;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game;

    constructor(game) {
        this._game = game;
    }

    simulate(): void {
        console.log('simulate');
        const map = this._game.map;

        this.simulateResidences(map);
        this.simulateBusinesses(map);
    }

    simulateResidences(map: GameMap): void{
        const emptyResidentialCells = map.findCellsByZoneAndStructure(
            Cell.ZONE_TYPE_RESIDENTIAL,
            Cell.STRUCTURE_TYPE_EMPTY,
        );
        // Loop through each empty residential zone
        for (const emptyResidentialCell of emptyResidentialCells) {
            // Determine if this cell should be "moved into"
            if (this.shouldResidentMoveIn(emptyResidentialCell)) {
                emptyResidentialCell.structureType = Cell.STRUCTURE_TYPE_HOUSE;
            }
        }
    }

    simulateBusinesses(map: GameMap): void{
        const emptyCommercialCells = map.findCellsByZoneAndStructure(
            Cell.ZONE_TYPE_COMMERCIAL,
            Cell.STRUCTURE_TYPE_EMPTY,
        );
        // Loop through each empty commercial zone
        for (const emptyCommercialCell of emptyCommercialCells) {
            // Determine if this cell should be "moved into"
            if (this.shouldBusinessMoveIn(emptyCommercialCell)) {
                emptyCommercialCell.structureType = Cell.STRUCTURE_TYPE_BUSINESS;
            }
        }
    }

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

    calculateNearestRoadDistance(cell: Cell, map: GameMap): number {
        // Create a Graph of the GameMap
        const graph = Pathfinder.generateGraphFromMap(map);
        // Find all the Cells with roads
        const cellsWithRoads = map.findCellsByStructure(Cell.STRUCTURE_TYPE_ROAD);
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
     * The maximum is exclusive and the minimum is inclusive.
     *
     * @param max
     */
    static randomInt(max): number {
        max = Math.floor(max);
        return Math.floor(Math.random() * max);
    }
}
