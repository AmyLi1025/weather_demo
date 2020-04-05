import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Weather } from '../entities/Weather';
import { Forecast } from '../entities/Forecast';
import { ForecastUIDetail, ForecastUI } from '../entities/ForecastUI';
import { ForecastChart } from '../entities/ForecastChart';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  readonly API_BASE_URL = 'http://api.openweathermap.org/data/2.5/';
  readonly API_KEY = '7ec083dd373bfc29ad9f3b553c1d11a4';
  readonly UNITS = 'metric';
  DEFAULT_CITY_NAME: string = 'Dalian';
  //update country information for below cities
  aUpdateCities: Array<string> = ['taiwan', 'hong kong', 'macao'];
  //event emitter for city changed
  oCityChangeEmmiter = new EventEmitter<string>();
  //event emitter to refresh weather data per 10 mins
  oTimerEmmiter = new EventEmitter();
  //event emitter to refresh user logon information
  oLogonEmmiter = new EventEmitter<string>();

  constructor(
    private http: HttpClient
  ) { }

  /**
   * @param sCity string
   * @returns Observable<Weather>
   * call open weather API to retrieve basic weather info
  */
  getWeatherByCity(sCity = this.DEFAULT_CITY_NAME): Observable<Weather> {
    return this.http.get<Weather>(this.API_BASE_URL + 'weather', {
      params: {
        q: sCity,
        appid: this.API_KEY,
        units: this.UNITS
      }
    }).pipe(
      tap(oWeather => {
        oWeather.main.temp = Math.round(oWeather.main.temp);
        oWeather.sys.sunrise *= 1000;
        oWeather.sys.sunset *= 1000;
        if(this.aUpdateCities.includes(oWeather.name.toLowerCase())) {
          oWeather.sys.country = 'CN';
        }
        oWeather.weather.map(item => {
          item.icon = "/assets/images/" + item.icon + "@2x.png";
        });
      }),
      catchError(this.handleError<any>('getWeatherByCity'))
    )
  }

  /**
   * @param sCity string
   * @param iCount number, how many recoard to retrieve
   * @returns Observable<Forecast>
   * call open weather API to retrieve weather forecast info
  */
  getForecast(sCity = this.DEFAULT_CITY_NAME, iCount = 40): Observable<Forecast> {
    return this.http.get<Forecast>(this.API_BASE_URL + 'forecast', {
      params: {
        q: sCity,
        appid: this.API_KEY,
        cnt: iCount.toString(),
        units: this.UNITS
      }
    }).pipe(
      tap(oForecast => {
        if(this.aUpdateCities.includes(oForecast.city.name.toLowerCase())) {
          oForecast.city.country = 'CN';
        }
      }),
      catchError(this.handleError<any>('getForeCast'))
    );
  }

  /**
   * @param oForecast Forecast, weather data from open weather API
   * @returns ForecastUI[]
   * convert the data from API structure to ForecastUI[] for page showing
  */
  convertForcastData(oForecast: Forecast): ForecastUI[] {
    let aForeCastData: ForecastUI[] = [];
    let oTempCast = {};
    oForecast.list.map(item => {
      let sDate = (new Date(item.dt * 1000)).toLocaleDateString();
      let oForecastData: ForecastUIDetail = {} as any;
      oForecastData.temp = item.main.temp.toFixed(1);
      oForecastData.weather_main = item.weather[0].main.toLowerCase();
      oForecastData.weather_desc = item.weather[0].description;
      oForecastData.image_url = "/assets/images/" + item.weather[0].icon + "@2x.png";
      oForecastData.humidity = item.main.humidity;
      oForecastData.pressure = item.main.pressure;
      oForecastData.wind_speed = item.wind.speed;
      oForecastData.datetime = item.dt * 1000;
      if (!oTempCast[sDate]) {
        oTempCast[sDate] = [];
      }
      oTempCast[sDate].push(oForecastData);
    });
    for (let sKey in oTempCast) {
      let oForecastItem: ForecastUI = {} as any;
      oForecastItem.date = sKey;
      oForecastItem.datetime = oTempCast[sKey][0].datetime;
      oForecastItem.data = oTempCast[sKey];
      aForeCastData.push(oForecastItem);
    }
    return aForeCastData;
  }

  /**
   * @param oForecast Forecast, weather data from open weather API
   * @returns ForecastChart
   * convert the data from API structure to ForecastChart for chart showing
  */
  convertChartData(oForecast: Forecast): ForecastChart {
    let oForecastChart: ForecastChart = {
      labels: [],
      icons: [],
      temp: [],
      wind_speed: [],
      pressure: []
    };
    oForecast.list.map(item => {
      let sTime = (new Date(item.dt * 1000)).toLocaleTimeString().substr(0, 5);
      oForecastChart.labels.push(sTime);
      oForecastChart.temp.push(item.main.temp);
      oForecastChart.icons.push("/assets/images/" + item.weather[0].icon + "@2x.png");
      oForecastChart.wind_speed.push(item.wind.speed);
      oForecastChart.pressure.push(item.main.pressure);
    })
    return oForecastChart;
  }

  private handleError<T>(opration = 'Operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${opration} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
