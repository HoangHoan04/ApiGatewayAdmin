import { DashboardService, DashboardSettings } from '@/app/core/services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  s: DashboardSettings;
  currentYear = new Date().getFullYear();
  private sub = new Subscription();

  constructor(private ds: DashboardService) {
    this.s = ds.snapshot;
  }

  ngOnInit(): void {
    this.sub.add(
      this.ds.settings$.subscribe((settings) => {
        this.s = settings;
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
