const client = require('../server'),
guilds = require('../data/guilds'),
users = require('../data/members');
const canvas = require("canvas")
const Discord = require('discord.js');
const Konva = require("konva-node")
const { Image } = require('canvas')
const invites = {};
const humanizeDuration = require('humanize-duration');
const e = require('express');
const wait = require('util').promisify(setTimeout);
client.on('ready', async () => {
  await wait(1000);
  client.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});
client.on('message', message => {
	if (message.content.startsWith('!join')) {
const member = message.mentions.members.first() ? message.mentions.members.first() : message.member
		client.emit('guildMemberAdd',  member);
	}
});
client.on('guildMemberAdd', async member => {
const guild = client.guilds.cache.get(member.guild.id); 
  const savedGuild = await guilds.get(guild);
	const channel = member.guild.channels.cache.find(ch => ch.id === savedGuild.welcome_settings.channel);
if(!channel)return
 let stage = new Konva.Stage({
width: +(savedGuild.welcome_settings.stagewidth),
height: +(savedGuild.welcome_settings.stageheight)
})
let layer = new Konva.Layer()
stage.add(layer);
var background = new Konva.Image({
width:stage.width(),
height:stage.height(),
})
if(savedGuild.welcome_settings.imageurl != ""){
const backround = await canvas.loadImage(savedGuild.welcome_settings.imageurl);
background.image(backround)
}
var b = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
const img = await canvas.loadImage(b);
	const Canvas = canvas.createCanvas(256, 256);
	const ctx = Canvas.getContext('2d');
if(savedGuild.welcome_settings.icontype ==="circle"){
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI* 2 , true);
    ctx.closePath();
    ctx.clip();}
ctx.drawImage(img, 0, 0, Canvas.width, Canvas.height);
var imge = new Image()
imge.src = Canvas.toDataURL()
var circle = new Konva.Image({
      x: +(savedGuild.welcome_settings.imagex),
      y: +(savedGuild.welcome_settings.imagey),
  scaleX:+(savedGuild.welcome_settings.imagesx)/50,
  scaleY:+(savedGuild.welcome_settings.imagesy)/50,
image:imge
})
 const name = member.displayName.length > 10 ? member.displayName.substring(0, 7) + "..." : member.displayName;
 let text = new Konva.Text({
        x:+(savedGuild.welcome_settings.textx),
        y:+(savedGuild.welcome_settings.texty),
        fill:savedGuild.welcome_settings.textcolor,
        fontSize:+(savedGuild.welcome_settings.texts),
        name:"text",
        scaleX:+(savedGuild.welcome_settings.textsx)/50,
        scaleY:+(savedGuild.welcome_settings.textsy)/50,
        text:name,
        fontFamily:'Open Sans,sans-serif',
        shadowOffset: { x: 1, y: 2 },
        shadowColor: "black",
        fontStyle:"bold"
})
layer.add(background)
layer.add(circle)
layer.add(text);
layer.draw()
  var dataURL = layer.getCanvas()._canvas.toBuffer();
	const attachment = new Discord.MessageAttachment(dataURL, 'welcome-image.png');
  var textarea = savedGuild.welcome_settings.textarea
member.guild.fetchInvites().then(guildInvites => {
const ei = invites[member.guild.id];
invites[member.guild.id] = guildInvites;
const invitecounter = []
const userinvites = []
const username =[]
guildInvites.forEach((i)=>{
if(ei.get(i.code).uses<i.uses){
var inviter = i.inviter
var invites = i.uses
invitecounter.push(inviter)
userinvites.push(invites)
username.push(inviter.username)
}
});
if(invitecounter.length==0){
var inviter = member.guild.owner
var invitesx = "0"
invitecounter.push(inviter)
userinvites.push(invitesx)
username.push(inviter.user.username)
}
channel.send(`${textarea.replace("[server]",member.guild.name).replace("[memberCount]",member.guild.memberCount).replace("[user]",member).replace("[userName]",member.displayName).replace("[inviter]",invitecounter).replace("[invites]",userinvites).replace("[inviterName]",username)}`, attachment);
});
})
//**************************************** */

