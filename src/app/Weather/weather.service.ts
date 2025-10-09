
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {

 constructor(private http: HttpClient) {}
 
 //set public variables
 domain = "http://api.weatherapi.com/v1/";
 key:string = "2cbc315372e24bbaafe41000252404";
 
 private locationSrc = new BehaviorSubject<string>('none');
 location = this.locationSrc.asObservable();

 //location param
 getLocation():any {
  
  const locSrc = this.locationSrc.value;
  const locStorage = localStorage.getItem('location'); 
  
  if (locSrc == 'none')
  {
   return locStorage || 'none'; 
  }  
  else {
   return locSrc;
  }
 }

 setLocation(loc: string) {
  localStorage.setItem('location', loc.trim());
  this.locationSrc.next(loc);
 }
   
 //temp type param
 getTempType() {
  let tt = localStorage.getItem('temp type')?.trim();

  if (tt == undefined ) {
   tt = 'F'; //default to Fahreinheit
   this.setTempType(tt);
  }

  return tt;
 }

 setTempType(temp_type: string) {
  localStorage.setItem('temp type', temp_type);
 }

 //returns current forecast
 getCurrent(location:string):Observable<any> {
  const url:string = `${this.domain}current.json?key=${this.key}&q=${location}&aqi=no`;
  return this.http.get(url); 
 } 

 //returns hourly forecast
 getHourly(location:string):Observable<any> {
  const url:string = `${this.domain}forecast.json?key=${this.key}&q=${location}&days=2&aqi=no&alerts=no`;
  return this.http.get(url); 
 }

 //returns dailly forecast
 getDaily(location:string,numOfDays:number):Observable<any> {
  const url:string = `${this.domain}forecast.json?key=${this.key}&q=${location}&days=${numOfDays}&aqi=no&alerts=no`;
  return this.http.get(url); 
 }

 //gets local time for specified location
 getLocalTime(location:string):Observable<any> {
  const url = `${this.domain}timezone.json?key=${this.key}&q=${location}`;
  return this.http.get(url);
 }

 //get Lat and Lon for specified location
 getLatLon(location:string):Observable<any> {
  const key = "AIzaSyA6SlsexTUB33B0hWAIf-26M93lhMlE_tk";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${key}`;

  return this.http.get(url);
 }

 getLocationByLatLng(lat: number, lng: number):Observable<any> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  
  return this.http.get(url); 
}

 //fetches air quality 
 getAirQuality(lat: number, lng: number):Observable<any> {
  const key = "AIzaSyA6SlsexTUB33B0hWAIf-26M93lhMlE_tk";
  const url = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${key}`;

  let body = {
    "location": { "latitude": lat, "longitude": lng },
    "languageCode": "en",
    "extraComputations": ["HEALTH_RECOMMENDATIONS", "POLLUTANT_ADDITIONAL_INFO", 
     "DOMINANT_POLLUTANT_CONCENTRATION", "POLLUTANT_CONCENTRATION"]
  }
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 
  return this.http.post(url, body, { headers });
 }
}

