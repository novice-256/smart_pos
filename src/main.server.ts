import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

export default function bootstrap(context: BootstrapContext) {
  return bootstrapApplication(App, {
    ...config,
    providers: [
      ...(config.providers ?? []),
      provideNoopAnimations() // server-safe animations
    ]
  }, context);
}