import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { FilterAction, FilterConfig, FilterField, FilterOption } from './filter-custom.types';

@Component({
  selector: 'app-filter-custom',
  standalone: false,
  templateUrl: './filter-custom.component.html',
  styleUrls: ['./filter-custom.component.scss'],
})
export class FilterCustomComponent implements OnInit, OnChanges, OnDestroy {
  @Input() id: string = 'custom-filter';
  @Input() fields: FilterField[] = [];
  @Input() filters: Record<string, any> = {};
  @Input() config?: FilterConfig;
  @Input() filterActions: FilterAction[] = [];
  @Input() loading: boolean = false;
  @Input() customTemplates?: Record<string, TemplateRef<any>>;
  @Input() headerLeftContent?: TemplateRef<any>;
  @Input() headerRightContent?: TemplateRef<any>;

  @Output() filtersChange = new EventEmitter<Record<string, any>>();
  @Output() search = new EventEmitter<Record<string, any>>();
  @Output() clear = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<FilterAction>();

  open = true;

  ngOnInit(): void {
    this.loadOpenState();
    this.ensureFilterDefaults();
    document.addEventListener('keydown', this.onEnterKeydown);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields']) {
      this.ensureFilterDefaults();
    }

    if (changes['config'] && !changes['config'].firstChange) {
      this.loadOpenState();
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onEnterKeydown);
  }

  get title(): string {
    return this.config?.title || 'Tìm kiếm';
  }

  get collapsible(): boolean {
    return this.config?.collapsible !== false;
  }

  get gutter(): [number, number] {
    return this.config?.gutter || [16, 16];
  }

  get actionsAlign(): string {
    return this.config?.actionsAlign || 'center';
  }

  get visibleFields(): FilterField[] {
    return this.fields.filter((field) => field.hidden !== true);
  }

  get hasActions(): boolean {
    return this.filterActions.some((action) => action.visible !== false);
  }

  toggleOpen(): void {
    if (!this.collapsible) return;
    this.open = !this.open;
    localStorage.setItem(`${this.id}_filter_open`, JSON.stringify(this.open));
  }

  onFilterChange(key: string, value: any): void {
    this.filters = { ...this.filters, [key]: value };
    this.filtersChange.emit(this.filters);
  }

  handleActionClick(action: FilterAction): void {
    this.actionClick.emit(action);

    if (action.key === 'search') {
      this.search.emit(this.filters);
    } else if (action.key === 'clear') {
      this.onClearClick();
    }

    action.onClick?.();
  }

  onClearClick(): void {
    this.filters = this.buildDefaultFilters();
    this.filtersChange.emit(this.filters);
    this.clear.emit();
  }

  getFieldContext(field: FilterField): Record<string, any> {
    return {
      $implicit: this.filters[field.key],
      filters: this.filters,
      onChange: (value: any) => this.onFilterChange(field.key, value),
    };
  }

  getOptionLabel(opt: FilterOption): string {
    return opt.label || opt.name || opt.code || '';
  }

  isFieldDisabled(field: FilterField): boolean {
    return field.disabled === true || this.loading;
  }

  isActionVisible(action: FilterAction): boolean {
    return action.visible !== false;
  }

  isActionDisabled(action: FilterAction): boolean {
    return action.disabled === true || this.loading;
  }

  getActionSeverityClass(action: FilterAction): string {
    switch (action.severity) {
      case 'success':
        return 'severity-success';
      case 'info':
        return 'severity-info';
      case 'warning':
        return 'severity-warning';
      case 'danger':
        return 'severity-danger';
      case 'secondary':
        return 'severity-secondary';
      default:
        return 'severity-primary';
    }
  }

  private loadOpenState(): void {
    const defaultOpen = this.config?.defaultOpen ?? true;
    const saved = localStorage.getItem(`${this.id}_filter_open`);

    if (saved !== null) {
      try {
        this.open = JSON.parse(saved);
      } catch {
        this.open = defaultOpen;
      }
    } else {
      this.open = defaultOpen;
    }
  }

  private ensureFilterDefaults(): void {
    const defaults = this.buildDefaultFilters();
    this.filters = { ...defaults, ...this.filters };
  }

  private buildDefaultFilters(): Record<string, any> {
    const defaults: Record<string, any> = {};

    this.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaults[field.key] = field.defaultValue;
        return;
      }

      switch (field.type) {
        case 'multiSelect':
          defaults[field.key] = [];
          break;
        case 'switch':
          defaults[field.key] = false;
          break;
        case 'dateRange':
          defaults[field.key] = null;
          break;
        default:
          defaults[field.key] = null;
      }
    });

    return defaults;
  }

  private onEnterKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' || !this.open) return;

    const target = event.target as HTMLElement | null;
    if (!target) return;

    const isTextInput =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.getAttribute('contenteditable') === 'true';

    if (!isTextInput) return;

    const searchAction = this.filterActions.find(
      (action) => action.key === 'search' && action.visible !== false,
    );
    if (searchAction) {
      event.preventDefault();
      this.handleActionClick(searchAction);
    }
  };
}
