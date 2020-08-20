const Discord = require("discord.js");
const config = require("../config.json")
var pModule = require('../pubing.js');

/* EMBED */

var eHelp = new Discord.MessageEmbed()
    .setTitle("Voici les commandes ")
    .addField(config.prefix + "pub token_bot", "Cette commande sert à envoyer un message à tous les membres d'un serveur.")
    .addField(config.prefix + "puball token_bot", "Cette commande sert à envoyer un message à tous les membres des serveurs.")
    .addField(config.prefix + "pub* token_bot", "Cette commande sert à envoyer un message à tous les membres en ligne d'un serveur.")
    .addField(config.prefix + "puball* token_bot", "Cette commande sert à envoyer un message à tous les membres en ligne des serveurs.")
    .setColor(config.embedColor)

module.exports.run = async (client, message, args) => {
    message.channel.send(eHelp)
}

module.exports.help = {
    name: "help"
}