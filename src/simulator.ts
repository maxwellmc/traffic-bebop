import Cell from './cell';
import Map from './map';

/**
 * Handles the changes to the map each tick, based on set logic and varying amounts of randomness.
 * The goal is to simulate real-world traffic and economic fluctuations.
 */
export default class Simulator {
    /* Constants ---------------------------------------------------------------------------------------------------- */
    public static readonly CHANCE_MOVE_IN = 200;

    /* Class Properties --------------------------------------------------------------------------------------------- */
    private _game;

    constructor(game) {
        this._game = game;
    }

    simulate(): void {
        console.log('simulate');
        const map = this._game.map;
        const emptyResidentialCells = map.findCellsByZoneAndStructure(
            Cell.ZONE_TYPE_RESIDENTIAL,
            Cell.STRUCTURE_TYPE_EMPTY,
        );
        // Loop through each empty residential zone
        for (const emptyResidentialCell of emptyResidentialCells) {
            // Determine if this cell should be "moved into"
            if (Simulator.randomInt(Simulator.CHANCE_MOVE_IN) === 0) {
                emptyResidentialCell.structureType = Cell.STRUCTURE_TYPE_HOUSE;
                console.log('movein');
            }
        }
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
