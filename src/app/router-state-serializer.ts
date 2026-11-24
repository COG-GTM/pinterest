import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

export interface RouterState {
  url: string;
}

// Keeps only the URL in the store (as @ngrx/router-store 1.x did) so storeFreeze never freezes live router snapshots.
export class UrlRouterStateSerializer implements RouterStateSerializer<RouterState> {
  serialize(routerState: RouterStateSnapshot): RouterState {
    return { url: routerState.url };
  }
}
