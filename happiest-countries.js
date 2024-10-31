function HappiestCountries2023()
{
  // Name of the visualization to appear in the menu bar.
  this.name = 'Happiest Countries in the World';

  // Unique ID for the visualization with no special characters.
  this.id = 'happiest-countries-2023';

  // Title to appear above the graph.
  this.title = 'Top Happiest Countries in the World in 2023. Hover over each smiley to know the secret for their happiness \n\ Press mouse to start/stop the smiley';
  
  let data; // Variable to hold the data from the CSV file
 
  let bubbles = []; // an empty array for bubbles

  // Preload function to load the CSV file before setup
  this.preload = function () 
  {
    data = loadTable('./data/emotions/happiest-countries.csv', 'csv', 'header');
  }
  
  // Start
  // Setup function where the initial environment properties are defined
  this.setup = function () 
  {
    bubbles = []; /* Clear the bubbles array so the bubbles dosent multiply when switched
    from different visualization */

    // Get the number of rows in the data
    const rowCount = data.getRowCount(); 
    
    // Loop through each row in the data
    for (let i = 0; i < rowCount; i++) 
    {
      // Get the happiness index from the data
      const happiness_Index = data.getNum(i, 'happinessIndex');
      
      // Map the happiness index to a diameter value
      // Bigger the index, bigger the value in map
      const diameter = map(happiness_Index, 7, 8, 20, 200); 
      
      // Generate random x & y coordinates for the bubble within the canvas, considering the diameter
      const x = random(diameter / 2, width - diameter / 2);
      const y = random(diameter / 2, height - diameter / 2);
      
      // Get the country & secret values from the data
      const country = data.getString(i, 'country');
      const secret = data.getString(i, 'secret');
      
      // Create a new Bubble object & add it to the bubbles array
      bubbles.push(new Bubble(x, y, diameter, country, secret, happiness_Index));
    }
  }
  
  // Draw function where the visual elements are drawn & updated
  this.draw = function () 
  {
    background(220); // Set the background color of the canvas
    
    // Loop through each Bubble object in the bubbles array
    for (let i = 0; i < bubbles.length; i++) 
    {
      // If pause is false, move the bubble & check its boundaries
      if (!pause) 
      { 
        bubbles[i].move();
        bubbles[i].checkBoundaries();
      }
      // Check if the mouse is hovering over the bubble
      push(); /* using push & pop to avoid the displacement of hovered text in 
      coloring-dangers.js*/
      bubbles[i].checkHover(mouseX, mouseY); 
      pop();
      // Display the bubble
      bubbles[i].display(); 

      // Check for collisions with other bubbles
      for (let j = i + 1; j < bubbles.length; j++) 
      {
        bubbles[i].checkCollision(bubbles[j]);
      }
    }

    // Draw the tooltip
    for (let i = 0; i < bubbles.length; i++) 
    {      
      // If the mouse is hovering over the bubble, draw a tooltip
      if (bubbles[i].hover) 
      { 
        /* Calculate the width of the tooltip based on the text width of the secret message, 
        adding 20 for padding */
        const tooltip_Width = textWidth(bubbles[i].secret) + 20; 
        
        // Set a fixed height for the tooltip
        const tooltip_Height = 40; 
  
        // Position the tooltip 5 pixels to the right of the mouse cursor
        const tooltip_X = mouseX + 5; 
  
         /* Position the tooltip 5 pixels above the mouse cursor, 
         considering the height of the tooltip */
         const tooltip_Y = mouseY - tooltip_Height - 5;
        
        // tooltip rectangle
        fill(255); 
        rect(tooltip_X, tooltip_Y, tooltip_Width, tooltip_Height); 
        
        // tooltip text
        fill(0); 
        text(bubbles[i].secret, tooltip_X + tooltip_Width /2, tooltip_Y + tooltip_Height / 2);
      }
    }
        // Title
        push();
        stroke(0);
        textAlign(LEFT);
        strokeWeight(0.5);
        textSize(18);
        // Display the title at the top center of the canvas
        text(this.title,10, 30);
        pop();
  }
  
    // Call the mousePressed function from helper-functions.js 
    mousePressed();
  
  // Constructor function for the bubble
  class Bubble 
  {
      constructor(x, y, diameter, country, secret, happinessIndex) 
      {
        this.x = x; // x-coordinate of the bubble
        this.y = y; // y-coordinate of the bubble
        this.diameter = diameter; // diameter of the bubble
        this.country = country; // country that the bubble represents
        this.secret = secret; // secret message associated with the bubble
        this.happinessIndex = happinessIndex; // happiness index of the country that the bubble represents
        this.hover = false; // A boolean to track whether the mouse is hovering over the bubble
        this.x_Speed = random(-1, 1); // The speed of the bubble in the x-direction
        this.y_Speed = random(-1, 1); // The speed of the bubble in the y-direction
      }
  
    checkCollision(other) 
    {
      // Calculate the distance between this object and another object
      let d = dist(this.x, this.y, other.x, other.y);
      
      // Check if the distance is less than the sum of their radii (assuming diameter is twice the radius)
      if (d < (this.diameter + other.diameter) / 2) 
      {  
        // Calculate the angle of collision
        let angle = atan2(other.y - this.y, other.x - this.x);
        
        // Update this object's speed in the opposite direction of the collision
        this.x_Speed = -cos(angle);
        this.y_Speed = -sin(angle);
        
        // Update the other object's speed in the direction of the collision
        other.x_Speed = cos(angle);
        other.y_Speed = sin(angle);
      }
    }
  
    move() 
    {
      // Update the x & y position of the object based on its speed
      this.x += this.x_Speed;
      this.y += this.y_Speed;
    }
  
    checkBoundaries() 
    {
      // Check if the object has hit the left or right boundary (assuming 'width' is the width of the boundary)
      // If it has, reverse its x direction
      if (this.x - this.diameter / 2 < 0 || this.x + this.diameter / 2 > width) 
      {
        this.x_Speed *= -1;
      }
      
      // Check if the object has hit the top or bottom boundary (assuming 'height' is the height of the boundary)
      // If it has, reverse its y direction
      if (this.y - this.diameter / 2 < 0 || this.y + this.diameter / 2 > height) 
      {
        this.y_Speed *= -1;
      }
    }
  
    display() 
    {
      push();
      // Yellow face as an ellipse
      stroke(0);
      fill(255,255,0); 
      ellipse(this.x,this.y,this.diameter,this.diameter);
  
      // Black eyes as an ellipses
      fill(0);
      // left eye 
      ellipse(this.x-this.diameter/6,this.y-this.diameter/6,this.diameter/10,this.diameter/5); 
      // right eye 
      ellipse(this.x+this.diameter/6,this.y-this.diameter/6,this.diameter/10,this.diameter/5); 
  
      // Define the start & end for the smile
      const startOfSmile = 0.1 * PI;
      const endOfSmile = 0.9 * PI;
      // Define the size of the smile
      const smileSize = 0.6 * this.diameter;
      // Do not fill the smile (it will be an outline)
      noFill();
      // Draw the smile as an arc
      stroke(0);
      strokeWeight(1.5);
      arc(this.x,this.y,smileSize,smileSize,startOfSmile,endOfSmile);
      pop();
  
      // text for country & happiness index
      stroke(0);
      fill(0);
      // Align the text to the center
      textAlign(CENTER);
      // Display the country name below the face
      text(this.country,this.x,this.y+this.diameter/2+15);
      // Display the happiness index below the country name
      text(this.happinessIndex,this.x,this.y+this.diameter/2+30);
   }
  
    checkHover(x,y) 
    {
      // Calculate the distance between the point (x, y) & the center of the object
      let d=dist(x,y,this.x,this.y);
      
      // Check if the distance is less than the radius of the object (assuming diameter is twice the radius)
      // If it is, set the hover property to true
      if(d<this.diameter/2)
      {
        this.hover=true;
      } 
      // If it's not, set the hover property to false
      else
      {
        this.hover=false;
      }
    }
  }
}
// End

/* Made the CSV myself & took info for CSV from:
-Top happiest countries (took first 5): https://wisevoter.com/country-rankings/happiest-countries-in-the-world/
-Their secrets: https://www.talentedladiesclub.com/articles/the-10-happiest-countries-in-the-world-and-their-secrets-to-success/
-Secret for Netherlands is not mentioned in the given site, so I simply googled it. */

/* Idea inspiration (from % of internet usage by age group & sex, in the UK): https://www.coursera.org/learn/uol-introduction-to-programming-2/lecture/TqnUn/4-206-interview-with-a-student-simas-cesnauskas
 However, the ideas to animate the bubbles into a smiley face & add secrets in tooltip are 
 my own */