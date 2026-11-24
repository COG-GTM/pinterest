import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum SlimLoadingBarEventType {
  PROGRESS,
  HEIGHT,
  COLOR,
  VISIBLE
}

export class SlimLoadingBarEvent {
  constructor(public type: SlimLoadingBarEventType, public value: any) {}
}

@Injectable()
export class SlimLoadingBarService {
  private _progress = 0;
  private _height = '2px';
  private _color = 'firebrick';
  private _visible = true;
  private _intervalCounterId: any = 0;
  public interval = 500;

  private eventSource = new Subject<SlimLoadingBarEvent>();
  public events: Observable<SlimLoadingBarEvent> = this.eventSource.asObservable();

  set progress(value: number) {
    if (value != null) {
      if (value > 0) {
        this.visible = true;
      }
      this._progress = value;
      this.emitEvent(new SlimLoadingBarEvent(SlimLoadingBarEventType.PROGRESS, this._progress));
    }
  }
  get progress(): number { return this._progress; }

  set height(value: string) {
    if (value != null) {
      this._height = value;
      this.emitEvent(new SlimLoadingBarEvent(SlimLoadingBarEventType.HEIGHT, this._height));
    }
  }
  get height(): string { return this._height; }

  set color(value: string) {
    if (value != null) {
      this._color = value;
      this.emitEvent(new SlimLoadingBarEvent(SlimLoadingBarEventType.COLOR, this._color));
    }
  }
  get color(): string { return this._color; }

  set visible(value: boolean) {
    if (value != null) {
      this._visible = value;
      this.emitEvent(new SlimLoadingBarEvent(SlimLoadingBarEventType.VISIBLE, this._visible));
    }
  }
  get visible(): boolean { return this._visible; }

  private emitEvent(event: SlimLoadingBarEvent): void {
    this.eventSource.next(event);
  }

  start(onCompleted: Function = null): void {
    this.stop();
    this.visible = true;
    this._intervalCounterId = setInterval(() => {
      this.progress++;
      if (this.progress === 100) {
        this.complete();
      }
    }, this.interval);
  }

  stop(): void {
    if (this._intervalCounterId) {
      clearInterval(this._intervalCounterId);
      this._intervalCounterId = null;
    }
  }

  reset(): void {
    this.stop();
    this.progress = 0;
  }

  complete(): void {
    this.progress = 100;
    this.stop();
    setTimeout(() => {
      this.visible = false;
      setTimeout(() => {
        this.progress = 0;
      }, 250);
    }, 250);
  }
}
