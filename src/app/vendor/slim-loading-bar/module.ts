import { NgModule, ModuleWithProviders } from '@angular/core';
import { SlimLoadingBarComponent } from './slim-loading-bar.component';
import { SlimLoadingBarService } from './slim-loading-bar.service';

@NgModule({
  declarations: [SlimLoadingBarComponent],
  exports: [SlimLoadingBarComponent]
})
export class SlimLoadingBarModule {
  static forRoot(): ModuleWithProviders<SlimLoadingBarModule> {
    return { ngModule: SlimLoadingBarModule, providers: [SlimLoadingBarService] };
  }
}
