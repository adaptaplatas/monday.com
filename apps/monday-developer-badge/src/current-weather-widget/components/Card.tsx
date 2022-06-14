import React from "react";
import { LocationWeather } from "../../types/app";

const Card = ({locationWeather, units}: {locationWeather: LocationWeather, units: "metric" | "imperial"}) =>
    <div className="card-component">
      <div className="card-wrapper">
        <div className="card-title">{locationWeather.address}</div>
        <div className="card-body">
          <span>{locationWeather.main.temp.toFixed(0)} {units === "metric" ? "Cº" : "F"}</span>
          <img className="image"
              title={locationWeather.weather[0].description}
               alt={locationWeather.weather[0].description}
               src={`http://openweathermap.org/img/wn/${locationWeather.weather[0].icon.slice(0,2)}d@2x.png`} />
          </div>
      </div>
    </div>;

  export default Card;