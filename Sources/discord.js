import axios from "axios";
import { I18n } from "i18n";
import moment from "moment";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const env = Object.create(process.env);
const { DISCORD_WEBHOOK, LANGUAGE } = env;

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const i18n = new I18n();

i18n.configure({
  locales: ["en", "ko", "ja"],
  directory: join(__dirname, "../locales"),
  defaultLocale: "en",
});

i18n.setLocale(LANGUAGE || "en");

export function post(appInfo, submissionStartDate) {
  if (!DISCORD_WEBHOOK) {
    return;
  }
  const status = i18n.__(appInfo.status);
  const message = i18n.__("Message", { appname: appInfo.name, status });
  const embed = discordEmbed(appInfo, submissionStartDate);

  hook(message, embed);
}

async function hook(message, embed) {
  const payload = {
    content: message,
    embeds: [embed],
  };

  await axios.post(DISCORD_WEBHOOK, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function discordEmbed(appInfo, submissionStartDate) {
  const embed = {
    title: "App Store Connect",
    author: {
      name: appInfo.name,
      icon_url: appInfo.iconURL,
    },
    url: `https://appstoreconnect.apple.com/apps/${appInfo.appID}/appstore`,
    fields: [
      {
        name: i18n.__("Version"),
        value: appInfo.version,
        inline: true,
      },
      {
        name: i18n.__("Status"),
        value: i18n.__(appInfo.status),
        inline: true,
      },
    ],
    footer: {
      text: "appstore-status-bot",
      icon_url:
        "https://icons-for-free.com/iconfiles/png/512/app+store+apple+apps+game+games+store+icon-1320085881005897327.png",
    },
    timestamp: new Date(),
  };

  // Set elapsed time since "Waiting For Review" start
  if (
    submissionStartDate &&
    appInfo.status != "Prepare for Submission" &&
    appInfo.status != "Waiting For Review"
  ) {
    const elapsedHours = moment().diff(moment(submissionStartDate), "hours");
    embed.fields.push({
      name: "Elapsed Time",
      value: `${elapsedHours} hours`,
      inline: true,
    });
  }

  embed.color = colorForStatus(appInfo.status);

  return embed;
}

function colorForStatus(status) {
  const infoColor = 0x8e8e8e;
  const warningColor = 0xf4f124;
  const successColor1 = 0x1eb6fc;
  const successColor2 = 0x14ba40;
  const failureColor = 0xe0143d;
  const colorMapping = {
    "Prepare for Submission": infoColor,
    "Waiting For Review": infoColor,
    "In Review": successColor1,
    "Pending Contract": warningColor,
    "Waiting For Export Compliance": warningColor,
    "Pending Developer Release": successColor2,
    "Processing for App Store": successColor2,
    "Pending Apple Release": successColor2,
    "Ready for Sale": successColor2,
    Rejected: failureColor,
    "Metadata Rejected": failureColor,
    "Removed From Sale": failureColor,
    "Developer Rejected": failureColor,
    "Developer Removed From Sale": failureColor,
    "Invalid Binary": failureColor,
  };

  return colorMapping[status];
}
