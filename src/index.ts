import { App } from "@slack/bolt";
import axios from "axios";
import dayjs from "dayjs";
import Stump from "stump.js";
import eventsList from "./blocks/events-list";
import { Event } from "./types";
import updateView from "./updateView";
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
  await updateView(event_type, client, body, 0, 20);
});

app.action("ping-me", async ({ ack }) => {
  await ack();
});
app.action("cal", async ({ ack }) => await ack());

app.action("prev", async ({ ack, body, client }) => {
  await ack();
  const start: number = parseInt((body as any).actions[0].value);
  const selected_option: string = (body as any).view.blocks.find((block) => block?.accessory?.type === "static_select")
    .accessory.initial_option.value;

  await updateView(selected_option, client, body, start - 20, start);
});

app.action("next", async ({ ack, body, client }) => {
  await ack();
  const end: number = parseInt((body as any).actions[0].value);
  const selected_option: string = (body as any).view.blocks.find((block) => block?.accessory?.type === "static_select")
    .accessory.initial_option.value;

  await updateView(selected_option, client, body, end, end + 20);
});

(async () => {
  await app.start(PORT);
  stump.info("⚡️ Bolt app is running!");
})();
