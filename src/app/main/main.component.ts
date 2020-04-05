import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WeatherService } from '../service/weather.service';

import { Chart } from 'chart.js';
import { ForecastChart } from '../entities/ForecastChart';
import { ActivatedRoute, Router } from '@angular/router';

import * as $ from 'jquery';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  oChartData: ForecastChart = {} as any;
  sCity: string = '';
  sCountry: string = '';

  constructor(
    private oWeatherService: WeatherService,
    private oRoute: ActivatedRoute
  ) { }

  /**
   * get weather forecast information
  */
  ngOnInit(): void {
    let sRouteCity = this.oRoute.snapshot.paramMap.get('city');
    if(sRouteCity) {
      this.getForeCast(sRouteCity);
    }
    //subscribe city change event and refresh chart after city changed
    this.oWeatherService.oCityChangeEmmiter.subscribe(sCity => this.getForeCast(sCity));
  }

  /**
   * set main tab as Active
  */
  ngAfterViewInit(): void {
    $('#main-tab')[0].click();
  }

  /**
   * @param sCity string optinal, the city which to get weather for
   * call weather service to get weather details and show in chart
  */
  getForeCast(sCity: string) {
    this.oWeatherService.getForecast(sCity, 10).subscribe(oForeCast => {
      if (oForeCast) {
        this.sCity = oForeCast.city.name;
        this.sCountry = oForeCast.city.country;
        this.oChartData = this.oWeatherService.convertChartData(oForeCast);
        this.showLineChart(this.oChartData);
      }
    });
  }

  /**
   * @param oChartData ForecastChart, data for chart display
  */
  showLineChart(oChartData: ForecastChart) {
    var canvas = document.getElementById('line_chart');
    if (canvas && canvas['getContext']) {
      var ctx = canvas['getContext']('2d');
      return new Chart(ctx, {
        type: 'line',
        data: {
          labels: oChartData.labels,
          datasets: [{
            label: 'Temperature °C',
            data: oChartData.temp,
            fill: false,
            borderColor: '#ec6e4c',
            spanGaps: true
          }]
        }
      });
    }
    return null;
  }

}
