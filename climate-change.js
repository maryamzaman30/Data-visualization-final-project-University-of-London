function ClimateChange() 
{
   // Name for the visualisation to appear in the menu bar.
  this.name = 'Climate Change';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'climate-change';

  // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = '℃';

  const marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = 
  {
    marginSize: marginSize, //size of the margins around the plot area

    // Margin positions around the plot. Left and bottom have double
    // margin size to make space for axis and tick labels on the canvas.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5, //pad property

    //Calculate width and height for plot area
    plotWidth: function() 
    {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() 
    {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: false,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 8,
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
      './data/surface-temperature/surface-temperature.csv', 'csv', 'header',
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
    textAlign('center', 'center');

    // Set min and max years: assumes data is sorted by year.
    this.minYear = this.data.getNum(0, 'year');
    this.maxYear = this.data.getNum(this.data.getRowCount() - 1, 'year');

    // Find min and max temperature for mapping to canvas height.
    this.minTemperature = min(this.data.getColumn('temperature'));
    this.maxTemperature = max(this.data.getColumn('temperature'));

    // Find mean temperature to plot average marker.
    this.meanTemperature = mean(this.data.getColumn('temperature'));

    // Count the number of frames drawn since the visualisation
    // started so that we can animate the plot.
    this.frameCount = 0;

    // Create sliders to control start and end years. Default to
    // visualise full range.
    this.startSlider = createSlider(this.minYear,
                                    this.maxYear - 1,
                                    this.minYear,
                                    1);
    this.startSlider.position(400, 10);

    this.endSlider = createSlider(this.minYear + 1,
                                  this.maxYear,
                                  this.maxYear,
                                  1);
    this.endSlider.position(600, 10);
  };

  this.destroy = function() //For destroying when switching to other visualizations
  {
    this.startSlider.remove();
    this.endSlider.remove();
  };

  this.draw = function() 
  {
    if (!this.loaded) 
    {
      return; //If not loaded then return without doing anything
    }

    // Prevent slider ranges overlapping.
    if (this.startSlider.value() >= this.endSlider.value()) 
    {
      this.startSlider.value(this.endSlider.value() - 1);
    }
    this.startYear = this.startSlider.value();
    this.endYear = this.endSlider.value();

    // Draw all y-axis tick labels.
    drawYAxisTickLabels(this.minTemperature,
                        this.maxTemperature,
                        this.layout,
                        this.mapTemperatureToHeight.bind(this),
                        1);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot average line.
    stroke(200);
    strokeWeight(1);
    line(this.layout.leftMargin,
         this.mapTemperatureToHeight(this.meanTemperature),
         this.layout.rightMargin,
         this.mapTemperatureToHeight(this.meanTemperature));

    // Plot all temperatures between startYear and endYear using the
    // width of the canvas minus margins.
    var previous;
    const numYears = this.endYear - this.startYear;

    // Count the number of years plotted each frame to create
    // animation effect.
    var yearCount = 0;

    // Loop over all rows but only plot those in range.
    for (var i = 0; i < this.data.getRowCount(); i++) 
    {
      // Create an object to store data for the current year.
      const current = {
        // Convert strings to numbers.
        'year': this.data.getNum(i, 'year'),
        'temperature': this.data.getNum(i, 'temperature')
      };

      if (previous != null && current.year > this.startYear && current.year <= this.endYear) 
      {
        // Start
        // I drew background gradient to represent colour temperature of the current year.
        noStroke();

        const currentTemperature = this.data.getNum(i, 'temperature');
        const currentColor = this.mapTemperatureToColour(currentTemperature);

        fill(currentColor);

        const segmentWidth = this.layout.plotWidth() / numYears;
        const x = this.mapYearToWidth(previous.year);

        rect(x, this.layout.topMargin, segmentWidth, this.layout.plotHeight());
        //End

        // Draw line segment connecting previous year to current
        // year temperature.
        stroke(0);
        line(this.mapYearToWidth(previous.year),
             this.mapTemperatureToHeight(previous.temperature),
             this.mapYearToWidth(current.year),
             this.mapTemperatureToHeight(current.temperature));

        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        const xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

        // Draw the tick label marking the start of the previous year.
        if (yearCount % xLabelSkip == 0) 
        {
          drawXAxisTickLabel(previous.year, this.layout,
                             this.mapYearToWidth.bind(this));
        }

        // When six or fewer years are displayed also draw the final
        // year x tick label.
        if ((numYears <= 6
             && yearCount == numYears - 1)) 
        {
          drawXAxisTickLabel(current.year, this.layout,
                             this.mapYearToWidth.bind(this));
        }

        yearCount++;
      }

      // Stop drawing this frame when the number of years drawn is
      // equal to the frame count. This creates the animated effect
      // over successive frames.
      if (yearCount >= this.frameCount) 
      {
        break;
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }

    // Count the number of frames since this visualisation
    // started. This is used in creating the animation effect and to
    // stop the main p5 draw loop when all years have been drawn.
    this.frameCount++;
  };

  this.mapYearToWidth = function(value) 
  {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin, // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapTemperatureToHeight = function(value) 
  {
    // map function to map the value from the input range to the output range
    return map(value,
               this.minTemperature,
               this.maxTemperature,
               this.layout.bottomMargin, // Lower temperature at bottom.
               this.layout.topMargin); // Higher temperature at top.
  };

  //Function to map a temperature value to a color
  this.mapTemperatureToColour = function(value) 
  {
    // Map the temperature value from the input range to the output range of 0 to 255
    const red =  map(value,
                   this.minTemperature,
                   this.maxTemperature,
                   0,
                   255);
    // Calculate the blue value as the inverse of the red value               
    const blue = 255 - red;
    // Return a color object with the calculated red and blue values
    return color(red, 0, blue, 100);
  };
}