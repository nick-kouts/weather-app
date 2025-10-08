
import { Routes } from '@angular/router';
import { CurrentComponent } from './components/current/current.component';
import { HourlyComponent } from './components/hourly/hourly.component';
import { DailyComponent } from './components/daily/daily.component';

export const routes: Routes = [
  { path: '', component: CurrentComponent }, 
  { path: 'hourly/:location', component: HourlyComponent }, 
  { path:'daily/:location', component: DailyComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
