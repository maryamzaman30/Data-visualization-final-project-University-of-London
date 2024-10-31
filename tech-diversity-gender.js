function TechDiversityGender() 
{
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Tech Diversity: Gender';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'tech-diversity-gender';

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    // Margin positions around the plot. Left and bottom margins are
    // bigger so there is space for axis and tick labels on the canvas.
    leftMargin: 130,
    rightMargin: width,
    topMargin: 30,
    bottomMargin: height,
    pad: 5,

    plotWidth: function() 
    {
      return this.rightMargin - this.leftMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Middle of the plot: for 50% line.
  this.midX = (this.layout.plotWidth() / 2) + this.layout.leftMargin;

  // Default visualisation colours.
  this.femaleColour = color(255, 0 ,0);
  this.maleColour = color(0, 255, 0);

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() 
  {
    const self = this;
    this.data = loadTable(
      './data/tech-diversity/gender-2018.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) 
      {
        self.loaded = true;
      });
  };

  this.setup = function() 
  {
    // Font defaults.
    textSize(16);
  };

  this.draw = function() 
  {
    if (!this.loaded) 
    {
      return;
    }
    
    // Draw Female/Male labels at the top of the plot.
    this.drawCategoryLabels();

    const lineHeight = (height - this.layout.topMargin) /
        this.data.getRowCount();

      // Calculate the relative mouse position within the plot area
      const relativeMouseX = (mouseX - this.layout.leftMargin) / this.layout.plotWidth();
      // Check if the relative mouse position is within the range [0.095, 0.905]
      if (relativeMouseX > 0.095 && relativeMouseX < 0.905) 
      {
      // If the relative mouse position is within the range, calculate the mouse percent
        var mousePercent = 100 * relativeMouseX;
      } 
      else 
      {
        // If the relative mouse position is outside the range, set the mouse percent to 50
        var mousePercent = 50;
      }
      /* This calculates the relative mouse location inside the plot area and checks to see 
      if it is within a particular range. If the relative mouse position is inside the range, 
      it computes the mousePercent variable based on the relative mouse position. If the relative 
      mouse location is beyond the range, it sets mousePercent to 50. */

    // Loop over every row in the data.
    for (var i = 0; i < this.data.getRowCount(); i++) 
    {
      // Calculate the y position for each company.
      const lineY = (lineHeight * i) + this.layout.topMargin;

      // Create an object that stores data from the current row.
      /* uncomment the lines in the company object that extract data 
         from the current row and convert strings to numbers: */
      const company = 
      {
        // Start
        //I was assigned to convert strings to numbers.
        'name': this.data.getString(i, 'company'),
        'female': this.data.getNum(i, 'female'),
        'male': this.data.getNum(i, 'male'),
        // End
      };
        /* This ensure that the data for each company is correctly extracted 
           and used to draw the rectangles for female and male employees */

      // Draw the company name in the left margin.
      push();
      fill(0);
      noStroke();
      textAlign('right', 'top');
      pop();
      // Check if the percentage of female employees for the current company exceeds the mouse percent
      if (company.female > mousePercent) 
      {
        // If it does, set the fill color to the female color
        fill(this.femaleColour);
      } 
      else 
      {
        // If it does not, set the fill color to the male color
        fill(this.maleColour);
      }

      // Draw the company name at the specified position
      text(company.name, this.layout.leftMargin - this.layout.pad, lineY);
     /*This determines if the proportion of female employees at a 
     certain organization above a certain threshold (mousePercent). 
     If it does, it changes the fill color to the female color. If it 
     does not, the fill color is set to the male color. The company name 
     is then drawn in the desired place using the fill color.. */

      // Draw female employees rectangle.
      fill(this.femaleColour);
      rect(this.layout.leftMargin,
           lineY,
           this.mapPercentToWidth(company.female),
           lineHeight - this.layout.pad);

      //I was assigned to draw male employees rectangle.
      fill(this.maleColour);
      rect(this.layout.leftMargin + this.mapPercentToWidth(company.female),
      lineY,
      this.mapPercentToWidth(company.male),
      lineHeight - this.layout.pad);
      /*This generates a rectangle for male workers to the right of the rectangle 
      for female employees. The rectangle's width is calculated by mapping the 
      proportion of male workers to the plot width with the mapPercentToWidth function. */
    }

      push();
      stroke(0);
      strokeWeight(1);

      // Calculate the x position of the line based on the current mouse position
      const lineX = this.mapPercentToWidth(mousePercent) + this.layout.leftMargin;

      // Draw a vertical line at the calculated x position
      line(lineX, this.layout.topMargin, lineX, this.layout.bottomMargin);

      // Set the text alignment 
      textAlign('center', 'top');
      noStroke();
      fill(0);
      // Draw the text showing the current mouse percent at the calculated x position
      text(Math.round(mousePercent) + '%', lineX, this.layout.pad);
      pop();
      /*This calculates the x location of a vertical line depending on the current mouse 
      position and then displays the line as well as a text label indicating the current 
      mouse percentage at that place. Because the mousePercent variable used in this code 
      is not defined, it must be defined, before using it. */
      /* In order to enhance this code, I took this code from:
         https://irfanullahjan.github.io/cm1010-prog-ii-final-project/ */
  };

      // Function to draw the category labels on the plot
      this.drawCategoryLabels = function() 
      {
        fill(0);
        noStroke();        
        textAlign('left', 'top');

        // Draw the 'Female' label at the specified position
        text('Female',
            this.layout.leftMargin,
            this.layout.pad);
        
        // Set the text alignment to right and top
        textAlign('right', 'top');

        // Draw the 'Male' label at the specified position
        text('Male',
            this.layout.rightMargin,
            this.layout.pad);
      };

      // Start
      this.destroy = function() // To avoid confliction in text positions in other code
      {
        textAlign(LEFT, BASELINE);
      };
      // End
    
      // Function to map a percentage value to a position on the x-axis
      this.mapPercentToWidth = function(percent) 
      {
        // Map function to map the value from the input range to the output range
        return map(percent,0,100,0,this.layout.plotWidth());
      };
}