async function getrank(id){
const saveduser = await users.arr()
  var top100 = saveduser.sort((a,b) =>parseFloat(b.level.totalxp) - parseFloat(a.level.totalxp))
var i = 1
var arr = top100.map((b)=>({id:b._id,rank:i++}))
var member =arr.find(m=>m.id == id)
return member.rank
}
/*profile */

/********************** */
client.on("message", async (message)  => {
  if(message.author.bot || !message.channel.guild) return;
  if (message.guild) {
var id = message.author.id
const saveduser = await users.get({id})
var xp = Number(saveduser.level.xp)
var totalxp =Number(saveduser.level.totalxp)
    var addnew =  Math.round(Math.random() * 5 + 1);
var addxp = ( xp + addnew)
var newtotal = ( totalxp + addnew) 
saveduser["level"] = {xp:addxp,lvl:saveduser.level.lvl,totalxp:newtotal}
 await saveduser.save()
const curLevel = Math.floor(0.1 * Math.sqrt(saveduser.level.xp));
if (saveduser.level.lvl < curLevel) {
saveduser["level"] = {xp:0,lvl:curLevel,totalxp:saveduser.level.totalxp}
await saveduser.save()
    }
  }
  const guild = client.guilds.cache.get(message.guild.id); 
  const savedGuild = await guilds.get(guild);
        if(savedGuild.commands.enabled == 'false') return
    if (message.content.startsWith( savedGuild.general.prefix + "ping")||savedGuild.commands.ping.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0].toLowerCase())) {
            if(savedGuild.commands.ping.status.disabled == 'false') return
message.channel.send("ping is being calculated...").then((msg) => {
  const ping = msg.createdTimestamp - message.createdTimestamp;
  msg.edit(`${ping} ms`);
});  
}
  if (message.content.startsWith( savedGuild.general.prefix + "profile")||savedGuild.commands.profile.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0].toLowerCase())) {
        if(savedGuild.commands.profile.status.disabled == 'false') return
message.channel.startTyping();
var mentionned = message.mentions.users.first();
var mention; mentionned ?  mention = mentionned : mention = message.author
if(mention.bot) return
    const Canvas = canvas.createCanvas(400, 400);
    var ctx = Canvas.getContext("2d");
    var id =  mention.id
   var savedmember = await users.get({id})
    const backround = await canvas.loadImage(savedmember.profile.background);
    const avatar = await canvas.loadImage(mention.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
    const b0 = await canvas.loadImage("https://cdn.discordapp.com/attachments/819530298119290920/835473833309372437/welcome-image.png")
    const bc = await canvas.loadImage("https://cdn.discordapp.com/attachments/835311974752845835/835312007850360882/1_2.png")
    const bc1 = await canvas.loadImage("https://cdn.discordapp.com/attachments/819530298119290920/835505275607842876/2_5.png");
    const bc2 = await canvas.loadImage("https://cdn.discordapp.com/attachments/835311974752845835/835312017153458216/3_1.png");
    const bc3 = await canvas.loadImage("https://cdn.discordapp.com/attachments/819530298119290920/835308060733472798/welcome-image_9.png");
    const bc4 = await canvas.loadImage(message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }))
  const username = mention.username.length > 12 ? mention.username.substring(0, 12) + "..." : mention.username;
