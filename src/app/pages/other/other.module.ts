import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';

@NgModule({
  declarations: [
    AccessDeniedComponent,
    ServerErrorComponent,
    ComingSoonComponent,
    NotFoundComponent,
  ],
  exports: [AccessDeniedComponent, ServerErrorComponent, ComingSoonComponent, NotFoundComponent],
  imports: [SharedModule],
})
export class OtherModule {}
