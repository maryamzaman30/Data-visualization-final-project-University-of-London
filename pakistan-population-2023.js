function populationPakistan()
{
  // Name of the visualization to appear in the menu bar.
  this.name = 'Population of Pakistan in 2023';

  // Unique ID for the visualization with no special characters.
  this.id = 'pakistan-population-2023';

  // Title to appear above the graph.
  this.title = 'This landscape represents the age group % distribution of Pakistan in 2023. Each category of age group % is represented by \n\ certain element: trees for ages 0-14, clouds for ages 15-64, and mountains for ages 65 and above. The number of each \n\ element corresponds to the % in each age group.';

  let data; // variable to store data from a csv file

  // Start
  const cloudPositions = []; // array to store positions of clouds
  const treePositions = []; // array to store positions of trees
  const mountainPositions = []; // array to store positions of mountains
  // End

  // preload function to load data from a csv file
  this.preload = function () 
  {
    data = loadTable("./data/population/pakistan.csv", "csv", "header", )
  }

  // Start
  // setup function to create canvas & generate positions for clouds, trees, & mountains
  this.setup = function () 
  {    
    generateCloudPositions(); // call function to generate positions for clouds
    generateTreePositions(); // call function to generate positions for trees
    generateMountainPositions(); // call function to generate positions for mountains
  }

  // draw function to draw the background, ground, clouds, mountains, and trees
  this.draw = function () 
  {
    push(); // Using push & pop to avoid noStroke being applying to happiest-countries.js
    background(135,206,235); // set the background color to sky blue

    drawGround(); // call function to draw the ground

    drawClouds(); // call function to draw the clouds
    drawMountains(); // call function to draw the mountains
    drawTrees(); // call function to draw the trees
    pop();

    // Title
    push();  
    noStroke();
    fill(0);
    textAlign(LEFT, TOP);
    textSize(18);
    // Display the title at the top center of the canvas
    text(this.title,5,5);
    pop();
  }

  // function to generate positions for clouds based on data from csv file
  function generateCloudPositions() 
  {
    // Get the number of clouds from the CSV file
    const cloud_Count = data.getNum(1, "Percentage")

    /*Calculate the number of clouds per row by dividing the percentage value 
    from the CSV file by 4 & rounding up, to arrange clouds in 4 rows*/
    const cloudsPerRow = Math.ceil(cloud_Count / 4);
    
    // Calculate the horizontal & vertical spacing between clouds
    const cloudSpacing_X = width / (cloudsPerRow + 1); 
    const cloudSpacing_Y = height / 8;
    
    // Loop through the number of clouds specified in the CSV file
    for (let i = 1; i <= cloud_Count; i++) 
    {
      // Calculate the row & column of the current cloud
      const row = Math.floor((i - 1) / cloudsPerRow);
      const column = (i - 1) % cloudsPerRow;
      
      // Calculate the x & y position of the current cloud
      let x = (column + 1) * cloudSpacing_X;
      let y = (row + 1) * cloudSpacing_Y;
      
      // Add the x & y position of the current cloud to the cloudPositions array
      cloudPositions.push([x, y]);
    }
  }

  // function to generate positions for trees based on data from csv file
  function generateTreePositions() 
  {
    // Get the number of trees from the CSV file
    const tree_Count = data.getNum(0, "Percentage");
    
    // Calculate the horizontal spacing between trees
    const treeSpacing_X = width / (tree_Count + 1);
    
    // Set the base vertical position for trees
    const tree_Floor = height * 3 / 4;
    
    // Loop through the number of trees specified in the CSV file
    for (let i = 1; i <= tree_Count; i++) 
    {
      // Calculate the x position of the current tree
      const x = i * treeSpacing_X;

      // Start with the base vertical position for the y position
      let y = tree_Floor;
      
      // If the current tree is an odd-numbered tree, adjust its y position
      if (i % 2 != 0) 
      {
        y = tree_Floor + height / 8;
      }
      
      // Add the x and y position of the current tree to the treePositions array
      treePositions.push([x, y]);
    }
  }

  // function to generate positions for mountains based on data from csv file
  function generateMountainPositions() 
  {
    // Get the number of mountains from the CSV file
    const mountain_Count = data.getNum(2, "Percentage");
    
    // Calculate the horizontal spacing between mountains
    const mountain_Spacing = width / (mountain_Count + 1);
    
    // Loop through the number of mountains specified in the CSV file
    for (let i = 1; i <= mountain_Count; i++) 
    {
      // Calculate the x position of the current mountain
      let x = i * mountain_Spacing;
      
      // Add the x & y position of the current mountain to the mountainPositions array
      // The y position is set to half of the canvas height
      mountainPositions.push([x, height/2]);
    }
  }

  // function to draw the ground
  function drawGround() 
  {
    noStroke(); 
    fill(0,180,0); 
    // draw a rectangle to represent the ground, with the top edge at 3/4 of the canvas height
    rect(0, height * 3/4, width, height - (height * 3/4)); 
  }

  // function to draw the clouds using the generated positions
  function drawClouds() 
  {
    // loop through the cloudPositions array
    for(let i=0;i<cloudPositions.length;i++)
    {
      // get the x & y position of the current cloud
      let x=cloudPositions[i][0];
      let y=cloudPositions[i][1];
      // call the drawCloud function to draw a cloud at the current position
      drawCloud(x,y);
    }
  }

  // function to draw the mountains using the generated positions
  function drawMountains() 
  {
    // loop through the mountainPositions array
    for(let i=0;i<mountainPositions.length;i++)
    {
      // get the x & y position of the current mountain
      let x=mountainPositions[i][0];
      let y=mountainPositions[i][1];
      // call the drawMountain function to draw a mountain at the current position
      drawMountain(x,y);
    }
  }

  // function to draw the trees using the generated positions
  function drawTrees() 
  {
    // loop through the treePositions array
    for(let i=0;i<treePositions.length;i++)
    {
      // get the x & y position of the current tree
      let x=treePositions[i][0];
      let y=treePositions[i][1];
      // call the drawTree function to draw a tree at the current position
      drawTree(x,y);
    }
  }

  // function to draw a single cloud at position x,y
  function drawCloud(x,y)
  {
    fill(255); 
    noStroke(); 
    ellipse(x,y+10,50,40); // an ellipse to represent the left part of the cloud
    ellipse(x+20,y+10,40,30); // an ellipse to represent the right part of the cloud
  }

  // function to draw a single mountain at position x,y
  function drawMountain(x,y)
  {
    // a triangle to represent the mountain
    fill (128,128,128); 
    triangle(x-50,y+145,x+50,y+145,x,y+50);
    // a smaller triangle on top of the mountain to represent snow
    fill(225,225,225); 
    triangle(x-19,y+85,x+19,y+85,x,y+50);
  }

  // function to draw a single tree at position x,y
  function drawTree(x,y)
  {
    // a rectangle to represent the trunk of the tree
    fill(139,69,19);
    rect(x,y+40,20,-40);
    // two triangles to represent the leaves of the tree
    fill(0,128,0); 
    triangle(x-20,y+16,x+10,y-20,x+40,y+16);
    triangle(x-20,y,x+10,y-40,x+40,y);
  }
}
// End

/* info for CSV making is taken right from the first pie (or donut) chart of Population 
   given in the link: 
   https://www.unfpa.org/data/world-population/PK */ 
// Idea inspiration from: https://www.studioterp.nl/a-view-on-despair-a-datavisualization-project-by-studio-terp/   