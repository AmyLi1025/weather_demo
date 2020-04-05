import { Component, OnInit } from '@angular/core';
import { Weather } from '../entities/Weather';
import { WeatherService } from '../service/weather.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  oWeather: Weather;
  sSearchKey: string;
  bNotFound: boolean = false;
  oRequestTime: Date = new Date();

  constructor(
    private oWeatherService: WeatherService,
    private oRouter: Router,
    private oCookieService: CookieService
  ) {
  }

  /**
   * check if user already logon, otherwise navigate to login page
  */
  ngOnInit(): void {
    if(!this.oCookieService.get('username')) {
      this.oRouter.navigate(['/login']);
    } else {
      this.getWeather(this.oWeatherService.DEFAULT_CITY_NAME);
      this.oWeatherService.oTimerEmmiter.subscribe(_ => this.refresh());
    }
    
  }

  /**
   * @param oEvent event, search event
   * refresh weather infor based on user's search key
  */
  onSearch(oEvent) {
    this.refresh();
    oEvent.preventDefault();
  }

  /**
   * @param sCity string optinal, the city which to get weather for
   * call weather service to get weather details
  */
  getWeather(sCity? : string) {
    this.oWeatherService.getWeatherByCity(sCity).subscribe(oWeatherData => {
      if(!oWeatherData) {
        this.oWeather = {} as any;
        this.bNotFound = true;
      } else {
        this.bNotFound = false;
        this.oWeather = oWeatherData;
        this.oRequestTime = new Date();
        //emit event since city changed so that other tabs could refresh base on it
        this.oWeatherService.oCityChangeEmmiter.emit(oWeatherData.name);
      }
    });
  }

  /**
   * refresh weather info based on new city name
  */
  refresh() {
    this.getWeather(this.sSearchKey);
  }

}
