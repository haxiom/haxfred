function Component2(haxfred) {
   haxfred.on('baz', function(times,deferred) {
      console.log('2 init:', times);

      //function async() {
      //   promise.resolve();
      //}
      setTimeout(function() {
         console.log("2 Resolved:", times);
         deferred.resolve('from 2');
      }, 2342);
   });
}

module.exports = Component2;
