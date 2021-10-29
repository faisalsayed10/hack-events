import { SlackAction } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import axios from "axios";
import dayjs from "dayjs";
import eventsList from "./blocks/events-list";
import { Event } from "./types";

export default async (type: string, client: WebClient, body: SlackAction, start: number, end: number) => {
  try {
    const { user } = await client.users.info({ user: body.user.id });

    if (type === "upcoming") {
      const { data } = await axios.get<Event[]>(`https://events.hackclub.com/api/events/${type}`);
      const events = data.filter((event) => dayjs(event.start) > dayjs());

      await client.views.update({
        view_id: (body as any).view.id,
        view: {
          type: "home",
          blocks: eventsList(events, "upcoming", start, end, user.tz),
        },
      });
    } else if (type === "all") {
      const { data } = await axios.get<Event[]>(`https://events.hackclub.com/api/events/${type}`);

      await client.views.update({
        view_id: (body as any).view.id,
        view: {
          type: "home",
          blocks: eventsList(data, "total", start, end, user.tz),
        },
      });
    } else if (type === "amas") {
      const { data } = await axios.get<Event[]>(`https://events.hackclub.com/api/${type}`);
      await client.views.update({
        view_id: (body as any).view.id,
        view: {
          type: "home",
          blocks: eventsList(data, "ama", start, end, user.tz),
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
};
