import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { HourlyComponent } from './hourly/hourly.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [{
  path: '',
  component: HomeComponent,
  children: [
    {
      path: '',
      redirectTo: 'main/Dalian',
      pathMatch: 'full'
    }, {
      path: 'main/:city',
      component: MainComponent
    }, {
      path: 'hourly/:city',
      component: HourlyComponent
    }
  ]
}, {
  path: 'main/:city',
  component: MainComponent
}, {
  path: 'hourly/:city',
  component: HourlyComponent
}, {
  path: 'login',
  component: LoginComponent
}, {
  path: '**',
  component: NotfoundComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
