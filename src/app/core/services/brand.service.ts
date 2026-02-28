import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Brand {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class BrandService {
    private apiUrl = `${environment.apiUrl}/brand`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Brand[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(res => res.data || res)
        );
    }
}
