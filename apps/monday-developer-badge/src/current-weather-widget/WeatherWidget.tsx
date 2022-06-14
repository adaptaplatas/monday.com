import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import initMonday from "monday-sdk-js";
import { Board, Context } from "../types/monday";
import { WeatherSettings } from "../types/app";
import useBoards from "./hooks/useBoards";
import Card from "./components/Card";
import CardLoader from "./components/CardLoader";

const monday = initMonday();

const WeatherWidget = () => {
  const [settings, setSettings] = useState<WeatherSettings>({ units: "metric", boards: [] });
  const [boards, setBoards] = useState<Board[]>();
  const [loading, setLoading] = useState(true);
  const locationWeathers = useBoards(boards, settings.units, setLoading);

  useEffect(() => {
    monday.listen("settings", (res: any) => {
      console.log("settings called");
      setSettings(prev => ({...prev, units: res.data.units}));
      setLoading(true);
    });
    monday.listen("context", (res) => {
      const context = res.data as Context;
      if (!boards?.length) {
        setLoading(true);
        monday
          .api(
            `
          query { 
            boards (ids: [${context.boardIds}]) { 
              items { 
                column_values { 
                  title 
                  value
                  type
                } 
              } 
            } 
          }`
          )
          .then((res) => {
            setBoards(res.data["boards"] as Board[]);
          })
          .catch(console.log);
      }
    });
  }, []);

  return (
    <div className="app">
        <div className="cards-row">
          {loading ? (
            Array.from(Array(10).keys()).map(() => <CardLoader />)
          ) : boards?.length ? (
            locationWeathers.map((locationWeather) => (
              <Card key={locationWeather.name} locationWeather={locationWeather} units={settings.units} />
            ))
          ) : (
            <span className={"data"}>Select any number of boards with locations to get the weather!</span>
          )}
        </div>
    </div>
  );
};

export default WeatherWidget;
