import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { SharedModule } from '../../shared/shared.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TopologyComponent } from './topology/topology.component';
import { RoutesComponent } from './routes/routes.component';
import { TrafficLogsComponent } from './traffic-logs/traffic-logs.component';
import { SecurityComponent } from './security/security.component';
import { ApiExplorerComponent } from './api-explorer/api-explorer.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'topology', component: TopologyComponent },
  { path: 'routes', component: RoutesComponent },
  { path: 'traffic-logs', component: TrafficLogsComponent },
  { path: 'security', component: SecurityComponent },
  { path: 'api-explorer', component: ApiExplorerComponent },
];

@NgModule({
  declarations: [
    DashboardComponent,
    TopologyComponent,
    RoutesComponent,
    TrafficLogsComponent,
    SecurityComponent,
    ApiExplorerComponent,
  ],
  imports: [
    SharedModule,
    NzTabsModule,
    NzProgressModule,
    RouterModule.forChild(routes),
  ],
})
export class MainModule {}
