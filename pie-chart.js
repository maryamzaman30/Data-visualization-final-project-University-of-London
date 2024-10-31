function PieChart(x, y, diameter) 
{
  // Properties of the pie chart
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  
  // To control the spacing of the legend items
  this.labelSpace = 30;

  // Define a method to calculate the angles of the pie chart slices
  this.get_radians = function(data) 
  {
    // Calculate the total value of the data
    const total = sum(data);
    
    // Create an array to hold the calculated angles
    const radians = [];

    // Loop through the data values
    for (let i = 0; i < data.length; i++) 
    {
      // Calculate the angle of the slice and add it to the array
      radians.push((data[i] / total) * TWO_PI);
    }
    
    // Return the array of angles
    return radians;
  };

  // Define a method to draw the pie chart on the page
  this.draw = function(data, labels, colours, title) 
  {
    // Check if the data is not empty and that each input array is the same length
    if (data.length == 0) 
    {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => 
    {
      return array.length == data.length;
    })) 
    {
      alert(`Data (length: ${data.length})
      Labels (length: ${labels.length})
      Colours (length: ${colours.length})
      Arrays must be the same length!`);
    }
    
    // Calculate the angles of the pie chart slices
    const angles = this.get_radians(data);
    
    // Initialize variables for drawing the slices
    var lastAngle = 0;
    var colour;
    
    // Calculate the total value of the data
    const total = sum(data);

    // Loop through the data values
    for (var i = 0; i < data.length; i++) 
    {
      // Set the fill color for the slice
      if (colours) 
      {
        colour = colours[i];
      } else 
      {
        colour = map(i, 0, data.length, 0, 255);
      }

      // Properties for drawing the slice
      fill(colour);
      stroke(0);
      strokeWeight(1);

      // Draw the slice using an arc shape
      arc(this.x, this.y,
          this.diameter, this.diameter,
          lastAngle, lastAngle + angles[i] + 0.001); // Hack for 0!

      // If labels are provided, draw a legend item for the slice
      if (labels) 
      {
        this.makeLegendItem(labels[i], i, colour);
      }

      // Start
      // Calculate and display percentage of data
      const percentage = (data[i] / total) * 100;
      const x = this.x + (this.diameter / 2 + 10) * cos(lastAngle + angles[i] / 2); // x position of data
      const y = this.y + (this.diameter / 2 + 10) * sin(lastAngle + angles[i] / 2); // y position of data
        fill(0);
        stroke(255);
        strokeWeight(2);
        textAlign(CENTER, CENTER);
        textSize(20);
        text(nfc(percentage, 1) + '%', x, y);
      // End  

      // Update lastAngle for drawing next slice
      lastAngle += angles[i];
    }

    // If a title is given, draw it above the pie chart
    if (title) 
    {
      noStroke();
      textAlign('center', 'center');
      textSize(24);
      text(title, this.x, this.y - this.diameter * 0.6);
    }
  };

  // Define a method to draw a legend item for a slice of the pie chart
  this.makeLegendItem = function(label, i, colour) 
  {
    // Calculate the position of the legend item
    const x = this.x + 50 + this.diameter / 2;
    const y = this.y + (this.labelSpace * i) - this.diameter / 3;
    
    // Set the width and height of the legend item box
    const boxWidth = this.labelSpace / 2;
    const boxHeight = this.labelSpace / 2;

    // For the legend item box
    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    // Draw text label next to legend item box 
    fill('black');
    noStroke();
    textAlign('left', 'center');
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  };
}
