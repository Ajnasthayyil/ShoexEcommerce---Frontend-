import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../../features/products/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;
  private adminApiUrl = `${environment.apiUrl}/admin/products`;

  constructor(private http: HttpClient) { }

  // ---------------- FETCH ----------------

  /** Fetch all products */
  getAll(): Observable<Product[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        const items = res.data || res;
        return items.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brandName || p.brand || '',
          brandId: p.brandId,
          price: p.price,
          imageUrl: p.imageUrl || p.primaryImageUrl || (p.images && p.images.length > 0 ? p.images[0].url : ''),
          images: p.images || [],
          description: p.description || '',
          availableSizes: p.sizeIds ? p.sizeIds.map(String) : [],
          sizeIds: p.sizeIds || [],
          gender: p.genderName || p.gender || '',
          genderId: p.genderId,
          isActive: p.isActive
        }));
      })
    );
  }

  /** Backward compatibility */
  getProducts(): Observable<Product[]> {
    return this.getAll();
  }

  /** Fetch all products for Admin (Active + Inactive) */
  getAllAdmin(): Observable<Product[]> {
    return this.http.get<any>(this.adminApiUrl).pipe(
      map(res => {
        const items = res.data || res;
        return items.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brandName || p.brand || '',
          brandId: p.brandId,
          price: p.price,
          imageUrl: p.imageUrl || p.primaryImageUrl || (p.images && p.images.length > 0 ? p.images[0].url : ''),
          images: p.images || [],
          description: p.description || '',
          availableSizes: p.sizeIds ? p.sizeIds.map(String) : [],
          sizeIds: p.sizeIds || [],
          gender: p.genderName || p.gender || '',
          genderId: p.genderId,
          isActive: p.isActive
        }));
      })
    );
  }

  /** Fetch product by ID */
  getById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        const p = res.data || res;
        return {
          id: p.id,
          name: p.name,
          brand: p.brandName || p.brand || '',
          brandId: p.brandId,
          price: p.price,
          imageUrl: p.imageUrl || p.primaryImageUrl || (p.images && p.images.length > 0 ? p.images[0].url : ''),
          images: p.images || [],
          description: p.description || '',
          availableSizes: p.sizeIds ? p.sizeIds.map(String) : [],
          sizeIds: p.sizeIds || [],
          gender: p.genderName || p.gender || '',
          genderId: p.genderId,
          isActive: p.isActive
        };
      })
    );
  }

  // ---------------- CREATE ----------------

  /** Add a new product (Admin) */
  create(product: any, images: File[]): Observable<Product> {
    const formData = new FormData();
    formData.append('Name', product.name);
    formData.append('Description', product.description || 'N/A');
    formData.append('Price', product.price?.toString() || '0');
    formData.append('BrandId', product.brandId?.toString() || '1');
    formData.append('GenderId', product.genderId?.toString() || '1');
    formData.append('PrimaryImageIndex', product.primaryImageIndex?.toString() || '0');

    if (product.sizeIds && Array.isArray(product.sizeIds)) {
      product.sizeIds.forEach((id: number | string) => {
        formData.append('SizeIds', id.toString());
      });
    }

    if (images && images.length > 0) {
      images.forEach(file => {
        formData.append('Images', file, file.name);
      });
    }

    return this.http.post<any>(this.adminApiUrl, formData).pipe(
      map(res => res.data || res)
    );
  }

  // ---------------- UPDATE ----------------

  /** Update an existing product (Admin) */
  update(id: number, product: any): Observable<Product> {
    const formData = new FormData();
    formData.append('Name', product.name);
    formData.append('Description', product.description || 'N/A');
    formData.append('Price', product.price?.toString() || '0');
    formData.append('BrandId', product.brandId?.toString() || '1');
    formData.append('GenderId', product.genderId?.toString() || '1');

    // In updates, the user might not be updating images, but if the API expects it for changing default images, we can pass it
    // formData.append('PrimaryImageIndex', product.primaryImageIndex?.toString() || '0');

    if (product.sizeIds && Array.isArray(product.sizeIds)) {
      product.sizeIds.forEach((sizeId: number | string) => {
        formData.append('SizeIds', sizeId.toString());
      });
    }

    return this.http.put<any>(`${this.adminApiUrl}/${id}`, formData).pipe(
      map(res => res.data || res)
    );
  }

  // ---------------- DELETE / TOGGLE ----------------

  /** Soft Delete a product (Admin) */
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.adminApiUrl}/${id}`);
  }

  /** Toggle Active/Inactive status */
  toggleActive(id: number): Observable<any> {
    return this.http.patch<any>(`${this.adminApiUrl}/${id}/toggle`, {});
  }

  // ---------------- STOCK MANAGEMENT ----------------

  /** Update absolute stock for a size */
  updateSizeStock(productId: number, sizeId: number, stock: number): Observable<any> {
    const formData = new FormData();
    formData.append('Stock', stock.toString());
    return this.http.put<any>(`${this.adminApiUrl}/${productId}/sizes/${sizeId}/stock`, formData);
  }

  /** Adjust stock by a relative delta (positive or negative) for a size */
  adjustSizeStock(productId: number, sizeId: number, delta: number): Observable<any> {
    const formData = new FormData();
    formData.append('Delta', delta.toString());
    return this.http.patch<any>(`${this.adminApiUrl}/${productId}/sizes/${sizeId}/stock`, formData);
  }
}
