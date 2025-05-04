import { Type } from "../node_modules/typescript/lib/typescript";

const weatherForm = <HTMLFormElement>document.getElementById("weatherForm");

const submitBtn = document.getElementById("submitBtn");

const errorParagraph = <HTMLParagraphElement>(
  document.getElementById("errorParagraph")
);

const cityName = <HTMLParagraphElement>document.getElementById("cityName");

const currentTemperature = <HTMLParagraphElement>(
  document.getElementById("currentTemperature")
);

const windDirection = <HTMLParagraphElement>(
  document.getElementById("winddirection")
);

const windSpeed = <HTMLParagraphElement>document.getElementById("windspeed");

async function fetchCity(searchForCityInput: string): Promise<Type> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${searchForCityInput}`,
    );

    if (response.status >= 400) {
      errorParagraph.innerText =
        "Value of type 'String' required for key 'name'.";
    }

    return await response.json();
  } catch (error) {
    console.log(error);

    throw error;
  }
}

async function fetchCityLatitudeAndLongitude(
  latitude: number,
  longitude: number,
) {
  try {
    const response =
      await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=-
${longitude}&current_weather=true`);

    if (response.status >= 400) {
      console.log(response.status);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

type PromiseFetchCityResult = {
  results: undefined;
  name: string;
  latitude: string;
  longitude: string;
};

async function getFetchedCityLatitudeAndLongitude(
  fetchCityResult: PromiseFetchCityResult,
) {
  if (fetchCityResult.results !== undefined) {
    const { name, latitude, longitude } = fetchCityResult.results[0];

    cityName.innerText = "City: " + name;

    const fetchCityLatitudeAndLongitudeResult =
      await fetchCityLatitudeAndLongitude(latitude, longitude);

    const { temperature, winddirection, windspeed } =
      fetchCityLatitudeAndLongitudeResult.current_weather;

    currentTemperature.innerText = "Current temperature: " + temperature + "C";

    windDirection.innerText = "Wind direction: " + winddirection;

    windSpeed.innerText = "Wind speed: " + windspeed;

    errorParagraph.innerText = "";
  } else {
    errorParagraph.innerText = "Ciy not found!";
  }
}

weatherForm.addEventListener("submit", async (e) => {
  const searchForCityInput = (<HTMLInputElement>document.getElementById("city"))
    .value;
  e.preventDefault();
  const fetchCityResult = await fetchCity(searchForCityInput);
  getFetchedCityLatitudeAndLongitude(fetchCityResult);
  weatherForm.reset();
});
