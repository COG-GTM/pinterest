import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, getProgressStatus, getNotifications } from './reducers/index';
import { ShowProgressAction, CompleteProgressAction } from './actions/notification';
import { SlimLoadingBarService } from './vendor/slim-loading-bar';
import { ToasterService, ToasterConfig, ToastType } from './vendor/toaster';
import { ToasterContainerComponent } from './vendor/toaster/toaster-container.component';
import { SlimLoadingBarComponent } from './vendor/slim-loading-bar/slim-loading-bar.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';

declare var $:any;

@Component({
    selector: 'pin-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ToasterContainerComponent, SlimLoadingBarComponent, HeaderComponent, RouterOutlet, FooterComponent]
})
export class AppComponent implements OnInit {
  router = inject(Router);
  private store = inject<Store<AppState>>(Store);
  private slimLoadingBarService = inject(SlimLoadingBarService);
  private toasterService = inject(ToasterService);

  public toasterconfig : ToasterConfig = new ToasterConfig({
    preventDuplicates: true,
    positionClass: 'toast-bottom-right'
  });

  ngOnInit() {
    this.afterModalClosed();
    this.subscribeToProgress();
    this.subscribeToNotifications();
  }

  afterModalClosed() {
    $(document).on('closed.zf.reveal', '[data-reveal]', () => {
      this.router.navigate(['../'])
    });
  }

  subscribeToProgress() {
    this.store.select(getProgressStatus).subscribe(
      (status) => {
        if(status == true){
          this.slimLoadingBarService.start();
        }
        else {
          this.slimLoadingBarService.complete();
        }
      }
    );
  }

  private subscribeToNotifications() {
    this.store.select(getNotifications).subscribe(
      notifications => {
        notifications.forEach(toastr => {
          this.toasterService.pop(toastr.type as ToastType, toastr.title, toastr.body);
        });
      }
    );
  }

}
