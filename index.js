const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Verifica se o bot está online."),

  new SlashCommandBuilder()
    .setName("download")
    .setDescription("Envia a página oficial de downloads do Stumble blockz.")
    .addStringOption(option =>
      option
        .setName("pc")
        .setDescription("Link do download para PC.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("mobile")
        .setDescription("Link do download do APK para Mobile.")
        .setRequired(true)
    )
].map(command => command.toJSON());

client.once("ready", async () => {
  console.log(`✅ Conectado como ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log("✅ Comandos /ping e /download registrados.");
  } catch (error) {
    console.error("❌ Erro ao registrar comandos:", error);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    return interaction.reply({
      content: "🏓 Pong! O Stumble blockz está online.",
      ephemeral: true
    });
  }

  if (interaction.commandName === "download") {
    const pc = interaction.options.getString("pc");
    const mobile = interaction.options.getString("mobile");

    const embed = new EmbedBuilder()
      .setTitle("🎮 — Stumble blockz Official Download")
      .setDescription(
        "➡️ Official access to the latest Stumble blockz build, providing a stable and secure release with performance optimizations, enhanced gameplay systems, and ongoing updates designed to deliver a consistent and refined experience across supported platforms."
      )
      .addFields(
        {
          name: "━━━━━━━━━━━━━━━━━━\n🎮 — Details & Information",
          value:
            "➡️ **Melon Loader v0.7.1 🍉**\n" +
            "Open-source mod loader responsible for enabling C# modifications in Unity IL2CPP environments.\n\n" +
            "➡️ **Stumble Guys Build Version v0.58.3 🛠️**\n" +
            "Base multiplayer game used as the foundation for the Stumble blockz modification.\n\n" +
            "➡️ **Stumble blockz v1.0 🎮**\n" +
            "Customized version focused on performance, additional mechanics, and the return of Classic Tournaments."
        },
        {
          name: "━━━━━━━━━━━━━━━━━━\n🎮 — Downloads",
          value:
            "➡️ **Game Files Loader (Required) 💻**\n" +
            "Complete game directory with Melon Loader pre-installed.\n\n" +
            "➡️ **Stumbleblockz.apk (Required) 📱**\n" +
            "Mobile version of Stumble blockz."
        }
      )
      .setFooter({ text: "Stumble blockz • Official Download" })
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("📦 Download Here (PC)")
        .setStyle(ButtonStyle.Link)
        .setURL(pc),
      new ButtonBuilder()
        .setLabel("📦 Download Here (.APK)")
        .setStyle(ButtonStyle.Link)
        .setURL(mobile)
    );

    await interaction.reply({
      embeds: [embed],
      components: [buttons]
    });
  }
});

if (!process.env.DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN não foi encontrado nos Secrets.");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
