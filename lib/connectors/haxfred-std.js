module.exports = function (bot) {
  function initialize () {
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function (chunk) {
      console.log('foo');
      var chunk = process.stdin.read();
      var output = bot.router.route('pm', chunk);

      if (output) {
        process.stdout.write(output);
      }
    });
  }

  bot.on('connect', initialize);
}
