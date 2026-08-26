import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, of, tap } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/common.models';
import {
  NotificationItem,
  NotificationFilter,
  BroadcastNotificationPayload,
  NotificationSetting,
} from '../models/notification/notification.models';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService implements OnDestroy {
  private readonly unreadCountSubject = new BehaviorSubject<number>(0);
  public readonly unreadCount$ = this.unreadCountSubject.asObservable();

  private readonly newNotificationSubject = new Subject<NotificationItem>();
  public readonly newNotification$ = this.newNotificationSubject.asObservable();

  private hubConnection?: signalR.HubConnection;
  private isConnecting = false;

  constructor(
    private readonly api: ApiService,
    private readonly authService: AuthService,
    private readonly nzNotification: NzNotificationService,
  ) {
    this.initSignalR();
  }

  ngOnDestroy(): void {
    this.stopConnection();
  }

  public initSignalR(): void {
    if (this.hubConnection || this.isConnecting) return;

    const hubBase = environment.apiUrl ? environment.apiUrl.replace(/\/api\/v1\/?$/, '') : '';
    const hubUrl = `${hubBase}/hubs/notifications`;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => this.authService.token || '',
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.hubConnection.on('ReceiveNotification', (notification: NotificationItem) => {
      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
      this.newNotificationSubject.next(notification);

      if (notification?.title) {
        this.nzNotification.create(
          this.mapSeverityToNzType(notification.severity),
          notification.title,
          notification.content || '',
          {
            nzDuration: 5000,
            nzPlacement: 'topRight',
          },
        );
      }
    });

    this.hubConnection.on('ReceiveUnreadCount', (count: number) => {
      this.unreadCountSubject.next(count);
    });

    this.startConnection();
  }

  public startConnection(): void {
    if (!this.hubConnection || this.hubConnection.state === signalR.HubConnectionState.Connected || this.isConnecting) {
      return;
    }

    if (!this.authService.isLoggedIn) {
      return;
    }

    this.isConnecting = true;
    this.hubConnection
      .start()
      .then(() => {
        this.isConnecting = false;
      })
      .catch(() => {
        this.isConnecting = false;
      });
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().catch(() => undefined);
      this.hubConnection = undefined;
    }
  }

  private mapSeverityToNzType(severity?: string): 'info' | 'success' | 'warning' | 'error' {
    switch (severity?.toUpperCase()) {
      case 'SUCCESS':
        return 'success';
      case 'WARNING':
        return 'warning';
      case 'DANGER':
      case 'ERROR':
        return 'error';
      default:
        return 'info';
    }
  }

  getNotifications(filter: NotificationFilter): Observable<PagedResult<NotificationItem>> {
    return this.api.post<PagedResult<NotificationItem>>(this.api.NOTIFICATION.PAGINATION, filter).pipe(
      catchError(() =>
        of({
          items: [],
          pageIndex: 1,
          pageSize: 10,
          totalCount: 0,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        }),
      ),
    );
  }

  getUnreadCount(): Observable<number> {
    return this.api.get<number>(this.api.NOTIFICATION.UNREAD_COUNT).pipe(
      catchError(() => of(0)),
      tap((count) => {
        this.unreadCountSubject.next(count || 0);
      }),
    );
  }

  markRead(ids: string[]): Observable<boolean> {
    return this.api.post<boolean>(this.api.NOTIFICATION.MARK_READ, { ids }).pipe(
      tap(() => {
        this.getUnreadCount().subscribe();
      }),
    );
  }

  markAllRead(): Observable<number> {
    return this.api.post<number>(this.api.NOTIFICATION.MARK_ALL_READ, {}).pipe(
      tap(() => {
        this.unreadCountSubject.next(0);
      }),
    );
  }

  deleteNotification(id: string): Observable<boolean> {
    return this.api.post<boolean>(this.api.NOTIFICATION.DELETE, { id }).pipe(
      tap(() => {
        this.getUnreadCount().subscribe();
      }),
    );
  }

  broadcast(payload: BroadcastNotificationPayload): Observable<number> {
    return this.api.post<number>(this.api.NOTIFICATION.BROADCAST, payload);
  }

  getSettings(): Observable<NotificationSetting> {
    return this.api.get<NotificationSetting>(this.api.NOTIFICATION.SETTINGS);
  }

  updateSettings(settings: NotificationSetting): Observable<boolean> {
    return this.api.post<boolean>(this.api.NOTIFICATION.SETTINGS, settings);
  }

  setUnreadCount(count: number): void {
    this.unreadCountSubject.next(count);
  }
}
