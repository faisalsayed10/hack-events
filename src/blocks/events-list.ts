import { Event } from "../types";
import eventBlock from "./eventBlock";
import pagination from "./pagination";
import select from "./select";

export default (events: Event[], type: string, start: number, end: number, tz: string) => {
  const events_arr = [];
  events.slice(start, end).forEach((event) => events_arr.push(...eventBlock(event, tz)));

  return [
    {
      type: "section",
      text: { type: "mrkdwn", text: `There are *${events.length}* ${type} events:` },
      accessory: select(type),
    },
    { type: "divider" },
    ...events_arr,
    ...(events.length > 20 ? pagination(start, end, events.length) : []),
  ];
};
