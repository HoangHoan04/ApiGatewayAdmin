import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SharedModule } from '../../shared/shared.module';
import { LayoutWidgetsModule } from '../../layout/admin-layout/layout-widgets.module';
import { AuthLayoutComponent } from '../../layout/auth-layout/auth-layout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SsoCallbackComponent } from './sso-callback/sso-callback.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'callback', component: SsoCallbackComponent },
      { path: 'sso-callback', component: SsoCallbackComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ForgotPasswordComponent },
      { path: 'change-password', component: ChangePasswordComponent },
    ],
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    AuthLayoutComponent,
    ChangePasswordComponent,
    SsoCallbackComponent,
  ],
  imports: [
    FormsModule,
    SharedModule,
    LayoutWidgetsModule,
    RouterModule,
    NzButtonModule,
    NzCheckboxModule,
    NzIconModule,
    NzInputModule,
    NzSpinModule,
    RouterModule.forChild(routes),
  ],
})
export class AuthModule {}
