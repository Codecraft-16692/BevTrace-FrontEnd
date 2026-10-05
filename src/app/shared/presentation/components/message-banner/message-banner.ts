import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

import { AppMessage } from '../../../domain/model/app-message';

/**
 * Component that renders a translated user-facing message.
 *
 * @remarks
 * Application stores expose errors and success messages as translation keys.
 * This shared presentation component renders them with the proper color and
 * icon, and stays hidden when there is no message.
 */
@Component({
  selector: 'app-message-banner',
  standalone: true,
  imports: [TranslatePipe, MatIconModule],
  templateUrl: './message-banner.html',
  styleUrl: './message-banner.css',
})
export class MessageBanner {
  /**
   * Message to render, null hides the banner.
   */
  readonly message = input<AppMessage | null>(null);

  /**
   * Visual style of the banner.
   */
  readonly type = input<'error' | 'success' | 'warn'>('error');

  /**
   * Resolves the Material icon of the banner.
   *
   * @returns Material icon identifier
   */
  protected icon(): string {
    if (this.type() === 'success') return 'check_circle';
    if (this.type() === 'warn') return 'warning_amber';
    return 'error_outline';
  }
}