var requirexp = (((savedmember.level.lvl+1)**2)*100)
var difference = savedmember.level.xp/requirexp ;
var difference2 = difference * 199 ; 
var rank = await getrank(mention.id)
/*--------------------------------------------------------------*/
        drawShape(0,0 );
        ctx.clip();
        ctx.drawImage(backround, 0,0 ,400, 400);
        /********************************* */
        ctx.fillStyle = "white";
        ctx.font = " bold 27px Source Sans Pro, sans-serif";
        ctx.fillText(username, 155, 80);
        ctx.font = "bold 16px Source Sans Pro, sans-serif";
        ctx.fillText("LVL", 24, 160);
        ctx.font = "bold 14px Source Sans Pro, sans-serif";
        ctx.fillText("REP", 24, 220);
        ctx.font = "bold 11px Source Sans Pro, sans-serif";
        ctx.fillText("CREDITS", 24, 280);
        ctx.font = "bold 12px Source Sans Pro, sans-serif";
        ctx.fillText("RANK", 24, 340);
        ctx.font = "bold 11px Source Sans Pro, sans-serif";
        ctx.fillText("TOTAL XP:", 219, 352);

     /********************************************************/
        ctx.font = "bold 25px Fjalla One, sans-serif";
        ctx.fillText(savedmember.level.lvl, 27, 187);
        ctx.font = "bold 27px Fjalla One, sans-serif";
        ctx.fillText(`+${savedmember.data.rep}`, 26, 246);
        ctx.font = "bold 19px Fjalla One, sans-serif";
        ctx.fillText(`${savedmember.data.credits}`, 26, 300);
        ctx.font = "bold 19px Fjalla One, sans-serif";
        ctx.fillText(rank, 26, 360);
        ctx.font = "bold 11px Fjalla One, sans-serif";
        ctx.fillText(savedmember.level.totalxp, 283, 352);

        /******************************** */
        ctx.drawImage(bc4, 195,5 ,30, 30);
        ctx.drawImage(b0, 0,0 ,400, 400);
        ctx.drawImage(bc3, 0,0 ,400, 400);
        ctx.drawImage(bc, 0,0 ,400, 400);
        ctx.drawImage(bc1, 0,0 ,400, 400);
        ctx.drawImage(bc2, 0,0 ,400, 400);
       
   draw2(0,0)
   ctx.clip()
   ctx.fillStyle = '#cdcdcd';
   ctx.fillRect(163,317,200,20) 
   ctx.fillStyle = '#37393d';
   ctx.fillRect(163,317,difference2,20)//100 is the level
   ctx.fillStyle = "white";
   ctx.font = "14px Fjalla One, sans-serif";
   ctx.fillText(`${savedmember.level.xp} / ${requirexp}`, 230, 332);
   ctx.drawImage(avatar, 10,4,130, 130);
      
        const attachment = new Discord.MessageAttachment(Canvas.toBuffer(), 'profile.png');
      await  message.channel.send(attachment)
