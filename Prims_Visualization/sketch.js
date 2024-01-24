var pNodes;
var mstcalled = 0;
var v =1;
var parents;
function generate(){
  reset_values();
  var how_many= int(document.getElementById("generate_num").value);
  
  if (isNaN(how_many) || how_many < 1 || how_many > 15){
    how_many = 3;
  }
  
  pNodes = generatepNodes(how_many);
  generateRandomEdges(pNodes);
  console.log(pNodes.length);
  mstcalled = 0;
  v = 1;
}

function setup() {
//   sets the window size. we can get these dimensions later from the DOM
  canvas=createCanvas(800, 800); 
  canvas.position(300, 300);
//add some amount of nodes at some min distance apart
  pNodes = generatepNodes(5,10);
//   add a single node of a certain size and min distance away from all other nodes in random location
  generateRandomEdges(pNodes);
  
}


function draw() {
  background(220);
//   draw all nodes onto canvas
  for(i = 0; i < pNodes.length; i++){
    pNodes[i].display_edges();
  }
  for(i = 0; i < pNodes.length; i++){
    pNodes[i].display();
  }
  for(i = 0; i < pNodes.length; i++){
    if(pNodes[i].dragging){
      pNodes[i].pos.x = mouseX;
      pNodes[i].pos.y = mouseY;
      pNodes[i].color = "#F96618";
    }
  }
}

function mousePressed(){
  for(i = 0; i < pNodes.length; i++){
    pNodes[i].clicked(mouseX, mouseY);
  }
  
}

function mouseReleased(){
  for(i = 0; i < pNodes.length; i++){
    pNodes[i].released(mouseX, mouseY);
    pNodes[i].color = "#4BD0E3";
  }
  
}

function add_new_node(){
  addNode(pNodes, 5);
}

function add_new_edge(){
  var element = int(document.getElementById("start_node").value);
  var element2 = int(document.getElementById("end_node").value);
  var new_weight = int(document.getElementById("weight").value);
  var max_nodes = pNodes.length;
  var errors = 0;
  if (element > max_nodes-1 || element < 0 || isNaN(element)){
    alert("Start node is not valid");
    console.log("error 1");
    errors++;
  }
  if (element > max_nodes-1 || element < 0 || isNaN(element2)){
    alert("End node is not valid");
    console.log("error 2");
    errors++;
  }
  if (new_weight <= 0 || new_weight > 20 || isNaN(new_weight)){
    alert("Weight is not valid");
    console.log("error 3");
    errors++;
  }
  if(element == element2){
    errors++;
    alert("You cannot update edges that end on the same node");
  }
  
  if(errors == 0){
    if (pNodes[element].connections.includes(element2)){
      pNodes[element].updateEdge(pNodes[element2], new_weight);
    }
    else{
      pNodes[element].addEdge(pNodes[element2], new_weight);
      pNodes[element].connections.push(element2);
      pNodes[element2].addEdge(pNodes[element], new_weight);
      pNodes[element2].connections.push(element);
      
    }
  }
}

function get_MST(){
  parents = Prims(pNodes);
  mstcalled = 1;
}

function printMST(){
  var Node_list = pNodes
  if(v < Node_list.length){
    console.log(parents[v], "-", Node_list[v].node_label);
    Node_list[parents[v]].updateColor(Node_list[v]);
    Node_list[v].updateColor(Node_list[parents[v]]);
    v++
  } else{
    console.log('full tree found');
  }
}



