import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';

/**
 * @summary Global language selector of BevTrace.
 * @remarks Allows the user to switch between English and Spanish. It uses
 * ngx-translate to apply the language change reactively across the whole
 * application and persists the choice in the browser. It is placed in the
 * toolbar of the public views and of the main Layout.
 * @author BevTrace
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [MatButtonToggleGroup, MatButtonToggle],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {
  /**
   * Language code currently applied.
   */
  protected currentLang = 'en';

  /**
   * Language codes offered to the user.
   */
  protected languages: string[] = ['en', 'es'];

  /**
   * Translation service used to change the active language.
   */
  protected translate: TranslateService;

  /**
   * Creates a new LanguageSwitcher and reads the active language.
   */
  constructor() {
    this.translate = inject(TranslateService);
    this.currentLang = this.translate.getCurrentLang() || 'en';
  }

  /**
   * Applies and persists the selected language.
   *
   * @param language - Language code selected by the user
   */
  useLanguage(language: string): void {
    this.translate.use(language);
    this.currentLang = language;
    localStorage.setItem('bevtrace.lang', language);
  }
}
