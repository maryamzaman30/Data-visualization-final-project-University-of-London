function FoodPurchases() 
{  
  // Name of the visualization to appear in the menu bar.
  this.name = 'Food purchases 1974-201617';

  // Unique ID for the visualization with no special characters.
  this.id = 'food-purchases';

  let data; // To store the data from the CSV file
  
  let bubbles = []; // an empty array for bubbles

  let maxAmt; // Variable to hold the maximum amount of bubbles

  let years = []; // Initialize an empty array for years

  let currentYear = '1974'; // Set the current year to 1974

  //It is important to declare yearDropdown outside setup function
  let yearDropdown = null; // Declare a variable for the year dropdown, but don't assign a value yet

  // Preload function to load data before setup
  this.preload = function() 
  {
    // Load a CSV file with header into the 'data' variable
    data = loadTable('./data/food/food_purchases.csv', 'csv', 'header');
  };

  // The setup function is called once when the program starts
  this.setup = function() 
  {
    bubbles = []; /* Clear the bubbles array so the bubbles dosent multiply when switched
    from different visualization */

    // Get all rows from the data
    let rows = data.getRows();

    // Get the number of columns in the data
    let numColumns = data.getColumnCount();

    // Start by Teacher
    // Check if yearDropdown already exists
    if (yearDropdown === null) 
    {
      // If not, create a select dropdown & set its parent to 'years'
      yearDropdown = createSelect();
      yearDropdown.parent('years');
      yearDropdown.position(320, 24); // Set its position
    } 
    else 
    {
      // If it exists, clear all existing options in the dropdown
      yearDropdown.elt.options.length = 0;
    }
    // End by Teacher

    // Loop through all columns starting from the 6th column
    for (let i = 5; i < numColumns; i++) 
    {
      let y = data.columns[i];
      years.push(y); // Add the column name to the years array
    // Start by Teacher
      yearDropdown.option(y); // Add it as an option in the dropdown
    }

    // When an option is selected in the dropdown, update currentYear & call changeYear function
    yearDropdown.changed(function() 
    {
      // Get the currently selected year from the dropdown
      currentYear = yearDropdown.value();

      // Call the changeYear function with the currently selected year
      changeYear(currentYear); // Replaced this.elt.value with currentYear 

    });
    // End by Teacher

    // Initialize maxAmt to 0
    maxAmt = 0;

    // Loop through all rows in the data
    for (let i = 0; i < rows.length; i++) 
    {
      if (rows[i].get(0) !== '') 
      { 
        // If the first cell in the row is not empty
        let b = new Bubble(rows[i].get(0)); // Create a new Bubble object with the first cell as argument

        // Loop through all cells in the row starting from the 6th cell
        for (let j = 5; j < numColumns; j++) 
        {
          if (rows[i].get(j) !== '') 
          { 
            // If the cell is not empty
            let n = rows[i].getNum(j); // Get its value as a number
            if (n > maxAmt) 
            { 
              maxAmt = n; // If it's greater than maxAmt, update maxAmt
            }
            b.data.push(n); // Add it to the Bubble object's data array
          } 
          else 
          {
            b.data.push(0); // If the cell is empty, add a zero instead
          }
        }

        bubbles.push(b); // Add the Bubble object to the bubbles array
      }
    }

      // Loop through all Bubble objects & call their setData method with currentYear as argument
      for (let i = 0; i < bubbles.length; i++) 
    {
      // Start by Teacher
      // Call the setData method on each Bubble object with currentYear as an argument
      bubbles[i].setData(currentYear); currentYear 
      // End by Teacher
    }
  };

  // Function to change the current year & update the data for all bubbles
  function changeYear(year) 
  {
    // Start by Teacher
    // Update the current year
    currentYear = year;
    // End by Teacher

    // Loop through all Bubble objects in the bubbles array
    for (let i = 0; i < bubbles.length; i++) 
    {
      // Start
      // Call the setData method on each Bubble object with currentYear as an argument
      bubbles[i].setData(currentYear); // Replaced y with currentYear  
      // End
    }
  }

  // Start
  // Function to remove the year dropdown when the visualization is switched
  this.destroy = function() 
  {
    if (yearDropdown !== null) 
    {
      // Remove the dropdown
      yearDropdown.remove();

      // Set yearDropdown to null
      yearDropdown = null;
    }
  };
  // End

  // Function to draw the visualization
  this.draw = function() 
  {
    // Translate the origin to the center of the canvas
    translate(width / 2, height / 2);

    // Loop through all Bubble objects in the bubbles array
    for (let i = 0; i < bubbles.length; i++) 
    {
      // Update each bubble's position & check for collisions with other bubbles
      bubbles[i].update(bubbles);

      // Draw each bubble on the canvas
      bubbles[i].draw();
    }
  };

    function Bubble(_name) 
   {
      this.size = 20; // Initial size of the bubble
      this.target_size = 20; // target size of the bubble

      // Start by Teacher
      /* Set the initial position of the bubble to a random location within the canvas */
      // so that they float from random position to center of canvas
      this.pos = createVector(random(-width / 2, width / 2), random(-height / 2, height / 2)); 
      // End by Teacher

      this.direction = createVector(0, 0); // initial direction of the bubble set to (0,0)
      this.name = _name; // the name of the bubble

      this.color = color(random(0, 255), random(0, 255), random(0, 255)); /* Set a random 
      color for the bubble */

      this.data = []; // Initialize an empty array for data associated with the bubble

      // a function method to draw the bubble
      this.draw = function() 
      {
        push();
        noStroke();
        fill(this.color);
        // Draw an ellipse at this.pos with diameter this.size
        ellipse(this.pos.x, this.pos.y, this.size);

        stroke(255);
        strokeWeight(0.1);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(12);
        // Draw the name of the bubble at its center
        text(this.name, this.pos.x, this.pos.y);
        pop();
      };

      // a function to update the bubble's position & check for collisions with other bubbles
      this.update = function(_bubbles) 
      {
        // Reset the direction of the bubble to (0,0)
        this.direction.set(0, 0);
      
        // Loop through all bubbles in the _bubbles array
        for (let i = 0; i < _bubbles.length; i++) 
        {
          // If the current bubble in the loop is not this bubble
          if (_bubbles[i].name !== this.name) 
          {
            // Calculate a vector pointing from the current bubble to this bubble
            let v = p5.Vector.sub(this.pos, _bubbles[i].pos);

            // Calculate the distance between this bubble & the current bubble
            let d = v.mag();
      
            // Calculate the minimum distance they should have to not overlap
            let minDist = this.size / 2 + _bubbles[i].size / 2 ;

            // If they are overlapping
            if (d < minDist) 
            {
              // Start
              // Set the magnitude of v to the overlapping distance
              v.setMag(minDist - d);

              // Move this bubble away from the current bubble by v
              this.pos.add(v);
              // End
            }
          }
        }
      
        // Start
        // Add a force that pushes the bubble towards the center of the canvas
        const centerForce = p5.Vector.sub(createVector(0, 0), this.pos);

        // Adjust the strength of the force by multiplying it by 0.01
        centerForce.mult(0.01); 

        // Add the center force to the bubble's direction
        this.direction.add(centerForce);
      
        // Update the bubble's position based on its direction
        this.pos.add(this.direction);
        // End
      
        // If the bubble's size is less than its target size, increase it by 1
        if (this.size < this.target_size) 
        {
          this.size += 1;
        }
        // If the bubble's size is more than its target size, decrease it by 1 
        else if (this.size > this.target_size) 
        {
          this.size -= 1;
        }
      };
      
      // Start by Teacher
      // a function to set the target size of the bubble based on a specific year's data
      this.setData = function(year) // Replaced i with year
      {
        // Find the index of the year in the years array
        let index = years.indexOf(year);

        /* Map the data value at that index from its original range (0 to maxAmt) to the 
        range for size (20 to 250) & set it as the target size of the bubble*/
        this.target_size = map(this.data[index], 0, maxAmt, 20, 250);
      };  // Replaced this.data[i] with this.data[index]
  }     // End by Teacher
}

/* CSV source: https://www.coursera.org/learn/uol-introduction-to-programming-2/lecture/vSkkO/7-204-extending-the-data-visualiser-dynamic-presentation-of-data-part-1 
   and: https://www.coursera.org/learn/uol-introduction-to-programming-2/lecture/DxqtL/7-205-extending-the-data-visualiser-dynamic-presentation-of-data-part-2   */

/* I copied & learend this code from "7.204-5 Extending the data visualiser: dynamic 
presentation of data, part 1 & 2" video in week 13 coursera & also copied CSV file */

// Note: Start & End by Teacher imply that the code was written by Teacher

// Changes made:
// Added comments
// -Replaced buttons with dropdown
// -Added Center Force