import { input } from '@angular/core';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { state, transition, trigger, style, animate } from '@angular/animations';

declare var $: any;

@Component({
    selector: 'pin-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css'],
    animations: [
        trigger('flyInDown', [
            state('in', style({ transform: 'translateY(0)' })),
            transition('void => *', [
                style({ transform: 'translateY(-100%)' }),
                animate(300)
            ]),
            transition('* => void', [
                animate(300, style({ transform: 'translateY(100%)' }))
            ])
        ])
    ]
})

export class ModalComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly title = input<string>(undefined);
  readonly klass = input<string>(undefined);
  readonly size = input<string>(undefined);

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(document).foundation();
  }

  ngOnDestroy() {
    $('.reveal').remove();
    $('.reveal-overlay').remove();
  }

}
