
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './assets/app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './assets/app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [ provideHttpClient(), provideRouter(routes) ] 
}).catch(err => console.error(err));

