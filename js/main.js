$(function () {
  
  $.getJSON('current.city.list.min.json', function (data) {
    $('select').on('change', function () {
      let out = '';
      for (let key in data) {
        if (data[key].country == $('select option:selected').val()) {
          out += `<p value="${data[key].id}">${data[key].name}</p>`;
        }
      }
      $('#city').html(out);
      $('#city p').on('click', function () {
        $.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            "id": $(this).attr('value'),
            "appid": "1ee4ac6b731f93424c70893ed53cb042",
            "lang": "ru"
          },
          function (data) {
            let out = '';
            out += `<p>Город: <b>${data.name}</b></p><br>`;
            out += `<p>Погода: <b>${data.weather[0].description}</b></p><br>`;
            out += `<p style="text-align:center"><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"></p>`;
            out += `<p>Температура: <b>${Math.round(data.main.temp - 273)}&#176;C</b></p><br>`; //converting from Kelvin to Celsius
            out += `<p>Ощущается: <b>${Math.round(data.main.feels_like - 273)}&#176;C</b></p><br>`;
            
            //formula for translating wind directions from degrees to cardinal points
            function degToCompass(num) {
              let val = Math.floor((num / 22.5) + 0.5);
              let arr = ["Северное", "Северо-Северо-Восточное", "Северо-Восточное", "Восточно-Северо-Восточное", "Восточное", "Восточно-Юго-Восточное", "Юго-Восточное", "Юго-Юго-Восточное", "Южное", "Юго-Юго-Западное", "Юго-Западное", "Западное-Юго-Западное", "Западное", "Западно-Северо-Западное", "Северо-Западное", "Северо-Северо-Западное"];
              return arr[(val % 16)] || 'Нет данных по этому городу';
            }
            let deg = data.wind.deg;
            degToCompass(deg);
            
            out += `<p>Скорость ветра: <b>${data.wind.speed} м/с</b></p><br>`;
            out +=`<p class="deg-undef">Направление ветра: <b>${degToCompass(deg)}</b></p><br>`;
            out += `<p>Влажность: <b>${data.main.humidity}%</b></p><br>`;
            out += `<p>Давление: <b>${Math.round(data.main.pressure * 0.00750063755419211 * 100)} мм.рт.ст</b></p><br>`; // converting from megapascals to mm of mercury column
            $('#weather').html(out);
          }
        );
      });
    });
  });

});