message.channel.stopTyping()
    function drawShape( xoff, yoff) {
      ctx.beginPath();
      ctx.arc(210, 20, 15, 0, Math.PI* 2 , true);
      ctx.moveTo(0 + xoff, 122 + yoff);
      ctx.bezierCurveTo(0 + xoff, 137 + yoff, 0 + xoff, 363 + yoff, 0 + xoff, 384 + yoff);
      ctx.bezierCurveTo(0 + xoff, 403 + yoff, 19 + xoff, 399 + yoff, 18 + xoff, 399 + yoff);
      ctx.bezierCurveTo(17 + xoff, 399 + yoff, 368 + xoff, 401 + yoff, 381 + xoff, 401 + yoff);
      ctx.bezierCurveTo(399 + xoff, 401 + yoff, 400 + xoff, 394 + yoff, 400 + xoff, 378 + yoff);
      ctx.bezierCurveTo(400 + xoff, 363 + yoff, 400 + xoff, 34 + yoff, 400 + xoff, 19 + yoff);
      ctx.bezierCurveTo(400 + xoff, 2 + yoff, 395 + xoff, 0 + yoff, 377 + xoff, 0 + yoff);
      ctx.bezierCurveTo(362 + xoff, 0 + yoff, 270 + xoff, -1 + yoff, 250 + xoff, 0 + yoff);
      ctx.bezierCurveTo(235 + xoff, 1 + yoff, 235 + xoff, 7 + yoff, 235 + xoff, 14 + yoff);
      ctx.bezierCurveTo(234 + xoff, 30 + yoff, 231 + xoff, 55 + yoff, 174 + xoff, 30 + yoff);
      ctx.bezierCurveTo(153 + xoff, 21 + yoff, 137 + xoff, 40 + yoff, 137 + xoff, 40 + yoff);
      ctx.bezierCurveTo(131 + xoff, 29 + yoff, 118 + xoff, 8 + yoff, 89 + xoff, 4 + yoff);
      ctx.bezierCurveTo(74 + xoff, 2 + yoff, 55 + xoff, 4 + yoff, 36 + xoff, 21 + yoff);
      ctx.bezierCurveTo(27 + xoff, 29 + yoff, 19 + xoff, 43 + yoff, 18 + xoff, 62 + yoff);
      ctx.bezierCurveTo(17 + xoff, 81 + yoff, 25 + xoff, 94 + yoff, 26 + xoff, 95 + yoff);
      ctx.bezierCurveTo(27 + xoff, 96 + yoff, 3 + xoff, 86 + yoff, 0 + xoff, 122 + yoff);
     ctx.closePath();
    }
    function draw2( xoff, yoff) {
      ctx.beginPath();
      ctx.arc(79.5, 64.5, 60, 0, Math.PI* 2 , true);
      ctx.lineWidth=3;
      ctx.strokeStyle = "#9ea9b1";
      ctx.stroke();
      ctx.moveTo(176 + xoff, 319 + yoff);
      ctx.bezierCurveTo(166 + xoff, 318 + yoff, 165 + xoff, 335 + yoff, 176 + xoff, 335 + yoff);
      ctx.bezierCurveTo(189 + xoff, 335 + yoff, 341 + xoff, 335 + yoff, 349 + xoff, 335 + yoff);
      ctx.bezierCurveTo(363 + xoff, 335 + yoff, 363 + xoff, 319 + yoff, 349 + xoff, 319 + yoff);
      ctx.bezierCurveTo(341 + xoff, 319 + yoff, 191 + xoff, 319 + yoff, 176 + xoff, 319 + yoff);
      ctx.lineWidth=4;
      ctx.strokeStyle = "#cdcdcd";
      ctx.stroke();
      ctx.closePath();
}
    
  }
 if (message.content.startsWith(savedGuild.general.prefix + "rep")||savedGuild.commands.rep.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0].toLowerCase())) {
if(savedGuild.commands.rep.status.disabled == 'false') return
var mentionned = message.mentions.users.first();
var mention;
if (mentionned) {
var mention = mentionned;
} else return message.channel.send(`**:rolling_eyes: |  ${message.author.username}**, the user could not be found.`)
if(mention.bot) return message.channel.send(`**🤖   ${message.author.username}**, bots do not have ranks!`);
if(mention.id == message.author.id) return message.channel.send(`**:rolling_eyes: |  ${message.author.username}**, the user could not be found.`);
var id = message.author.id
var savedmember2 = await users.get({id})
const remaining = humanizeDuration(savedmember2.data.lastrep - Date.now(),{ units: ['h','m','s'], round: true,conjunction: " and " });
if(savedmember2.data.lastrep - Date.now() > 1) return message.channel.send(`**:stopwatch: ${message.author.username}, you can award more reputation in ${remaining}.**`)
var id = mention.id 
var savedmember = await users.get({id})
savedmember["data"] = {credits:savedmember.data.credits, rep: `${+(+savedmember.data.rep) + (1) }`,lastrep: savedmember.data.lastrep}
savedmember2["data"] = {credits:savedmember2.data.credits, rep: savedmember2.data.rep,lastrep: Date.now() +86400000}
await savedmember2.save();
await savedmember.save();
message.channel.send(`**:up: ${message.author.username} has given ${mention} a reputation point!**`)
}
  if (message.content.startsWith( savedGuild.general.prefix + "daily")||savedGuild.commands.daily.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0].toLowerCase())) {
           if(savedGuild.commands.daily.status.disabled == 'false') return
 var credits = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
    var id =  message.author.id
   var savedmember = await users.get({id})
   const remaining = humanizeDuration(savedmember.data.lastdaily - Date.now(),{ units: ['h','m','s'], round: true,conjunction: " and " });
   if(savedmember.data.lastdaily - Date.now() > 1) return message.channel.send(`**:rolling_eyes: ${message.author.username}, your daily credits refreshes in ${remaining} . **`)
   savedmember["data"] = { credits: `${+(+savedmember.data.credits) + (+credits)}`,lastdaily:Date.now() +86400000,rep:savedmember.data.rep,lastrep:savedmember.data.lastrep}
   await savedmember.save();
   message.channel.send(`** :moneybag: ${message.author.username}, you got :dollar: ${credits} daily credits!**`)
  }
  if (message.content.startsWith( savedGuild.general.prefix + "credits")||savedGuild.commands.credits.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0].toLowerCase())) {
    if(savedGuild.commands.credits.status.disabled == 'false') return
     if(message.author.bot || !message.channel.guild) return;
    var args =  message.content.split(/ +/);
    var mentionned = message.mentions.users.first();
   var mention;
   if (mentionned) {
   var mention = mentionned;
if(mention.bot) return message.channel.send(`**🤖   ${message.author.username}**, bots do not have ranks!`);
if(mention.id == message.author.id) return 
   if(!args[2]){
    var id = mention.id
    var savedmember1 = await users.get({id})
    message.channel.send(`** ${mention.username} :credit_card: balance is \`\`$${savedmember1.data.credits}\`\`.**`)   

   }
    if(args[2]){
    if(isNaN(args[2])){
      message.channel.send( `**:interrobang: | ${message.author.username}, type the credit you need to transfer!**`)	
    }else if(args[2] != parseInt(args[2])){
message.channel.send( `**:interrobang: | ${message.author.username}, type the credit you need to transfer!**`)	
}  else  {
      var id = mention.id
      var savedmember1 = await users.get({id})
      var id = message.author.id
      var savedmember2 = await users.get({id})
if(savedmember2.data.credits < +(args[2])) return message.channel.send(`**:thinking: | ${message.author.username}, Your balance is not enough for that!**`)
//crditstranfer
var credits1 = parseInt(args[2])
var credits2 = parseInt(credits1 -  ((credits1 * 5) / 100).toFixed(0))
var captcha = Math.floor(1000 + Math.random() * 9000);
function randomColor(){
    var r = Math.floor(Math.random()*300);
    var g = Math.floor(Math.random()*256);
    var b = Math.floor(Math.random()*100);
    return "rgb("+ r + "," + g + "," + b +")";
}
function texter(str, x, y){
    for(var i = 0; i <= str.length; ++i){
        var ch = str.charAt(i);
        ctx.fillStyle = randomColor();
        ctx.font = "25px Fjalla One, sans-serif";
        ctx.fillText(ch, x, y);
        x += ctx.measureText(ch).width;
    }}
const Canvas = canvas.createCanvas(89, 40);
var ctx = Canvas.getContext("2d");
   ctx.fillStyle = '#36393f';
   ctx.fillRect(0,0,89,40)
   ctx.fillStyle = "white";
   texter(captcha.toString(), 12, 30);
   ctx.fillStyle = '#485b90';
   ctx.fillRect(12.5,20,65,2)
  const attachment = new Discord.MessageAttachment(Canvas.toBuffer(), 'captcha.png');
var msg = await message.channel.send(`** ${message.author.username}, Transfer Fees: \`${((credits1 * 5) / 100).toFixed(0)}\`, Amount :\`$${credits2}\` **
  type these numbers to confirm :`,attachment)
let filter =	message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 10000, errors: ['time'] }).then(async collected => {
if(collected.first().toString()!= captcha.toString()) return msg.delete()
msg.delete()
collected.first().delete();
savedmember1["data"] = { credits: `${+(+savedmember1.data.credits) + (+credits2)}`,lastdaily:savedmember1.data.lastdaily,rep:savedmember1.data.rep,lastrep:savedmember1.data.lastrep}
savedmember2["data"] = { credits: `${+(+savedmember2.data.credits) - (+credits1)}`,lastdaily:savedmember2.data.lastdaily,rep:savedmember2.data.rep,lastrep:savedmember2.data.lastrep}
await savedmember1.save();
await savedmember2.save();
message.channel.send(`**:moneybag: | ${message.author.username}, has transferred \`\`$${credits2}\`\` to ${mention} **`)
mention.send(`:atm:  |  Transfer Receipt 
\`\`\`You have received $${credits2} from user ${mention.username} (ID: ${mention.id})
Reason: No reason provided \`\`\``).catch(e=>{})
		}).catch(collected=>{
return msg.delete()
})

    }
  }
} else{
  var id = message.author.id
   var savedmember = await users.get({id})
   message.channel.send(`** :bank: ${message.author.username}, your account balance is \`\`$${savedmember.data.credits}\`\`.**`)
}
}

