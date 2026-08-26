import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

export interface ActionConfirmOptions {
  title: string;
  content: string;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'default';
  icon?: 'confirm' | 'warning' | 'info' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class ActionConfirmService {
  constructor(private readonly modal: NzModalService) {}

  confirm(options: ActionConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.modal.confirm({
        nzTitle: options.title,
        nzContent: options.content,
        nzOkText: options.okText ?? 'Xác nhận',
        nzCancelText: options.cancelText ?? 'Hủy',
        nzOkType: options.okType ?? 'primary',
        nzIconType: options.icon === 'warning' ? 'exclamation-circle' : 'question-circle',
        nzOnOk: () => resolve(true),
        nzOnCancel: () => resolve(false),
      });
    });
  }

  confirmActivate(entityKey: string, itemName: string): Promise<boolean> {
    const entity = `${entityKey.charAt(0).toUpperCase()}${entityKey.slice(1)}`;
    return this.confirm({
      title: 'Xác nhận kích hoạt',
      content: `Bạn có chắc chắn muốn kích hoạt ${entity} "${itemName}" không?`,
      okText: 'Xác nhận',
      okType: 'primary',
      icon: 'confirm',
    });
  }

  confirmDeactivate(entityKey: string, itemName: string): Promise<boolean> {
    const entity = `${entityKey.charAt(0).toUpperCase()}${entityKey.slice(1)}`;
    return this.confirm({
      title: 'Xác nhận vô hiệu hóa',
      content: `Bạn có chắc chắn muốn vô hiệu hóa ${entity} "${itemName}" không?`,
      okText: 'Xác nhận',
      okType: 'primary',
      icon: 'warning',
    });
  }
}
