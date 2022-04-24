// require Nuggies
const Nuggies = require('nuggies');
const Discord = require('discord.js');
/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {String[]} args
 */

module.exports.run = async (client, message, args) => {
	const brmanager = new Nuggies.buttonroles();
	message.channel.send('Send messages in `roleID color label emoji` syntax! Once finished say `done`.');

	/**
	 * @param {Discord.Message} m
	 */
	const filter = m => m.author.id === message.author.id;
	const collector = message.channel.createMessageCollector(filter, { max: Infinity });

	collector.on('collect', async (msg) => {
		if (!msg.content) return message.channel.send('Invalid syntax');
		if (msg.content.toLowerCase() == 'done') return collector.stop('DONE');
		const colors = ['grey', 'gray', 'red', 'blurple', 'green'];
		if (!msg.content.split(' ')[0].match(/[0-9]{18}/g) || !colors.includes(msg.content.split(' ')[1])) return message.channel.send('Invalid syntax');

		const role = msg.content.split(' ')[0];
		// const role = message.guild.roles.cache.get(roleid);
		if (!role) return message.channel.send('Invalid role');

		const color = colors.find(color => color == msg.content.split(' ')[1]);
		if (!color) return message.channel.send('Invalid color');

		const label = msg.content.split(' ').slice(2, msg.content.split(' ').length - 1).join(' ');

		const reaction = (await msg.react(msg.content.split(' ').slice(msg.content.split(' ').length - 1).join(' ')).catch(/*() => null*/console.log));

		const final = {
			role, color, label, emoji: reaction ? reaction.emoji.id || reaction.emoji.name : null,
		};
		brmanager.addrole(final);
	})

  // ACTION PESAN KEPADA USER UNTUK MEMILIH ROLES
	collector.on('end', async (msgs, reason) => {
		if (reason == 'DONE') {
			const embed = new Discord.MessageEmbed()
				.setTitle('<:komputer:950004445230551100> Roles Knight of Favonius!')
				.setDescription('Silahkan pilih role yang anda suka di bawah ini, jika system bot mengalami seperti ini: **This interaction failed**. berarti bot sedang tidur')
				.setColor('#08c903')
				.setTimestamp();
			Nuggies.buttonroles.create({ message, content: embed, role: brmanager, channelID: message.channel.id })
		}
	})
};
// ACTION END

// MODULE CONFIG MEMANGGIL COMMANDS
module.exports.config = {
	name: 'role',
	description: 'Creates button role!',
	usage: '?role',
	botPerms: [],
	userPerms: ['MANAGE_GUILD'],
	aliases: [],
};