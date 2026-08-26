import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PermissionGuard } from './core/guards/permission.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AccessDeniedComponent } from './pages/other/access-denied/access-denied.component';
import { ComingSoonComponent } from './pages/other/coming-soon/coming-soon.component';
import { NotFoundComponent } from './pages/other/not-found/not-found.component';
import { ServerErrorComponent } from './pages/other/server-error/server-error.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },

  { path: '500', component: ServerErrorComponent },
  { path: 'coming-soon', component: ComingSoonComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard],
    children: [
      { path: 'access-denied', component: AccessDeniedComponent },
      {
        path: '',
        loadChildren: () => import('./pages/main/main.module').then((m) => m.MainModule),
      },
    ],
  },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
