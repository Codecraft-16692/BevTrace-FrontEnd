import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { Toolbar } from '../../components/toolbar/toolbar';

/**
 * Component rendered when the requested route does not exist.
 *
 * @remarks
 * This presentation component offers a link back to the landing page.
 */
@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink, TranslateModule, MatIconModule, Toolbar],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css',
})
export class PageNotFound {}
