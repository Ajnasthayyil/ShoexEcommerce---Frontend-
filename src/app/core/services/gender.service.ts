import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Gender {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class GenderService {
    private apiUrl = `${environment.apiUrl}/gender`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Gender[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(res => res.data || res)
        );
    }
}
