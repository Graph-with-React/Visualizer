// Javascript program to find Minimum Spanning Tree
// of a graph using Reverse Delete Algorithm

// Graph class represents a directed graph
// using adjacency list representation
class Graph {

	// Constructor
	constructor(V) {
		this.V = V;
		this.adj = [];
		this.edges = [];
		for (let i = 0; i < V; i++) {
			this.adj[i] = [];
		}
	}
	
	// function to add an edge to graph
	addEdge(u, v, w) {
		this.adj[u].push(v);// Add w to v’s list.
		this.adj[v].push(u);// Add w to v’s list.
		this.edges.push([w, [u, v]]);
	}

	DFS(v, visited) {
		// Mark the current node as visited and print it
		visited[v] = true;
		for (const i of this.adj[v]) {
			if (!visited[i]) {
				this.DFS(i, visited);
			}
		}
	}

	// Returns true if given graph is connected, else false
	isConnected() {
		const visited = [];
		for (let i = 0; i < this.V; i++) {
			visited[i] = false;
		}
		
		// Find all reachable vertices from first vertex
		this.DFS(0, visited);
		
		// If set of reachable vertices includes all,
		// return true.
		for (let i = 1; i < this.V; i++) {
			if (!visited[i]) {
				return false;
			}
		}
		return true;
	}

	// This function assumes that edge (u, v)
	// exists in graph or not,
	reverseDeleteMST() {
	
		// Sort edges in increasing order on basis of cost
		this.edges.sort((a, b) => a[0] - b[0]);
		
		let mstWt = 0;// Initialize weight of MST
		
		console.log("Edges in MST");
		
		// Iterate through all sorted edges in
		// decreasing order of weights
		for (let i = this.edges.length - 1; i >= 0; i--) {
			const [u, v] = this.edges[i][1];
			
			// Remove edge from undirected graph
			this.adj[u] = this.adj[u].filter(x => x !== v);
			this.adj[v] = this.adj[v].filter(x => x !== u);
			
			// Adding the edge back if removing it
			// causes disconnection. In this case this 
			// edge becomes part of MST.
			if (!this.isConnected()) {
				this.adj[u].push(v);
				this.adj[v].push(u);
				
				// This edge is part of MST
				console.log(`(${u}, ${v})`);
				mstWt += this.edges[i][0];
			}
		}
		console.log(`Total weight of MST is ${mstWt}`);
	}
}

// Driver code
function main()
{

	// create the graph given in above figure
	var V = 9;
	var g = new Graph(V);

	// making above shown graph
	g.addEdge(0, 1, 4);
	g.addEdge(0, 7, 8);
	g.addEdge(1, 2, 8);
	g.addEdge(1, 7, 11);
	g.addEdge(2, 3, 7);
	g.addEdge(2, 8, 2);
	g.addEdge(2, 5, 4);
	g.addEdge(3, 4, 9);
	g.addEdge(3, 5, 14);
	g.addEdge(4, 5, 10);
	g.addEdge(5, 6, 2);
	g.addEdge(6, 7, 1);
	g.addEdge(6, 8, 6);
	g.addEdge(7, 8, 7);

	g.reverseDeleteMST();
}
main();
