const { model ,Schema } = require('mongoose');

var ScheduleSchema = new Schema({
_id:String,
general:{type:Object, default: {prefix:"#"}},
commands: {
enabled: {type: String, default: true},
 profile: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
},
 user: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'} 
}
},     
 avatar: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
},  
 server: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
}, 
 daily: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
}, 
 rep: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled:'true'}
}
}, 
 credits: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'} 
}
},     
 ping: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
},
ban: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
},
unban: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
},
kick: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
},
mute: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
}, 
unmute: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
},
clear: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
},
lock: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
},
unlock: { type: Object, 
          default:{
    "aliases": [],
    "status": {disabled: 'true'}
}
},       
},
welcome_settings:{
    type: Object, 
  default:{
    channel:null,
    imagex:40,
    imagey:67,
    imagesx:29.3,
    imagesy:26.4,
    textx: 204,
    texty: 123,
    textsx:68,
    textsy:65,
    texts:24,
    imageurl:null,
    stagewidth:500,
    stageheight:250,
    icontype:"circle",
    textarea:"welcome to our server",
    textcolor:"#ffffff",
    textalign:"center"
}
}
});
module.exports = model('guild',ScheduleSchema);