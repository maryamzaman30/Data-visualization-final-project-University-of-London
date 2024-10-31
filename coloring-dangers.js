function ColoringDangers()
{
  // Name of the visualization to appear in the menu bar.
  this.name = 'Dangers of Coloring Chicks';

  // Unique ID for the visualization with no special characters.
  this.id = 'dangers-of-coloring';

  // Title to appear above the graph.
  this.title = 'An illustration showing danger for different colors dyeing on chicks. (hover over each chicks to find out the danger)';
  
  // Start
  // An Intro
  this.subtitle = 'animal welfare advocates argue that dyeing chicks can cause stress and harm to the chicks. They believe that the \n\ process is unnecessary and can lead to abandonment or mistreatment of the chicks once they are no longer colorful.'
  // End

  let data; // To store the data from the CSV file

  // Load the data from the CSV file before the sketch starts
  this.preload = function () 
  {
    data = loadTable('./data/animals/dangers.csv', 'csv', 'header');
  }  

  this.draw = function () 
  {    
    // Start
    const chick_Width = 50;
    const chick_Height = 50;
    const chick_Spacing = 10; // Spacing of chicks
  
    let hover_Text = ''; // To store the text that will be displayed when hovering over a chick
    
    // Loop through each row & column of the 3x3 grid
    for (let row = 0; row < 3; row++) 
    {
      for (let column = 0; column < 3; column++) 
      {
        // Calculate the index of the current chick in the data
        const i = row * 3 + column;
        
        // Get the color & danger of the current chick from the data
        const color = data.getString(i, 'Color');
        const danger = data.getString(i, 'Danger');
    
        // Calculate the position of the current chick
        // Calculate the horizontal (or x) & vertical (or y) spacing between chicks
        const x_Spacing = chick_Width + chick_Spacing; 
        const y_Spacing = chick_Height + chick_Spacing;
        
        // Calculate the x & y coordinate of the chick 
        const x = column * x_Spacing + 400; 
        const y = row * y_Spacing + 200 ; 
    
        // Calculate the center coordinates of the current chick
        const center_X = (x + chick_Width /2);
        const center_Y = (y + chick_Height /2);

        // Draw the chick at the calculated coordinates with the specified color
        drawChick(center_X, center_Y, color);

        // Check if the mouse is hovering over the current chick
        if (mouseX >= x && mouseX <= x + chick_Width && mouseY >= y && 
            mouseY <= y + chick_Height) 
        {
          // If it is, set the hover text to display the color & danger of the current chick
          hover_Text = color + ': ' + danger;
        }
      } 
    }
      // Texts
      push();
      // Styling of hovered text
      fill(0);
      noStroke();
      textSize(18);
      textAlign(LEFT);
      // Display the hover text at the bottom of the canvas
      text(hover_Text, 10, height - 130);

      // Title & subtitle
      stroke(0);
      textAlign(LEFT);
      strokeWeight(1);
      textSize(18);
      // Display the title at the top center of the canvas
      text(this.title,29, 37);
      noStroke();
      text(this.subtitle,29, 90);
      pop();
   }
  
  // A function to draw a chick at a given position with a given color
  /* Note: The original chick drawn is taken from my game project from a previous semester
  course 'cm1005-intro-prog-i' */
  function drawChick(gameChar_x, gameChar_y, color) 
  {
      // Set the half stroke color for head & body based on the color parameter
      /* If color is equal to 'Black', then half_strokeColor is set to white, otherwise it 
         is set to black */
      let half_strokeColor;
  
      if (color === 'Black')
      {
        half_strokeColor = 255;
      } 
      else 
      {
        half_strokeColor = 0;
      }

      // Draw the 1st ellipse with a half stroke for chick head
      noFill();
      stroke(half_strokeColor);
      strokeWeight(2);
      beginShape();
      // Iterate over values of i from 0 to TWO_PI (Full circle), incrementing i by 0.1 each time
      for (let i = 0; i < TWO_PI; i += 0.1) 
      {
        /* Using parametric equation To calculate the center point of circle (chick head) 
           & then drawing a half stroke (or half circle) around that center point */       
        // Calculate the x coordinate of a point on the ellipse
        const x = gameChar_x + cos(i) * 45 / 2 ;
        // Calculate the y coordinate of a point on the ellipse
        const y = gameChar_y + sin(i) * 35 / 2 ;
        vertex(x, y);
      }
      endShape(CLOSE);

      // Draw the 2nd ellipse with other half stroke for chick body below the head
      noFill();
      stroke(half_strokeColor);
      strokeWeight(2);
      beginShape();
      // Iterate over values of i from 0 to TWO_PI, incrementing i by 0.1 each time
      for (let i = 0; i < TWO_PI; i += 0.1) 
      {
        /* Using parametric equation for calculating center point for chick body
           & then drawing a half stroke around that center point */     
        // Calculate the x coordinate of a point on the ellipse
        const x = gameChar_x + cos(i) * 53 / 2;
        // Calculate the y coordinate of a point on the ellipse
        const y = gameChar_y + 25 + sin(i) * 43 / 2;
        vertex(x, y);
      }
      endShape(CLOSE);
    
      // Draw the rest of the chick
      noStroke();  /* Not using full stroke, since this divides the body into 2 parts
      which reveals the 2 ellipse for head & body */
      fill(color); // Different colors for chick body
      
      // Draw two ellipses to create the body & head of the chick
      ellipse(gameChar_x, gameChar_y, 45,35); // Head
      ellipse(gameChar_x, gameChar_y + 25, 53, 43); // Body
      
      // Draw the eyes with a white outline for the black chick
      if (color === 'Black') 
      {
          fill(0);
          stroke(255);
          strokeWeight(0.5);
          ellipse(gameChar_x -3, gameChar_y -5,4,4);
          ellipse(gameChar_x +3, gameChar_y -5,4,4);
      } 
      else 
      {
          fill(0);
          ellipse(gameChar_x -3, gameChar_y -5,4,4);
          ellipse(gameChar_x +3, gameChar_y -5,4,4);
      }
      
      // Draw the beak using a triangle
      stroke(0);
      strokeWeight(0.5);
      fill(255,165,0);
      triangle(gameChar_x +4,gameChar_y,
      gameChar_x ,gameChar_y +9,
      gameChar_x -4 ,gameChar_y );
  } 
}
// End

/* Intro (subtitle) taken from: 
   https://www.nytimes.com/2012/04/02/us/dyeing-easter-chicks-raises-concerns.html */
/* CSV file for this is Ai generated. The reason why I used from Ai is because I could not
   find the information about the effects of different colors dyeing on chicks*/
/* The reason why I want to represent this information is for speaking up for animal
   rights & so dyeing of chicks side efects is rarely talked about, especially in my
   country.*/   
/* Kids love colors. If a kid's favourite color is purple and he wants a purple chick
   then parents can explain from this ilustration the danger of purple color dyeing
   on chicks */    