const Discord = require("discord.js");
const config = require("../config.json")
var os = require("os");
var fs = require("fs")
var pModule = require('../pubing.js');

/* EMBED */

var embed_pubing = new Discord.MessageEmbed()
    .setTitle(`** ${config.m_AlreadyPubing_title} **`)
    .setDescription(config.m_AlreadyPubing_description)
    .setFooter(config.m_AlreadyPubing_footer)
    .setColor(config.embedColor)

var embed_token_invalid = new Discord.MessageEmbed()
    .setTitle(`** ${config.m_token_invalide_title} **`)
    .setDescription(config.m_token_invalid_description)
    .addField(`Utilisation de la commande :`, `.pub tokendevotrebot`)
    .setColor(config.embedColor)

var embed_pub_s1_stopped = new Discord.MessageEmbed()
    .setTitle(`** ${config.m_pub_s1_stopped} **`)
    .setFooter("Vous pouvez recommencer une publicité dès maintenant")
    .setColor(config.embedColor)

var embed_pub_time_stop = new Discord.MessageEmbed()
    .setTitle(`** ${config.m_pub_time_stop_title} **`)
    .setFooter(config.m_pub_time_stop_description)
    .setColor(config.embedColor)
/* _________________________________________________________ */

var newClient = {};




module.exports.run = async (client, message, args) => {
    // CHECK IF ALREADY PUBING

    if(pModule.pubing[message.channel.id] == true) return message.channel.send(embed_pubing)
    let tkn = args[0];
    newClient[message.channel.id] = new Discord.Client({fetchAllMembers: true});

    newClient[message.channel.id].login(tkn).catch(err => {message.channel.send(embed_token_invalid)})

    newClient[message.channel.id].on("ready", async () => {
        pModule.pubing[message.channel.id] = true;


        

        let server = "";

        newClient[message.channel.id].guilds.cache.forEach(guild => {
            server += `**${guild.name}** (${guild.memberCount} membres) \n`
        })

        let confirm ;
        console.log("length " + server.length)
        if(server.length >= 1500){
            
            let p = 1500 - server.length
            
            if(p < 0){
                p = p * (-1);
            }
            
            let s = p;
            console.log("soustract " + s)
            server = server.substring(0, server.length - s)
            console.log("length After " + server.length)

            confirm = await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`**Voici les serveurs où votre publicité sera envoyée (${newClient[message.channel.id].guilds.cache.size} serveurs)**`)
            .setDescription(server + " \nTrop de serveur à afficher \n " + ` \n [Cliquez ici pour inviter le bot sur un serveur](https://discord.com/oauth2/authorize?client_id=${newClient[message.channel.id].user.id}&scope=bot&permissions=0)`)
            .setColor(config.embedColor)
            .setFooter(`Vous avez 2 minutes pour valider \n Appuyez sur la croix pour annuler l'opération \n botid: ${newClient[message.channel.id].user.id}`)
        )

        } else {
            confirm = await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`**Voici les serveurs où votre publicité sera envoyée (${newClient[message.channel.id].guilds.cache.size} serveurs)**`)
            .setDescription(server + ` \n [Cliquez ici pour inviter le bot sur un serveur](https://discord.com/oauth2/authorize?client_id=${newClient[message.channel.id].user.id}&scope=bot&permissions=0)`)
            .setColor(config.embedColor)
            .setFooter(`Vous avez 2 minutes pour valider \n Appuyez sur la croix pour annuler l'opération \n botid: ${newClient[message.channel.id].user.id}`)
        )
        }

        
        confirm.react("✅");
        confirm.react("❌");
        

        const Reactfilter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        confirm.awaitReactions(Reactfilter, { max: 1, time: 120000, errors: ['time'] })
        .then(async collected => {
            if(message.author.bot) return;
            const reaction = collected.first();

            if (reaction.emoji.name === '✅') {
                const filter = m => m.author.id == message.author.id;
                let s2 = await message.channel.send(new Discord.MessageEmbed()
                    .setTitle("**Entrez votre message de publicité pour tous les serveurs**")
                    
                    .setFooter(`Vous avez 5 minutes pour entrer un message de publicité. \n Appuyez sur la croix pour annuler l'opération`)
                    .setColor(config.embedColor)
                )

                s2.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                        .then(async collected => {
                            if(message.author.bot) return;
                            const pub2 = collected.first().content

                            if(pub2 === ""){
                                message.channel.send(embed_pub_s1_stopped);
                                newClient[message.channel.id].destroy();
                                pModule.pubing[message.channel.id] = false;
                                return;
                            }


                            if(pub2.startsWith("{") && pub2.endsWith("}")){

                                var obj;
                                
                                try{
                                    JSON.parse(pub2)
                                } catch(err) {
                            
                                    message.channel.send(new Discord.MessageEmbed()
                                        .setTitle("Erreur")
                                        .setDescription(` \`\`${err.message} \`\``)
                                        .setImage("https://bhawanigarg.com/wp-content/uploads/2014/05/error-code-18.jpeg")
                                        .setColor(config.embedColor)
                                    )
                                    newClient[message.channel.id].destroy();
                                    pModule.pubing[message.channel.id] = false;
                                    return;
                                }

                                let embedMSG = JSON.parse(pub2)

                                console.log("d")
                                let confirmEmbed = await message.channel.send(embedMSG)
                                confirmEmbed.react("✅");
                                confirmEmbed.react("❌");

                                confirmEmbed.awaitReactions(Reactfilter, { max: 1, time: 120000, errors: ['time'] })
                                .then(async collected => {
                                    if(message.author.bot) return;
                                    const reaction = collected.first();

                                    if (reaction.emoji.name === '✅') {

                                        let mbr = await newClient[message.channel.id].users.cache.filter(member => !member.bot && member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").size
                                        let scd = mbr*0.08;
                                        scd= scd * 1000;
            
                                        let estim = msToTime(scd)
                                       let msg = await message.channel.send(new Discord.MessageEmbed()
                                            .setTitle("**:white_check_mark: Publicité sur tous les serveurs démarrée**")
                                            .setDescription(`Temps estimé de ${estim} secondes \n Il y a ${mbr} membres qui ne sont pas des bots et qui peuvent potentiellement la recevoir`)
                                            .setFooter("Appuyez sur la croix pour annuler l'opération")
                                            
                                            .setColor(config.embedColor)
                                        )
                                            msg.react('❌')
                                    
            
                                            
                                            
                                            let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
            
                                        let memberarray = newClient[message.channel.id].users.cache.filter(member => member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").array();
                                        let membercount = memberarray.length;
                                        let botcount = 0;
                                        let successcount = 0;
                                        let errorcount = 0;
            
            
            
                                        let refresh = await message.channel.send(new Discord.MessageEmbed()
                                            .setTitle("**:hourglass: Publicité en cours**")
                                            .setDescription(`Envoyée à **${successcount}** membres de **tous les serveurs**`)
                                            .setFooter(`Envois échoués: ${errorcount} bloqués par les destinataires.`)
                                            .setColor(config.embedColor)
                                        )
            
                                        let interv = setInterval(() => {
                                            refresh.edit(new Discord.MessageEmbed()
                                            .setTitle("**:hourglass: Publicité en cours**")
                                            .setDescription(`Envoyée à **${successcount}** membres de **tous les serveurs**`)
                                            .setFooter(`Envois échoués: ${errorcount} bloqués par les destinataires.`)
                                            .setColor(config.embedColor)
                                            )
                                        }, 10000)
                                        
                                        collector.on("collect", async(reaction, user) => {
            
                                            if(reaction._emoji.name === "❌") {
                                           
                                            pModule.pubing[message.channel.id] = false;
            
                                            }
                                        }); 

                                        newClient[message.channel.id].on("guildCreate", async guild => {
                                            message.channel.send(new Discord.MessageEmbed()
                                                .setDescription(`⚠️ - Votre bot a été ajouté sur **${guild.name} (${guild.memberCount} membres)**`)
                                                .setColor(config.embedColor)
                                            )
                                        })
            
                                        newClient[message.channel.id].on("guildDelete", async guild => {
                                            message.channel.send(new Discord.MessageEmbed()
                                                .setDescription(`⚠️ - Votre bot a été retiré de **${guild.name} (${guild.memberCount} membres)**`)
                                                .setColor(config.embedColor)
                                            )
                                        })
                                        
                                        
                                        let aSleep = 600;
            
                                        let slowDown = setInterval(() => {
                                            aSleep -= 5
                                            if(aSleep <= 90) return clearInterval(slowDown);
                                        }, 500)

                                        let customEmbed = JSON.stringify(embedMSG)
                                        for (var i = 0; i < membercount; i++) {
            
                                            let member = memberarray[i];
            
                                            
                                            if(pModule.pubing[message.channel.id] == false){
                                                break;
                                            }
            
                                            if (member.bot) {
                                               
                                                botcount++;
                                                continue
                                            }
            
                                            
                                            let timeout = Math.floor((Math.random() * (1 - 0.01)) * 100) + 10; 
                                            await sleep(aSleep);
                                            
                                            if(i == (membercount-1)) {
                                                
                                            } else {
                                                
                                            }
                                            try {
                                                let customReplace = customEmbed.replace("{user}" , `<@${member.id}>`)
                                                let toSend = JSON.parse(customReplace)
                                                await member.send(toSend).catch(err =>  errorcount++)
                                                successcount++;
                                            } catch (error) {
                                                console.log(`Failed to send DM! ` + error)
                                                errorcount++
                                            }
                                        }
            
                                            message.channel.send(new Discord.MessageEmbed()
                                                .setTitle("**:white_check_mark: Publicité sur tous les serveurs terminée**")
                                                .setDescription(`Envoyée avec succès à **${successcount}** membres`)
                                                .setFooter(`Envois échoués: ${errorcount} bloqués par les destinataires.`)
                                                .setColor(config.embedColor)
                                            )
                                            newClient[message.channel.id].destroy();
                                            pModule.pubing[message.channel.id] = false;
                                            clearInterval(interv)
                                    }

                                    if (reaction.emoji.name === '❌') {
                                        message.channel.send(embed_pub_s1_stopped);
                                        newClient[message.channel.id].destroy();
                                        pModule.pubing[message.channel.id] = false;
                                    }
                                }).catch(collected => {
                                    message.channel.send(embed_pub_time_stop);
                                    newClient[message.channel.id].destroy();
                                    pModule.pubing[message.channel.id] = false;
                                    clearInterval(interv)
                                })
                                
                            } else {
                                
                            let mbr = await newClient[message.channel.id].users.cache.filter(member => !member.bot && member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").size
                            let scd = mbr*0.08;
                            scd= scd * 1000;

                            let estim = msToTime(scd)
                           let msg = await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("**:white_check_mark: Publicité sur tous les serveurs démarrée**")
                                .setDescription(`Temps estimé de ${estim} secondes \n Il y a ${mbr} membres qui ne sont pas des bots et qui peuvent potentiellement la recevoir`)
                                .setFooter("Appuyez sur la croix pour annuler l'opération")
                                
                                .setColor(config.embedColor)
                            )
                                msg.react('❌')
                        

                                
                                
                                let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);

                            let memberarray = newClient[message.channel.id].users.cache.filter(member => member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").array();
                            let membercount = memberarray.length;
                            let botcount = 0;
                            let successcount = 0;
                            let errorcount = 0;



                            let refresh = await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("**:hourglass: Publicité en cours**")
                                .setDescription(`Envoyée à **${successcount}** membres de **tous les serveurs**`)
                                .setFooter(`Envois échoués: ${errorcount} bloqués par les destinataires.`)
                                .setColor(config.embedColor)
                            )

                            let interv = setInterval(() => {
                                refresh.edit(new Discord.MessageEmbed()
                                .setTitle("**:hourglass: Publicité en cours**")
                                .setDescription(`Envoyée à **${successcount}** membres de **tous les serveurs**`)
                                .setFooter(`Envois échoués: ${errorcount} bloqués par les destinataires.`)
                                .setColor(config.embedColor)
                                )
                            }, 10000)
                            
                            collector.on("collect", async(reaction, user) => {

                                if(reaction._emoji.name === "❌") {
                               
                                pModule.pubing[message.channel.id] = false;

                                }
                            }); 

                            newClient[message.channel.id].on("guildCreate", async guild => {
                                message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`⚠️ - Votre bot a été ajouté sur **${guild.name} (${guild.memberCount} membres)**`)
                                    .setColor(config.embedColor)
                                )
                            })

                            newClient[message.channel.id].on("guildDelete", async guild => {
                                message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`⚠️ - Votre bot a été retiré de **${guild.name} (${guild.memberCount} membres)**`)
                                    .setColor(config.embedColor)
                                )
                            })
                            
                            
                            let aSleep = 600;

                            let slowDown = setInterval(() => {
                                aSleep -= 5
                                if(aSleep <= 90) return clearInterval(slowDown);
                            }, 500)

                            for (var i = 0; i < membercount; i++) {

                                let member = memberarray[i];

                                
                                if(pModule.pubing[message.channel.id] == false){
                                    break;
                                }

                                if (member.bot) {
                                   
                                    botcount++;
                                    continue
                                }

                                
                                let timeout = Math.floor((Math.random() * (1 - 0.01)) * 100) + 10; 
                                await sleep(aSleep);
                                
                                if(i == (membercount-1)) {
                                    
                                } else {
                                    
                                }
                                try {
                                    let toSend = pub2.replace("{user}" , `<@${member.id}>`)
                                    member.send(toSend).catch(err =>  errorcount++)
                                    successcount++;
                                } catch (error) {
                                    console.log(`Failed to send DM! ` + error)
                                    errorcount++
                                }
                            }

                                message.channel.send(new Discord.MessageEmbed()
                                    .setTitle("**:white_check_mark: Publicité sur tous les serveurs terminée**")
                                    .setDescription(`Envoyée avec succès à **${successcount}** membres`)
                                    .setFooter(`Envois échoués: ${errorcount} bloqués par les destinataires.`)
                                    .setColor(config.embedColor)
                                )
                                newClient[message.channel.id].destroy();
                                pModule.pubing[message.channel.id] = false;
                                clearInterval(interv)
                            }







                        }).catch(collected => {
                            message.channel.send(embed_pub_time_stop);
                            newClient[message.channel.id].destroy();
                            pModule.pubing[message.channel.id] = false;
                            clearInterval(interv)
                        })
            }

            if (reaction.emoji.name === '❌') {
                message.channel.send(embed_pub_s1_stopped);
                newClient[message.channel.id].destroy();
                pModule.pubing[message.channel.id] = false;
            }

        }).catch(collected => {
            message.channel.send(embed_pub_time_stop);
            newClient[message.channel.id].destroy();
            pModule.pubing[message.channel.id] = false;
        })

        
    })



    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function msToTime(duration) {
    var milliseconds = parseInt((duration%1000))
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);
    
    hours = hours;
    minutes = minutes;
    seconds = seconds;
    
    return hours + " heure(s) " + minutes + " minute(s) et " + seconds + " seconde(s)"
    }
module.exports.help = {
    name: "puball*"
}