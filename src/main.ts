const weatherForm = <HTMLFormElement>document.getElementById("weatherForm");

interface CityNameResponse {
  results: [
    {
      id: number;
      name: string;
      latitude: number;
      longitude: number;
      elevation: number;
      feature_code: string;
      country_code: string;
      admin1_id: number;
      timezone: string;
      population: number;
      postcodes: string[];
      country_id: number;
      country: string;
      admin1: string;
    },
  ];
  generationtime_ms: number;
}

interface CityLatitudeAndLongitudeResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: {
    time: string;
    interval: number;
    temperature: number;
    windspeed: number;
    winddirection: number;
    is_day: number;
    weathercode: number;
  };
}

interface CityLatitudeAndLongitudeCurrentWeather {
  current_weather_units: {
    time: string;
    interval: string;
    temperature: string;
    windspeed: string;
    winddirection: string;
    is_day: string;
    weathercode: string;
  };
}

async function fetchForCityName(
  searchForCity: string,
): Promise<CityNameResponse> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${searchForCity}`,
    );

    if (response.status >= 400) {
      throw new Error("Network error. Check if the URL is correct!");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function fetchForCityByLatitudeAndLongitude(
  latitude: number,
  longitude: number,
): Promise<CityLatitudeAndLongitudeResponse> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
    );

    if (response.status >= 400) {
      throw new Error("Network error. Check if the URL is correct!");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

function visualizeTheWeatherInfo(
  fetchCityResult: CityNameResponse,
  fetchCityLatitudeAndLongitude: CityLatitudeAndLongitudeResponse,
) {
  if (
    fetchCityResult.results !== undefined &&
    fetchForCityByLatitudeAndLongitude !== undefined
  ) {
    const cityName = <HTMLParagraphElement>document.getElementById("cityName");

    const currentTemperature = <HTMLParagraphElement>(
      document.getElementById("currentTemperature")
    );

    const windDirection = <HTMLParagraphElement>(
      document.getElementById("windDirection")
    );

    const windSpeed = <HTMLParagraphElement>(
      document.getElementById("windSpeed")
    );

    const { name } = fetchCityResult.results[0];

    const { temperature, winddirection, windspeed } =
      fetchCityLatitudeAndLongitude.current_weather;

    cityName.innerText = "City: " + name;

    currentTemperature.innerText = "Current temperature: " + temperature + "C";

    windDirection.innerText = "Wind direction: " + winddirection;

    windSpeed.innerText = "Wind speed: " + windspeed;
  }
}

weatherForm.addEventListener("submit", async (e) => {
  const searchForCity = (<HTMLInputElement>(
    document.getElementById("searchForCity")
  )).value;
  e.preventDefault();
  try {
    const fetchCityResult = await fetchForCityName(searchForCity);

    const { latitude, longitude } = fetchCityResult.results[0];

    const fetchCityLatitudeAndLongitude =
      await fetchForCityByLatitudeAndLongitude(latitude, longitude);

    visualizeTheWeatherInfo(fetchCityResult, fetchCityLatitudeAndLongitude);
  } catch (error) {
    throw new Error("City not found!");
  }
  weatherForm.reset();
});
