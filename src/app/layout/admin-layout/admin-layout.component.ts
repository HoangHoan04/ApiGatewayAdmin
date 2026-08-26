import { DashboardService, DashboardSettings } from '@/app/core/services';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  s: DashboardSettings;
  private sub = new Subscription();

  watermarkTiles: number[] = [];

  isNavigating = false;
  currentTransitionState = 'ready';

  constructor(
    private ds: DashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.s = ds.snapshot;
  }

  ngOnInit(): void {
    this.sub.add(
      this.ds.settings$.subscribe((settings) => {
        this.s = settings;
        this.updateWatermarkTiles();
        this.cdr.markForCheck();
      }),
    );
    this.updateWatermarkTiles();

    this.sub.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.isNavigating = true;
          if (this.s.pageTransition) {
            this.currentTransitionState = 'exit';
          }
          this.cdr.markForCheck();
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          setTimeout(() => {
            this.isNavigating = false;
            if (this.s.pageTransition) {
              this.currentTransitionState = 'enter';
              setTimeout(() => {
                this.currentTransitionState = 'ready';
                this.cdr.markForCheck();
              }, 400);
            }
            this.cdr.markForCheck();
          }, 300);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  prepareRoute(outlet: RouterOutlet): string | null {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  private updateWatermarkTiles(): void {
    const cols = Math.ceil(window.innerWidth / 180);
    const rows = Math.ceil(window.innerHeight / 140);
    this.watermarkTiles = Array.from({ length: cols * rows }, (_, i) => i);
  }
}
