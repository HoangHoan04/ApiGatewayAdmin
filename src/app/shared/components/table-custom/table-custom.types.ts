import { TemplateRef } from '@angular/core';

export interface TableColumn<T = any> {
  field: string;
  header: string;
  width?: string | number;
  body?: TemplateRef<any>;
  sortable?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  filterMatchMode?: string;
  style?: Record<string, any>;
  headerStyle?: Record<string, any>;
  bodyStyle?: Record<string, any>;
  frozen?: boolean;
  alignFrozen?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
  resizable?: boolean;
  type?:
    | 'text'
    | 'number'
    | 'currency'
    | 'date'
    | 'datetime'
    | 'boolean'
    | 'badge'
    | 'tag'
    | 'image';
  dateFormat?: string;
  currencySymbol?: string;
  numberFormat?: string;
  badgeSeverity?: (value: any) => 'success' | 'info' | 'warning' | 'danger' | 'secondary';
  badgeColor?: (value: any) => string;
  tagSeverity?: (value: any) => 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'primary';
  render?: (value: any, row?: any) => string;
  renderBoolean?: (value: boolean) => string;
  renderEmpty?: () => string;
}

export interface FilterMeta {
  [field: string]: {
    value: any;
    matchMode?: string;
  };
}

export interface RowAction<T = any> {
  key: string;
  label?: string;
  icon?: string;
  tooltip?: string;
  severity?: 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'primary';
  onClick?: (record: T, index: number) => void;
  disabled?: boolean | ((record: T) => boolean);
  visible?: boolean | ((record: T) => boolean);
  loading?: boolean | ((record: T) => boolean);
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showTotal?: boolean;
  serverSide?: boolean;
  pageSizeOptions?: number[];
}

export interface ToolbarConfig {
  show?: boolean;
  align?: 'left' | 'center' | 'right' | 'between';
  showRefreshButton?: boolean;
}

export interface TableAction {
  key: string;
  label?: string;
  icon?: string;
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'default';
  onClick?: () => void | Promise<any> | import('rxjs').Observable<any>;
  loading?: boolean | (() => boolean);
  disabled?: boolean;
  visible?: boolean | (() => boolean);
  subActions?: TableAction[];
  acceptFiles?: string;
  onFileSelect?: (file: File) => void | Promise<any> | import('rxjs').Observable<any>;
  importUrl?: string | (() => string);
  templateUrl?: string | (() => string);
  exportUrl?: string | (() => string);
  getPayload?: () => any;
  fallbackFileName?: string;
  entityName?: string;
  onSuccess?: (result?: any) => void;
  __open?: boolean;
}

export interface UploadExcelOptions {
  templateUrl?: string | (() => string);
  importUrl?: string | (() => string);
  entityName?: string;
  onDownloadTemplate?: () => void | Promise<any> | import('rxjs').Observable<any>;
  onUploadFile?: (file: File) => void | Promise<any> | import('rxjs').Observable<any>;
  onSuccess?: (result?: any) => void;
  acceptFiles?: string;
  loading?: boolean | (() => boolean);
}

export interface ExportExcelOptions {
  exportUrl?: string | (() => string);
  getPayload?: () => any;
  fallbackFileName?: string;
  onClick?: () => void | Promise<any> | import('rxjs').Observable<any>;
  loading?: boolean | (() => boolean);
}

