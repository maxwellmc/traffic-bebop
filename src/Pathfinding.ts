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
import Cell, { StructureTypes } from './Cell';

/**
 * The file houses multiple classes used for the pathfinding algorithms.
 */

/**
 * A node within a Graph, carrying a set weight.
 */
class WeightedNode {
    public node;
    public weight;

    constructor(node, weight) {
        this.node = node;
        this.weight = weight;
    }
}

/**
 * An implementation of a Graph, for the purpose of Dijkstra's algorithm.
 */
export class Graph {
    public nodes: number[];
    public adjacencyList: Set<WeightedNode>[];

    constructor() {
        this.nodes = [];
        this.adjacencyList = [];
    }

    addNode(node: number): void {
        this.nodes.push(node);
        this.adjacencyList[node] = new Set<WeightedNode>();
    }

    addEdge(node1, node2, weight): void {
        this.adjacencyList[node1].add(new WeightedNode(node2, weight));
    }
}

/**
 * An item within a PriorityQueue.
 */
class PriorityQueueItem {
    public element;
    public weight;

    constructor(element, weight) {
        this.element = element;
        this.weight = weight;
    }
}

/**
 * An implementation of a PriorityQueue, for the purpose of Dijkstra's algorithm.
 */
export class PriorityQueue {
    private collection: PriorityQueueItem[];

    constructor() {
        this.collection = [];
    }

    enqueue(item: PriorityQueueItem): void {
        if (this.isEmpty()) {
            this.collection.push(item);
        } else {
            let added = false;
            for (let i = 1; i <= this.collection.length; i++) {
                if (item.weight < this.collection[i - 1].weight) {
                    this.collection.splice(i - 1, 0, item);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.collection.push(item);
            }
        }
    }

    dequeue(): PriorityQueueItem {
        return this.collection.shift();
    }

    isEmpty(): boolean {
        return this.collection.length === 0;
    }
}

/**
 * Houses static functions for pathfinding.
 */
export class Pathfinder {
    public static readonly PREFER_ROADS_NONROAD_WEIGHT = 1000;

    /**
     * An implementation of Dijkstra's algorithm. This simply processes the Graph per the algorithm.
     * What is done with the processed queue, backtrace, etc. should be handled by another function.
     *
     * @param graph
     * @param startNode
     * @param times
     * @param backtrace
     * @param priorityQueue
     */
    static processDijkstra(
        graph: Graph,
        startNode: number,
        times: Map<number, number>,
        backtrace: Map<number, number>,
        priorityQueue: PriorityQueue,
    ): void {
        times.set(startNode, 0);

        graph.nodes.forEach((node) => {
            if (node !== startNode) {
                times.set(node, Infinity);
            }
        });

        priorityQueue.enqueue(new PriorityQueueItem(startNode, 0));

        while (!priorityQueue.isEmpty()) {
            const shortestStep = priorityQueue.dequeue();
            const currentNode = shortestStep.element;
            for (const neighbor of graph.adjacencyList[currentNode]) {
                const time = times.get(currentNode) + neighbor.weight;
                if (time < times.get(neighbor.node)) {
                    times.set(neighbor.node, time);
                    backtrace.set(neighbor.node, currentNode);
                    priorityQueue.enqueue(new PriorityQueueItem(neighbor.node, time));
                }
            }
        }
    }

    /**
     * An implementation of Dijkstra's algorithm, with modifications for the fact that there are multiple
     * destinations, and we just want the time to the closest destination.
     *
     * @param graph
     * @param startNode
     * @param endNodes
     */
    static findShortestTimeWithMultipleDestinationsWithDijkstra(
        graph: Graph,
        startNode: number,
        endNodes: number[],
    ): number {
        const times: Map<number, number> = new Map(),
            backtrace: Map<number, number> = new Map(),
            priorityQueue: PriorityQueue = new PriorityQueue();

        Pathfinder.processDijkstra(graph, startNode, times, backtrace, priorityQueue);

        let shortestTime = Infinity;
        // Loop through each node that's considered a destination
        for (const endNode of endNodes) {
            // If this node's travel time is shorter than the one we had, then set its time as the new shortest one
            if (times.get(endNode) < shortestTime) {
                shortestTime = times.get(endNode);
            }
        }

        return shortestTime;
    }

    static findShortestPathWithOneDestinationWithDijkstra(graph: Graph, startNode: number, endNode: number): number[] {
        const times: Map<number, number> = new Map(),
            backtrace: Map<number, number> = new Map(),
            priorityQueue: PriorityQueue = new PriorityQueue();

        Pathfinder.processDijkstra(graph, startNode, times, backtrace, priorityQueue);

        return Pathfinder.getPathOfEndNode(startNode, endNode, backtrace);
    }

    /**
     * Given a start node, an individual destination, and a previously determined backtrace Map, this recreates the
     * best route and returns it as an ordered array of nodes.
     *
     * @param startNode
     * @param endNode
     * @param backtrace
     */
    static getPathOfEndNode(startNode: number, endNode: number, backtrace: Map<number, number>): number[] {
        const path = [endNode];
        let lastStep = endNode;
        while (lastStep !== startNode) {
            path.unshift(backtrace.get(lastStep));
            lastStep = backtrace.get(lastStep);
        }
        return path;
    }

    /**
     * Given a GameMap full of Cells, this converts it to a Graph full of nodes and edges.
     *
     * @param gameMap
     * @param preferRoads If true, then routes will try to use roads as much as possible
     */
    static generateGraphFromMap(gameMap: GameMap, preferRoads = false): Graph {
        const graph = new Graph();

        // Add all the nodes
        for (const row of gameMap.map) {
            for (const cell of row) {
                // A node is simply the ID of the Cell
                graph.addNode(cell.id);
            }
        }

        // Add all the edges to the nodes
        for (const row of gameMap.map) {
            for (const cell of row) {
                const leftNeighbor = cell.getLeftNeighbor(),
                    rightNeighbor = cell.getRightNeighbor(),
                    topNeighbor = cell.getTopNeighbor(),
                    bottomNeighbor = cell.getBottomNeighbor();

                // Add an edge for each neighboring Cell (to the left, to the right, above, and below)
                if (leftNeighbor) {
                    graph.addEdge(
                        cell.id,
                        leftNeighbor.id,
                        Pathfinder.determineEdgeWeightOfNeighborCell(leftNeighbor, preferRoads),
                    );
                }
                if (rightNeighbor) {
                    graph.addEdge(
                        cell.id,
                        rightNeighbor.id,
                        Pathfinder.determineEdgeWeightOfNeighborCell(rightNeighbor, preferRoads),
                    );
                }
                if (topNeighbor) {
                    graph.addEdge(
                        cell.id,
                        topNeighbor.id,
                        Pathfinder.determineEdgeWeightOfNeighborCell(topNeighbor, preferRoads),
                    );
                }
                if (bottomNeighbor) {
                    graph.addEdge(
                        cell.id,
                        bottomNeighbor.id,
                        Pathfinder.determineEdgeWeightOfNeighborCell(bottomNeighbor, preferRoads),
                    );
                }
            }
        }

        return graph;
    }

    static determineEdgeWeightOfNeighborCell(neighborCell: Cell, preferRoads: boolean): number {
        // If we're preferring roads and the neighbor is a road, then give this edge a weight of 1
        // If we're preferring roads and the neighbor isn't a road, then give a large weight (to avoid)
        // If we don't care about preferring roads, then just give a 1
        return preferRoads
            ? neighborCell.structureType === StructureTypes.Road
                ? 1
                : this.PREFER_ROADS_NONROAD_WEIGHT
            : 1;
    }
}
