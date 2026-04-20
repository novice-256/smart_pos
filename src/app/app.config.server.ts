import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


const serverConfig: ApplicationConfig = {
  providers: [
 provideAnimationsAsync(),
    
    provideServerRendering(withRoutes(serverRoutes))

  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
