import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { NotificationItem } from '../../../core/models/notification/notification.models';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html',
  styleUrls: ['./navbar-notification.component.scss'],
  standalone: false,
})
export class NavbarNotificationComponent implements OnInit, OnDestroy {
  unreadCount = 0;
  notifications: NotificationItem[] = [];
  loading = false;
  popoverVisible = false;

  private pollSubscription?: Subscription;
  private unreadSub?: Subscription;
  private newNotifSub?: Subscription;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.unreadSub = this.notificationService.unreadCount$.subscribe((count) => {
      this.unreadCount = count;
      this.cdr.markForCheck();
    });

    this.newNotifSub = this.notificationService.newNotification$.subscribe((item) => {
      if (item) {
        this.notifications = [item, ...this.notifications.filter((n) => n.id !== item.id)].slice(
          0,
          10,
        );
        this.cdr.markForCheck();
      }
    });

    this.loadUnreadCount();
    this.pollSubscription = interval(60000).subscribe(() => {
      this.loadUnreadCount();
    });
  }

  ngOnDestroy(): void {
    this.pollSubscription?.unsubscribe();
    this.unreadSub?.unsubscribe();
    this.newNotifSub?.unsubscribe();
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadCount = count || 0;
        this.cdr.markForCheck();
      },
    });
  }

  onVisibleChange(visible: boolean): void {
    this.popoverVisible = visible;
    if (visible) {
      this.loadLatestNotifications();
    }
  }

  loadLatestNotifications(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.notificationService
      .getNotifications({
        pageIndex: 1,
        pageSize: 5,
      })
      .subscribe({
        next: (res) => {
          this.notifications = res.items || [];
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  markAllAsRead(): void {
    if (this.unreadCount === 0) return;
    this.notificationService.markAllRead().subscribe({
      next: () => {
        this.unreadCount = 0;
        this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
        this.cdr.markForCheck();
      },
    });
  }

  onNotificationClick(item: NotificationItem): void {
    if (!item.isRead) {
      this.notificationService.markRead([item.id]).subscribe();
      item.isRead = true;
      this.cdr.markForCheck();
    }
    this.popoverVisible = false;

    if (item.targetUrl) {
      this.router.navigateByUrl(item.targetUrl);
    }
  }

  viewAll(): void {
    this.popoverVisible = false;
    this.router.navigate(['/system-settings/notification-center']);
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'LEAVE':
        return 'calendar';
      case 'OVERTIME':
        return 'clock-circle';
      case 'PAYSLIP':
        return 'dollar-circle';
      case 'ATTENDANCE':
        return 'schedule';
      case 'CONTRACT':
        return 'file-text';
      case 'RECRUITMENT':
        return 'usergroup-add';
      case 'PERFORMANCE':
        return 'trophy';
      case 'ANNOUNCEMENT':
        return 'sound';
      default:
        return 'bell';
    }
  }

  getTypeColor(type: string, severity: string): string {
    if (severity === 'DANGER') return '#ff4d4f';
    if (severity === 'WARNING') return '#faad14';
    if (severity === 'SUCCESS') return '#52c41a';

    switch (type) {
      case 'LEAVE':
        return '#1890ff';
      case 'OVERTIME':
        return '#fa8c16';
      case 'PAYSLIP':
        return '#52c41a';
      case 'ATTENDANCE':
        return '#13c2c2';
      case 'CONTRACT':
        return '#722ed1';
      case 'RECRUITMENT':
        return '#eb2f96';
      case 'ANNOUNCEMENT':
        return '#2f54eb';
      default:
        return '#1890ff';
    }
  }

  getRelativeTime(dateStr: string): string {
    if (!dateStr) return '';
    const now = new Date().getTime();
    const date = new Date(dateStr).getTime();
    const diffSeconds = Math.max(0, Math.floor((now - date) / 1000));

    if (diffSeconds < 60) return 'Vừa xong';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return new Date(dateStr).toLocaleDateString('vi-VN');
  }
}
