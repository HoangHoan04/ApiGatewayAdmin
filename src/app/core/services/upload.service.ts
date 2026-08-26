import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFileResult, UploadMode } from '../models/upload.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private readonly api: ApiService) {}

  uploadSingle(file: File): Observable<UploadFileResult> {
    return this.api.uploadFile<UploadFileResult>(this.api.UPLOAD_FILE.UPLOAD_SINGLE, file);
  }

  uploadMulti(files: File[]): Observable<UploadFileResult[]> {
    return this.api.uploadFiles<UploadFileResult[]>(this.api.UPLOAD_FILE.UPLOAD_MULTI, files);
  }

  uploadImage(file: File): Observable<UploadFileResult> {
    return this.api.uploadFile<UploadFileResult>(this.api.UPLOAD_FILE.UPLOAD_IMAGE, file);
  }

  uploadAudio(file: File): Observable<UploadFileResult> {
    return this.api.uploadFile<UploadFileResult>(this.api.UPLOAD_FILE.UPLOAD_AUDIO, file);
  }

  uploadDocument(file: File): Observable<UploadFileResult> {
    return this.api.uploadFile<UploadFileResult>(this.api.UPLOAD_FILE.UPLOAD_DOCUMENT, file);
  }

  uploadCatbox(file: File): Observable<UploadFileResult> {
    return this.api.uploadFile<UploadFileResult>(this.api.UPLOAD_FILE.UPLOAD_CATBOX, file);
  }

  uploadCatboxFromUrl(url: string): Observable<UploadFileResult> {
    return this.api.post<UploadFileResult>(this.api.UPLOAD_FILE.UPLOAD_CATBOX_URL, { url });
  }

  uploadS3(file: File, folder?: string): Observable<UploadFileResult> {
    return this.api.uploadFileWithFields<UploadFileResult>(
      this.api.UPLOAD_FILE.UPLOAD_S3,
      file,
      folder ? { folder } : undefined,
    );
  }

  uploadSingleS3(file: File, isHd = false): Observable<UploadFileResult> {
    return this.api.uploadFileWithFields<UploadFileResult>(
      this.api.UPLOAD_FILE.UPLOAD_SINGLE_S3,
      file,
      {
        isHD: isHd ? 'true' : 'false',
      },
    );
  }

  uploadMultiS3(files: File[]): Observable<UploadFileResult[]> {
    return this.api.uploadFiles<UploadFileResult[]>(this.api.UPLOAD_FILE.UPLOAD_MULTI_S3, files);
  }

  uploadByMode(file: File, mode: UploadMode = 'single'): Observable<UploadFileResult> {
    switch (mode) {
      case 'image':
        return this.uploadImage(file);
      case 'document':
        return this.uploadDocument(file);
      case 'audio':
        return this.uploadAudio(file);
      case 'catbox':
        return this.uploadCatbox(file);
      case 's3':
        return this.uploadS3(file);
      default:
        return this.uploadSingle(file);
    }
  }
}
