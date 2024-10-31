function NYTempTimeSeries() 
{
	// Name for the visualisation to appear in the menu bar.
	this.name = 'New York Temperature';

	// Each visualisation must have a unique ID with no special
	// characters.
	this.id = 'newyorktemp-timeseries';

	// Title to display above the plot.
	this.title = 'New York Temperature All Year Round';

	// Names for each axis.
	this.xAxisLabel = 'Months';
	this.yAxisLabel = 'Celsius';

	const marginSize = 35;

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
		numXTickLabels: 12,
		numYTickLabels: 12,
	};

	// Property to represent whether data has been loaded.
	this.loaded = false;

	// Preload the data. This function is called automatically by the
	// gallery when a visualisation is added.
	this.preload = function() 
	{
		const self = this; //To correctly refer to the graph

		this.data = loadTable('./data/surface-temperature/new-york-temp.csv','csv','header',
			// Callback function to set the value
			// this.loaded to true.
			function(table) 
			{
				self.loaded = true;
				self.Min_Y = min(self.data.getColumn('min'));
				self.Max_Y = max(self.data.getColumn('max'));
			}
		);
	};

	this.draw = function() 
	{
		if (!this.loaded) 
		{
			return;
		}
			//Drawing Months
			const months = this.data.getColumn('category');
			for (var j = 0; j < months.length; j++) 
		{
			const x = map(j, 0, months.length - 1, this.layout.leftMargin, this.layout.rightMargin);
			text(months[j], x, height - 50);
		}

		// Draw x and y axis labels.
		drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

		// Draw x and y axis.
		drawAxis(this.layout);

		// Draw the title above the plot.
		push();
		this.drawTitle();
		pop();

		// Draw all y-axis labels.
		drawYAxisTickLabels(this.Min_Y,this.Max_Y,this.layout,this.mapTempToHeight.bind(this),0);

		// Draw x and y axis labels.
		drawAxisLabels(this.xAxisLabel,this.yAxisLabel,this.layout);

		// Get the minimum and maximum values for the x and y axis.
		const Min_Y = min(this.data.getColumn('min'));  //Get min data
		const Max_Y = max(this.data.getColumn('max'));  //Get max data	
	
			// Map the data to the plot area.
			const points_Min = this.data.getColumn('min').map((value, index) =>{
			// Create a vector object for each point
			return createVector(
			// Map the index of the value to a position on the x-axis
			map(
				index,
				0,
				this.data.getRowCount() - 1,
				this.layout.leftMargin,
				this.layout.rightMargin
			),
			// Map the value to a position on the y-axis
			map(
				value,
				Min_Y,
				Max_Y,
				this.layout.bottomMargin,
				this.layout.topMargin
			)
			);
		});		
		// Define a variable to hold an array of points for the maximum temperature values
		     const points_Max = this.data.getColumn('max').map((value, index) => {
				// Create a vector object for each point
				return createVector(
				// Map the index of the value to a position on the x-axis
				map(
					index,
					0,
					this.data.getRowCount() - 1,
					this.layout.leftMargin,
					this.layout.rightMargin
				),
				// Map the value to a position on the y-axis
				map(
					value,
					Min_Y,
					Max_Y,
					this.layout.bottomMargin,
					this.layout.topMargin
				)
				);
			});
  
			// Draw the range area chart. My teacher helped
			stroke(50,205,0);
			fill(152,251,152,100);
			beginShape();
			points_Min.forEach((p) => vertex(p.x, p.y)); // p for point
			points_Max.reverse().forEach((p) => vertex(p.x, p.y));
			endShape(CLOSE);
			 
			// Draw circle points for each month. My teacher helped
			stroke(255);
			fill(0);
			for (let i = 0; i < points_Min.length; i++) 
			{
				const x = points_Min[i].x;
				const min_Temp = this.data.getNum(i, 'min'); //Get Min Data
				const max_Temp = this.data.getNum(i, 'max'); //Get Max Data
				
				//Map the exact values
			  const y_Min = map(
					min_Temp,
					Min_Y,
					Max_Y,
					this.layout.bottomMargin,
					this.layout.topMargin
				);
			  const y_Max = map(
					max_Temp,
					Min_Y,
					Max_Y,
					this.layout.bottomMargin,
					this.layout.topMargin
				);
				// Start
				//Changed it from Circle to Ellipse
				ellipse(x, y_Min, 5, 5); //Draw points on exact Min values
				ellipse(x, y_Max, 5, 5); //Draw points on exact Max values
		
				text(min_Temp, x + 10, y_Min); //Text for exact Min values
				text(max_Temp, x + 10, y_Max); //Text for exact Max values
				// End
			}
	};

		// Define a function to draw the title of the plot
		this.drawTitle = function() 
		{
			push();	
			fill(0);
			noStroke();
			textAlign('center', 'center');
			push();	

			// Draw the title text at the specified position
			text(
				this.title,
				this.layout.plotWidth() / 2 + this.layout.leftMargin,
				this.layout.topMargin - this.layout.marginSize / 2
			);
		};

		// Define a function to map a month value to a position on the page
		this.mapMonthToWidth = function(value) 
		{
		// Map function to map the value from the input range to the output range
		return map(
			value,
			this.layout.leftMargin, // Draw left-to-right from margin.
			this.layout.rightMargin
		);
		};

		// A function to map a temperature value to a position on the page
		this.mapTempToHeight = function(value) 
		{
		// Map function to map the value from the input range to the output range
		return map(
			value,
			this.Min_Y,
			this.Max_Y,
			this.layout.bottomMargin,
			this.layout.topMargin
		); 
		};

		// Setup function to set the text size
		this.setup = function() 
		{
			textSize(16);
		};
}

//CSV file source: https://apexcharts.com/javascript-chart-demos/range-area-charts/basic/
//I manipulated the CSV file data by removing New York Temperature and adding min,max
/*I started this from 'Nutrients: 1974-2016' and changed the names of varibles like
  mapYearToWidth, mapPayGapToHeight etc. I took help from my BIC teacher in drawing 
  range area and circular points but I customized it myself*/