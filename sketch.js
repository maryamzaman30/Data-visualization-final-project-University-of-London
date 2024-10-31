
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() 
{
  // Create a canvas to fill the content div from index.html.
  const c = createCanvas(1024, 576);
  c.parent('app');

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
  gallery.addVisual(new UKFoodAttitudes());
  gallery.addVisual(new NutrientsTimeSeries());
  gallery.addVisual(new NYTempTimeSeries());
  gallery.addVisual(new EducationLevel());
  gallery.addVisual(new WaffleChart());
  gallery.addVisual(new ColoringDangers());
  gallery.addVisual(new populationPakistan());
  gallery.addVisual(new HappiestCountries2023());
  gallery.addVisual(new FoodPurchases());
}

// Draw function to draw the visual on the page
function draw() 
{
  let start = millis(); // For Manual Profiling (STABILITY TESTING)

  background(255);
  // Check if a visual has been selected in the gallery
  if (gallery.selectedVisual != null) 
  {
    // If a visual has been selected, call its draw method to draw it on the page
    gallery.selectedVisual.draw();
  }

  //////////////////////STABILITY TESTING///////////////////////////////

  // Manual Profiling: to measure how long a piece of code takes to run
  let end = millis();
  let elapsed = end - start;
  console.log("This took: " + elapsed + "ms.");
  /* Result: All the extensions run smoothly between 0-5 milliseconds but
     sometimes 'waffle charts' & 'Nutrients: 1974-2016' takes more than 5 ms,
     especially after it is switched continuously between different visualizations 
     then it slows down.
     Longest time taken by (especially after switching to different visualization);
    -Waffle charts; 20 ms
    -Nutrients: 1974-2016; 9 ms
  */ 

  // Frames Per Second (FPS): to measure the number of frames per second (FPS) program can render.
  // Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
  let fps = frameRate();
  push();
  fill(0);
  textAlign(LEFT, BASELINE)
  stroke(0);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
  pop();
  /* Result: all the sketches are rendering smoothly & efficiently between 60-59
     Except for waffle charts that renders at moderate speed somewhere between 
     30-40, when continuously switching between different visualizations, FPS
     value decreases & waffle charts slows down */
}

/* Stability testing code source; 
   2.i.Frames Per Second (FPS): https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#frames-per-second-fps
   2.ii.Manual Profiling: https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#manual-profiling   
*/