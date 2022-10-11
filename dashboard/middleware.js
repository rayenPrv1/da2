const AuthClient = require('./auth-client'),
      utils = require('./utils');

var bot = require('./../server');
module.exports.setUser = async (req, res, next) => {
  res.locals.utils = utils; 
  try {
    const key = res.cookies.get('key')
     
    if (key) {
      const  authUser  = await AuthClient.getUser(key).catch(console.error)
if(authUser){
      res.locals.user = authUser;
}
    }
  } finally {
    return next();
  }
};
module.exports.validateUser = async (req, res, next) => {
var guilds = bot.guilds.cache.size
var members = bot.users.cache.size
  return (res.locals.user)
    ? next()
    : res.render("home",{guilds:{size:guilds},members:{size:members}})   
};
