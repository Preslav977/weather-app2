const weatherForm = <HTMLFormElement>document.getElementById("weatherForm");

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

async function fetchCity(searchForCityInput: string) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${searchForCityInput}`,
    );

    if (response.status >= 400) {
      errorParagraph.innerText =
        "Network Error. Check the URL for misspelling!";
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchCityLatitudeAndLongitude(
  latitudeCity: number,
  longitudeCity: number,
) {
  try {
    const response =
      await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitudeCity}&longitude=-
${longitudeCity}&current_weather=true`);

    if (response.status >= 400) {
      console.log(response.status);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

type CityLatitudeAndLongitudeType = {
  results: [{ name: string; latitude: number; longitude: number }];
};

// const results: CityLatitudeAndLongitudeType[] = [];

async function getFetchedCityLatitudeAndLongitude(
  fetchCityResult: CityLatitudeAndLongitudeType,
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

    errorParagraph.style.color = "red";
  } else {
    errorParagraph.innerText = "Ciy not found!";

    errorParagraph.style.color = "red";

    cityName.innerText = "";

    currentTemperature.innerText = "";

    windDirection.innerText = "";

    windSpeed.innerText = "";
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
