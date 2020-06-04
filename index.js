
// this script constructs a 'timeline' - an array of structures where each
// structure references a 'plugin' that will be run, in that order

// which plugins we can call were loaded on the index.html page
// jspsych has lots of pre-defined plugins
// for this one, i made one called 'jspsych-evan-example', in the evan plugins folder
// this has the name 'evan-twostim-choice'

var timeline = [];

var full_screen = { // this plugin will prompt the full screen
  type: 'fullscreen',
  fullscreen_mode: true
};
timeline.push(full_screen)

/* define instructions trial */
var instructions = {
  // there's multiple plugins for displaying instructions, for my task i use one where i show powerpoint slides
  //  it uses the jspsych instruction plugin
  type: "html-keyboard-response",
  stimulus: "<p>In this experiment, you'll choose between which of two slot machines " +
      "to play.</p><p> Both slot machines have some chance at providing a reward. " +
      "<p>Try to learn which slot machine is the most rewarding so you can get as many rewards as you can. </p> " +
      "<div style='width: 700px;'>"+
      "</div>"+
      "<p>Press any key to begin.</p>",
  post_trial_gap: 1000
};
timeline.push(instructions)


// give path to choice images
var choice_images = ["Stimuli/Evan_Stimuli/Banana.png",
                  "Stimuli/Evan_Stimuli/House.png",
                ];

// function to sample from normal distribution
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve/36481059#36481059
var randn_bm = function() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}

// set mean for either choice
var c1_mean = 40;
var c2_mean = 50;

var sd = 8;
 // define 10 of these trials and push them onto the array.
n_choice_trials = 10;

// loop through each choice trial and push it to the array
for (var i = 0; i < n_choice_trials; i++){
  var choice_trial = { // this calls the plugin that i made in - jspsych-evan-explugin.js
    type: 'evan-two-stim-choice',
    c1_image: choice_images[0],
    c2_image: choice_images[1],
    c1_reward: Math.round(c1_mean + sd*randn_bm()),
    c2_reward: Math.round(c2_mean + sd*randn_bm())
  }
  timeline.push(choice_trial);
}

//  run the exmperiment, do a local save of the results.
jsPsych.init({
    timeline: timeline,
    show_preload_progress_bar: false,
    on_finish: function() {
      jsPsych.data.get().localSave('csv','results.csv');
  }
});
