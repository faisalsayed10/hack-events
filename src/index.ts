import { App } from "@slack/bolt";
import axios from "axios";
import dayjs from "dayjs";
import Stump from "stump.js";
import { Event } from "./types";
import eventsList from "./blocks/events-list";
require("dotenv").config();

const PORT = parseInt(process.env.PORT || "5000");
const stump = new Stump(["Debug", "Timestamp"]);
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.event("app_home_opened", async ({ event, client }) => {
  try {
    const { data } = await axios.get<Event[]>(`https://events.hackclub.com/api/events/upcoming/`);
    const events = data.filter((event) => dayjs(event.start) > dayjs());

    await client.views.publish({
      user_id: event.user,
      view: {
        type: "home",
        blocks: eventsList(events, "upcoming", 0, 20),
      },
    });
  } catch (err) {
    stump.error(err);
  }
});

app.action("select_event", async ({ ack, body, client }) => {
  await ack();
  const event_type = (body as any).actions[0].selected_option.value;

  try {
    if (event_type === "upcoming") {
      const { data } = await axios.get<Event[]>(`https://events.hackclub.com/api/events/${event_type}`);
      const events = data.filter((event) => dayjs(event.start) > dayjs());

      await client.views.update({
        view_id: (body as any).view.id,
        hash: (body as any).view.hash,
        view: {
          type: "home",
          blocks: eventsList(events, "upcoming", 0, 20),
        },
      });
    } else if (event_type === "all") {
      const { data } = await axios.get<Event[]>(`https://events.hackclub.com/api/events/${event_type}`);

      await client.views.update({
        view_id: (body as any).view.id,
        hash: (body as any).view.hash,
        view: {
          type: "home",
          blocks: eventsList(data, "total", 0, 20),
        },
      });
    } else if (event_type === "amas") {
      const { data } = await axios.get<Event[]>(`https://events.hackclub.com/api/${event_type}`);
      await client.views.update({
        view_id: (body as any).view.id,
        hash: (body as any).view.hash,
        view: {
          type: "home",
          blocks: eventsList(data, "ama", 0, 20),
        },
      });
    }
  } catch (err) {
    stump.error(err);
  }
});

app.action("ping-me", async ({ ack }) => {
  await ack();
});
app.action("cal", async ({ ack }) => await ack());

(async () => {
  await app.start(PORT);
  stump.info("⚡️ Bolt app is running!");
})();
