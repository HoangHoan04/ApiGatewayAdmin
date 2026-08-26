import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NetworkErrorToastService } from '../services/network-error-toast.service';
import { isHttpNetworkError } from '../utils/http-network-error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private readonly injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: unknown) => {
        if (isHttpNetworkError(error)) {
          const networkToast = this.injector.get(NetworkErrorToastService);
          const message = networkToast.notify();
          const original = error as HttpErrorResponse;
          return throwError(
            () =>
              new HttpErrorResponse({
                error: message,
                headers: original.headers,
                status: 0,
                statusText: original.statusText || 'Unknown Error',
                url: original.url ?? undefined,
              }),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
