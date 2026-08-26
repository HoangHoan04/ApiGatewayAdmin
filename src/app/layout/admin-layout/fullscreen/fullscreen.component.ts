import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-fullscreen',
  standalone: false,
  templateUrl: './fullscreen.component.html',
})
export class FullscreenComponent implements OnInit, OnDestroy {
  isFullscreen = false;
  private onFsChange: (() => void) | null = null;

  ngOnInit(): void {
    this.onFsChange = () => {
      this.isFullscreen = !!document.fullscreenElement;
    };
    document.addEventListener('fullscreenchange', this.onFsChange);
  }

  ngOnDestroy(): void {
    if (this.onFsChange) {
      document.removeEventListener('fullscreenchange', this.onFsChange);
    }
  }

  toggle(): void {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .catch((err) => console.error('Fullscreen error:', err));
    } else {
      document.exitFullscreen();
    }
  }
}
