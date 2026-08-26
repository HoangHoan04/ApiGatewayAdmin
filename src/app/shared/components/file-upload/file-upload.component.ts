import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import { UploadFileResult, UploadMode } from '../../../core/models/upload.models';
import { UploadService } from '../../../core/services/upload.service';

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() mode: UploadMode = 'image';
  @Input() accept = 'image/*';
  @Input() maxSizeMb = 10;
  @Input() disabled = false;
  @Input() showUrlInput = false;
  @Output() uploaded = new EventEmitter<UploadFileResult>();

  fileList: NzUploadFile[] = [];
  fileUrl = '';
  uploading = false;
  previewVisible = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private readonly uploadService: UploadService,
    private readonly message: NzMessageService,
  ) {}

  writeValue(value: string | null): void {
    this.fileUrl = value || '';
    this.syncFileList();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const rawFile = (file as NzUploadFile & { size?: number })?.originFileObj
      ? (file as NzUploadFile).originFileObj!
      : (file as unknown as File);
    const size = (rawFile as File)?.size ?? (file as NzUploadFile).size ?? 0;
    const maxBytes = this.maxSizeMb * 1024 * 1024;
    if (size > maxBytes) {
      this.message.error(`Dung lượng tệp tin không được vượt quá ${this.maxSizeMb} MB.`);
      return false;
    }
    return true;
  };

  customRequest = (item: NzUploadXHRArgs): Subscription => {
    const file = item.file as unknown as File;
    this.uploading = true;
    return this.uploadService.uploadByMode(file, this.mode).subscribe({
      next: (result) => {
        this.uploading = false;
        this.fileUrl = result.fileUrl;
        this.onChange(result.fileUrl);
        this.onTouched();
        this.uploaded.emit(result);
        this.syncFileList();
        item.onSuccess?.(result, item.file, item.file as any);
        this.message.success(`Tải lên thành công.`);
      },
      error: (err) => {
        this.uploading = false;
        const msg = err?.error?.message || err?.message;
        this.message.error(msg || `Tải lên thất bại.`);
        item.onError?.(err, item.file);
      },
    });
  };

  onUrlInput(value: string): void {
    this.fileUrl = value;
    this.onChange(value);
    this.onTouched();
    this.syncFileList();
  }

  previewImage(): void {
    if (this.fileUrl) {
      this.previewVisible = true;
    }
  }

  removeFile(): void {
    if (this.disabled) return;
    this.fileUrl = '';
    this.onChange('');
    this.onTouched();
    this.fileList = [];
  }

  private syncFileList(): void {
    if (!this.fileUrl) {
      this.fileList = [];
      return;
    }

    this.fileList = [
      {
        uid: '-1',
        name: this.fileUrl.split('/').pop() || 'file',
        status: 'done',
        url: this.fileUrl,
      },
    ];
  }
}
