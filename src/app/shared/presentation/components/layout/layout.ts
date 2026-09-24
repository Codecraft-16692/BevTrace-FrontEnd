import { Component, OnInit, computed, inject } from '@angular/core';
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
  children?: { label: string; link: string }[];
}

const MANAGER = 'ROLE_LOGISTICS_MANAGER';
const OPERATOR = 'ROLE_WAREHOUSE_OPERATOR';

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
        { label: 'inventory.catalog.title', link: '/inventory/catalog' },
        { label: 'inventory.entry.title', link: '/inventory/batch-entry' },
        { label: 'inventory.batch-form.title', link: '/inventory/batch-form' },
        { label: 'inventory.waste.title', link: '/inventory/waste' },
        { label: 'inventory.reconciliation.title', link: '/inventory/reconciliation' },
      ],
    },
    {
      label: 'nav.dispatch',
      icon: 'local_shipping',
      link: '/dispatch',
      children: [
        { label: 'dispatch.queue.title', link: '/dispatch/queue' },
        { label: 'dispatch.form.title', link: '/dispatch/new' },
      ],
    },
    {
      label: 'nav.traceability',
      icon: 'alt_route',
      link: '/traceability',
      children: [
        { label: 'traceability.map.title', link: '/traceability/route-map' },
        { label: 'traceability.history.title', link: '/traceability/history' },
      ],
    },
    {
      label: 'nav.telemetry',
      icon: 'sensors',
      link: '/telemetry',
      children: [
        { label: 'telemetry.panel.title', link: '/telemetry/devices' },
        { label: 'telemetry.form.title', link: '/telemetry/device-form' },
      ],
    },
    {
      label: 'nav.incidents',
      icon: 'warning_amber',
      link: '/incidents',
      children: [
        { label: 'incident.dashboard.title', link: '/incidents/dashboard' },
        { label: 'incident.rules.title', link: '/incidents/rules' },
        { label: 'incident.notifications.title', link: '/incidents/notifications' },
      ],
    },
    {
      label: 'nav.analytics',
      icon: 'insights',
      link: '/analytics',
      roles: [MANAGER],
      children: [
        { label: 'analytics.dashboard.title', link: '/analytics/dashboard' },
        { label: 'analytics.reports.title', link: '/analytics/reports' },
      ],
    },
    {
      label: 'nav.subscription',
      icon: 'payments',
      link: '/subscriptions',
      roles: [MANAGER],
      children: [
        { label: 'subscription.billing.title', link: '/subscriptions/billing' },
        { label: 'subscription.plans.title', link: '/subscriptions/plans' },
      ],
    },
    {
      label: 'nav.administration',
      icon: 'admin_panel_settings',
      link: '/admin',
      roles: ['ROLE_ADMIN'],
      children: [
        { label: 'iam.users.title', link: '/iam/users' },
        { label: 'subscription.admin.title', link: '/subscriptions/admin' },
      ],
    },
  ];

  /**
   * Navigation options visible for the current user.
   */
  protected readonly options = computed(() =>
    this.allOptions.filter((option) => !option.roles || this.iamStore.hasAnyRole(option.roles)),
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
  protected readonly unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);

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
    return this.router.url === link || this.router.url.startsWith(`${link}/`);
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
    this.navigateTo('/incidents/notifications');
  }
}
