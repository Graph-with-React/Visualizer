var nodes_number = 0;
// our starting node class we can call "new PrimNode" to create a new node and access its methods ex: PrimNode.edges[2] would give us the third incident edge on PrimNode
function PrimNode(posX, posY, radius, node_num) {
  this.pos = createVector(posX, posY);
  this.radius = radius;
  this.edges = [];
  this.node_label = node_num;
  this.connections = [node_num];
  this.dragging = false;
  this.color = "#4BD0E3";


  //create an edge from this Prim node to another with a specific weight
  //need to also add a "directed" component to this
  this.addEdge = function(e, w) {
    var edge = {
      end: e,
      weight: w,
      edgecolor: "#000000"
    }
    this.edges.push(edge);
  }
  
  this.updateEdge = function(to_update, w){
    for (var i = 0; i<this.edges.length; i++){
      if(this.edges[i].end.node_label == to_update.node_label){
        this.edges[i].weight = w;
        for (var i = 0; i<to_update.edges.length; i++){
          if(to_update.edges[i].end.node_label == this.node_label){
            to_update.edges[i].weight = w;  
          }
        }
      }
    }
    
  }
  
    this.updateColor = function(to_update){
    for (var i = 0; i<to_update.edges.length; i++){
          if(to_update.edges[i].end.node_label == this.node_label){
            to_update.edges[i].edgecolor = "#FF0000";  
          }
  }
  }
  
  //   displays nodes as circles on screen with colors specific to location (right now). need to implement displaying edge between adjacent nodes
  //for some reason probably to do with web browser protocol we have to write a display method for each class
  
  //this.pos.x / width * 255, this.pos.y / height * 255, this.pos.x + this.pos.y / (width + height)
  this.display = function() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, radius * 2, radius * 2);
    fill("#FFFFFF");
    textAlign(CENTER, CENTER);
    textSize(radius);
    text(this.node_label, this.pos.x, this.pos.y);

  }
  //displays all the edges with their weight
  this.display_edges = function() {
    for (var i = 0; i < this.edges.length; i++) {
      fill("#000000");
      strokeWeight(0);
      var midx = (this.pos.x + this.edges[i].end.pos.x) / 2;
      var midy = (this.pos.y + this.edges[i].end.pos.y) / 2;
      textAlign(CENTER, TOP);
      text(this.edges[i].weight, midx + 4, midy + 4);
      strokeWeight(2);
      stroke(this.edges[i].edgecolor);
      line(this.pos.x, this.pos.y, this.edges[i].end.pos.x, this.edges[i].end.pos.y);
      
    }
      
  }
  
  this.clicked = function(px, py){
    let d = dist(this.pos.x, this.pos.y, px, py);
    if (d < this.radius){
      this.dragging = true;
    }
  }
  
  this.released = function(px, py){
    this.dragging = false;
  }
}
// generates a certain amount of nodes in non overlapping locations with a minimum buffer space between circle radii. We can set the size to be constant if need be
function generatepNodes(amount, buffer) {

  pNodes = new Array(amount);
  var nodes = [];
  var tryCounter = 0;

  while (nodes.length < amount && tryCounter < 1000) { // keep trying to fit the amount of nodes into frame with no overlap. if we cant get a node to fit after a thousand tries just exit the loop

    //  this is not an actual Prim Node just a potential one.
    var node = {
      x: random(100, width - 100),
      y: random(100, height - 100),
      r: int(25)
    }

    var overlapping = false;
    //  check if the node overlaps any of the previously added nodes
    for (i = 0; i < nodes.length; i++) {
      var circle = nodes[i];
      var distance = dist(node.x, node.y, circle.x, circle.y);
      if (distance < node.r + circle.r + buffer) {
        overlapping = true;
      }
    }
    //  if the potential node isnt over lapping add it to our array of nodes that dont overlap
    if (!overlapping) {
      nodes.push(node);
    }
    tryCounter++;
    if (tryCounter > 1000) {
      console.log('please use fewer nodes or lower your node buffer range')
    }
  }
  //once we add the amount of non overlapping nodes that we wanted, make them all into Prim nodes
  for (i = 0; i < nodes.length; i++) {
    pNodes[i] = new PrimNode(nodes[i].x, nodes[i].y, nodes[i].r, nodes_number);
    nodes_number++;
  }
  return pNodes;
}

function generateRandomEdges(currentNodes) {
  let node_num = currentNodes.length;
  for (var i = 0; i < node_num; i++) {
    var added_edges = [];
    let node = currentNodes[i];
    let num_edges_to_add = int(random(1, node_num));
    //creates random number of edges for each node
    for (var j = 0; j < num_edges_to_add; j++) {
      var end_node = i;
      var value_select = 0;
      var found = false;

      //select node to add edge towards
      while (end_node == i) {
        if (value_select > 20) {
          break;
        }
        //random node to try
        let trial = int(random(0, node_num));

        if (currentNodes[trial].edges.length == 0 && added_edges.includes(trial) == 0) {
          found = true;
          end_node = trial;
        } else {

          if (!added_edges.includes(trial)) {
              if (!currentNodes[trial].connections.includes(node.node_label)) {
                end_node = trial;
                found = true;
              }
            }
          }
        value_select++;
      }
      if (found == true) {
        let random_weight = int(random(1, 20));
        added_edges.push(end_node);
        node.connections.push(end_node);
        currentNodes[end_node].connections.push(node.node_label);
        node.addEdge(currentNodes[end_node], random_weight);
        currentNodes[end_node].addEdge(node, random_weight);
      }
    }
  }
}

// very similar to generatepNodes, just for adding nodes with specific values to the graph
function addNode(currentNodes, buffer) {
  var currentLength = currentNodes.length;
  var tryCounter = 0
  while (currentNodes.length < currentLength + 1 && tryCounter < 1000) {

    var node = {
      x: random(100, width - 100),
      y: random(100, height - 100),
      r: int(25),
      v: nodes_number
    }

    var overlapping = false;

    for (i = 0; i < currentNodes.length; i++) {
      var circle = currentNodes[i];
      var distance = dist(node.x, node.y, circle.pos.x, circle.pos.y);
      if (distance < node.r + circle.radius + buffer) {
        overlapping = true;
      }
      if (node.v == circle.node_label) {
        overlapping = true;
      }
    }
    if (!overlapping) {
      currentNodes.push(new PrimNode(node.x, node.y, node.r, node.v));
      nodes_number++;
    }
    tryCounter++;
    if (tryCounter >= 1000) {
      console.log('please use fewer nodes or lower your node buffer range')
    }
  }
}

function reset_values(){
  nodes_number = 0;
  
}