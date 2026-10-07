import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IamStore } from '../../../application/iam.store';

/**
 * Component that shows the authenticated user and the sign-out action.
 *
 * @remarks
 * This presentation component is rendered inside the toolbar of the main
 * layout. It displays the user initials, name and primary role.
 */
@Component({
  selector: 'app-user-session-section',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './user-session-section.html',
  styleUrl: './user-session-section.css',
})
export class UserSessionSection {
  /**
   * Store that exposes the authenticated session.
   */
  protected readonly store = inject(IamStore);

  /**
   * Router used to navigate after signing out.
   */
  private readonly router = inject(Router);

  /**
   * Closes the current session.
   */
  protected signOut(): void {
    this.store.signOut(this.router);
  }
}
