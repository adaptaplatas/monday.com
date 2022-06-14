export type WeatherSettings = { units: "metric" | "imperial"; boards: number[] };
export type UseBoardsHook = [data: string[], columns: string[]];
export type Location = {
  lat: string;
  lng: string;
  city: {
    long_name: string;
    short_name: string;
  };
  street?: string;
  address: string;
  country: {
    long_name: string;
    short_name: string;
  };
  placeId: string;
  changed_at: string;
  streetNumber?: string;
  weatherData?: LocationWeather;
};

export interface LocationWeather {
  address?: string;
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  main: {
    temp: number;
  };
  name: string;
}

/** Define the session property on the request object   */
declare global {
  namespace Express {
    interface Request {
      session: {
        accountId: string;
        userId: string;
        backToUrl: string | undefined;
        shortLivedToken: string | undefined;
        oauthToken?: string;
        oauthTokenSecret?: string;
      };
    }
  }
}
