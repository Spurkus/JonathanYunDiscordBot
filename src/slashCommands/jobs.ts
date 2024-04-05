import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    MessageComponentInteraction,
    SlashCommandBuilder,
  } from 'discord.js';
  import { SlashCommand } from '../types';
  import { getJob, addJob, getWorker, createWorker, getUser, createUser } from '../database';
  
  
  const jobs = new Map<string, number>([
    ["Jonathan Yun's Discord Kitten <:Sus_anime_catgirl_cute:1225436718459519117>", 5000],
    ["Jonathan Yun's Slave <:slave:1225435125320388679>", 1000],
    ["Jonathan Yun's Shein Factory Worker <:social_credit:1225435752108916786>", 10],
    ["Jonathan Yun's Noodle Shop Manager <:zucc:1225436490071412737>", 2000]
  ]);
  
  const game = (thingy: string, disable: boolean) => {
    const embed = new EmbedBuilder()
      .setTitle('Job Yunter (like yun + hunter gettit haha)')
      .setDescription(`Here is a list of jobs that you can do. Search powered by the Sex Algorithm:tm:`)
      .setColor('White')
      .setThumbnail("https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2M3ZWxzMTE1ZTRzYzAxOTQ1dDlnYXlwbHB5Nmh0Zmo1eTR5ZHpsbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2zUn8hAwJwG4abiS0p/giphy.gif");
  
    let i = 1;
    const row = new ActionRowBuilder<ButtonBuilder>();
    jobs.forEach((value, key) => {
      embed.addFields({ name: `**${i}** . ${key}`, value: `Salary: ¥${value}`, inline: false });
      const button = new ButtonBuilder()
        .setCustomId(`${i}`)
        .setLabel(`${i}`)
        .setDisabled(disable)
        .setStyle(ButtonStyle.Success)
        .setEmoji(`${key.split(" ")[key.split(" ").length-1]}`);
      i += 1;
      row.addComponents(button);
    });
    return {content: thingy, embeds: [embed], components: [row] };
  };
  
  const command: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName('jobs')
      .setDescription('Job Search'),
    execute: async interaction => {

        const userID = interaction.user.id;
        const user = await getUser(userID);
        const worker = await getWorker(userID);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply("You have not made a bank account in 'Yun Banks™' yet, and you're already trying to get a job smh.\nIt's ok, I will make one for you <3")
        }
        const userJob = await getJob(userID);
        const curJob = userJob ? userJob.cur : 0;
        if (!worker) {
            createWorker(userID);
        }
        
        
      const gameComponents = game(`Your current job is **${Array.from(jobs.keys())[curJob-1]}**`, false);
      await interaction.reply(gameComponents);
  
      const filter = (i: MessageComponentInteraction) => i.user.id === userID;
      const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });
  
      collector?.on('collect', async (i: MessageComponentInteraction) => {
        // Assuming a job ID or similar is passed as customId
        const selectedJobId = i.customId;
        await addJob(userID, parseInt(selectedJobId));
        await i.update({ content: `Job selected successfully.`, components: [] });
        collector.stop();
      });
  
      collector?.on('end', async () => {
        // Fetch the current job of the user to display
        const userJob = await getJob(userID);
        const curJob = userJob ? userJob.cur : 0;
        
        await interaction.followUp({ content: `Your current job is **${Array.from(jobs.keys())[curJob-1]}**`});
      });
    },
    cooldown: 5,
  };
  
  export default command;
  
