// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This servo module demo turns the servo around
1/10 of its full rotation  every 500ms, then
resets it after 10 turns, reading out position
to the console at each movement.
*********************************************/

// var tessel = require('tessel');
// var servolib = require('servo-pca9685');

// var servo = servolib.use(tessel.port['B']);

// var servo1 = 1; // We have a servo plugged in at position 1
// var servo2  = 2;

// servo.on('ready', function () {
//   var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).

//   //  Set the minimum and maximum duty cycle for servo 1.
//   //  If the servo doesn't move to its full extent or stalls out
//   //  and gets hot, try tuning these values (0.05 and 0.12).
//   //  Moving them towards each other = less movement range
//   //  Moving them apart = more range, more likely to stall and burn out
//   servo.configure(servo1, 0.1, 0.25, function () {
//     setInterval(function () {
//       console.log('Position (in range 0-1):', position);
//       //  Set servo #1 to position pos.
//       servo.move(servo1, 0);

//       // Increment by 10% (~18 deg for a normal servo)
//       position += 0.1;
//       // if (position > 1) {
//       //   position = 0; // Reset servo position
//       // }
//     }, 100); // Every 500 milliseconds

//   servo.configure(servo2, 0.1, 0.25, function () {
//     setInterval(function () {
//       console.log('Position (in range 0-1):', position);
//       //  Set servo #1 to position pos.
//       servo.move(servo2, position);

//       // Increment by 10% (~18 deg for a normal servo)
//       position += 0.1;
//       // if (position > 1) {
//       //   position = 0; // Reset servo position
//       // }
//     }, 100); // Every 500 milliseconds
//   });
// });
// });




var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);
var async = require('async');
var tessel = require('tessel');
var servolib = require('servo-pca9685');

//Initialize the accelerometer.
accel.on('ready', function () {
// Stream accelerometer data

  accel.on('data', function (xyz) {
    console.log('x:', xyz[0].toFixed(2),
      'y:', xyz[1].toFixed(2),
      'z:', xyz[2].toFixed(2));
    if (xyz[0] > .07 && xyz[1] > 0.1) {
      console.log('We MOVED!!')
      functionToRun();
      //setTimeout(functionToRun, 5000);
    }
  });

});

accel.on('error', function(err){

  console.log('Error:', err);
});


let functionToRun = function() {

};

var servo = servolib.use(tessel.port['B']);
var servoNumber = 1; // Plug your servo or motor controller into port 1

var movements = [];
var step = 0.02;
var delay = 50;
for (i = 0; i <= 1; i += step) movements.push(i);


servo.on('ready', function () {
  console.log('Have we made it here yet?');
  servo.configure(servoNumber, 0.05, 0.12, function () {
  // runSmoothMotion();
  functionToRun = runSmoothMotion
  });
});


function runSmoothMotion() {
  async.eachSeries(movements, function(movement, callback) {
    servo.move(servoNumber, movement, function(err) {
      if (err) console.error(err);
      setTimeout(function() {
        callback();
      }, delay);
    });
  }, function() {
    servo.move(servoNumber, 0, function() {
      runSmoothMotion();
    });
  });
}

