
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WeatherService } from './Weather/weather.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
 
 //refresh upon tab activation 
 @HostListener('window:focus', ['$event'])
 onFocus(event: Event): void {
  location.reload();
 }

 constructor(private weather:WeatherService ) {
  console.log('AppComponent Loaded');
 }

 title = 'CS701 TermProject - Nick Koutsoulidakis';
 location:any = '';

 hideLinks = true;
 
 linkDisabled = {
  pointerEvents:'none',
  opacity:'0.5',
  cursor:'not-allowed',
  textDecoration:'none'
 }
 
 linkEnabled = {
  pointerEvents:'auto',
  opacity:1,
  cursor:'pointer',
  textDecoration:'underline'
 }

 //init
 ngOnInit() {
  this.weather.location.subscribe(e => {
    this.location = (e === 'none') ? this.weather.getLocation() : e;
    
    if (this.location === 'none') {
     this.hideLinks = true;
    } 
    else { 
     this.hideLinks = false;
    }
   }); 
 }

}
