import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TabItem {
  id: string;
  path: string;
  label: string;
}

export interface DashboardSettings {
  dynamicTitle: boolean;
  backToTop: boolean;
  watermark: boolean;
  watermarkText: string;
  theme: 'light' | 'dark' | 'system';
  colorBlind: boolean;
  grayscale: boolean;
  borderRadius: number;
  fontFamily: string;
  fontWeight: 'light' | 'normal' | 'medium' | 'semibold';
  titleSize: number;
  bodySize: number;
  boldText: boolean;
  italicText: boolean;
  uppercaseText: boolean;
  primaryColor: string;
  navbarColorType: 'solid' | 'gradient';
  navbarColorLight: string;
  navbarColorDark: string;
  sidebarColorType: 'solid' | 'gradient';
  sidebarColorLight: string;
  sidebarColorDark: string;
  layoutMode: string;
  sidebarPosition: 'left' | 'right' | 'top';
  configPosition: 'left' | 'right';
  showSidebar: boolean;
  collapseSidebar: boolean;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  accordionMenu: boolean;
  showTabs: boolean;
  persistTabs: boolean;
  dragTabs: boolean;
  showTabIcons: boolean;
  showMaximizeTab: boolean;
  tabStyle: 'chrome' | 'card' | 'icon' | 'simple';
  maxTabs: number;
  pageProgress: boolean;
  pageLoader: boolean;
  pageTransition: boolean;
  transitionEffect: string;
  showFooter: boolean;
  fixedFooter: boolean;
  companyName: string;
  companyWebsite: string;
  copyrightYear: string;
  icpNumber: string;
  icpLink: string;
}

const STORAGE_KEY = 'admin-dashboard-settings';
const DEFAULT_SETTINGS: DashboardSettings = {
  dynamicTitle: true,
  backToTop: true,
  watermark: false,
  watermarkText: 'ADMIN DASHBOARD',
  theme: 'light',
  colorBlind: false,
  grayscale: false,
  borderRadius: 8,
  fontFamily: 'Inter',
  fontWeight: 'normal',
  titleSize: 20,
  bodySize: 13,
  boldText: false,
  italicText: false,
  uppercaseText: false,
  primaryColor: '#3b82f6',
  navbarColorType: 'solid',
  navbarColorLight: '#ffffff',
  navbarColorDark: '#000000',
  sidebarColorType: 'solid',
  sidebarColorLight: '#ffffff',
  sidebarColorDark: '#000000',
  layoutMode: 'modern',
  sidebarPosition: 'left',
  configPosition: 'right',
  showSidebar: true,
  collapseSidebar: false,
  sidebarWidth: 260,
  sidebarCollapsedWidth: 70,
  accordionMenu: true,
  showTabs: true,
  persistTabs: true,
  dragTabs: true,
  showTabIcons: true,
  showMaximizeTab: true,
  tabStyle: 'chrome',
  maxTabs: 10,
  pageProgress: true,
  pageLoader: false,
  pageTransition: true,
  transitionEffect: 'fade-up',
  showFooter: true,
  fixedFooter: false,
  companyName: 'HOANG HOAN TECHNOLOGY',
  companyWebsite: 'https://hoanghoantechnology.ai',
  copyrightYear: '2026',
  icpNumber: 'ICP-VN-20260707',
  icpLink: 'https://icp.hoanghoantechnology.ai',
};

