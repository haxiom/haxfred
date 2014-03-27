function Component(haxfred) {
   haxfred.on('baz', function(times) {
      console.log('times:', event.data.times);

      function async() {
         promise.resolve();
      }
   });
}

module.exports = Component;
