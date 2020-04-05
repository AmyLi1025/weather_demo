import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { WeatherService } from '../service/weather.service';

import * as md5_module from 'md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  bError: boolean = false;
  bLoggedIn: boolean;
  oFormGroup: FormGroup;
  readonly USER_MAX_LENGTH: number = 30;

  constructor(
    private oRouter: Router,
    private oCookieService: CookieService,
    private oWeatherService: WeatherService
  ) { }

  ngOnInit(): void {
    this.bLoggedIn = !!this.oCookieService.get('username');
    this.oFormGroup = new FormGroup({
      'user': new FormControl('', [
        Validators.required,
        Validators.maxLength(this.USER_MAX_LENGTH)
      ]),
      'password': new FormControl('', [
        Validators.required
      ])
    }, {
      validators: identityCheckValidator
    });
  }

  /**
   * @param oEvent event, login form submit event
   * check user and password, if valid then navigate to home page
  */
  onLogin(oEvent) {
    var oFormData: LoginForm = this.oFormGroup.value;
    if (this.getValidity(oFormData.user, oFormData.password)) {
      this.oWeatherService.oLogonEmmiter.emit(oFormData.user);
      this.oCookieService.set('username', oFormData.user, 0.01, 'weather');
      this.oRouter.navigate(['']);
      oEvent.preventDefault();
    } else {
      this.bError = true;
    }
  }

  /**
   * @param sUser string, user name
   * @param sPassword string, password
   * @returns boolean, if the user is valid
  */
  getValidity(sUser: string, sPassword: string): boolean {
    var md5 = md5_module;
    return sUser === 'demo' && md5(sPassword) === 'e10adc3949ba59abbe56e057f20f883e';
  }

}

interface LoginForm {
  user: string,
  password: string
}

export const identityCheckValidator: ValidatorFn =
  (group: FormGroup): ValidationErrors | null => {
  return group.invalid ? { invalid: true } : null;
}
