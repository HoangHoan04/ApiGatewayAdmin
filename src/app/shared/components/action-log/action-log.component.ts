import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { enumData } from '../../../core/constants/enums/enumData';
import { ActionLog, ActionTypeMeta } from '../../../core/models/action-log.models';
import { PagedResult } from '../../../core/models/common.models';
import { ApiService } from '../../../core/services/api.service';
import { PaginationConfig, RowAction, TableColumn } from '../table-custom/table-custom.types';

@Component({
  standalone: false,
  selector: 'app-action-log',
  templateUrl: './action-log.component.html',
  styleUrls: ['./action-log.component.scss'],
})
export class ActionLogComponent implements OnInit, OnChanges {
  @Input() entityName!: string;
  @Input() entityId?: string;
  @Input() title?: string;

  @ViewChild('actionTypeTpl', { static: true }) actionTypeTpl!: TemplateRef<any>;

  logs: ActionLog[] = [];
  loading = false;

  pagination: PaginationConfig = {
    current: enumData.PAGE.PAGE_INDEX,
    pageSize: enumData.PAGE.PAGE_SIZE,
    total: enumData.PAGE.TOTAL,
    showTotal: true,
  };

  columns: TableColumn[] = [];
  rowActions: RowAction[] = [
    {
      key: 'view',
      icon: 'eye',
      tooltip: 'table.action.viewDetail',
      severity: 'info',
      visible: (record: ActionLog) => !!(record.oldValue || record.newValue),
      onClick: (record) => this.openDetailModal(record),
    },
  ];

  selectedLog: ActionLog | null = null;
  modalVisible = false;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.initColumns();

    if (this.resolvedEntityName && this.resolvedEntityId) {
      this.loadLogs();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const keys = ['entityName', 'entityId'];
    const hasRelevantChange = keys.some((key) => changes[key] && !changes[key]?.firstChange);

    if (hasRelevantChange) {
      this.pagination.current = 1;
      this.loadLogs();
    }
  }

  private initColumns(): void {
    this.columns = [
      {
        field: 'createdAt',
        header: 'Ngày tạo',
        type: 'datetime',
        dateFormat: 'dd/MM/yyyy HH:mm:ss',
        width: 160,
      },
      {
        field: 'createdByName',
        header: 'Người tạo',
        type: 'text',
        width: 180,
      },
      {
        field: 'actionType',
        header: 'Loại hành động',
        body: this.actionTypeTpl,
        width: 150,
      },
      {
        field: 'createdNote',
        header: 'Ghi chú',
        type: 'text',
        style: { minWidth: '250px' },
      },
    ];
  }

  get resolvedEntityName(): string {
    return this.entityName || '';
  }

  get resolvedEntityId(): string | undefined {
    return this.entityId;
  }

  loadLogs(): void {
    if (!this.resolvedEntityId) return;

    this.loading = true;
    const url =
      `${this.apiService.ACTION_LOG.BASE}?pageIndex=${this.pagination.current}` +
      `&pageSize=${this.pagination.pageSize}` +
      `&entityName=${encodeURIComponent(this.resolvedEntityName)}` +
      `&entityId=${encodeURIComponent(this.resolvedEntityId)}`;

    this.apiService.get<PagedResult<ActionLog>>(url).subscribe({
      next: (res) => {
        this.logs = (res?.items || []).map((item) => this.mapLogItem(item));
        this.pagination.total = res?.totalCount || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(event: { page: number; pageSize: number }): void {
    this.pagination.current = event.page;
    this.pagination.pageSize = event.pageSize;
    this.loadLogs();
  }

  getActionTypeMeta(actionType?: string): ActionTypeMeta | undefined {
    if (!actionType) return undefined;
    return Object.values(enumData.ACTION_TYPE).find((item) => item.code === actionType);
  }

  getActionTypeLabel(actionType?: string): string {
    const meta = this.getActionTypeMeta(actionType);
    if (meta?.label) {
      return meta.label;
    }
    return actionType || 'Không xác định';
  }

  openDetailModal(log: ActionLog): void {
    this.selectedLog = {
      ...log,
      oldValueObj: this.parseJsonValue(log.oldValue),
      newValueObj: this.parseJsonValue(log.newValue),
    };
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
    this.selectedLog = null;
  }

  formatJsonValue(value: Record<string, unknown> | null | undefined, emptyText: string): string {
    if (!value || Object.keys(value).length === 0) {
      return emptyText;
    }
    return JSON.stringify(value, null, 2);
  }

  private mapLogItem(item: ActionLog): ActionLog {
    return {
      ...item,
      oldValueObj: this.parseJsonValue(item.oldValue),
      newValueObj: this.parseJsonValue(item.newValue),
    };
  }

  private parseJsonValue(raw?: string | null): Record<string, unknown> | null {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null
        ? (parsed as Record<string, unknown>)
        : { value: parsed };
    } catch {
      return { value: raw };
    }
  }
}
