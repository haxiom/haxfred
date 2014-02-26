module.exports = function (bot) {
  bot.prop = 'new';

  if (bot.register) {
    bot.register('pm',/hello/, function (context) {
      return "Hey there!" + context.sender;
    });
  }
};
