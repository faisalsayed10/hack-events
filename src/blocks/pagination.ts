export default (start: number, end: number, total: number) => [
  { type: "divider" },
  {
    type: "actions",
    elements: [
      ...(start > 0 ? [{
        type: "button",
        text: { type: "plain_text", text: "👈 Previous Page", emoji: true },
        action_id: "prev",
        value: `${start}`,
      }] : []),
      ...(total > end ? [{
        type: "button",
        text: { type: "plain_text", emoji: true, text: "👉 Next Page" },
        action_id: "next",
        value: `${end}`,
      }] : []),
    ],
  },
];
