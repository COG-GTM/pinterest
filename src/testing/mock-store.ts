import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { reducer } from '../app/reducers';

// Store stand-in for component specs: selectors run against the reducers' initial state, dispatch is a no-op.
export class MockStore {
  state$ = new BehaviorSubject<any>(reducer(undefined, { type: '@@spec/init' }));
  select(selector: (state: any) => any) { return this.state$.pipe(map(selector)); }
  dispatch(action: any) {}
}
