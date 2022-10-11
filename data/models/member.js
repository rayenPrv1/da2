const { model } = require('mongoose');

class GeneralModule {
    credits = '0';
    rep ='0';
    lastrep='0'
    lastdaily='0'
}

class profile {
    background="https://probot.media/store/default.png"
}

class level {
    lvl=1;
    xp=0;
    totalxp=0;
}

module.exports = model('user', {
        _id: String,
        data: { type: Object, default: new GeneralModule() },
        profile:{type:Object,default: new profile()},
        level:{type:Object,default: new level()}
});