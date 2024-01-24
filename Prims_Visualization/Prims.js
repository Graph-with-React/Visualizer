function nextNode(key, MST){
  var next_vertex = Infinity;
  var mini;
  for(var x = 0; x< MST.length; x++){
    if(MST[x] == false && key[x] < next_vertex){
      next_vertex = key[x];
      mini = x; 
    }
  }
  return mini;
  
}

function printMST(parents, Node_list){
  for (let v = 1; v < Node_list.length; v++){
    console.log(parents[v], "-", Node_list[v].node_label);
    Node_list[parents[v]].updateColor(Node_list[v]);
    Node_list[v].updateColor(Node_list[parents[v]]); 
  }
  
}

function Prims(Node_list){
  console.log(Node_list[0].color);
  var MST = new Array(Node_list.length);
  var key = new Array(Node_list.length);
  var parents = new Array(Node_list.length);
  for (var i= 0; i<Node_list.length; i++) {
    key[i] = Infinity;
    MST[i] = 0;
  }
  key[0] = 0;
  parent[0] = -1;
  
  
  for(i=0; i<Node_list.length; i++){
    var minnext = nextNode(key, MST);
    MST[minnext] = 1;
    Node_list[minnext].color = "#F96618";
    var end_nod;
    var start_nod;
    
    //check edges
    for (var e = 0; e< Node_list[minnext].edges.length; e++){
      if(MST[Node_list[minnext].edges[e].end.node_label] == false && 
         Node_list[minnext].edges[e].weight < key[Node_list[minnext].edges[e].end.node_label]){
        
        start_nod = minnext;
        end_nod = Node_list[minnext].edges[e].end.node_label;
        console.log(start_nod, end_nod);
        parents[end_nod] = minnext;
        key[end_nod] =  Node_list[minnext].edges[e].weight;
      }
      
    }
    
    //Node_list[start_nod].updateColor(Node_list[end_nod]);
    //Node_list[end_nod].updateColor(Node_list[start_nod]); 
    
  }
  return parents;
  
}