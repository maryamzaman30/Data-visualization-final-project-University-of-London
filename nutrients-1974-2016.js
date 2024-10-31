function NutrientsTimeSeries() 
{
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Nutrients: 1974-2016';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'nutrients-timeseries';

  // Title to display above the plot.
  this.title = 'Average Nutrient Intake: 1974-2016';

  // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = '%';
	
  this.colors = [];

  const marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() 
    {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() 
    {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() 
  {
    const self = this;
    this.data = loadTable(
      './data/food/nutrients74-16.csv', 'csv', 'header',
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
	  
    // Set min and max years: assumes data is sorted by date.
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length -1]);
	  
	for(var i = 0; i < this.data.getRowCount(); i++)
	{
		this.colors.push(color(random(0,255),random(0,255),random(0,255)));
	}

    // Find min and max pay gap for mapping to canvas height.
    this.minPercentage = 80;         
    this.maxPercentage = 400;
  };

  this.draw = function() 
  {
    if (!this.loaded) 
    {
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(this.minPercentage,
                        this.maxPercentage,
                        this.layout,
                        this.mapPayGapToHeight.bind(this),
                        0);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    
    const numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) 
	{
	  const row = this.data.getRow(i);
	  var previous = null;
		
	  var l = row.getString(0);
	
	  
	  for(var j = 1; j < numYears; j++)
      {
        
        // Create an object to store data for the current year.
        const current = {
        // Convert strings to numbers.
        'year': this.startYear + j - 1, 
        'percentage': row.getNum(j)
        };
        
      if (previous != null) 
      {
        // Draw line segment connecting previous year to current
        // year pay gap.
        push();
        stroke(this.colors[i]);
        strokeWeight(2);
        line(this.mapYearToWidth(previous.year),
          this.mapPayGapToHeight(previous.percentage),
          this.mapYearToWidth(current.year),
          this.mapPayGapToHeight(current.percentage));
          pop();

        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        const xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

        //Rotating the years on x-azis to avoid overlapping
        function drawXAxisTickLabel(value, layout, mapFunction) 
       {
          // Map the value to a position on the canvas.
          const x = mapFunction(value);
        
          // Start
          // Draw the tick label.
          push();
          stroke(0); //It will actually be of random colors rather than black
          strokeWeight(2);
          translate(x, layout.bottomMargin + layout.pad);
          rotate(-PI / 4); // Rotate the years by 45 degrees to prevent overlapping
          textAlign('right');
          text(value, 0, 0);
          pop();
       }

        // Draw the tick label marking the start of the previous year.
        if (i % xLabelSkip == 4) 
        {
          drawXAxisTickLabel(previous.year, this.layout,
                  this.mapYearToWidth.bind(this));
        }
      }
        else
        {
          const y_Gap = i * 8; // Increase or decrease y-value to adjust the spacing
          const y_Pos = -250;
          const x_Gap = i * 29; // Increase or decrease x-value to adjust the spacing
          const x_Pos = -250;

          noStroke();
          fill(this.colors[i]);
          text(l, (910 + x_Gap) + x_Pos, (this.mapPayGapToHeight(current.percentage) 
          + y_Gap) + y_Pos);        
        }
        // End 
        
        // Assign current year to previous year so that it is available
        // during the next iteration of this loop to give us the start
        // position of the next line segment.
        previous = current;
      }
    }
  };

      this.drawTitle = function() //For drawing title
      {
        fill(0);
        noStroke();
        textAlign('center', 'center');

        // Draw the title text at the top center of the plot
        text(this.title,
          (this.layout.plotWidth() / 2) + this.layout.leftMargin,
          this.layout.topMargin - (this.layout.marginSize / 2));
      };

      // Function to map a year value to a horizontal position on the plot
      this.mapYearToWidth = function(value) 
      {
        return map(value,
          this.startYear,
          this.endYear,
          this.layout.leftMargin, // Draw left-to-right from margin.
          this.layout.rightMargin);
      };

      // Function to map a pay gap percentage value to a vertical position on the plot
      this.mapPayGapToHeight = function(value) 
      {
        return map(value,
          this.minPercentage,
          this.maxPercentage,
          this.layout.bottomMargin, 
          this.layout.topMargin); 
      };
}

//CSV source: https://www.gov.uk/government/statistical-data-sets/family-food-datasets
//I copied and learend this one from 5.203 video in week 9 coursera, I also copied CSV file
//However I was assigned to fix the overlapping of texts(years) & organising the labels
//I fixed the years text with the help of rotation and fixed labels by changing position
