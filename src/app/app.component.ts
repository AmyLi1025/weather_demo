import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { WeatherService } from './service/weather.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  sUserName: string;

  constructor(
    private oWeatherService: WeatherService,
    private oRouter: Router,
    private oCookieService: CookieService
  ) {
  }

  ngOnInit(): void {
    this.oWeatherService.oLogonEmmiter.subscribe(sName => {
      this.sUserName = sName;
    });
    this.sUserName = this.oCookieService.get('username');
    if(!this.sUserName) {
      this.navLogin();
    } else {
      //refresh weather data per 10 mins
      interval(10 * 60 * 1000).pipe().subscribe(_ => this.oWeatherService.oTimerEmmiter.emit());
    }
  }

  navLogin() {
    this.oRouter.navigate(['/login']);
  }

  logout() {
    this.oCookieService.deleteAll('weather');
    this.sUserName = "";
    this.navLogin();
  }

}