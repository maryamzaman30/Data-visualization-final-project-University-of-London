function PayGapTimeSeries() 
{
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap: 1997-2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-timeseries';

  // Title to display above the plot.
  this.title = 'Gender Pay Gap: Average difference between male and female pay.';

  // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = '%';

  const marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Margin positions around the plot. Left and bottom have double
    // margin size to make space for axis and tick labels on the canvas.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function () 
    {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function () 
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
  this.preload = function () 
  {
    const self = this;
    this.data = loadTable(
      './data/pay-gap/all-employees-hourly-pay-by-gender-1997-2017.csv',
      'csv',
      'header',
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () 
  {
    // Font defaults.
    textSize(16);

    // Set min and max years: assumes data is sorted by date.
    this.startYear = this.data.getNum(0, 'year');
    this.endYear = this.data.getNum(this.data.getRowCount() - 1, 'year');

    // Find min and max pay gap for mapping to canvas height.
    this.minPayGap = 0; // Pay equality (zero pay gap).
    this.maxPayGap = max(this.data.getColumn('pay_gap'));
  };

  this.draw = function () 
  {
    if (!this.loaded) 
    {
      return;
    }

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      this.minPayGap,
      this.maxPayGap,
      this.layout,
      this.mapPayGapToHeight.bind(this),
      0
    );

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Draw the title above the plot.
    this.drawTitle();

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    var previous;
    const numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) 
    {
      // Create an object to store data for the current year.
      const current = {
        // Start
        // I converted strings to numbers.
        year: this.data.getNum(i, 'year'),
        payGap: this.data.getNum(i, 'pay_gap'),
        /* This sets the year and payGap properties of the 
        current object to the values from the current row of data 
        in the year and pay_gap columns */
        // End
      };

      if (previous != null) 
      {
        // Start
        //I drew line segment connecting previous year to current
        // year pay gap.
        stroke(255, 0, 0);
        line(
          this.mapYearToWidth(previous.year),
          this.mapPayGapToHeight(previous.payGap),
          this.mapYearToWidth(current.year),
          this.mapPayGapToHeight(current.payGap)
        );
        // End

        // Draw & display the values of the current data on the line plot
        noStroke();
        fill(0, 0, 255);
        textAlign(CENTER, BOTTOM);
        const values = nfc(current.payGap, 1);
        text(
          values,
          this.mapYearToWidth(current.year),
          this.mapPayGapToHeight(current.payGap) - this.layout.pad
        );

        // numXTickLabels are drawn.
        const xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

        // Draw the tick label marking the start of the previous year.
        if (i % xLabelSkip == 0) 
        {
          drawXAxisTickLabel(
            previous.year,
            this.layout,
            this.mapYearToWidth.bind(this)
          );
        }
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }

    // Start
    // Add trendlines (Suggestion from usability testing)
    const trendlineStartYear = 1997; // Start year for trendline
    const trendlineEndYear = 2017; // End year for trendline

    // Find the start and & indices for the trendline data
    let trendlineStartIndex = -1;
    let trendlineEndIndex = -1;

    // Loop through all rows of the data
    for (let i = 0; i < this.data.getRowCount(); i++) 
    {
      // Get the year for the current row
      const year = this.data.getNum(i, 'year');

      // If the year matches the start year of the trendline, save the index
      if (year === trendlineStartYear) 
      {
        trendlineStartIndex = i;
      }

      // If the year matches the end year of the trendline, save the index
      if (year === trendlineEndYear) 
      {
        trendlineEndIndex = i;
      }
    }

    // If both start and end indices are found, draw the trendline
    if (trendlineStartIndex >= 0 && trendlineEndIndex >= 0) 
    {
      // Map the years and pay gaps to x and y coordinates for the start and end of the trendline
      const trendlineStartX = this.mapYearToWidth(this.data.getNum(trendlineStartIndex, 'year'));
      const trendlineEndX = this.mapYearToWidth(this.data.getNum(trendlineEndIndex, 'year'));
      const trendlineStartY = this.mapPayGapToHeight(this.data.getNum(trendlineStartIndex, 'pay_gap'));
      const trendlineEndY = this.mapPayGapToHeight(this.data.getNum(trendlineEndIndex, 'pay_gap'));

      // Set the stroke color to green
      stroke(0, 255, 0);

      // Draw the line from the start to the end of the trendline
      line(trendlineStartX, trendlineStartY, trendlineEndX, trendlineEndY);
    }
  };
  // End

  // A function to draw the title of the plot
  this.drawTitle = function () 
  {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    // Draw the title text at the specified position
    text(
      this.title,
      this.layout.plotWidth() / 2 + this.layout.leftMargin,
      this.layout.topMargin - this.layout.marginSize / 2
    );
  };

  // A function to map a year value to a position on the x-axis
  this.mapYearToWidth = function (value) 
  {
    // Map function to map the value from the input range to the output range
    return map(
      value,
      this.startYear,
      this.endYear,
      this.layout.leftMargin, // Draw left-to-right from margin.
      this.layout.rightMargin
    );
  };

  // A function to map a pay gap value to a position on the y-axis
  this.mapPayGapToHeight = function (value) 
  {
    // Map function to map the value from the input range to the output range
    return map(
      value,
      this.minPayGap,
      this.maxPayGap,
      this.layout.bottomMargin, // Smaller pay gap at bottom.
      this.layout.topMargin // Bigger pay gap at top.
    );
  };
}