function loadSettings(): DashboardSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(s: DashboardSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private settingsSubject = new BehaviorSubject<DashboardSettings>(loadSettings());
  settings$ = this.settingsSubject.asObservable();

  private configOpenSubject = new BehaviorSubject<boolean>(false);
  configOpen$ = this.configOpenSubject.asObservable();
  get isConfigOpen(): boolean {
    return this.configOpenSubject.value;
  }

  private openTabsSubject = new BehaviorSubject<TabItem[]>([
    { id: 'HOME', path: '/', label: 'Trang chủ' },
  ]);
  openTabs$ = this.openTabsSubject.asObservable();
  get openTabs(): TabItem[] {
    return this.openTabsSubject.value;
  }

  private activeTabIdSubject = new BehaviorSubject<string>('HOME');
  activeTabId$ = this.activeTabIdSubject.asObservable();
  get activeTabId(): string {
    return this.activeTabIdSubject.value;
  }

  private isMaximizedSubject = new BehaviorSubject<boolean>(false);
  isMaximized$ = this.isMaximizedSubject.asObservable();
  get isMaximized(): boolean {
    return this.isMaximizedSubject.value;
  }

  get snapshot(): DashboardSettings {
    return this.settingsSubject.value;
  }

  constructor() {
    this.applyTheme(this.snapshot);
  }

  updateSettings(partial: Partial<DashboardSettings>): void {
    const next = { ...this.settingsSubject.value, ...partial };
    this.settingsSubject.next(next);
    saveSettings(next);
    this.applyTheme(next);
  }

  resetSettings(): void {
    this.settingsSubject.next({ ...DEFAULT_SETTINGS });
    saveSettings({ ...DEFAULT_SETTINGS });
    this.applyTheme(DEFAULT_SETTINGS);
  }

  setConfigOpen(open: boolean): void {
    this.configOpenSubject.next(open);
  }

  addTab(tab: TabItem): void {
    const tabs = this.openTabs;
    const exists = tabs.find((t) => t.id === tab.id);
    if (exists) {
      this.setActiveTabId(tab.id);
      return;
    }
    const settings = this.snapshot;
    let updated = [...tabs];
    if (updated.length >= settings.maxTabs) {
      if (updated.length > 1) updated.splice(1, 1);
      else updated.shift();
    }
    updated.push(tab);
    this.openTabsSubject.next(updated);
    this.setActiveTabId(tab.id);
  }

  removeTab(id: string): void {
    const tabs = this.openTabs;
    if (tabs.length <= 1) return;
    const filtered = tabs.filter((t) => t.id !== id);
    let nextActive = this.activeTabId;
    if (this.activeTabId === id) {
      const index = tabs.findIndex((t) => t.id === id);
      const nextTab = filtered[index] || filtered[index - 1];
      nextActive = nextTab ? nextTab.id : filtered[0].id;
    }
    this.openTabsSubject.next(filtered);
    this.activeTabIdSubject.next(nextActive);
  }

  setActiveTabId(id: string): void {
    this.activeTabIdSubject.next(id);
  }

  setOpenTabs(tabs: TabItem[]): void {
    this.openTabsSubject.next(tabs);
  }

  clearTabs(): void {
    this.openTabsSubject.next([{ id: 'HOME', path: '/', label: 'Trang chủ' }]);
    this.activeTabIdSubject.next('HOME');
  }

  setMaximized(val: boolean): void {
    this.isMaximizedSubject.next(val);
    document.documentElement.classList.toggle('s-maximized', val);
  }

  private applyTheme(s: DashboardSettings): void {
    const root = document.documentElement;
    const isDark =
      s.theme === 'dark' ||
      (s.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    root.setAttribute('data-layout', s.layoutMode);
    root.setAttribute('data-sidebar-position', s.sidebarPosition);
    root.setAttribute('data-config-position', s.configPosition);

    if (s.grayscale) root.style.setProperty('filter', 'grayscale(100%)');
    else if (s.colorBlind)
      root.style.setProperty('filter', 'contrast(120%) saturate(130%) sepia(20%)');
    else root.style.removeProperty('filter');

    root.style.setProperty('--primary', s.primaryColor);
    root.style.setProperty('--color-primary', s.primaryColor);
    root.style.setProperty('--primary-hover', this.shadeColor(s.primaryColor, -12));
    root.style.setProperty('--primary-active', this.shadeColor(s.primaryColor, -22));
    root.style.setProperty('--primary-muted', this.hexToRgba(s.primaryColor, isDark ? 0.18 : 0.12));
    root.style.setProperty('--ring', this.hexToRgba(s.primaryColor, 0.4));
    root.style.setProperty(
      '--shadow-primary',
      `0 8px 20px ${this.hexToRgba(s.primaryColor, 0.28)}`,
    );
    root.style.setProperty('--radius', `${s.borderRadius}px`);
    root.style.setProperty('--sidebar-width', `${s.sidebarWidth}px`);
    root.style.setProperty('--sidebar-collapsed-width', `${s.sidebarCollapsedWidth}px`);
    root.style.setProperty('--navbar-height', '64px');
    root.style.setProperty('--footer-height', '56px');
    if (s.fontFamily) root.style.setProperty('--font-family', s.fontFamily);
    root.style.setProperty('--title-size', `${s.titleSize}px`);
    root.style.setProperty('--body-size', `${s.bodySize}px`);
    const body = document.body;
    root.style.fontSize = `${s.bodySize}px`;
    root.style.fontFamily = s.fontFamily;
    if (body) {
      body.style.fontSize = `${s.bodySize}px`;
      body.style.fontFamily = s.fontFamily;
    }

    const w =
      s.fontWeight === 'light'
        ? '300'
        : s.fontWeight === 'normal'
          ? '400'
          : s.fontWeight === 'medium'
            ? '500'
            : '600';
    const fw = s.boldText ? '700' : w;
    root.style.fontWeight = fw;
    if (body) body.style.fontWeight = fw;
    if (s.italicText) {
      root.style.fontStyle = 'italic';
      if (body) body.style.fontStyle = 'italic';
    } else {
      root.style.fontStyle = 'normal';
      if (body) body.style.fontStyle = 'normal';
    }

    const navbarColor = isDark ? s.navbarColorDark : s.navbarColorLight;
    const sidebarColor = isDark ? s.sidebarColorDark : s.sidebarColorLight;
    root.style.setProperty('--navbar-bg', navbarColor);
    root.style.setProperty('--sidebar-bg', sidebarColor);
    root.setAttribute('data-navbar-color-type', s.navbarColorType);
    root.setAttribute('data-sidebar-color-type', s.sidebarColorType);

    root.classList.toggle('s-uppercase', s.uppercaseText);
    root.classList.toggle('s-show-footer', s.showFooter);
    root.classList.toggle('s-fixed-footer', s.fixedFooter);
    root.classList.toggle('s-show-sidebar', s.showSidebar);
    root.classList.toggle('s-collapse-sidebar', s.collapseSidebar);
    root.classList.toggle('s-show-tabs', s.showTabs);
    root.classList.toggle('s-watermark', s.watermark);
  }

  private hexToRgba(hex: string, alpha: number): string {
    const raw = (hex || '').replace('#', '').trim();
    if (raw.length !== 6) return `rgba(59, 130, 246, ${alpha})`;
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private shadeColor(hex: string, percent: number): string {
    const raw = (hex || '').replace('#', '').trim();
    if (raw.length !== 6) return hex;
    const num = parseInt(raw, 16);
    const clamp = (v: number) => Math.max(0, Math.min(255, v));
    const r = clamp((num >> 16) + Math.round(255 * (percent / 100)));
    const g = clamp(((num >> 8) & 0xff) + Math.round(255 * (percent / 100)));
    const b = clamp((num & 0xff) + Math.round(255 * (percent / 100)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}
