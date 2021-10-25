export default (type: string) => {
  const options = [
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
  ];
  let initial_option = options[0];

  if (type === "upcoming") {
    initial_option = options[0];
  } else if (type === "total") {
    initial_option = options[1];
  } else if (type === "ama") {
    initial_option = options[2];
  }

  return {
    type: "static_select",
    placeholder: {
      type: "plain_text",
      text: "🪄 Filter",
      emoji: true,
    },
    options,
    initial_option,
    action_id: "select_event",
  };
};
