import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AddressDto {
    id: number;
    fullName: string;
    phoneNumber: string;
    street: string;
    city: string;
    pincode: string;
    state: string;
    isDefault: boolean;
}

export interface AddAddressDto {
    fullName: string;
    phoneNumber: string;
    street: string;
    city: string;
    pincode: string;
    state: string;
    isDefault?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private apiUrl = `${environment.apiUrl}/ShippingAddresses`;

    constructor(private http: HttpClient) { }

    getAddresses(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/my`);
    }

    addAddress(address: AddAddressDto): Observable<any> {
        const formData = new FormData();
        Object.keys(address).forEach(key => {
            const value = (address as any)[key];
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        return this.http.post<any>(this.apiUrl, formData);
    }

    updateAddress(id: number, address: AddAddressDto): Observable<any> {
        const formData = new FormData();
        Object.keys(address).forEach(key => {
            const value = (address as any)[key];
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
    }

    deleteAddress(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    setDefaultAddress(id: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}/set-default`, {});
    }
}
