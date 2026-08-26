import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NgxEchartsModule } from 'ngx-echarts';
import { ActionLogComponent } from './components/action-log/action-log.component';
import { ExcelImportModalComponent } from './components/excel-import-modal/excel-import-modal.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FilterCustomComponent } from './components/filter-custom/filter-custom.component';
import { TableCustomComponent } from './components/table-custom/table-custom.component';

@NgModule({
  declarations: [
    FilterCustomComponent,
    TableCustomComponent,
    ActionLogComponent,
    FileUploadComponent,
    ExcelImportModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxEchartsModule,
    NzLayoutModule,
    NzIconModule,
    NzDropDownModule,
    NzAvatarModule,
    NzAlertModule,
    NzBadgeModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzCardModule,
    NzCollapseModule,
    NzEmptyModule,
    NzDrawerModule,
    NzSwitchModule,
    NzSelectModule,
    NzSliderModule,
    NzInputModule,
    NzInputNumberModule,
    NzDividerModule,
    NzButtonModule,
    NzTooltipModule,
    NzTableModule,
    NzModalModule,
    NzPopoverModule,
    NzFormModule,
    NzGridModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzSpinModule,
    NzStepsModule,
    NzPaginationModule,
    NzTabsModule,
    NzUploadModule,
    NzDescriptionsModule,
    NzTimelineModule,
    NzCheckboxModule,
    NzTagModule,
    NzTreeModule,
    NzProgressModule,
    NzRadioModule,
  ],
  exports: [
    FilterCustomComponent,
    TableCustomComponent,
    ActionLogComponent,
    FileUploadComponent,
    ExcelImportModalComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxEchartsModule,
    NzLayoutModule,
    NzIconModule,
    NzDropDownModule,
    NzAvatarModule,
    NzAlertModule,
    NzBadgeModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzCardModule,
    NzCollapseModule,
    NzEmptyModule,
    NzDrawerModule,
    NzSwitchModule,
    NzSelectModule,
    NzSliderModule,
    NzInputModule,
    NzInputNumberModule,
    NzDividerModule,
    NzButtonModule,
    NzTooltipModule,
    NzTableModule,
    NzModalModule,
    NzPopoverModule,
    NzFormModule,
    NzGridModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzSpinModule,
    NzStepsModule,
    NzPaginationModule,
    NzTabsModule,
    NzUploadModule,
    NzDescriptionsModule,
    NzTimelineModule,
    NzCheckboxModule,
    NzTagModule,
    NzTreeModule,
    NzProgressModule,
    NzRadioModule,
  ],
})
export class SharedModule {}
