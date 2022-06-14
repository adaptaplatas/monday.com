import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./board-view/serviceWorker";
import WeatherWidget from "./current-weather-widget/WeatherWidget";

ReactDOM.render(<WeatherWidget />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
