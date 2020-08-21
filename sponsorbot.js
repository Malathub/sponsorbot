var colors = require('colors');



const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
var prefix = config.prefix;
const client = new Discord.Client({fetchAllMembers: true});
client.commands = new Discord.Collection();

client.login(config.token);

fs.readdir("./Commands/", (err, files) => {
    if(err) console.log(err)
    console.log(`${files.length} commands loaded`.bgRed.black);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");

    if(jsfiles.length <= 0){
        console.log("Commands not loaded")
        return;
    }

    jsfiles.forEach((f, i) => {
        let props = require(`./Commands/${f}`) 
        client.commands.set(props.help.name, props);
    })
})






client.on("ready", () => {
    console.log(
        `Connected has ${client.user.tag} \n`.bgGreen.black
        +`Client Id: ${client.user.id} \n `.bgGreen.black
        +`Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0 \n`.bgGreen.black
        +`Discord Version: ${Discord.version}`.bgGreen.black
    )

    client.user.setActivity(config.stream, {type: "STREAMING", url: "https://twitch.tv/mlk#2389"});


})


client.on("message", async message => {

    client.emit('checkMessage', message);
   
    
    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let Args = messageArray.slice(1);
    var args = message.content.substring(prefix.length).split(" ");
    let commandFile = client.commands.get(cmd.slice(prefix.length));
    if(commandFile) commandFile.run(client, message, Args, args)


                            
})
