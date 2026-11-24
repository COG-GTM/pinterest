import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { reducer } from '../app/reducers';

// Store stand-in for component specs: selectors run against the reducers' initial state, dispatch is a no-op.
export class MockStore {
  state$ = new BehaviorSubject<any>(reducer(undefined, { type: '@@spec/init' }));
  select(selector: (state: any) => any) { return this.state$.map(selector); }
  dispatch(action: any) {}
}
