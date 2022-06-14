export type Context = {
  instanceId: number; // unique instance ID for the feature on the board
  instanceType: "board_view"; // feature type
  boardIds: number[]; // list of connected boards
  viewMode: "fullscreen" | "split"; // or "split"
  theme: "light" | "dark"; // or "dark"
};

export type Board_Column = { title: string; text: string; type: string; value: string /*JSON*/ };

export type Board = {
  name: string;
  items: {
    name: string;
    column_values: Board_Column[];
  }[];
  columns: [
    {
      title: string;
      type: string;
    }
  ];
};
