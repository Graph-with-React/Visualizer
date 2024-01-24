class Edge {
    constructor(u, v) {
        this.u = u;
        this.v = v;
    }
}

class Graph {
    constructor() {
        this.vertices = new Map();
    }

    addEdge(u, v) {
        this.vertices.set(u, (this.vertices.get(u) || []).concat(v));
        this.vertices.set(v, (this.vertices.get(v) || []).concat(u));
    }

    contractEdge(edge) {
        const u = edge.u;
        const v = edge.v;

        // Merge v into u
        const uNeighbors = this.vertices.get(u) || [];
        const vNeighbors = this.vertices.get(v) || [];

        // Remove self-loops
        const filteredVNeighbors = vNeighbors.filter(vertex => vertex !== u);

        // Merge v's neighbors into u's neighbors
        this.vertices.set(u, uNeighbors.concat(filteredVNeighbors));
        this.vertices.delete(v);

        // Update all occurrences of v with u in other vertices' adjacency lists
        for (const [key, neighbors] of this.vertices.entries()) {
            this.vertices.set(key, neighbors.map(vertex => (vertex === v ? u : vertex)));
        }
    }

    getRandomEdge() {
        const randomVertexIndex = Math.floor(Math.random() * this.vertices.size);
        const u = [...this.vertices.keys()][randomVertexIndex];

        const uNeighbors = this.vertices.get(u) || [];
        const randomNeighborIndex = Math.floor(Math.random() * uNeighbors.length);
        const v = uNeighbors[randomNeighborIndex];

        return new Edge(u, v);
    }

    getMinCut() {
        while (this.vertices.size > 2) {
            const randomEdge = this.getRandomEdge();
            this.contractEdge(randomEdge);
        }

        // Return the size of one of the remaining lists
        return [...this.vertices.values()][0].length;
    }
}

// Example Usage:
const graph = new Graph();

// Add your graph edges here
graph.addEdge(1, 2);
graph.addEdge(2, 3);
graph.addEdge(3, 4);
graph.addEdge(4, 1);

const minCut = graph.getMinCut();
console.log("Minimum cut size:", minCut);