if(message.content.startsWith(savedGuild.general.prefix+ "user")||savedGuild.commands.user.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0])){
           if(savedGuild.commands.user.status.disabled == 'false') return
var mentionned = message.mentions.members.first();
var mention; mentionned ?  mention = mentionned : mention = message.author
var user = message.guild.member(mention)
      var embed = new Discord.MessageEmbed()
      .setColor ("RANDOM")
      .setThumbnail (mention.displayAvatarURL())
      .addField ("Joined Discord :",`\`${require ('moment')(mention.createdAt).format("D/M/YYYY h:mm")}\`
**${require ('moment')(mention.createdAt).fromNow()}**`,true)
      .addField ("Joined Server :", `\`${require ('moment')(user.joinedAt).format("D/M/YYYY h:mm")}\`
**${require ('moment')(user.joinedAt).fromNow()}**`,true)
    	.setFooter(mention.tag, mention.displayAvatarURL());
      message.channel.send(embed);
  }
if(message.content.startsWith(savedGuild.general.prefix+ "avatar")||savedGuild.commands.avatar.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0])){
if(savedGuild.commands.avatar.disabled == 'false') return
  var mentionned = message.mentions.users.first();
   var mention; mentionned ?  mention = mentionned : mention = message.author
    var embed = new Discord.MessageEmbed()
  	.setAuthor(mention.tag, mention.displayAvatarURL())
    .setImage (mention.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setTitle("Avatar Link")
    .setURL (mention.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter("Requested by "+mention.tag, mention.displayAvatarURL());
    message.channel.send(embed);
  }
if(message.content.startsWith(savedGuild.general.prefix+ "ban")||savedGuild.commands.ban.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0])){
  if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(`**:rolling_eyes: -  i don't have Permission :sparkles:.**`);
  var args =  message.content.split(/ +/);
const mention = message.mentions.members.first()|| message.guild.members.cache.get(args[1]);
if (!mention) return message.channel.send(`**:rolling_eyes: - I can't find this member**`);
if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(`:rolling_eyes: -  You don't have Permission to ban @${mention.displayName} :sparkles:.`);
   if(mention.id === message.author.id) return message.channel.send(' you can\'t ban yourself!');
if(mention.roles.highest.position >= message.member.roles.highest.position ) return message.channel.send(`**:rolling_eyes: -  you don't have Permission to ban @${mention.displayName} :sparkles:.**`);
if( mention.roles.highest.position>=  message.guild.me.roles.highest.position) return message.channel.send(`**:rolling_eyes: -  i don't have Permission to ban @${mention.displayName} :sparkles:.**`);
    let reason = args.slice(2).join(" ")
    if (!reason) reason = '`None Provided`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
var ban = await mention.ban({reason: reason,time: 7}).catch(e =>{ console.log(e)});
ban ? message.channel.send(`**:white_check_mark: ${mention.displayName} banned from the server! :airplane:**`).catch(b => {}) : message.channel.send(`**:rolling_eyes: -  i don't have Permission to ban @${mention.displayName} :sparkles:.**`)
}
if(message.content.startsWith(savedGuild.general.prefix+ "unban")||savedGuild.commands.unban.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0])){
  if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(`**${message.author.username}**, You do not have Permission to unban mambers`)
  if(!message.guild.me.hasPermission("BAN_MEMBERS"))  return message.channel.send(`** I do not have Permission to unban mambers`)
     var args =  message.content.split(/ +/);
if(!args[1])return
let userID = args[1]
      message.guild.fetchBans().then(bans=> {
      if(bans.size == 0) return 
      let bUser = bans.find(b => b.user.id == userID)
      if(!bUser) return message.channel.send(`**:rolling_eyes: - I can't find ${userID} in the ban list**`)
      message.guild.members.unban(bUser.user)
      message.channel.send(`**:white_check_mark: ${bUser.user.username} unbanned!**`)
})   
}