export const CommonActions = {
  create: (onClick?: () => void | Promise<any> | import('rxjs').Observable<any>): TableAction => ({
    key: 'create',
    label: 'Thêm mới',
    icon: 'plus-circle',
    severity: 'success',
    onClick,
  }),

  update: (onClick?: () => void | Promise<any> | import('rxjs').Observable<any>): TableAction => ({
    key: 'update',
    label: 'Cập nhật',
    icon: 'edit',
    severity: 'warning',
    onClick,
  }),

  delete: (onClick?: () => void | Promise<any> | import('rxjs').Observable<any>): TableAction => ({
    key: 'delete',
    label: 'Xóa',
    icon: 'delete',
    severity: 'danger',
    onClick,
  }),

  refresh: (onClick?: () => void | Promise<any> | import('rxjs').Observable<any>): TableAction => ({
    key: 'refresh',
    label: 'Làm mới',
    icon: 'reload',
    severity: 'info',
    onClick,
  }),

  uploadExcel: (
    onDownloadOrOptions?:
      | (() => void | Promise<any> | import('rxjs').Observable<any>)
      | UploadExcelOptions,
    onUploadFile?: (file: File) => void | Promise<any> | import('rxjs').Observable<any>,
  ): TableAction => {
    if (onDownloadOrOptions && typeof onDownloadOrOptions === 'object') {
      const opts = onDownloadOrOptions as UploadExcelOptions;
      return {
        key: 'upload',
        label: 'Nhập Excel',
        icon: 'file-excel',
        severity: 'primary',
        acceptFiles: opts.acceptFiles,
        importUrl: opts.importUrl,
        templateUrl: opts.templateUrl,
        entityName: opts.entityName,
        onSuccess: opts.onSuccess,
        onFileSelect: opts.onUploadFile,
        subActions: [
          {
            key: 'download-template',
            label: 'Tải mẫu Excel',
            icon: 'download',
            onClick: opts.onDownloadTemplate,
          },
          {
            key: 'upload-file',
            label: 'Tải lên tệp',
            icon: 'upload',
          },
        ],
      };
    }

    return {
      key: 'upload',
      label: 'Nhập Excel',
      icon: 'file-excel',
      severity: 'primary',
      onFileSelect: onUploadFile,
      subActions: [
        {
          key: 'download-template',
          label: 'Tải mẫu Excel',
          icon: 'download',
          onClick: onDownloadOrOptions,
        },
        {
          key: 'upload-file',
          label: 'Tải lên tệp',
          icon: 'upload',
        },
      ],
    };
  },

  exportExcel: (
    onClickOrOptions?:
      | (() => void | Promise<any> | import('rxjs').Observable<any>)
      | ExportExcelOptions,
    loading?: boolean | (() => boolean),
  ): TableAction => {
    if (onClickOrOptions && typeof onClickOrOptions === 'object') {
      const opts = onClickOrOptions as ExportExcelOptions;
      return {
        key: 'export-excel',
        label: 'Xuất Excel',
        icon: 'file-excel',
        severity: 'primary',
        exportUrl: opts.exportUrl,
        getPayload: opts.getPayload,
        fallbackFileName: opts.fallbackFileName,
        loading: opts.loading,
        onClick: opts.onClick,
      };
    }

    return {
      key: 'export-excel',
      label: 'Xuất Excel',
      icon: 'file-excel',
      severity: 'primary',
      loading,
      onClick: onClickOrOptions,
    };
  },

  exportPdf: (
    onClick?: () => void | Promise<any> | import('rxjs').Observable<any>,
    loading?: boolean,
  ): TableAction => ({
    key: 'export-pdf',
    label: 'Xuất PDF',
    icon: 'file-pdf',
    severity: 'danger',
    loading,
    onClick,
  }),

  save: (
    onClick?: () => void | Promise<any> | import('rxjs').Observable<any>,
    loading?: boolean,
  ): TableAction => ({
    key: 'save',
    label: 'Lưu',
    icon: 'save',
    severity: 'success',
    loading,
    onClick,
  }),

  cancel: (onClick?: () => void | Promise<any> | import('rxjs').Observable<any>): TableAction => ({
    key: 'cancel',
    label: 'Hủy',
    icon: 'close',
    severity: 'secondary',
    onClick,
  }),

  view: (onClick?: () => void | Promise<any> | import('rxjs').Observable<any>): TableAction => ({
    key: 'view',
    label: 'Xem chi tiết',
    icon: 'eye',
    severity: 'info',
    onClick,
  }),
};
