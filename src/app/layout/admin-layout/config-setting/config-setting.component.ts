import { DashboardService, DashboardSettings } from '@/app/core/services';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-config-setting',
  standalone: false,
  templateUrl: './config-setting.component.html',
  styleUrls: ['./config-setting.component.scss'],
})
export class ConfigSettingComponent implements OnInit, OnDestroy {
  s: DashboardSettings;
  configOpen = false;
  private sub = new Subscription();

  primaryColors = [
    { name: 'blue', value: '#3b82f6' },
    { name: 'sky', value: '#0284c7' },
    { name: 'cyan', value: '#06b6d4' },
    { name: 'teal', value: '#14b8a6' },
    { name: 'emerald', value: '#10b981' },
    { name: 'green', value: '#22c55e' },
    { name: 'yellow', value: '#f59e0b' },
    { name: 'orange', value: '#f97316' },
    { name: 'red', value: '#ef4444' },
    { name: 'slate', value: '#475569' },
  ];

  solidColors = [
    '#ffffff',
    '#f8fafc',
    '#f0fdf4',
    '#eff6ff',
    '#fdf2f8',
    '#faf5ff',
    '#fffbeb',
    '#f0f9ff',
    '#8f0b0b',
    '#f5f5f4',
  ];
  solidColorsDark = [
    '#000000',
    '#1e1e2e',
    '#18181b',
    '#0f172a',
    '#1a1a2e',
    '#16213e',
    '#0d1117',
    '#111827',
    '#1f2937',
    '#27272a',
  ];

  gradientColors = [
    'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    'linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)',
  ];

  gradientColorsDark = [
    'linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 100%)',
    'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)',
    'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    'linear-gradient(135deg, #0d0d0d 0%, #1a0533 100%)',
    'linear-gradient(135deg, #0f2027 0%, #203a43 100%)',
    'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)',
    'linear-gradient(135deg, #16222a 0%, #3a6073 100%)',
    'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
    'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
  ];

  layoutModes = [
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'detached', label: 'Detached' },
    { value: 'modern', label: 'Modern' },
    { value: 'two column', label: 'Two Column' },
    { value: 'hovered', label: 'Hovered' },
    { value: 'boxed', label: 'Boxed' },
    { value: 'horizontal single', label: 'HorizontalSingle' },
    { value: 'horizontal overlay', label: 'HorizontalOverlay' },
    { value: 'horizontal box', label: 'HorizontalBox' },
    { value: 'menu aside', label: 'Menu Aside' },
    { value: 'transparent', label: 'Transparent' },
    { value: 'without header', label: 'Without Header' },
    { value: 'RTL', label: 'RTL' },
  ];

  transitionEffects = [
    { value: 'fade', label: 'Fade' },
    { value: 'fade-side', label: 'FadeSide' },
    { value: 'fade-up', label: 'FadeUp' },
    { value: 'fade-down', label: 'FadeDown' },
    { value: 'fade-zoom', label: 'FadeZoom' },
    { value: 'slide-left', label: 'SlideLeft' },
    { value: 'slide-right', label: 'SlideRight' },
    { value: 'zoom-in', label: 'ZoomIn' },
    { value: 'zoom-out', label: 'ZoomOut' },
    { value: 'rotate', label: 'Rotate' },
    { value: 'flip-x', label: 'FlipX' },
    { value: 'flip-y', label: 'FlipY' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'slide-up', label: 'SlideUp' },
    { value: 'slide-down', label: 'SlideDown' },
  ];

  fontFamilies = ['Inter', 'Roboto', 'Montserrat', 'Playfair Display', 'Outfit'];
  tabStyles = [
    { value: 'chrome', label: 'Chrome' },
    { value: 'card', label: 'Card' },
    { value: 'icon', label: 'Icon' },
    { value: 'simple', label: 'Đơn giản' },
  ];

  constructor(
    public ds: DashboardService,
    private readonly message: NzMessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.s = ds.snapshot;
  }

  ngOnInit(): void {
    this.sub.add(
      this.ds.settings$.subscribe((settings) => {
        this.s = settings;
      }),
    );
    this.sub.add(
      this.ds.configOpen$.subscribe((open) => {
        this.configOpen = open;
        this.cdr.markForCheck();
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  close(): void {
    this.ds.setConfigOpen(false);
  }

  onVisibleChange(visible: boolean): void {
    if (this.configOpen === visible) return;
    this.configOpen = visible;
    this.ds.setConfigOpen(visible);
  }

  update(partial: Partial<DashboardSettings>): void {
    this.ds.updateSettings(partial);
    this.s = this.ds.snapshot;
  }

  reset(): void {
    this.ds.resetSettings();
    this.s = this.ds.snapshot;
  }

  copyConfig(): void {
    navigator.clipboard.writeText(JSON.stringify(this.s, null, 2));
    this.message.success('Đã sao chép cấu hình vào clipboard.');
  }

  colorLabel(name: string): string {
    return name;
  }

  clearCacheAndLogout(): void {
    localStorage.clear();
    window.location.reload();
  }

  onBreakpointChange(): void {}

  navbarPalette(mode: string): string[] {
    const isLight = mode === 'light';
    const type = this.s.navbarColorType;
    if (type === 'solid') return isLight ? this.solidColors : this.solidColorsDark;
    return isLight ? this.gradientColors : this.gradientColorsDark;
  }

  sidebarPalette(mode: string): string[] {
    const isLight = mode === 'light';
    const type = this.s.sidebarColorType;
    if (type === 'solid') return isLight ? this.solidColors : this.solidColorsDark;
    return isLight ? this.gradientColors : this.gradientColorsDark;
  }
}
