// Boruvka's algorithm to find Minimum Spanning
// Tree of a given connected, undirected and weighted graph

// Class to represent a graph
class Graph {
	constructor(vertices) {
		this.V = vertices; // No. of vertices
		this.graph = []; // default dictionary to store graph
	}

	// function to add an edge to graph
	addEdge(u, v, w) {
		this.graph.push([u, v, w]);
	}

	// A utility function to find set of an element i
	// (uses path compression technique)
	find(parent, i) {
		if (parent[i] === i) {
			return i;
		}
		return this.find(parent, parent[i]);
	}
	
	// A function that does union of two sets of x and y
	// (uses union by rank)
	union(parent, rank, x, y) {
		const xroot = this.find(parent, x);
		const yroot = this.find(parent, y);

		// Attach smaller rank tree under root of high rank tree
		// (Union by Rank)
		if (rank[xroot] < rank[yroot]) {
			parent[xroot] = yroot;
		} else if (rank[xroot] > rank[yroot]) {
			parent[yroot] = xroot;
		}
		
		// If ranks are same, then make one as root and increment
		// its rank by one
		else {
			parent[yroot] = xroot;
			rank[xroot] += 1;
		}
	}

	//The main function to construct MST using Kruskal's algorithm
	boruvkaMST() {
		const parent = [];
		
		// An array to store index of the cheapest edge of
		// subset. It store [u,v,w] for each component
		const rank = [];
		const cheapest = [];

		// Initially there are V different trees.
		// Finally there will be one tree that will be MST
		let numTrees = this.V;
		let MSTweight = 0;

		// Create V subsets with single elements
		for (let node = 0; node < this.V; node++) {
			parent.push(node);
			rank.push(0);
			cheapest[node] = -1;
		}

		// Keep combining components (or sets) until all
		// components are not combined into single MST
		while (numTrees > 1) {
		
			// Traverse through all edges and update
			// cheapest of every component
			for (let i = 0; i < this.graph.length; i++) {
			
				// Find components (or sets) of two corners
				// of current edge
				const [u, v, w] = this.graph[i];
				const set1 = this.find(parent, u);
				const set2 = this.find(parent, v);

				// If two corners of current edge belong to
				// same set, ignore current edge. Else check if 
				// current edge is closer to previous
				// cheapest edges of set1 and set2
				if (set1 !== set2) {
					if (cheapest[set1] === -1 || cheapest[set1][2] > w) {
						cheapest[set1] = [u, v, w];
					}

					if (cheapest[set2] === -1 || cheapest[set2][2] > w) {
						cheapest[set2] = [u, v, w];
					}
				}
			}

			// Consider the above picked cheapest edges and add them
			// to MST
			for (let node = 0; node < this.V; node++) {
			
				// Check if cheapest for current set exists
				if (cheapest[node] !== -1) {
					const [u, v, w] = cheapest[node];
					const set1 = this.find(parent, u);
					const set2 = this.find(parent, v);

					if (set1 !== set2) {
						MSTweight += w;
						this.union(parent, rank, set1, set2);
						console.log(`Edge ${u}-${v} with weight ${w} included in MST`);
						numTrees--;
					}
				}
			}

			for (let node = 0; node < this.V; node++) {
			
				// reset cheapest array
				cheapest[node] = -1;
			}
		}

		console.log(`Weight of MST is ${MSTweight}`);
	}
}

let g = new Graph(4);
g.addEdge(0, 1, 10);
g.addEdge(0, 2, 6);
g.addEdge(0, 3, 5);
g.addEdge(1, 3, 15);
g.addEdge(2, 3, 4);

g.boruvkaMST();

// This code is contributed by prajwal kandekar
