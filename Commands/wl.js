const Discord = require("discord.js");
const config = require("../config.json")




    /* EMBED */


var embed_wl_error = new Discord.MessageEmbed()
    .setDescription(`**${config.m_wl_error}**`)
    .setColor(config.embedColor)

var embed_wl_null = new Discord.MessageEmbed()
    .setDescription(` ${config.m_wl_null} `)
    .setColor(config.embedColor)



/* _________________________________________________________ */



module.exports.run = async (client, message, args) => {




    if(!message.member.roles.cache.get(config.helperRole)) return;

    let target;

    if(!message.mentions.members.first()){
        if(!args[0]){
            return message.channel.send(embed_wl_null);
        } else {
            target = message.guild.members.cache.get(args[0])

            if(!target) return message.channel.send(embed_wl_error);

            message.guild.channels.create(target.user.username, {type: "text", permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: target.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],}).then(channel => {
                target.roles.add(config.wlrole)
                channel.send(new Discord.MessageEmbed() 
                    .setTitle(`**Bievenue dans votre salon privé, ${target.user.username}**`)
                    .setDescription(`Vous disposez maintenant de votre propre salon privé pour faire des publicités avec Advert ♾ Bot !
                    Rappelez-vous que vous devez avoir un ou plusieurs tokens de bot pour utiliser Advert ♾ Bot, si vous n'avez pas encore de token, adressez-vous à un helper pour en savoir plus.`)
                    .setColor(config.embedColor)
                )
    
                channel.send(new Discord.MessageEmbed() 
                    .setTitle("Utilisation de Advert ♾ Bot")
                    .setDescription("__Voici les commandes que vous pouvez utiliser avec Advert ♾ Bot:__")
                    .addField(config.prefix + "pub token_bot", "Cette commande sert à envoyer un message à tous les membres d'un serveur.")
                    .addField(config.prefix + "puball token_bot", "Cette commande sert à envoyer un message à tous les membres des serveurs.")
                    .addField(config.prefix + "pub* token_bot", "Cette commande sert à envoyer un message à tous les membres en ligne d'un serveur.")
                    .addField(config.prefix + "puball* token_bot", "Cette commande sert à envoyer un message à tous les membres en ligne des serveurs.")
                    .setColor(config.embedColor)
                )
            })

            
            message.channel.send(new Discord.MessageEmbed()
            .setDescription(`**:white_check_mark: ${target.user.username} ${config.m_wl_sucess}** `)
            .setColor(config.embedColor))
        }
    } else {
        target = message.mentions.members.first()

        message.guild.channels.create(target.user.username, {type: "text", permissionOverwrites: [
            {
                id: message.guild.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: target.id,
                allow: ['VIEW_CHANNEL'],
            },
        ],}).then(channel => {
            target.roles.add(config.wlrole)
            channel.send(new Discord.MessageEmbed() 
                .setTitle(`**Bievenue dans votre salon privé, ${target.user.username}**`)
                .setDescription(`Vous disposez maintenant de votre propre salon privé pour faire des publicités avec Advert ♾ Bot !
                Rappelez-vous que vous devez avoir un ou plusieurs tokens de bot pour utiliser Advert ♾ Bot, si vous n'avez pas encore de token, adressez-vous à un helper pour en savoir plus.`)
                .setColor(config.embedColor)
            )

            channel.send(new Discord.MessageEmbed() 
                .setTitle("Utilisation de Advert ♾ Bot")
                .setDescription("__Voici les commandes que vous pouvez utiliser avec Advert ♾ Bot:__")
                .addField(config.prefix + "pub token_bot", "Cette commande sert à envoyer un message à tous les membres d'un serveur.")
                .addField(config.prefix + "puball token_bot", "Cette commande sert à envoyer un message à tous les membres des serveurs.")
                .addField(config.prefix + "pub* token_bot", "Cette commande sert à envoyer un message à tous les membres en ligne d'un serveur.")
                .addField(config.prefix + "puball* token_bot", "Cette commande sert à envoyer un message à tous les membres en ligne des serveurs.")
                .setColor(config.embedColor)
            )
            

        })

        message.channel.send(new Discord.MessageEmbed()
        .setDescription(`**:white_check_mark: ${target.user.username} ${config.m_wl_sucess}** `)
        .setColor(config.embedColor))
    }






    
    
}

module.exports.help = {
    name: "wl"
}