if(message.content.startsWith(savedGuild.general.prefix+ "kick")||savedGuild.commands.kick.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0])){
    if(savedGuild.commands.kick.status.disabled == 'false') return
 if(!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(`**${message.author.username}**, You do not have Permission to kick mambers`)
  if(!message.guild.me.hasPermission("KICK_MEMBERS"))  return message.channel.send(`** I do not have Permission to kick mambers`)
     var args =  message.content.split(/ +/);
const mention = message.mentions.members.first()|| message.guild.members.cache.get(args[1]);
if (!mention) return message.channel.send(`**:rolling_eyes: - I can't find this member**`);
   if(mention.id === message.author.id) return message.channel.send(`**:rolling_eyes: -  You can't kick @${message.author.username}. **`);
if(mention.roles.highest.position >= message.member.roles.highest.position ) return message.channel.send(`**:rolling_eyes: -  you don't have Permission to kick @${mention.displayName} :sparkles:.**`);
if( mention.roles.highest.position>=  message.guild.me.roles.highest.position) return message.channel.send(`**:rolling_eyes: -  i don't have Permission to kick @${mention.displayName} :sparkles:.**`);
 let reason = args.slice(2).join(" ")
    if (!reason) reason = '`None Provided`';
var kick = await mention.kick(reason).catch(b =>{});
kick ? message.channel.send(`**:white_check_mark: ${mention.displayName} kicked from the server! :airplane:**`).catch(b => {}) : message.channel.send(`**:rolling_eyes: -  i don't have Permission to kick @${mention.displayName} :sparkles:.**`)
}

if(message.content.startsWith(savedGuild.general.prefix+ "clear")||savedGuild.commands.clear.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0])){
            if(savedGuild.commands.clear.status.disabled == 'false') return
if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`** u do not have MANAGE_MESSAGES Permission `)
  if(!message.guild.me.hasPermission('MANAGE_MESSAGES'))  return message.channel.send(`** I do not have MANAGE_MESSAGES Permission `)
     var args =  message.content.split(/ +/);
