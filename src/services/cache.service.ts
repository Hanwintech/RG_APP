
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * GlobalCache
 */
@Injectable()
export class CacheService {
    private _orgUsersLoaded = new BehaviorSubject<Number>(0);
    public orgUsersLoaded$;

    private _availableFormsLoaded = new BehaviorSubject<Number>(0);
    public availableFormsLoaded$;

    public availableForms = {};


    constructor(
        private apiService: ApiService
    ) {
        this.orgUsersLoaded$ = this._orgUsersLoaded.asObservable();
        this.availableFormsLoaded$ = this._availableFormsLoaded.asObservable();
    }

}