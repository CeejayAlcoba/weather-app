class OpenWeatherService {
  constructor() {
    this.URL = "https://api.openweathermap.org/data/2.5/weather";
    this.token = "d47b58a96433bc53204fecf3a2af9052";
  }
  async get({ country, city }) {
    const res = await fetch(
      `${this.URL}?q=${country},${city}&appid=${this.token}&units=metric`
    );
    return res.json();
  }
}

class SelectOption {
  constructor({ value, label }) {
    this.value = value;
    this.label = label;
  }
  layout() {
    return `<option value="${this.value}">${this.label}</option>`;
  }
}

//==============GLOBAL VARIABLE===========================//
const openWeatherService = new OpenWeatherService();
let weather = {};

//===============DOCUMENT READY==========================//
$(document).ready(() => {
  generateCountriesDropdown();
  $("#select-country").on("change", () => {
    generateCitiesDropdown();
  });
  $("#btn-check").on("click", () => {
    onCheckClick();
  });
});

//==============HANDLER FUNCTIONS=======================//
const getOpenWeather = async () => {
  let params = {
    country: $(`#select-country`).val(),
    city: $(`#select-city`).val(),
  };
  weather = await openWeatherService.get(params);
};

const onCheckClick = async () => {
  const countryElement = $("#select-country");
  console.log(countryElement.val());
  if (countryElement.val() == "")
    return countryElement.addClass("border-danger");
  countryElement.removeClass("border-danger");
  await getOpenWeather();
  generateWeatherUi();
};

//================JS DOM GENERATE======================//

const generateCountriesDropdown = () => {
  Object.keys(country).map((key) => {
    let option = new SelectOption({ value: key, label: key });
    $("#select-country").append(option.layout());
  });
};

const generateCitiesDropdown = () => {
  $("#select-city").empty();
  $("#select-city").append(
    new SelectOption({
      value: "",
      label: "-----------select city-----------",
    }).layout()
  );
  let selectedCountry = $("#select-country").val();
  country[selectedCountry].map((city) => {
    let option = new SelectOption({ value: city, label: city });
    $("#select-city").append(option.layout());
  });
};

const generateWeatherUi = () => {
  const sunrise = new Date(weather.sys.sunrise * 1000);
  const sunset = new Date(weather.sys.sunset * 1000);
  let city = $("#select-city").val();
  let countryCityHeader = city ? `${city}, ${weather.name}` : `${weather.name}`;
  $("#country-city").text(countryCityHeader);
  $("#current-temp").text(weather.main.temp + "°C");
  $("#feels-like").text(weather.main.feels_like + "°C");
  $("#sunrise").text("GMT: " + dateFormat(sunrise));
  $("#sunset").text("GMT: " + dateFormat(sunset));
  $("#max-temp").text(weather.main.temp_max + "°C");
  $("#min-temp").text(weather.main.temp_min + "°C");

  generateWeatherIcon();
};

const dateFormat = (datetime) => {
  let dateTime = new Date(datetime).toLocaleString();
  return dateTime;
};
const generateWeatherIcon = () => {
  $("#weather-icon").empty();
  let url = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
  let description =
    weather.weather[0].main + "/" + weather.weather[0].description;
  $("#weather-icon").append(
    `<img id="image-weather" src="${url}"/>
    <p>${description}</p>`
  );
};
