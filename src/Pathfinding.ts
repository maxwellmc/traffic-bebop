import GameMap from './GameMap';

class WeightedNode {
    public node;
    public weight;

    constructor(node, weight) {
        this.node = node;
        this.weight = weight;
    }
}

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
        this.adjacencyList[node2].add(new WeightedNode(node1, weight));
    }
}

class PriorityQueueItem {
    public element;
    public weight;

    constructor(element, weight) {
        this.element = element;
        this.weight = weight;
    }
}

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

export class Pathfinder {
    /**
     * An implementation of the Dijkstra algorithm, with modifications for the fact that there are multiple
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
        const times: Map<number, number> = new Map();
        const backtrace: Map<number, number> = new Map();
        const pq: PriorityQueue = new PriorityQueue();

        times.set(startNode, 0);

        graph.nodes.forEach((node) => {
            if (node !== startNode) {
                times.set(node, Infinity);
            }
        });

        pq.enqueue(new PriorityQueueItem(startNode, 0));

        while (!pq.isEmpty()) {
            const shortestStep = pq.dequeue();
            const currentNode = shortestStep.element;
            for (const neighbor of graph.adjacencyList[currentNode]) {
                const time = times.get(currentNode) + neighbor.weight;
                if (time < times.get(neighbor.node)) {
                    times.set(neighbor.node, time);
                    backtrace.set(neighbor.node, currentNode);
                    pq.enqueue(new PriorityQueueItem(neighbor.node, time));
                }
            }
        }

        let shortestTime = Infinity;
        for (const endNode of endNodes) {
            if (times.get(endNode) < shortestTime) {
                shortestTime = times.get(endNode);
            }
        }

        return shortestTime;
    }

    static getPathOfEndNode(startNode: number, endNode: number, backtrace: Map<number, number>): number[] {
        const path = [endNode];
        let lastStep = endNode;
        while (lastStep !== startNode) {
            path.unshift(backtrace.get(lastStep));
            lastStep = backtrace.get(lastStep);
        }
        return path;
    }

    static generateGraphFromMap(map: GameMap): Graph {
        const graph = new Graph();

        // Add all the nodes
        for (const row of map.map) {
            for (const cell of row) {
                graph.addNode(cell.id);
            }
        }

        // Add all the edges to the nodes
        for (const row of map.map) {
            for (const cell of row) {
                if (cell.getLeftNeighbor()) {
                    graph.addEdge(cell.id, cell.getLeftNeighbor().id, 1);
                }
                if (cell.getRightNeighbor()) {
                    graph.addEdge(cell.id, cell.getRightNeighbor().id, 1);
                }
                if (cell.getTopNeighbor()) {
                    graph.addEdge(cell.id, cell.getTopNeighbor().id, 1);
                }
                if (cell.getBottomNeighbor()) {
                    graph.addEdge(cell.id, cell.getBottomNeighbor().id, 1);
                }
            }
        }

        return graph;
    }
}
