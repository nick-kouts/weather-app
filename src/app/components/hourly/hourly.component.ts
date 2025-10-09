
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule, NgOptimizedImage} from '@angular/common';
import { WeatherService } from '../../Weather/weather.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-hourly',
  standalone:true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: './hourly.component.html',
  styleUrl: './hourly.component.css'
})

export class HourlyComponent {

  //set public variables 
  location:any = '';
  hourlyForecast:any[] = [];
  numOfHours:number = 10; //number of hours in forecast

  constructor(private weather:WeatherService,private route: ActivatedRoute) {}
  
  //init
  ngOnInit():void {
   //get location parameter
   this.route.params.subscribe( params => {
    this.location = params['location'];
 
    if (this.location == 'none') {   
     this.location = this.weather.getLocation();
    }
   })     
   
   this.getHourly(); 
  }

  //returns local time for specified location
  async getLocalTime():Promise<number> {
   let currentHour:any;
   
   //response
   const resp = await firstValueFrom(this.weather.getHourly(this.location));
   
   //parse hour from localtime
   currentHour = resp.location.localtime;
   currentHour = currentHour.split(" ")[1].split(":")[0];
   
   return Number(currentHour);
  }

  //gets hourly forecast
  async getHourly() 
  {
   //set variables 
   //let currentHour = await this.getLocalTime();
   let hour = await this.getLocalTime();
   let hour_converted = 0;
   let day = 0; 
   let temp_type:any = '';

   this.weather.getHourly(this.location).subscribe(e => 
   { 
    let iLoop:number = 1; //starting loop index
   
    while(iLoop <= this.numOfHours) 
    {
     //change to next day after 23rd hour
     if(hour==24) {
      day++; 
      hour = 0;
     }
     
     //get this hour's forecast for this day
     let ret = e.forecast.forecastday[day].hour[hour];

     //convert to am/pm hour 
     if (hour == 0) {
      hour_converted = 12;
     }
     else if (hour<=12) {
      hour_converted = hour;
     }
     else {
      hour_converted = hour - 12;
     }

     //get temp type 
     temp_type = this.weather.getTempType();
          
     //create JSON obj 
     let obj = {
      'hour_military':hour,
      'hour':hour_converted,
      "am_pm": (hour<12?'am':'pm'),
      'temp':(temp_type=="F"?ret.temp_f:ret.temp_c),
      'wind':ret.wind_mph,
      'wind_dir':ret.wind_dir,
      "gust_mph":ret.gust_mph,
      'condition':ret.condition.text,
      'icon':ret.condition.icon,
      'humidity':ret.humidity,
      'dewpoint':(temp_type=="F"?ret.dewpoint_f:ret.dewpoint_c),
      'snow':ret.chance_of_snow,
      'rain':ret.chance_of_rain
     } 

     //add to array
     this.hourlyForecast.push(obj);

     //increment hour & loop indexes
     hour+=1;
     iLoop+=1;
    }
   })
  }
}
