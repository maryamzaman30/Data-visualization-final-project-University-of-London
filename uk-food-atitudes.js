function UKFoodAttitudes() 
{
  // Name for the visualisation to appear in the menu bar.
  this.name = 'UK Food Attitudes 2018';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'uk-food-attitudes';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() 
  {
    const self = this;
    this.data = loadTable(
    './data/food/attitudestoukfood-2018.csv', 'csv', 'header',      
    // Callback function to set the value
    // this.loaded to true.
      function(table) 
      {
        self.loaded = true;
      });
  };

  this.setup = function() 
  {
    if (!this.loaded) 
    {
      return;
    }
    // Start
     /* I was assigned to Create a select DOM element, 
     Set select position and Fill the options with all 
     company names. */
    this.select = createSelect();
    this.select.position(400, 10);
    for (var i = 1; i < this.data.getColumnCount(); i++) 
    {
      this.select.option(this.data.columns[i]);
    }
     /* This will create a select DOM element, set its position,
     and fill its options with all company names from the data. */
     // End
  };

    this.destroy = function() 
  {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() 
  {
    if (!this.loaded) 
    {
      return;
    }

    push();
    // Get the value of the company we're interested in from the select item.
    // Use a temporary hard-code example for now.
    // Start
    //I then, change the hard-coded company name to instead get the value from the select element
    const questionType = this.select.value();
      /* This will set the questionType variable to the value of the currently selected option 
      in the select element. */
    // Start  

    // Get the column of raw data for questionType.
    var col = this.data.getColumn(questionType);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    const labels = this.data.getColumn(0);

    // Colour to use for each category.
    const colours = ['#00ff00', 'green','yellow', 'orange', 'red'];

    // Make a title.
    const title = 'Question ' + questionType;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
    pop();
  };
}

//CSV source: https://www.gov.uk/government/statistics/food-statistics-pocketbook
//I copied and learend this one from 5.203 video in week 9 coursera and also copied CSV file