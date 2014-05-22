function Component(haxfred) {
   haxfred.on('baz', function(times,deferred) {
      console.log('3 init:', times);

      //function async() {
      //   promise.resolve();
      //}
      setTimeout(function() {
         console.log("3 Resolved:", times);
         deferred.resolve('from 3');
      },1000);
   });
}

module.exports = Component;
