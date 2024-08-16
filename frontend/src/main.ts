import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { JwtInterceptor } from './app/services/interceptor.service';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes)),
     provideAnimationsAsync(),
     provideHttpClient(),
     {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi:true
     }
  ]
}).catch(err => console.error(err));
