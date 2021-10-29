import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Event } from "../types";

dayjs.extend(utc);
dayjs.extend(timezone);

const linkParser = (text: string) => text.replace(/\[([^\[\]]*)\]\((.*?)\)/gm, `<$2|$1>`);
const getDate = (start: string, tz: string) => dayjs(start).tz(tz).format("DD MMMM YYYY");
const getTime = (start: string, end: string, tz: string) =>
  `⏱ Starts At: ${dayjs(start).tz(tz).format("hh:mm a")} | Ends At: ${dayjs(end).tz(tz).format("hh:mm a")}`;

export default (event: Event, tz: string) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*<https://events.hackclub.com/${event.slug}|${event.title}>*\n${linkParser(
        event.desc
      )}\n\n*When:* ${getDate(event.start, tz)}\n*Hosted by:* <${event.leader}>`,
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
        text: getTime(event.start, event.end, tz),
      },
    ],
  },
  ...(dayjs(event.start) > dayjs()
    ? [
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
              value: dayjs(event.start),
            },
          ],
        },
      ]
    : event.youtube
    ? [
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "🎥 Watch the Recording", emoji: true },
              url: event.youtube,
              action_id: "watch-recording",
              style: "primary",
            },
          ],
        },
      ]
    : []),
  { type: "divider" },
];
