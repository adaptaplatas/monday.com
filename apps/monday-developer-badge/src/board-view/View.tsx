import React, { useEffect, useState } from "react";
import "./View.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Board, Context } from "../types/monday";
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import "./index.css";

const monday = mondaySdk();

const View = () => {
  const [settings, setSettings] = useState<{ background_color: string }>({ background_color: "white" });
  const [boardIds, setBoardIds] = useState<number[]>();
  const [boards, setBoards] = useState<Board[]>();
  const [name, setName] = useState("");

  useEffect(() => {
    monday.listen("settings", (res: any) => {
      console.log("settings called");
      setSettings(res.data);
    });

    monday.listen("context", (res) => {
      console.log("context called");
      setBoardIds((res.data as Context).boardIds);
    });
  }, []);

  useEffect(() => {
    monday.api(`query { me { name } }`).then((res) => {
      setName(res.data["me"].name);
    });

    if (boardIds) {
      monday
        .api(
          `
          query { 
            boards (ids: [${boardIds}]) { 
              name 
              columns {
                title
                type
              }
              items { 
                name 
                column_values { 
                  title 
                  text 
                  } 
                } 
              } 
            }`
        )
        .then((res) => {
          console.log("boards", res.data);
          setBoards(res.data["boards"] as Board[]);
        });
    }
  }, [boardIds]);

  return (
    <div className="app" style={{ background: settings.background_color }}>
      <span>{name ? `Hello, ${name}!` : "Wait..."}</span>
      {boards?.length && (
        <>
          <h2>Boards</h2>
          <div className={"data"}>
            <Grid
              data={boards[0].items.map((item) => [item.name, ...item.column_values.map((column) => column.text)])}
              columns={boards[0].columns.filter((column) => column.type !== "autonumber").map((column) => column.title)}
              search={true}
              pagination={{
                enabled: true,
                limit: 10
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default View;
