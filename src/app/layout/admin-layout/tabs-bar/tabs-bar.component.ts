import { getRouteByPath } from '@/app/core/constants/common';
import { DashboardService, DashboardSettings, TabItem } from '@/app/core/services';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-tabs-bar',
  standalone: false,
  templateUrl: './tabs-bar.component.html',
  styleUrls: ['./tabs-bar.component.scss'],
})
export class TabsBarComponent implements OnInit, AfterViewInit, OnDestroy {
  s: DashboardSettings;
  openTabs: TabItem[] = [];
  activeTabId = 'HOME';
  isMaximized = false;
  draggedIndex: number | null = null;
  pinnedTabs: string[] = [];
  containerWidth = 800;
  contextMenu: { x: number; y: number; tabId: string } | null = null;

  @ViewChild('tabsContainer', { static: false }) tabsContainerRef!: ElementRef;

  private sub = new Subscription();

  constructor(
    public ds: DashboardService,
    private router: Router,
  ) {
    this.s = ds.snapshot;
    this.openTabs = ds.openTabs;
    this.activeTabId = ds.activeTabId;
    this.isMaximized = ds.isMaximized;
  }

  ngOnInit(): void {
    const stored = localStorage.getItem('pinned_tabs');
    if (stored) {
      try {
        this.pinnedTabs = JSON.parse(stored);
      } catch {
        this.pinnedTabs = [];
      }
    }

    this.sub.add(
      this.ds.openTabs$.subscribe((tabs) => {
        this.openTabs = tabs;
      }),
    );
    this.sub.add(
      this.ds.activeTabId$.subscribe((id) => {
        this.activeTabId = id;
      }),
    );
    this.sub.add(
      this.ds.isMaximized$.subscribe((v) => {
        this.isMaximized = v;
      }),
    );
    this.sub.add(
      this.ds.settings$.subscribe((settings) => {
        this.s = settings;
      }),
    );

    this.sub.add(
      this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
        const path = this.router.url.split('?')[0];
        const matchingTab = this.openTabs.find((t) => t.path === path);
        if (matchingTab && matchingTab.id !== this.activeTabId) {
          this.ds.setActiveTabId(matchingTab.id);
        } else if (!matchingTab) {
          const route = getRouteByPath(path);
          if (route && route.path === path) {
            this.ds.addTab({
              id: route.key,
              path: route.path,
              label: route.label,
            });
          }
        }
      }),
    );
  }

  ngAfterViewInit(): void {
    this.updateContainerWidth();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateContainerWidth();
  }

  private updateContainerWidth(): void {
    if (this.tabsContainerRef) {
      this.containerWidth = this.tabsContainerRef.nativeElement.clientWidth;
    }
  }

  togglePinTab(id: string): void {
    if (this.pinnedTabs.includes(id)) {
      this.pinnedTabs = this.pinnedTabs.filter((tId) => tId !== id);
    } else {
      this.pinnedTabs = [...this.pinnedTabs, id];
    }
    localStorage.setItem('pinned_tabs', JSON.stringify(this.pinnedTabs));
  }

  closeTab(id: string): void {
    if (this.openTabs.length <= 1) return;
    this.ds.removeTab(id);
    setTimeout(() => {
      const currentTab = this.openTabs.find((t) => t.id === this.ds.activeTabId);
      if (currentTab) this.router.navigateByUrl(currentTab.path);
    }, 50);
  }

  closeOtherTabs(id: string): void {
    const keep = this.openTabs.filter((t) => t.id === id || this.pinnedTabs.includes(t.id));
    this.ds.setOpenTabs(keep);
    this.ds.setActiveTabId(id);
    const target = this.openTabs.find((t) => t.id === id);
    if (target) this.router.navigateByUrl(target.path);
  }

  closeTabsToLeft(id: string): void {
    const index = this.openTabs.findIndex((t) => t.id === id);
    if (index === -1) return;
    const keep = this.openTabs.filter(
      (_, idx) => idx >= index || this.pinnedTabs.includes(this.openTabs[idx].id),
    );
    this.ds.setOpenTabs(keep);
    if (!keep.some((t) => t.id === this.activeTabId)) {
      this.ds.setActiveTabId(id);
      const target = this.openTabs.find((t) => t.id === id);
      if (target) this.router.navigateByUrl(target.path);
    }
  }

  closeTabsToRight(id: string): void {
    const index = this.openTabs.findIndex((t) => t.id === id);
    if (index === -1) return;
    const keep = this.openTabs.filter(
      (_, idx) => idx <= index || this.pinnedTabs.includes(this.openTabs[idx].id),
    );
    this.ds.setOpenTabs(keep);
    if (!keep.some((t) => t.id === this.activeTabId)) {
      this.ds.setActiveTabId(id);
      const target = this.openTabs.find((t) => t.id === id);
      if (target) this.router.navigateByUrl(target.path);
    }
  }

  closeAllTabs(): void {
    let keep = this.openTabs.filter((t) => this.pinnedTabs.includes(t.id));
    if (!keep.some((t) => t.path === '/')) {
      keep.unshift({ id: 'HOME', path: '/', label: 'Trang chủ' });
    }
    this.ds.setOpenTabs(keep);
    this.ds.setActiveTabId('HOME');
    this.router.navigateByUrl('/');
  }

  duplicateTab(id: string): void {
    const target = this.openTabs.find((t) => t.id === id);
    if (!target) return;
    const dupId = `${target.id}_dup_${Date.now()}`;
    const index = this.openTabs.findIndex((t) => t.id === id);
    const updated = [...this.openTabs];
    updated.splice(index + 1, 0, { ...target, id: dupId });
    this.ds.setOpenTabs(updated);
    this.ds.setActiveTabId(dupId);
    this.router.navigateByUrl(target.path);
  }

  refreshTab(id: string): void {
    const target = this.openTabs.find((t) => t.id === id);
    if (target) {
      this.router.navigateByUrl('/500').then(() => {
        setTimeout(() => this.router.navigateByUrl(target.path), 50);
      });
    }
  }

  refreshAllTabs(): void {
    window.location.reload();
  }

  selectTab(tab: TabItem): void {
    this.ds.setActiveTabId(tab.id);
    this.router.navigateByUrl(tab.path);
  }

  onDragStart(index: number): void {
    if (!this.s.dragTabs) return;
    this.draggedIndex = index;
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
  }

  onDrop(index: number): void {
    if (this.draggedIndex === null || !this.s.dragTabs) return;
    const reordered = [...this.openTabs];
    const [removed] = reordered.splice(this.draggedIndex, 1);
    reordered.splice(index, 0, removed);
    this.ds.setOpenTabs(reordered);
    this.draggedIndex = null;
  }

  onContextMenu(e: MouseEvent, tabId: string): void {
    e.preventDefault();
    this.contextMenu = { x: e.clientX, y: e.clientY, tabId };
  }

  @HostListener('window:click')
  closeContextMenu(): void {
    this.contextMenu = null;
  }

  get sortedTabs(): TabItem[] {
    return [...this.openTabs].sort((a, b) => {
      const aPinned = this.pinnedTabs.includes(a.id);
      const bPinned = this.pinnedTabs.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }

  get tabWidth(): number {
    if (this.s.tabStyle === 'icon') return 55;
    if (this.s.tabStyle === 'chrome') return 150;
    return 130;
  }

  get visibleTabs(): TabItem[] {
    const availableWidth = Math.max(100, this.containerWidth - 100);
    const maxVisible = Math.floor(availableWidth / this.tabWidth);
    const tabs = this.sortedTabs;
    if (tabs.length <= maxVisible || maxVisible <= 1) return tabs;
    let visible = tabs.slice(0, maxVisible);
    const activeIndex = tabs.findIndex((t) => t.id === this.activeTabId);
    if (activeIndex >= maxVisible) {
      visible[visible.length - 1] = tabs[activeIndex];
    }
    return visible;
  }

  get overflowTabs(): TabItem[] {
    const availableWidth = Math.max(100, this.containerWidth - 100);
    const maxVisible = Math.floor(availableWidth / this.tabWidth);
    const tabs = this.sortedTabs;
    if (tabs.length <= maxVisible || maxVisible <= 1) return [];
    let overflow = tabs.slice(maxVisible);
    const activeIndex = tabs.findIndex((t) => t.id === this.activeTabId);
    if (activeIndex >= maxVisible) {
      overflow = overflow.filter((t) => t.id !== this.activeTabId);
      overflow.unshift(tabs[maxVisible - 1]);
    }
    return overflow;
  }

  getRouteIcon(tab: TabItem): string {
    const route = getRouteByPath(tab.path);
    return route?.icon || 'dashboard';
  }

  getRouteLabel(tab: TabItem): string {
    const route = getRouteByPath(tab.path);
    return route ? route.label : tab.label || tab.id;
  }
}
