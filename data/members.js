const SavedGuild = require('./models/member');
//SavedGuild.collection.drop();

module.exports = new class {
    async get({ id }) {        
        return await SavedGuild.findById(id)
            || await new SavedGuild({ _id: id }).save();
    }
    async arr(){
   var bar = await SavedGuild.collection.find().toArray()

return bar
    }
}