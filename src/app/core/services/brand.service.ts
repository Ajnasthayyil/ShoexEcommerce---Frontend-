import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Brand {
    id: number;
    name: string;
    isActive?: boolean;
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

    createBrand(name: string): Observable<any> {
        const formData = new FormData();
        formData.append('Name', name);
        return this.http.post<any>(this.apiUrl, formData).pipe(
            map(res => res.data || res)
        );
    }

    updateBrand(id: number, name: string): Observable<any> {
        const formData = new FormData();
        formData.append('Name', name);
        return this.http.put<any>(`${this.apiUrl}/${id}`, formData).pipe(
            map(res => res.data || res)
        );
    }

    toggleBrand(id: number): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/${id}/toggle`, {}).pipe(
            map(res => res.data || res)
        );
    }

    deleteBrand(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
            map(res => res.data || res)
        );
    }
}
