function PayGapByJob2017() 
{
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap by job: 2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-by-job-2017';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() 
  {
    const self = this;
    this.data = loadTable(
      './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) 
      {
        self.loaded = true;
      });
  };

  this.draw = function() 
  {
    if (!this.loaded) 
    {
      return;
    }

    // Draw the axes.
    this.addAxes();

    // Get data from the table object.
    var propFemale = this.data.getColumn('proportion_female');
    var payGap = this.data.getColumn('pay_gap');
    var numJobs = this.data.getColumn('num_jobs');

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    // Use full 100% for x-axis (proportion of women in roles).
    var propFemaleMin = 0;
    var propFemaleMax = 100;

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.
    var payGapMin = -20;
    var payGapMax = 20;

    // Start
    const colors = [[255,0,0,100],
    [255,165,0,100], [0,255,0,100],
    [0,191,255,100], [255,255,0,100], 
    [128,0,128,100], [255,105,180,100],]; // array of 7 colors
    // End
    
    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    const numJobsMin = min(numJobs);
    const numJobsMax = max(numJobs);
    stroke(0);
    strokeWeight(1);
 
    for (i = 0; i < this.data.getRowCount(); i++) 
    {
     // Start 
    /* In this part of the code, a for loop is used to iterate over all rows of data. 
      Within the loop, an ellipse is drawn for each point, with its x-coordinate representing
      the proportion of women in the role, its y-coordinate representing the pay gap, and its size
      representing the number of jobs. However, the code to draw the ellipses was incomplete and
      I was assigned to complete it
       */
      fill(colors[i % colors.length]); // Index to access and get the color from array
      const x = map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad);
      const y = map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad);
      const size = map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax);
      ellipse(x, y, size);
      /* This uses the map function to linearly interpolate the propFemale, payGap, and
      numJobs values from their data ranges to their pixel ranges. The resulting x, y, and 
      size values are then passed to the ellipse function to draw an ellipse for each point */
      // End
    }
  };

  this.addAxes = function () 
  {
    stroke(200);
    
    // Add vertical line.
    line(width / 2,
         0 + this.pad,
         width / 2,
         height - this.pad);

    // Add horizontal line.
    line(0 + this.pad,
         height / 2,
         width - this.pad,
         height / 2);
  };
}
