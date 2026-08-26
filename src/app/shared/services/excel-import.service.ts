import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExcelImportModalComponent, ExcelImportModalConfig } from '../components/excel-import-modal/excel-import-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ExcelImportService {
  constructor(private modalService: NzModalService) {}

  openImportModal(config: ExcelImportModalConfig): void {
    this.modalService.create({
      nzTitle: 'Xem trước & Nhập dữ liệu từ Excel',
      nzContent: ExcelImportModalComponent,
      nzData: { config },
      nzWidth: 960,
      nzFooter: null,
      nzMaskClosable: false,
    });
  }
}
