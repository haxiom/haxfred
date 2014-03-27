var interval = null;

function Adapter(haxfred) {
   haxfred.times = haxfred.times || 0;
   interval = setInterval(function() {
      haxfred.emit('baz',haxfred.times);
      haxfred.times++;
   }, 1000);
}

module.exports = Adapter;
