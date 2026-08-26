import { RouteConfig, ROUTES_CONFIG } from '@/app/core/constants/common';
import { DashboardService } from '@/app/core/services';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface SearchItem {
  label: string;
  path: string;
  icon?: string;
}

interface RecentSearch {
  label: string;
  path: string;
}

@Component({
  selector: 'app-search-box',
  standalone: false,
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  isOpen = false;
  query = '';
  activeIndex = 0;
  recentSearches: RecentSearch[] = [];
  private sub = new Subscription();
  private allRoutes: SearchItem[] = [];

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
  ) {
    this.loadRecentSearches();
  }

  ngOnInit(): void {
    this.allRoutes = this.flattenRoutes();
    this.sub.add(
      this.dashboardService.settings$.subscribe(() => {
        this.allRoutes = this.flattenRoutes();
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private flattenRoutes(): SearchItem[] {
    const items: SearchItem[] = [];
    const traverse = (config: Record<string, RouteConfig>) => {
      for (const key of Object.keys(config)) {
        const route = config[key];
        if (route.path) {
          items.push({
            label: route.label,
            path: route.path,
            icon: route.icon || 'file-text',
          });
        }
        if (route.children) {
          traverse(route.children as Record<string, RouteConfig>);
        }
      }
    };
    traverse(ROUTES_CONFIG);
    return items;
  }

  get searchResults(): SearchItem[] {
    if (!this.query.trim()) return [];
    const q = this.query.toLowerCase().trim();
    return this.allRoutes.filter(
      (r) => this.getLabel(r).toLowerCase().includes(q) || r.path.toLowerCase().includes(q),
    );
  }

  get popularPages(): SearchItem[] {
    return this.allRoutes;
  }

  get navigableItems(): SearchItem[] {
    if (this.query.trim()) return this.searchResults;
    return this.recentSearches;
  }

  open(): void {
    this.isOpen = true;
    this.query = '';
    this.activeIndex = 0;
  }

  close(): void {
    this.isOpen = false;
  }

  @HostListener('window:keydown', ['$event'])
  handleGlobalKeydown(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (this.isOpen) this.close();
      else this.open();
    }
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  onInputKeydown(e: KeyboardEvent): void {
    const items = this.navigableItems;
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIndex = (this.activeIndex - 1 + items.length) % items.length;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = items[this.activeIndex];
      if (item) this.navigateTo(item);
    }
  }

  selectItem(item: SearchItem, idx: number): void {
    this.activeIndex = idx;
    this.navigateTo(item);
  }

  navigateTo(item: SearchItem): void {
    this.addRecentSearch(item);
    this.close();
    this.router.navigateByUrl(item.path);
  }

  removeRecent(event: MouseEvent, path: string): void {
    event.stopPropagation();
    this.recentSearches = this.recentSearches.filter((s) => s.path !== path);
    this.saveRecentSearches();
  }

  clearQuery(): void {
    this.query = '';
  }

  clearRecent(): void {
    this.recentSearches = [];
    localStorage.removeItem('recent_searches_v2');
    localStorage.removeItem('recent_searches');
  }

  private addRecentSearch(item: SearchItem): void {
    const recent: RecentSearch = { label: item.label, path: item.path };
    this.recentSearches = [
      recent,
      ...this.recentSearches.filter((s) => s.path !== item.path),
    ].slice(0, 5);
    this.saveRecentSearches();
  }

  private loadRecentSearches(): void {
    try {
      const saved = localStorage.getItem('recent_searches_v2');
      this.recentSearches = saved ? JSON.parse(saved) : [];
    } catch {
      this.recentSearches = [];
    }
  }

  private saveRecentSearches(): void {
    localStorage.setItem('recent_searches_v2', JSON.stringify(this.recentSearches));
  }

  getLabel(item: { label: string; path: string }): string {
    return item.label;
  }

  getIcon(item: SearchItem): string {
    return item.icon || 'file-text';
  }
}
