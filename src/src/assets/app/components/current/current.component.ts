
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule, NgOptimizedImage} from '@angular/common';
import { WeatherService } from '../../Weather/weather.service';

@Component({
  selector: 'app-current',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  providers: [], 
  templateUrl: './current.component.html',
  styleUrl: './current.component.css'
})

export class CurrentComponent {
 ngModelOptions = { standalone: true };

 constructor(private weather:WeatherService) {}

 //set variables
 lat:number = 0;
 lng:number = 0;
 temp_type:string = '';
 location:string = '';
 loc_param:string = '';
 curr_temp:string = '';
 feelslike:string = '';
 windchill:string = '';
 dewpoint:string = '';
 localtime:string|any = '';
 conditions:string = '';
 icon:string = '';
 wind_mph:string = '';
 gust_mph:string = '';
 humidity:string = '';
 
 displayName = '';
 aqi = '';
 aqiDisplay = '';
 category = '';
 dominantPollutant = '';
 color = {};
 showForecast:boolean = false;
 showAQ:boolean = false;

 //init
 ngOnInit() {  
  
  //check for previous location
  const storageLoc = this.weather.getLocation();
  
  if (storageLoc == 'none') {
  
   //get default current location
   navigator.geolocation.getCurrentPosition(position => 
   {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    let data:any;
    
    this.weather.getLocationByLatLng(this.lat,this.lng).subscribe (e =>
     {
      const city = e.address.city;
      this.weather.setLocation(city);

      this.location = city;
      this.temp_type = this.weather.getTempType(); 
      this.weather.setTempType(this.temp_type);
    
      this.displayCurrentForecast(); 
     }
    )   
    }, 
    error => {
     console.error('Current: Geolocation error:', error);
    }
   )
  } 
  else {
   this.location = storageLoc;
   this.temp_type = this.weather.getTempType();
   this.displayCurrentForecast();
  }
 }

 //returns current forecast
 displayCurrentForecast():void 
 {
  
  this.weather.getLatLon(this.location).subscribe( e=> {
   
   if (e.status !== "ZERO_RESULTS")
   {
    this.showForecast = true;

    //set location 
    this.weather.setLocation(this.location);
   
    //extract values
    this.weather.getCurrent(this.location).subscribe(e=>
    {
     if(this.temp_type.toUpperCase() == "F") {
      this.curr_temp = e.current.temp_f;
      this.feelslike = e.current.feelslike_f 
      this.windchill = e.current.windchill_f 
      this.dewpoint = e.current.dewpoint_f 
     }
     else {
      this.curr_temp = e.current.temp_c;
      this.feelslike = e.current.feelslike_c 
      this.windchill = e.current.windchill_c 
      this.dewpoint = e.current.dewpoint_c
     }

     this.localtime = e.location.localtime.split(' ')[1]; 
     this.conditions = e.current.condition.text;
     this.icon = e.current.condition.icon;
     this.wind_mph = e.current.wind_mph
     this.gust_mph = e.current.gust_mph
     this.humidity = e.current.humidity
    })

    //get air quality
    this.getAirQuality(); 
   }
   else {
    this.showForecast = false;
    this.weather.setLocation("none");
   }
  })
} 

 //air quality
 getAirQuality():void {
  
  this.weather.getLatLon(this.location).subscribe(e=> {
   let resp = e.results[0].geometry.location;
    
   this.lat = resp.lat;
   this.lng = resp.lng;

   this.weather.getAirQuality(this.lat,this.lng).subscribe(e =>
   {
    this.showAQ = true;

    const resp  = e.indexes[0]; 

    this.displayName = resp.displayName;
    this.aqi = resp.aqi;
    this.aqiDisplay = resp.aqiDisplay;
    this.category = resp.category;
    this.dominantPollutant = resp.dominantPollutant;
    this.color = resp.color;
   },
   error => {
    this.showAQ = false;
   })
  })
 }

  //sets temp type
 setTempType():void {
  this.weather.setTempType(this.temp_type); 
 }

}
