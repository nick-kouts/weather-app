
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule, NgOptimizedImage} from '@angular/common';
import { WeatherService } from '../../Weather/weather.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

//import { FormsModule } from '@angular/forms'
//import { CommonModule, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-daily',
  standalone:true,
  imports:  [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.css'
})

export class DailyComponent {
 
 //set public variables 
 location:any = '';
 dailyForecast:any[] = [];
 numOfDays:number = 10; //number of days in forecast

 constructor( private weather:WeatherService, private route:ActivatedRoute ) {}

 ngOnInit(){  
  //get location parameter
  this.route.params.subscribe( params => {
   this.location = params['location'];

   if (this.location == 'none') {   
    this.location = this.weather.getLocation();
   }
  })
    
  this.displayDailyForecast();
 }

  //returns local time for specified location
 async getLocalTime(hour_or_date:number):Promise<any> {
  let currentDateTime:any;
   
  //response
  const resp = await firstValueFrom(this.weather.getHourly(this.location));
   
  currentDateTime = resp.location.localtime;
  
  if(hour_or_date == 1) {
   //parse hour from localtime 
   currentDateTime = currentDateTime.split(" ")[1].split(":")[0];
   return Number(currentDateTime);
  }
  else {
   //parse date from localtime 
   currentDateTime = currentDateTime.split(" ")[0];
   return String(currentDateTime);
  } 
 }

 //returns daily forecast - 10 days
 async displayDailyForecast() {
  
  //set variables 
  let hour = await this.getLocalTime(1);

  let date = await this.getLocalTime(2)+"T00:00:00";
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];
  const date2 = new Date(date);
  let index = date2.getDay();
    
  let hour_converted = 0;
  let temp_type:any = '';

  //get this hour's forecast for next 10 days
  this.weather.getDaily(this.location,this.numOfDays).subscribe( e=>
  {
  
   for(let i=0;i<this.numOfDays;i++) { 
  
    let ret = e.forecast.forecastday[i].hour[hour];
    
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
     "day_of_week":days[index],
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
    this.dailyForecast.push(obj);
    
    //increment index
    index++;

    if (index === 7) {
     index=0; 
    }
   }
  }) 
 } 

 
 
}
