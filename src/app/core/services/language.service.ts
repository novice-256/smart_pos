// core/services/language.service.ts

import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type AppLanguage = 'ur' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private renderer: Renderer2;

  private currentLang = new BehaviorSubject<AppLanguage>('ur');
  lang$ = this.currentLang.asObservable();

  constructor(
    private translate: TranslateService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);

    const initialLang = this.detectInitialLanguage();
    this.setLanguage(initialLang);
  }

  /**
   * Detect initial language safely (SSR safe)
   */
  private detectInitialLanguage(): AppLanguage {

    if (!this.isBrowser) {
      return 'ur'; 
    }

    const savedLang = localStorage.getItem('preferred_lang') as AppLanguage | null;
    if (savedLang === 'ur' || savedLang === 'en') {
      return savedLang;
    }

    const browserLang = navigator.language?.split('-')[0];
    if (browserLang === 'ur' || browserLang === 'en') {
      return browserLang;
    }

    return 'ur';
  }

  /**
   * Change language safely
   */
 setLanguage(lang: AppLanguage) {

  if (this.currentLang.value === lang) {
    return;
  }

  this.currentLang.next(lang);
  this.translate.use(lang);

  if (!this.isBrowser) return;

  const direction = lang === 'ur' ? 'rtl' : 'ltr';

  this.renderer.setAttribute(document.documentElement, 'dir', direction);
  this.renderer.setAttribute(document.documentElement, 'lang', lang);

  localStorage.setItem('preferred_lang', lang);
}

}
