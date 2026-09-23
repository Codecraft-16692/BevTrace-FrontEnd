import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * @summary Public top navigation bar (Toolbar) for BevTrace.
 * @remarks Presentational component that wraps the brand logo, the access
 * buttons and the language switcher. It is used in public views (sign-in,
 * sign-up and not-found) where the sidenav is not required.
 * @author BevTrace
 */
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLink, TranslatePipe, MatToolbarModule, MatButtonModule, LanguageSwitcher],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  /**
   * Store that exposes the authenticated session.
   */
  protected readonly iamStore = inject(IamStore);
}