if(args[1]){
if(isNaN(args[1])) return message.delete() && message.channel.bulkDelete(100)
await message.delete()
  message.channel.bulkDelete(args[1])
} else{
await message.delete() 
 message.channel.bulkDelete(100)
}
}
if(message.content.startsWith(savedGuild.general.prefix+ "mute")||savedGuild.commands.mute.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0])){
             if(savedGuild.commands.mute.status.disabled == 'false') return
 var role = message.guild.roles.cache.find((role) => role.name == 'Muted');
    if(!role)await message.guild.roles.create({ data: { name: 'Muted', permissions: [] } }) , role = message.guild.roles.cache.find((role) => role.name == 'Muted')
  var user = message.mentions.members.first();
 if(!user)return message.channel.send(`**:rolling_eyes: - I can't find this member**`);
if(user.roles.highest.position >= message.member.roles.highest.position )  return message.channel.send(`**:rolling_eyes: -  You can't mute @${user.displayName}. **`);
    message.guild.channels.cache.filter(ch=>ch.type=='text').forEach(muterole => {
        muterole.updateOverwrite(role, {
            SEND_MESSAGES: false
        });
    });
        user.roles.add(role);
     message.channel.send(`**:white_check_mark: @${user.displayName} muted from the text! :zipper_mouth:**`);
}
if(message.content.startsWith(savedGuild.general.prefix+ "unmute")||savedGuild.commands.unmute.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0])){
              if(savedGuild.commands.unmute.status.disabled == 'false') return
var role = message.guild.roles.cache.find((role) => role.name == 'Muted');
  if(!role)return
  var user = message.mentions.members.first();
  if(!user) return message.channel.send(`**:rolling_eyes: - I can't find this member**`);
if(!user.roles.cache.has(role))return message.channel.send(`**:blush: ${user.displayName} not muted.**`);
user.roles.remove(role).then(message.channel.send(`**:white_check_mark: ${user.displayName} unmuted!**`));
}

