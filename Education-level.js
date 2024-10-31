function EducationLevel() 
{
  // Name of the visualization to appear in the menu bar.
  this.name = 'Educational Level';

  // Unique ID for the visualization with no special characters.
  this.id = 'education-level';

  // Title to appear above the graph.
  this.title = 'A bar graph listing responses for different levels of education. (Hover over the bar to see the number of responses)';

  // Start
  let dataTable;
  let C_width = 800; // Canvas width
  let C_height = 400; // Canvas height
  // End

  /* Preload the data. This function is automatically called by the
  gallery when a visualization is added. */
  this.preload = function() 
  {
    this.dataTable = loadTable(
      './data/education/levels-of-education.csv', 'csv', 'header');
  };

  this.draw = function() 
  {
    // Start
    textAlign(LEFT);
    noStroke();
    fill(0);
    textSize(18);
    text(this.title, 10, 29); // Title

    let data = []; //Empty array for use

    // Process the data from the table
    for (let row = 0; row < this.dataTable.getRowCount(); row++) 
    {
      let Levels = this.dataTable.getString(row, 0);
      let count = this.dataTable.getNum(row, 1);
      data.push({
        Levels: Levels,
        Count: count
      });
    }

    // Find the maximum count value
    let maxCount = max(data.map((d) => d.Count));

    // Set the height of the bars based on the number of bars
    let bar_Height = C_height / data.length;

    // Draw each bar along with its label
    for (let i = 0; i < data.length; i++) 
    {
      let d = data[i]; // Set the data i
      let x = map(d.Count, 0, maxCount, 0, C_width); // Set the x-coordinate 
      let y = i * bar_Height; // Set the y-coordinate 
      let bar_Width = x; // Set the width of the bar based on its count

      push();
      stroke(0);
      fill(0, 0, 255);
      rect(0, y + 150, bar_Width, bar_Height - 1); 
      pop();

      push();
      translate(bar_Width + 10, y + bar_Height / 2 + 150); // Horizontal bars
      textAlign(LEFT, CENTER);
      text(d.Levels, 0, 0);
      pop();

      // Check if the mouse is hovering over the current bar
      if (mouseX >= 0 && mouseX <= bar_Width && mouseY >= y + 150 && mouseY <= y + bar_Height + 150) 
      {
        /* Declaring variables for tooltip to avoid conflictions & displacement when
        switched to different visualization */
        // Calculate the width of the tooltip
        const calc_tooltipWidth = textWidth(d.Count.toString()) + 10;
        
        // Calculate the x position to place the tooltip infront of the mouse
        const calc_tooltipX = (mouseX + calc_tooltipWidth) - 20 ;
      
        // Draw a tooltip (hovering effect) with the count value
        fill(255);
        rect(calc_tooltipX, mouseY - 12, calc_tooltipWidth, 20);
        fill(0);
        textAlign(CENTER, CENTER); 
        text(d.Count.toString(), calc_tooltipX + calc_tooltipWidth / 2, mouseY - 2);
      }
    }
  }
}
// End

//CSV file source: https://wsform.com/knowledgebase/sample-csv-files/
//Original CSV file had no numerical values so I manipulated the data by putting Values.