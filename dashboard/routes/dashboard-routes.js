const { user } = require('../../server');
const AuthClient = require('../auth-client'),
      bot = require('../../server'),
      express = require('express'),
      guilds = require('../../data/guilds'),
      users = require('../../data/members'),
      { setUser, validateUser } = require('../middleware');
const router = express.Router();
const axios = require("axios")
 
async function getrank(id){
const saveduser = await users.arr()
  var top100 = saveduser.sort((a,b) =>parseFloat(b.level.totalxp) - parseFloat(a.level.totalxp))
var i = 1
var arr = top100.map((b)=>({id:b._id,rank:i++}))
var member =arr.find(ar=>ar.id == id)
return member.rank
}
router.get('/dashboard', setUser, validateUser, async (req, res) => {
  const key = req.cookies.get('key');
  const authGuilds = await AuthClient.getGuilds(key); 
  const manageableGuilds = getManageableGuilds(authGuilds);
  var id =res.locals.user._id
  var userdata = await users.get({id})
var rank = await getrank(id)
  var arr = []
  var top = (await users.arr())
  await top.forEach(b=>{
if(bot.users.cache.get(b._id)){
    arr.push({userimg:bot.users.cache.get(b._id).displayAvatarURL({ format: 'png', dynamic: true, size: 64 }),user:bot.users.cache.get(b._id).username,credits:b.data.credits})
 }
 })
  var top100 = arr.sort((a,b) =>parseFloat(b.credits) - parseFloat(a.credits)).splice(0, 100);
var arrlvl =[]
await top.forEach(b=>{
if(bot.users.cache.get(b._id)){
    arrlvl.push({userimg:bot.users.cache.get(b._id).displayAvatarURL({ format: 'png', dynamic: true, size: 64 }),user:bot.users.cache.get(b._id).username,lvl:b.level.lvl,totxp:b.level.totalxp})
 }
 })
    var top100lvl = arrlvl.sort((a,b) =>parseFloat(b.totxp) - parseFloat(a.totxp)).splice(0, 100);

  var acio =await axios.get("https://cdn.discordapp.com/attachments/819530298119290920/834809471192137798/message.json")
  var profile= acio.data
  res.render('index', {rank,profile,userdata,top100lvl:top100lvl, top100: top100, guilds: manageableGuilds });
});

router.get('/servers/:id', setUser, validateUser, async (req, res) => {
  const key = req.cookies.get('key');
var gid = req.params.id
  const authGuilds = await AuthClient.getGuilds(key);
  const manageableGuilds = getManageableGuilds(authGuilds);
   if (!manageableGuilds.some(g => g.id === req.params.id))  return res.send({"faild":"faild"});
  const guild = bot.guilds.cache.get(req.params.id); 
  if (!guild) return   res.render('addbot',{gid,guilds: manageableGuilds});
  const savedGuild = await guilds.get(guild);
  res.render('show', {gid, guilds: manageableGuilds,savedGuild,guild });
});

router.put('/servers/:id/:module', async (req, res) => {
  const { id, module } = req.params;  
  const key = req.cookies.get('key');
  const authGuilds = await AuthClient.getGuilds(key);
  if(!authGuilds) return res.send({"faild":"faild"});
  const manageableGuilds = getManageableGuilds(authGuilds);
  if (!manageableGuilds.some(g => g.id === id))return res.send({"faild":"faild"});
  const savedGuild = await guilds.get({ id });
 savedGuild[module] = req.body;
 await savedGuild.save();
  
  res.send({"sucsess":"sucsess"});
});

router.put('/user/profile', setUser, validateUser,async (req, res) => {
var id = req.body.id
const key = req.cookies.get('key');
  const authUser = await AuthClient.getUser(key);
  if(!authUser) return res.send({"faild":"faild"});
if(authUser._id != id) return res.send({"faild":"faild"});
  var me = await users.get({id}) 
  me["profile"] = req.body;
  await me.save();
res.send({"success":"success"})
 
})
//--------------------------------------
router.put('/commands/:id/:mdoule', setUser, validateUser,async (req, res) => {
const { id, mdoule } = req.params;  
const key = req.cookies.get('key');
  const authGuilds = await AuthClient.getGuilds(key);
  if(!authGuilds) return res.send({"faild":"faild"});
  const manageableGuilds = getManageableGuilds(authGuilds);
  if (!manageableGuilds.some(g => g.id === id))
    return res.send({"faild":"faild"});
  const { cmd } = req.params;  
  const guild = bot.guilds.cache.get(id); 
  const savedGuild = await guilds.get(guild);
  savedGuild.commands[mdoule] = {aliases:req.body.arr, status:{disabled:savedGuild.commands[mdoule]["status"]["disabled"]}};
  await savedGuild.save();
res.send({"success":"success"})
})

//--------------------------------------
router.put('/cmdenable/:id/:mdoule', setUser, validateUser,async (req, res) => {
const { id, mdoule } = req.params;  
const key = req.cookies.get('key');
  const authGuilds = await AuthClient.getGuilds(key);
  if(!authGuilds) return res.send({"faild":"faild"});
  const manageableGuilds = getManageableGuilds(authGuilds);
  if (!manageableGuilds.some(g => g.id === id))
    return res.send({"faild":"faild"});
  const guild = bot.guilds.cache.get(id); 
  const savedGuild = await guilds.get(guild);
  savedGuild.commands[mdoule] = {aliases:savedGuild.commands[mdoule]["aliases"],status:{disabled:req.body.data}};
  await savedGuild.save();
res.send({"success":"success"})
})
//--------------------------------------
router.put('/cmd/:id/:mdoule', setUser, validateUser,async (req, res) => {
const { id, mdoule } = req.params;  
const key = req.cookies.get('key');
  const authGuilds = await AuthClient.getGuilds(key);
  if(!authGuilds) return res.send({"faild":"faild"});
  const manageableGuilds = getManageableGuilds(authGuilds);
  if (!manageableGuilds.some(g => g.id === id))
    return res.send('errors/404');
  const guild = bot.guilds.cache.get(id); 
  const savedGuild = await guilds.get(guild);
  savedGuild.commands[mdoule] = req.body.data;
  await savedGuild.save();
res.send({"success":"success"})
})
//--------------------------------------
function getManageableGuilds(guilds) {
  const manageableGuilds = [];
  for (const id of guilds.keys()) {
    const authGuild = guilds.get(id);
    const canManage = authGuild.permissions.includes('MANAGE_GUILD'||'ADMINISTRATOR');
    if ( canManage)
      manageableGuilds.push(authGuild);
  }
  return manageableGuilds;  
}

module.exports = router;