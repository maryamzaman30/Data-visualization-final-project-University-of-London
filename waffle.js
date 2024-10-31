function WaffleChart()
{
	// Name for the visualisation to appear in the menu bar.
	this.name = 'Eating behaviours of Students';

	// Each visualisation must have a unique ID with no special characters.
	this.id = 'Eating-Habits';

	// Title to display below the charts.
	this.title = 'Eating behaviours of Students (hover over the blocks to find out)';

	var data;
	const waffles = [];	//Empty for storing

	this.preload = function()
	{
		// load file
		data = loadTable("data/food/waffles-finalData.csv", "csv", "header");
	}

	// Where all the Waffles are drawn
	function Waffle(x, y, width, height, boxes_across, boxes_down, table, columnHeading, possibleValues) 
	{
		// Some variables  
		var x = x;
		var y = y;
		var height = height;
		var width = width;
		var boxes_down = boxes_down;
		var boxes_across = boxes_across;

		// Actual data:
		const column = table.getColumn(columnHeading);
		// All possible Values to create the waffle chart
		var possibleValues = possibleValues;
		// customize
		const colours = ["red", "green", "blue", "purple", "yellow", "orange"];

		// for storing
		const categories = [];
		const boxes = [];

		// Finding the categories
		function categoryLocation(categoryName) 
		{
			for (var i = 0; i < possibleValues.length; i++) 
			{
				if (categoryName == categories[i].name) 
				{
					return i;
				}
			}
			return -1;
		}

		function addCategories() 
		{
			// iterate over the possible values
			for (var i = 0; i < possibleValues.length; i++) 
			{

				categories.push(
				{
					"name": possibleValues[i],
					"count": 0,
					"colour": colours[i % colours.length] // Using Modulo for different colors
				});
			}
			// To know many answers we received
			for (var i = 0; i < column.length; i++) 
			{
				var catLocation = categoryLocation(column[i])
				if (catLocation != -1) 
				{
					categories[catLocation].count++
				}
			}
			// iterate over categories and add proportions
			for (var i = 0; i < categories.length; i++) 
			{
				// turn raw data value into a proportion
				categories[i].boxes = round((categories[i].count / column.length) * (boxes_down * boxes_across));
			}
		}

		// iterate over possible boxes   
		function addBoxes() 
		{
			var currentCategory = 0;
			var currentCategoryBox = 0;

			// size of each box
			const boxWidth = width / boxes_across;
			const boxHeight = height / boxes_down;

			for (var i = 0; i < boxes_down; i++) 
			{
				boxes.push([]);
				for (var j = 0; j < boxes_across; j++) 
				{
					if (currentCategoryBox == categories[currentCategory].boxes) 
					{
						currentCategoryBox = 0;
						currentCategory++;
					} 
					
					// Start
					if(typeof categories[currentCategory] != 'undefined') //To fix the error/missing box
					{
						Category = categories[currentCategory]
					}
					// End	

					 boxes[i].push(new Box(x + (j * boxWidth), y + (i * boxHeight),
						boxWidth, boxHeight, Category ));

					currentCategoryBox++;

				}
			}
		}
		// add categories 
		addCategories();
		addBoxes();

		this.draw = function () 
		{
			// draw waffle diagram
			for (var i = 0; i < boxes.length; i++) 
			{
				for (var j = 0; j < boxes[i].length; j++) 
				{
					if(boxes[i][j].category != undefined) //To make sure Box is present
					{
						boxes[i][j].draw();
					}
					
				}
			}				
		}

		// Interaction
		this.checkMouse = function (mouseX, mouseY) 
		{
			// check if mouse is over a box
			for (var i = 0; i < boxes.length; i++) 
			{
				for (var j = 0; j < boxes[i].length; j++) 
				{
						if(boxes[i][j] != undefined)
					{
						const mouseOver = boxes[i][j].mouseOver(mouseX, mouseY);

						if (mouseOver != false) 
						{
							push();
							fill(0);
							textSize(20);
							var tWidth = textWidth(mouseOver);
							textAlign(LEFT, TOP)
							rect(mouseX, mouseY, tWidth + 20, 40);
							fill(255);
							text(mouseOver, mouseX + 10, mouseY + 10);
							pop();
							break;
						}
					}
				
				}
			}
		}
	}

	this.setup = function()
	{

		// 7 Waffle charts
		const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
			"Sunday"
		];
		// values provided by survey
		const values = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate out',
			'Skipped meal', 'Left overs'
		]

		for (var i = 0; i < days.length; i++) 
		{
			// arrange them into rows  
			if (i < 4) 
			{
				waffles.push(new Waffle(20 + (i * 220), 20, 200, 200, 8, 8, data, days[i], values));
			} 
			else 
			{
				waffles.push(new Waffle(120 + (i-4) * 220, 240, 200, 200, 8, 8, data, days[i], values));
			}
		}
	}

	this.drawTitle = function() 
		{
			 fill(0);
       		 stroke(0);
			 textAlign(LEFT);
			 textSize(18);
			 text(this.title, 200, 500); // Title
		};

	this.draw = function()
	{
		for(var i = 0; i <  waffles.length; i++)
		{
			waffles[i].draw();
			this.drawTitle();
		}
		for(var i = 0; i < waffles.length; i++)
		{
			waffles[i].checkMouse(mouseX, mouseY);
		}
	}
}

/* I learned and copied this extension from a 
   '6.206 Extending the data visualiser: building the waffle charts' video in week 11
    and also copied its CSV file */
   //However I merged the Waffle charts file into my main file by myself & also drew a title
   //Box function is in helper-functions.js file