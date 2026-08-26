import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private collapsed = new BehaviorSubject<boolean>(false);
  collapsed$ = this.collapsed.asObservable();

  toggle(): void {
    this.collapsed.next(!this.collapsed.value);
  }

  setCollapsed(value: boolean): void {
    this.collapsed.next(value);
  }
}
