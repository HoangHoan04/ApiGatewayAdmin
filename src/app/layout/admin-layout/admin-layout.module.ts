import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ConfigSettingComponent } from './config-setting/config-setting.component';
import { FooterComponent } from './footer/footer.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { LayoutWidgetsModule } from './layout-widgets.module';
import { NavbarNotificationComponent } from './navbar-notification/navbar-notification.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TabsBarComponent } from './tabs-bar/tabs-bar.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    BreadcrumbComponent,
    ConfigSettingComponent,
    FooterComponent,
    FullscreenComponent,
    NavbarComponent,
    NavbarNotificationComponent,
    SearchBoxComponent,
    SidebarComponent,
    TabsBarComponent,
  ],
  imports: [SharedModule, LayoutWidgetsModule],
})
export class AdminLayoutModule {}
