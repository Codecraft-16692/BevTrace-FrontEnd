import { Component, inject, signal } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component of the BevTrace application.
 *
 * @remarks
 * Registers the supported languages and restores the language chosen by the
 * user in a previous visit, falling back to English.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  /**
   * Title of the application.
   */
  protected readonly title = signal('BevTrace');

  /**
   * Translation service used to configure the languages.
   */
  private translate = inject(TranslateService);

  /**
   * Creates the root component and configures the active language.
   */
  constructor() {
    this.translate.addLangs(['en', 'es']);
    const saved = localStorage.getItem('bevtrace.lang');
    this.translate.use(saved === 'es' ? 'es' : 'en');
  }
}
