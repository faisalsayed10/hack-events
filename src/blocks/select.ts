export default {
  type: "overflow",
  options: [
    {
      text: { type: "plain_text", emoji: true, text: ":zap: Upcoming Events" },
      value: "upcoming",
    },
    {
      text: { type: "plain_text", emoji: true, text: ":sparkles: All Events" },
      value: "all",
    },
    {
      text: { type: "plain_text", emoji: true, text: ":partyparrot: All AMAs" },
      value: "amas",
    },
  ],
  action_id: "select_event",
};