if(message.content.startsWith(savedGuild.general.prefix+ "lock")||savedGuild.commands.lock.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0])){
           if(savedGuild.commands.lock.status.disabled == 'false') return
if(!message.member.hasPermission('MANAGE_MESSAGES')) return  
           message.channel.updateOverwrite(message.guild.id, {
         SEND_MESSAGES: false
           }).then(() => {
                message.channel.send(`🔒** ${message.channel} has been locked.**`)
           });
             }
if(message.content.startsWith(savedGuild.general.prefix+ "unlock")||savedGuild.commands.unlock.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0])){
   if(savedGuild.commands.unlock.status.disabled == 'false') return
if(!message.member.hasPermission('MANAGE_MESSAGES')) return  
           message.channel.updateOverwrite(message.guild.id, {
         SEND_MESSAGES: true
           }).then(() => {
               message.channel.send(`🔓** ${message.channel} has been locked.**`)
           });
   }
if(message.content.startsWith(savedGuild.general.prefix+ "server")||savedGuild.commands.server.aliases.includes(message.content.replace(savedGuild.general.prefix,"").split(/ +/)[0])){
if(savedGuild.commands.server.status.disabled == 'false') return
var embed  = new Discord.MessageEmbed()
.setAuthor(message.guild.name, message.guild.iconURL)
.addField("**🆔 Server ID:**", message.guild.id,true)
.addField("**📅 Created On**",`${require ('moment')(message.guild.createdAt).format("D/M/YYYY h:mm")}
${require ('moment')(message.guild.createdAt).fromNow()}`,true)
.addField("**👑 Owned by**",`${message.guild.owner}`,true)
.addField(`**👥 Members(${message.guild.memberCount})**`,`**${message.guild.members.cache.filter(m => m.presence.status === 'online').size}** Online
`,true)
.addField(`**💬 Channels(${message.guild.channels.cache.filter(m => m.type != 'category').size}) **`,`**${message.guild.channels.cache.filter(m => m.type === 'text').size}** text | **${message.guild.channels.cache.filter(m => m.type === 'voice').size}** Voice `,true)
.addField("**🌍 Others **" , `**Region:** ${message.guild.region}
**Verification Level:** ${message.guild.verificationLevel}	`,true)
.addField(`**🔐 Roles(${message.guild.roles.cache.size}) **`,`To see a list with all roles use **#roles**`)
.setColor('#000000')
message.channel.send(embed)

}
})
 

