import { Board } from "../../types/monday";
import { Dispatch, useEffect, useState } from "react";
import { LocationWeather } from "../../types/app";
import BoardService from "../services/BoardService";

const useBoards = (boards: Board[] | undefined, units: "metric" | "imperial", setLoading: Dispatch<boolean>) => {
  const [locationWeathers, setLocationWeathers] = useState<LocationWeather[]>([]);

  useEffect(() => {
    boards?.length &&
      BoardService.loadLocationData(boards, units).then((data) => {
        setLocationWeathers(data);
        setLoading(false);
      });
  }, [boards, setLoading, units]);

  return locationWeathers;
};

export default useBoards;
