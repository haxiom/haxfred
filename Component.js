function Component(haxfred) {
   haxfred.on('baz', function(times,deferred) {
      console.log('1 init:', times);

      //function async() {
      //   promise.resolve();
      //}
      console.log("1 Resolved:", times);
      deferred.resolve('from 1');
   });
}

module.exports = Component;
