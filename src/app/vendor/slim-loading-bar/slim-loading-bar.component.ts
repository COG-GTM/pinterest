import { Component, Input, OnInit, inject } from '@angular/core';
import { SlimLoadingBarService, SlimLoadingBarEventType } from './slim-loading-bar.service';

@Component({
    selector: 'ng2-slim-loading-bar',
    template: `
<div class="slim-loading-bar">
    <div class="slim-loading-bar-progress" [style.width]="progress + '%'" [style.backgroundColor]="color" [style.color]="color"
        [style.height]="height" [style.opacity]="show ? '1' : '0'"></div>
</div>`
})
export class SlimLoadingBarComponent implements OnInit {
  service = inject(SlimLoadingBarService);

  @Input() progress = '0';
  @Input() color = 'firebrick';
  @Input() height = '2px';
  @Input() show = true;

  ngOnInit(): void {
    this.service.events.subscribe(event => {
      if (event.type === SlimLoadingBarEventType.PROGRESS && event.value != null) {
        this.progress = event.value;
      } else if (event.type === SlimLoadingBarEventType.COLOR) {
        this.color = event.value;
      } else if (event.type === SlimLoadingBarEventType.HEIGHT) {
        this.height = event.value;
      } else if (event.type === SlimLoadingBarEventType.VISIBLE) {
        this.show = event.value;
      }
    });
  }
}
