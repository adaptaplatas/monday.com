import { Location, LocationWeather } from "../../types/app";
import Constants from "../Constants";
import { Board, Board_Column } from "../../types/monday";
import BoardWithoutLocation from "../../error/BoardWithoutLocation";

class BoardService {
  static async loadLocationData(boards: Board[], units: "metric" | "imperial"): Promise<LocationWeather[]> {
    const visited = new Map<string, boolean>();
    // Column structure: [Location, weather]
    const locationWeathers: LocationWeather[] = [];
    for (const board of boards) {
      const locations: Location[] = board.items
        .map((item) => item.column_values.find((column) => column.type === "location"))
        .filter((column): column is Board_Column => !!column && !!column.value)
        .map((column) => JSON.parse(column.value));
      if (!locations.length) {
        throw new BoardWithoutLocation();
      }
      locationWeathers.push(...(await this.handleLocations(locations, visited, units)));
    }
    return locationWeathers;
  }

  private static async handleLocations(
    locations: Location[],
    visited: Map<string, boolean>,
    units: "metric" | "imperial"
  ) {
    const locationWeathers: LocationWeather[] = [];
    for (const location of locations) {
      if (!visited.get(location.placeId)) {
        visited.set(location.placeId, true);
        const urlParams: string = new URLSearchParams({
          lat: location.lat,
          lon: location.lng,
          appid: Constants.WEATHER_API_KEY!,
          units
        }).toString();
        const weatherData: LocationWeather = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?${urlParams}`
        ).then((response) => response.json());
        weatherData.address = location.address;
        locationWeathers.push(weatherData);
      }
    }
    return locationWeathers;
  }
}

export default BoardService;
