import { ImportResult } from '@/app/core/models/common.models';
import { ApiService } from '@/app/core/services/api.service';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import * as XLSX from 'xlsx';
import { PaginationConfig, TableColumn } from '../table-custom/table-custom.types';

export interface ExcelImportModalConfig {
  file: File;
  importUrl: string;
  entityName?: string;
  customUploadFn?: (file: File) => Promise<ImportResult> | import('rxjs').Observable<ImportResult>;
  onSuccess?: (result: ImportResult) => void;
}

@Component({
  selector: 'app-excel-import-modal',
  standalone: false,
  templateUrl: './excel-import-modal.component.html',
  styleUrls: ['./excel-import-modal.component.scss'],
})
export class ExcelImportModalComponent implements OnInit, OnDestroy {
  @Input() config!: ExcelImportModalConfig;

  file!: File;
  fileSizeFormatted = '';
  sheetNames: string[] = [];
  selectedSheet = '';
  headers: string[] = [];
  rows: any[] = [];
  totalRows = 0;
  previewRows: any[] = [];
  tableColumns: TableColumn[] = [];

  currentPage = 1;
  pageSize = 10;

  parsing = true;
  parseError = '';

  importing = false;
  progressPercent = 0;
  progressStatusMessage = '';
  private progressInterval: any = null;

  importCompleted = false;
  importResult: ImportResult | null = null;
  private cachedWorkbook: XLSX.WorkBook | null = null;

  constructor(
    private modalRef: NzModalRef,
    @Optional()
    @Inject(NZ_MODAL_DATA)
    private modalData: { config?: ExcelImportModalConfig } | null,
    private apiService: ApiService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  get paginationConfig(): PaginationConfig {
    return {
      current: this.currentPage,
      pageSize: this.pageSize,
      total: this.totalRows,
      showTotal: true,
    };
  }

  ngOnInit(): void {
    const activeConfig = this.config || this.modalData?.config;
    if (activeConfig?.file) {
      this.config = activeConfig;
      this.file = activeConfig.file;
      this.fileSizeFormatted = this.formatFileSize(this.file.size);
      setTimeout(() => {
        this.parseExcelFile(this.file);
      }, 0);
    } else {
      this.parseError = 'Không tìm thấy file Excel.';
      this.parsing = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.stopProgressAnimation();
    this.cachedWorkbook = null;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  parseExcelFile(file: File): void {
    this.parsing = true;
    this.parseError = '';
    this.cdr.detectChanges();

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.ngZone.run(() => {
        try {
          const buffer = e.target.result;
          const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
          this.cachedWorkbook = workbook;
          this.sheetNames = workbook.SheetNames || [];

          if (this.sheetNames.length === 0) {
            this.parseError = 'File Excel không có trang tính (Sheet) nào.';
            this.parsing = false;
            this.cdr.detectChanges();
            return;
          }

          this.selectedSheet = this.sheetNames[0];
          this.loadSheetData(workbook, this.selectedSheet);
          this.parsing = false;
        } catch (err: any) {
          console.error('Error parsing Excel file:', err);
          this.parseError = 'Không thể đọc nội dung file Excel: ' + (err?.message || err);
          this.parsing = false;
        } finally {
          this.cdr.detectChanges();
        }
      });
    };

    reader.onerror = (err) => {
      this.ngZone.run(() => {
        console.error('FileReader error:', err);
        this.parseError = 'Đã xảy ra lỗi khi đọc file.';
        this.parsing = false;
        this.cdr.detectChanges();
      });
    };

    reader.readAsArrayBuffer(file);
  }

  onSheetChange(sheetName: string): void {
    this.selectedSheet = sheetName;
    if (this.cachedWorkbook) {
      this.loadSheetData(this.cachedWorkbook, sheetName);
      this.cdr.detectChanges();
    }
  }

  private loadSheetData(workbook: XLSX.WorkBook, sheetName: string): void {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      this.headers = [];
      this.rows = [];
      this.totalRows = 0;
      this.tableColumns = [];
      this.updatePreviewRows();
      return;
    }

    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      blankrows: false,
    });

    if (jsonData.length === 0) {
      this.headers = [];
      this.rows = [];
      this.totalRows = 0;
      this.tableColumns = [];
      this.updatePreviewRows();
      return;
    }

    this.headers = (jsonData[0] || []).map((h: any, idx: number) =>
      h !== undefined && h !== null && String(h).trim() !== ''
        ? String(h).trim()
        : `Cột ${idx + 1}`,
    );

    const dataRows = jsonData.slice(1).filter((row: any[]) => {
      return row.some(
        (cell: any) => cell !== undefined && cell !== null && String(cell).trim() !== '',
      );
    });

    this.rows = dataRows.map((row: any[], rowIdx: number) => {
      const rowObj: Record<string, any> = { __rowNum: rowIdx + 2 };
      this.headers.forEach((header, colIdx) => {
        let val = row[colIdx];
        if (val instanceof Date) {
          const day = String(val.getDate()).padStart(2, '0');
          const month = String(val.getMonth() + 1).padStart(2, '0');
          const year = val.getFullYear();
          val = `${day}/${month}/${year}`;
        }
        rowObj[header] = val !== undefined && val !== null ? String(val).trim() : '';
      });
      return rowObj;
    });

