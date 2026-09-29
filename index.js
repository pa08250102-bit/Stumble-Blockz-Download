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
    .setDescription("Envia a página oficial de downloads do Stumble Night.")
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
      content: "🏓 Pong! O Stumble Night está online.",
      ephemeral: true
    });
  }

  if (interaction.commandName === "download") {
    const pc = interaction.options.getString("pc");
    const mobile = interaction.options.getString("mobile");

    const embed = new EmbedBuilder()
      .setTitle("🎮 — Stumble Night Official Download")
      .setDescription(
        "➡️ Official access to the latest Stumble Night build, providing a stable and secure release with performance optimizations, enhanced gameplay systems, and ongoing updates designed to deliver a consistent and refined experience across supported platforms."
      )
      .addFields(
        {
          name: "━━━━━━━━━━━━━━━━━━\n🎮 — Details & Information",
          value:
            "# <:StumbleNight:1553904399582101566> Stumble Night  •  v0.56
## 💻 Windows (PC)

<:Halloween_Currency:1553529307224080496> **Latest Update:** <t:1790461089:f>

> <:FinFlag:1553529691774783619> **Game Build:** `0.56`
> <:ServerMaintanace:1546734579480797185>  **Client Build:** `v0.1`
> <:Folder:1553530164347142185> **Download Size:** `439 MB`
## 📱 Android (Mobile)

<:StumbleNight:1553904399582101566>   **Latest Update:** <t:1790461080:f>


> <:FinFlag:1553529691774783619> **Game Build:** `0.56`
> <:Crown:1546141110374629466> **Client Build:** `v0.1`
> <:Paste:1525197590948483072> **APK Size:** `200 MB`
### <:Tournament_1:1553529468826685510>   **Minimum Requirements — PC & Mobile**

-# 🇺🇸 **🖥️ PC Requirements:**
-# <:Dot:1543281993356148756> Supports Windows 7–11, Dual-Core CPU (Core 2 Duo or better), 2–4 GB RAM, Integrated Graphics Supported, 1 GB Available Storage, Stable Internet Connection, 32/64-Bit OS.
-# 🇺🇸 **📱 Mobile Requirements:**
-# <:Dot:1543281993356148756> Android 6.0+, 2 GB RAM, Snapdragon 450 / Helio P22 or Higher, 1 GB Available Storage, 64-Bit Device.
@everyone @here
        },Tournaments
        {
          name: "━━━━━━━━━━━━━━━━━━\n🎮 — Downloads",
          value:
            "➡️ **Game Files Loader (Required) 💻**\n" +
            "Complete game directory with Melon Loader pre-installed.\n\n" +
            "➡️ **StumbleNight.apk (Required) 📱**\n" +
            "Mobile version of Stumble Night."
        }
      )
      .setFooter({ text: "Stumble Night • Official Download" })
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("📫 Download Here (PC)")
        .setStyle(ButtonStyle.Link)
        .setURL(pc),
      new ButtonBuilder()
        .setLabel("📬 Download Here (.APK)")
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
