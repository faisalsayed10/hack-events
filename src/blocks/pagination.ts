export default (start: number, end: number) => [
  { type: "divider" },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text: "👈 Previous Page", emoji: true },
        action_id: "prev",
        value: `${start}, ${end}`,
      },
      {
        type: "button",
        text: { type: "plain_text", emoji: true, text: "👉 Next Page" },
        action_id: "next",
        value: `${start}, ${end}`,
      },
    ],
  },
];
