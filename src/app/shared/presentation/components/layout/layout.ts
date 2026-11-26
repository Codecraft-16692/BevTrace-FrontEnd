import { Component, OnInit, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { UserSessionSection } from '../../../../iam/presentation/components/user-session-section/user-session-section';
import { IamStore } from '../../../../iam/application/iam.store';
import { IncidentStore } from '../../../../incident/application/incident.store';
import { Notification } from '../../../../incident/domain/model/notification.entity';

/**
 * Navigation option displayed in the sidenav.
 */
interface NavOption {
  /**
   * Translation key of the option label.
   */
  label: string;

  /**
   * Material icon of the option.
   */
  icon: string;

  /**
   * Route of the option or route prefix when it has children.
   */
  link: string;

  /**
   * Roles allowed to see the option, empty for every signed in user.
   */
  roles?: string[];

  /**
   * Sub-options displayed inside an expansion panel.
   */
  children?: { label: string; link: string; roles?: string[] }[];
}

const MANAGER = 'ROLE_LOGISTICS_MANAGER';

/**
 * @summary Main application layout of BevTrace.
 * @remarks Wraps every authenticated view with the fixed toolbar, the
 * notification bell and a role-aware sidenav grouped by bounded context.
 * Navigation entries are filtered with the roles of the signed in user.
 * @author BevTrace
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    TranslateModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
    LanguageSwitcher,
    UserSessionSection,
  ],
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  /**
   * Store that exposes the authenticated session.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Store that exposes the in-app notifications.
   */
  protected readonly incidentStore = inject(IncidentStore);

  /**
   * Sidenav display mode.
   */
  protected readonly sidenavMode: 'side' | 'over' = 'side';

  /**
   * Indicates whether the sidenav is opened by default.
   */
  protected readonly sidenavOpened = true;

  /**
   * Every navigation option of the application.
   */
  private readonly allOptions: NavOption[] = [
    { label: 'nav.dashboard', icon: 'dashboard', link: '/dashboard' },
    {
      label: 'nav.inventory',
      icon: 'inventory_2',
      link: '/inventory',
      children: [
        { label: 'inventory.catalog.title', link: '/inventory/products' },
        {
          label: 'inventory.product-form.title',
          link: '/inventory/products/new',
          roles: [MANAGER],
        },
        { label: 'inventory.batch-form.title', link: '/inventory/batches/new', roles: [MANAGER] },
        { label: 'inventory.entry.title', link: '/inventory/batches' },
        { label: 'inventory.waste.title', link: '/inventory/waste-records' },
        { label: 'inventory.reconciliation.title', link: '/inventory/reconciliations' },
      ],
    },
    {
      label: 'nav.dispatch',
      icon: 'local_shipping',
      link: '/dispatch',
      children: [
        { label: 'dispatch.queue.title', link: '/dispatch/orders' },
        { label: 'dispatch.form.title', link: '/dispatch/orders/new', roles: [MANAGER] },
      ],
    },
    {
      label: 'nav.traceability',
      icon: 'alt_route',
      link: '/traceability',
      children: [
        { label: 'traceability.map.title', link: '/traceability/logs' },
        { label: 'traceability.history.title', link: '/traceability/delivery-records' },
      ],
    },
    {
      label: 'nav.telemetry',
      icon: 'sensors',
      link: '/telemetry',
      children: [
        { label: 'telemetry.panel.title', link: '/telemetry/devices' },
        { label: 'telemetry.form.title', link: '/telemetry/devices/new', roles: [MANAGER] },
      ],
    },
    {
      label: 'nav.incidents',
      icon: 'warning_amber',
      link: '/incident',
      children: [
        { label: 'incident.dashboard.title', link: '/incident/incidents' },
        { label: 'incident.rules.title', link: '/incident/alert-rules' },
        { label: 'incident.notifications.title', link: '/incident/notifications' },
      ],
    },
    {
      label: 'nav.analytics',
      icon: 'insights',
      link: '/analytics',
      roles: [MANAGER],
      children: [
        { label: 'analytics.dashboard.title', link: '/analytics/kpis' },
        { label: 'analytics.reports.title', link: '/analytics/reports' },
      ],
    },
    {
      label: 'nav.subscription',
      icon: 'payments',
      link: '/subscription',
      roles: [MANAGER],
      children: [
        { label: 'subscription.billing.title', link: '/subscription/subscriptions' },
        { label: 'subscription.plans.title', link: '/subscription/plans' },
      ],
    },
    {
      label: 'nav.access',
      icon: 'manage_accounts',
      link: '/iam/users',
      roles: [MANAGER],
    },
    {
      label: 'nav.administration',
      icon: 'admin_panel_settings',
      link: '/admin',
      roles: ['ROLE_ADMIN'],
      children: [{ label: 'subscription.admin.title', link: '/subscription/admin/subscriptions' }],
    },
  ];

  /**
   * Navigation options and sub-options visible for the current user; what a role cannot open is hidden.
   */
  protected readonly options = computed(() =>
    this.allOptions
      .filter((option) => !option.roles || this.iamStore.hasAnyRole(option.roles))
      .map((option) =>
        option.children
          ? {
              ...option,
              children: option.children.filter(
                (child) => !child.roles || this.iamStore.hasAnyRole(child.roles),
              ),
            }
          : option,
      )
      .filter((option) => !option.children || option.children.length > 0),
  );

  /**
   * Notifications addressed to the roles of the current user.
   */
  protected readonly notifications = computed(() =>
    this.incidentStore
      .notifications()
      .filter((n) => n.recipientRole === 'ALL' || this.iamStore.hasAnyRole([n.recipientRole]))
      .slice(0, 6),
  );

  /**
   * Number of unread notifications.
   */
  protected readonly unreadCount = computed(
    () => this.notifications().filter((n) => !n.read).length,
  );

  /**
   * Creates a new Layout.
   *
   * @param router - Router used for navigation
   */
  constructor(private readonly router: Router) {}

  /**
   * Lifecycle hook that loads the notifications.
   */
  ngOnInit(): void {
    this.incidentStore.loadNotifications();
  }

  /**
   * Navigates to the specified route.
   *
   * @param link - Route to navigate to
   */
  protected navigateTo(link: string): void {
    this.router.navigate([link]).then();
  }

  /**
   * Determines whether a route is currently active.
   *
   * @param link - Route or route prefix to evaluate
   * @returns True when the current URL matches the link
   */
  protected isActive(link: string): boolean {
    const path = this.router.url.split(/[?#]/)[0];
    const matches = (candidate: string) => path === candidate || path.startsWith(`${candidate}/`);
    if (!matches(link)) return false;
    // Siblings such as /batches and /batches/new share a prefix: only the most specific one is active.
    const links = this.allOptions.flatMap((option) =>
      (option.children ?? []).map((child) => child.link),
    );
    return !links.some((other) => other.length > link.length && matches(other));
  }

  /**
   * Determines whether an expandable option contains the active route.
   *
   * @param option - Navigation option to evaluate
   * @returns True when any child route is active
   */
  protected isGroupActive(option: NavOption): boolean {
    return (option.children ?? []).some((child) => this.isActive(child.link));
  }

  /**
   * Marks a notification as read and opens the notification center.
   *
   * @param notification - Notification selected by the user
   */
  protected openNotification(notification: Notification): void {
    if (!notification.read) this.incidentStore.markNotificationRead(notification.id);
    this.navigateTo('/incident/notifications');
  }
}
