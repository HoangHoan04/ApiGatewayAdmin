import { DashboardService } from '@/app/core/services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toggle-theme',
  standalone: false,
  templateUrl: './toggle-theme.component.html',
  styleUrls: ['./toggle-theme.component.scss'],
})
export class ToggleThemeComponent implements OnInit, OnDestroy {
  theme: 'light' | 'dark' | 'system' = 'light';
  animating = false;
  nextTheme: 'light' | 'dark' | 'system' | null = null;
  private sub = new Subscription();
  private transEndHandler: (() => void) | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.sub.add(
      this.dashboardService.settings$.subscribe((s) => {
        this.theme = s.theme;
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.removeTransEndHandler();
  }

  get themeIcon(): string {
    if (this.theme === 'dark') return 'moon';
    if (this.theme === 'light') return 'sun';
    return 'desktop';
  }

  get themeLabel(): string {
    if (this.theme === 'dark') return 'Tối';
    if (this.theme === 'light') return 'Sáng';
    return 'Hệ thống';
  }

  get isDark(): boolean {
    return (
      this.theme === 'dark' ||
      (this.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }

  cycleTheme(): void {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const idx = order.indexOf(this.theme);
    const next = order[(idx + 1) % order.length];

    this.removeTransEndHandler();

    document.documentElement.classList.add('theme-transitioning');
    this.dashboardService.updateSettings({ theme: next });
    this.nextTheme = next;
    this.animating = true;

    this.transEndHandler = () => {
      document.documentElement.classList.remove('theme-transitioning');
      this.removeTransEndHandler();
    };
    document.documentElement.addEventListener('transitionend', this.transEndHandler);
  }

  onOverlayAnimEnd(): void {
    this.animating = false;
    this.nextTheme = null;
  }

  private removeTransEndHandler(): void {
    if (this.transEndHandler) {
      document.documentElement.removeEventListener('transitionend', this.transEndHandler);
      this.transEndHandler = null;
    }
  }
}
