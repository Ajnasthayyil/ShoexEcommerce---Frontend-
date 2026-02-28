import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Size {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class SizeService {
    private apiUrl = `${environment.apiUrl}/admin/sizes`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Size[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(res => res.data || res)
        );
    }
}
