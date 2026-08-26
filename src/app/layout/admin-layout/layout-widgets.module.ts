import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ToggleThemeComponent } from './toggle-theme/toggle-theme.component';

@NgModule({
  declarations: [ToggleThemeComponent],
  imports: [CommonModule, NzDropdownModule, NzIconModule, NzMenuModule],
  exports: [ToggleThemeComponent],
})
export class LayoutWidgetsModule {}
