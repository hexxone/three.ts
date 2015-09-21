/**
 * @author simonThiele / https://github.com/simonThiele
 */

module( "Clock" );

function mockPerformance() {
  self.performance = {
    deltaTime: 0,

    next: function( delta ) {
      this.deltaTime += delta;
    },

    now: function() {
      return this.deltaTime;
    }
  };
}

test( "clock with performance", function() {
  mockPerformance();

  var clock = new THREE.Clock();

  clock.start();

  self.performance.next(123);
  ok( clock.getElapsedTime() === 0.123 , "okay");

  self.performance.next(100);
  ok( clock.getElapsedTime() === 0.223 , "okay");

  clock.stop();

  self.performance.next(1000);
  ok( clock.getElapsedTime() === 0.223 , "don't update time if the clock was stopped");
});

test( "clock with date", function() {
  // remove the performance object so that clock takes Date()
  self.performance = undefined;

  var clock = new THREE.Clock();

  clock.start();

  // if a value was calculated, the clock took the alternative Date() object
  ok( clock.getElapsedTime() >= 0 , "okay");

  clock.stop();
});
