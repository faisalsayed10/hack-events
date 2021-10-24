import dayjs from "dayjs";
import { Event } from "../types";

const linkParser = (text: string) => text.replace(/\[([^\[\]]*)\]\((.*?)\)/gm, `<$2|$1>`);

export default (event: Event) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*<https://events.hackclub.com/${event.slug}|${event.title}>*\n${linkParser(event.desc)}\n\n*When:* ${dayjs(
        event.start
      ).format("DD MMMM YYYY")}\n*Hosted by:* <${event.leader}>`,
    },
    accessory: {
      type: "image",
      image_url: event.amaAvatar || event.avatar,
      alt_text: event.title,
    },
  },
  {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `⏱ Starts At: ${dayjs(event.start).format("hh:mm a")} | Ends At: ${dayjs(event.end).format("hh:mm a")}`,
      },
    ],
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text: "🤩 Add to Calendar", emoji: true },
        url: event.cal,
        action_id: "cal",
        style: "primary",
      },
      {
        type: "button",
        text: { type: "plain_text", emoji: true, text: "Ping me (Coming Soon)" },
        action_id: "ping-me",
      },
    ],
  },
];
