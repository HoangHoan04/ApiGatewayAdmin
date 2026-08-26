import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-coming-soon',
  template: `
    <div class="cs-container">
      <div class="cs-content">
        <h1 class="cs-title">Sắp ra mắt</h1>
        <p class="cs-desc">Tính năng đang được đội ngũ phát triển hoàn thiện.</p>
        <div class="cs-countdown">
          <div class="cs-unit">
            <span class="cs-value">{{ days | number: '2.0' }}</span>
            <span class="cs-label">Ngày</span>
          </div>
          <span class="cs-sep">:</span>
          <div class="cs-unit">
            <span class="cs-value">{{ hours | number: '2.0' }}</span>
            <span class="cs-label">Giờ</span>
          </div>
          <span class="cs-sep">:</span>
          <div class="cs-unit">
            <span class="cs-value">{{ minutes | number: '2.0' }}</span>
            <span class="cs-label">Phút</span>
          </div>
          <span class="cs-sep">:</span>
          <div class="cs-unit">
            <span class="cs-value">{{ seconds | number: '2.0' }}</span>
            <span class="cs-label">Giây</span>
          </div>
        </div>
        <button nz-button nzType="primary" routerLink="/">Về trang chủ</button>
      </div>
    </div>
  `,
  styles: [
    `
      .cs-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        padding: 24px;
        text-align: center;
        color: #fff;
      }
      .cs-content {
        max-width: 500px;
      }
      .cs-title {
        font-size: 48px;
        font-weight: 800;
        margin: 0 0 16px;
      }
      .cs-desc {
        font-size: 16px;
        opacity: 0.7;
        margin-bottom: 40px;
      }
      .cs-countdown {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 40px;
      }
      .cs-unit {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .cs-value {
        font-size: 42px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
      }
      .cs-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 2px;
        opacity: 0.6;
      }
      .cs-sep {
        font-size: 32px;
        font-weight: 700;
        opacity: 0.3;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class ComingSoonComponent implements OnInit, OnDestroy {
  targetDate = new Date('2026-12-31T00:00:00');
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  private interval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.calc();
    this.interval = setInterval(() => this.calc(), 1000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  private calc(): void {
    const diff = Math.max(0, this.targetDate.getTime() - Date.now());
    this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    this.minutes = Math.floor((diff / (1000 * 60)) % 60);
    this.seconds = Math.floor((diff / 1000) % 60);
  }
}
