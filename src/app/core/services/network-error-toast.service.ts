import { Injectable } from '@angular/core';
import { NzMessageRef, NzMessageService } from 'ng-zorro-antd/message';

const DEDUPE_MS = 3000;
const FALLBACK_MSG = 'Máy chủ đang kết nối hoặc có lỗi, vui lòng thử lại sau';

@Injectable({
  providedIn: 'root',
})
export class NetworkErrorToastService {
  private lastMessage = '';
  private lastShownAt = 0;
  private patched = false;

  constructor(private readonly message: NzMessageService) {
    this.patchMessageError();
  }

  text(): string {
    return FALLBACK_MSG;
  }

  notify(): string {
    const text = this.text();
    setTimeout(() => {
      this.message.error(text);
    }, 0);
    return text;
  }

  private patchMessageError(): void {
    if (this.patched) return;
    this.patched = true;

    const original = this.message.error.bind(this.message);

    this.message.error = ((content: any, options?: any) => {
      if (typeof content === 'string' && content.trim()) {
        const now = Date.now();
        if (content === this.lastMessage && now - this.lastShownAt < DEDUPE_MS) {
          return { messageId: `deduped-${now}` } as NzMessageRef;
        }
        this.lastMessage = content;
        this.lastShownAt = now;
      }
      return original(content, options);
    }) as NzMessageService['error'];
  }
}
