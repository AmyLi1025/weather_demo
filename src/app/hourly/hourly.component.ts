import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WeatherService } from '../service/weather.service';
import { ForecastUI } from '../entities/ForecastUI';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.css']
})
export class HourlyComponent implements OnInit, AfterViewInit {

  aForeCastData: ForecastUI[] = [];
  sCity: string = '';
  sCountry: string = '';

  constructor(
    private oWeatherService: WeatherService,
    private oRoute: ActivatedRoute,
    private oRouter: Router,
    private oCookieService: CookieService
  ) { }

  /**
   * check if user already logon, otherwise navigate to login page
  */
  ngOnInit(): void {
    if(!this.oCookieService.get('username')) {
      this.oRouter.navigate(['/login']);
    } else {
      this.getForeCast(this.oRoute.snapshot.paramMap.get('city'));
      //subscribe city change event
      this.oWeatherService.oCityChangeEmmiter.subscribe(sCity => this.getForeCast(sCity));
    }
  }

  /**
   * set hourly tab as Active
  */
  ngAfterViewInit(): void {
    $('#hourly-tab')[0].click();
  }

  /**
   * @param sCity string optinal, the city which to get weather for
   * call weather service to get weather details
  */
  getForeCast(sCity: string) {
    this.oWeatherService.getForecast(sCity).subscribe(oForeCast => {
      if (oForeCast) {
        this.sCity = oForeCast.city.name;
        this.sCountry = oForeCast.city.country;
        this.aForeCastData = this.oWeatherService.convertForcastData(oForeCast);
      }
    });
  }

}
