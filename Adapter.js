var interval = null;

function Adapter(haxfred) {
   haxfred.times = haxfred.times || 0;
   interval = setInterval(function() {
      if (haxfred.times % 2) {
         haxfred.emit('baz', haxfred.times);
      } else {
         haxfred.emitSequential('baz', haxfred.times);
      }
      haxfred.times++;
   }, 1000);
}

module.exports = Adapter;
