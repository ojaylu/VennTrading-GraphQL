function convertArrayToTree(arr) {
  // Create an empty object to store the result
  let result = {};
  
  // Loop through each tuple in the array
  for (let i = 0; i < arr.length; i++) {
    let tuple = arr[i];
    let value = tuple[1];
    
    // Split the value into an array of characters
    let chars = value.split("");
    
    // Initialize the current node to the result object
    let currentNode = result;
    
    // Loop through each character in the value
    for (let j = 0; j < chars.length; j++) {
      let char = chars[j];
      
      // Check if the character already exists as a child node
      let childNode = currentNode.children && currentNode.children.find(node => node.name === char);
      
      // If the character doesn't exist, create a new child node and add it to the current node's children array
      if (!childNode) {
        childNode = { name: char, children: [] };
        currentNode.children = currentNode.children || [];
        currentNode.children.push(childNode);
      }
      
      // Update the current node to be the child node
      currentNode = childNode;
    }
  }
  
  // Set the result object's name property to be the first character of the first tuple's value
  result.name = arr[0][1][0];
  
  return result;
}

// Example usage
let arr = [(1, "bsh"), (2, "bhs")];
let result = convertArrayToTree(arr);
console.log(result);