    this.tableColumns = this.headers.map((h) => {
      const colWidth = Math.max(160, Math.min(360, h.length * 11 + 45));
      return {
        field: h,
        header: h,
        type: 'text' as const,
        sortable: true,
        width: colWidth,
        align: 'left' as const,
        ellipsis: true,
        tooltip: true,
      };
    });

    this.totalRows = this.rows.length;
    this.currentPage = 1;
    this.updatePreviewRows();
  }

  onTablePageChange(e: { page: number; pageSize: number }): void {
    this.currentPage = e.page;
    this.pageSize = e.pageSize;
    this.updatePreviewRows();
    this.cdr.detectChanges();
  }

  private updatePreviewRows(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.previewRows = this.rows.slice(start, start + this.pageSize);
  }

  confirmImport(): void {
    if (this.totalRows === 0) {
      this.message.warning('File Excel không có dòng dữ liệu nào để nhập.');
      return;
    }

    this.importing = true;
    this.progressPercent = 10;
    this.progressStatusMessage = 'Đang tải file lên máy chủ...';
    this.cdr.detectChanges();

    this.startProgressAnimation();

    if (this.config.customUploadFn) {
      const uploadResult = this.config.customUploadFn(this.file);
      if (uploadResult instanceof Promise) {
        uploadResult
          .then((res) => {
            this.ngZone.run(() => this.handleImportSuccess(res));
          })
          .catch((err) => {
            this.ngZone.run(() => this.handleImportError(err));
          });
      } else {
        uploadResult.subscribe({
          next: (res: any) => {
            this.ngZone.run(() => this.handleImportSuccess(res));
          },
          error: (err: any) => {
            this.ngZone.run(() => this.handleImportError(err));
          },
        });
      }
    } else if (this.config.importUrl) {
      const formData = new FormData();
      if (this.file) formData.append('file', this.file);
      this.apiService.uploadFile<ImportResult>(this.config.importUrl, formData).subscribe({
        next: (res: any) => {
          this.ngZone.run(() => this.handleImportSuccess(res));
        },
        error: (err: any) => {
          this.ngZone.run(() => this.handleImportError(err));
        },
      });
    } else {
      this.handleImportError('Không tìm thấy đường dẫn API nhập file.');
    }
  }

  private startProgressAnimation(): void {
    this.stopProgressAnimation();
    this.progressInterval = setInterval(() => {
      this.ngZone.run(() => {
        if (this.progressPercent < 90) {
          const step = Math.max(1, Math.floor((90 - this.progressPercent) / 5));
          this.progressPercent += step;
          if (this.progressPercent > 25 && this.progressPercent <= 65) {
            this.progressStatusMessage = 'Máy chủ đang phân tích và lưu trữ dữ liệu...';
          } else if (this.progressPercent > 65) {
            this.progressStatusMessage = 'Đang hoàn tất xử lý...';
          }
          this.cdr.detectChanges();
        }
      });
    }, 250);
  }

  private stopProgressAnimation(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private handleImportSuccess(res: ImportResult): void {
    this.stopProgressAnimation();
    this.progressPercent = 100;
    this.progressStatusMessage = 'Hoàn tất nhập dữ liệu!';
    this.importing = false;
    this.importCompleted = true;
    this.importResult = res;

    if (res.errorCount === 0) {
      this.message.success(`Nhập thành công toàn bộ ${res.successCount} dòng dữ liệu!`);
    } else {
      this.message.warning(
        `Đã nhập ${res.successCount}/${res.totalRows} dòng thành công, ${res.errorCount} dòng gặp lỗi.`,
      );
    }

    if (res.successCount > 0 && this.config.onSuccess) {
      this.config.onSuccess(res);
    }
    this.cdr.detectChanges();
  }

  private handleImportError(err: any): void {
    this.stopProgressAnimation();
    this.progressPercent = 0;
    this.importing = false;
    this.importCompleted = true;
    const errMsg =
      typeof err === 'string'
        ? err
        : err?.error?.message || err?.error || err?.message || 'Lỗi không xác định khi nhập file.';
    this.importResult = {
      totalRows: this.totalRows,
      successCount: 0,
      errorCount: this.totalRows,
      errors: [`Lỗi hệ thống: ${errMsg}`],
    };
    this.message.error(errMsg);
    this.cdr.detectChanges();
  }

  copyErrors(): void {
    if (!this.importResult?.errors?.length) return;
    const errorText = this.importResult.errors.join('\n');
    navigator.clipboard.writeText(errorText).then(() => {
      this.message.success('Đã sao chép danh sách lỗi vào clipboard!');
    });
  }

  closeModal(): void {
    this.stopProgressAnimation();
    this.modalRef.close(this.importResult);
  }
}
