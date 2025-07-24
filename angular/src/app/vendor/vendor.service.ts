import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map,catchError  } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Observable, of, delay } from 'rxjs';
import { 
  VendorLogin, 
  VendorProfile, 
  RFQ, 
  PO, 
  GR, 
  DashboardTile, 
  INV,
  MEMO,
  PAY
} from './vendor.model';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private baseUrl = '/sap/opu/odata/sap/ZVENDOR_632_SRV';
  private currentVendorId: string | null = null;

 constructor(private http: HttpClient, private router: Router) {}
  


  login(credentials: VendorLogin): Observable<any> {
    return this.http.post<any>('/api/customer/login', {
      VENDOR_ID: credentials.CUSTOMER_ID,
      PASSWORD: credentials.PASSWORD
    });
  }

  setCurrentVendorId(id: string): void {
  this.currentVendorId = id;
  localStorage.setItem('vendorId', id); // ✅ store in localStorage
}
 
  getCurrentVendorId(): string | null {
  if (!this.currentVendorId) {
    this.currentVendorId = localStorage.getItem('vendorId'); // ✅ read from localStorage
  }
  return this.currentVendorId;
}

 logout(): void {
  this.currentVendorId = null;
  localStorage.removeItem('vendorId'); // ✅ clear it
  this.router.navigate(['/vendor/login']);
}

  // getDashboardTiles(): Observable<any> {
  //   return this.http.get<any>('http://localhost:5000/api/vendor/dashboard-tiles');
  // }


  // Vendor Profile
getVendorProfile(vendorId: string): Observable<VendorProfile> {
  return this.http.get<{ success: boolean; data: VendorProfile }>(
    `/api/customer/profile/${vendorId}`
  ).pipe(
    map(response => response.data)
  );
}
  // Dashboard Tiles
  getDashboardTiles(): Observable<DashboardTile[]> {
    const tiles: DashboardTile[] = [
      {
        title: 'Request for Quotation',
        count: 12,
        route: '/vendor/rfq',
        color: '#3b82f6'
      },
      {
        title: 'Purchase Orders',
        count: 8,
        route: '/vendor/po',
        color: '#10b981'
      },
      {
        title: 'Goods Receipt',
        count: 5,
        route: '/vendor/gr',
        color: '#f59e0b'
      },
      {
        title: 'Finance',
        count: 3,
        route: '/vendor/finance',
        color: '#8b5cf6'
      }
    ];
    
    return of(tiles).pipe(delay(500));
  }

  getVendorRfq(vendorId: string): Observable<RFQ[]> {
  return this.http.get<{ success: boolean; data: RFQ[] }>(
    `/api/customer/rfq/${vendorId}`
  ).pipe(
    map(response => response.data)
  );
}

getVendorPO(vendorId: string): Observable<PO[]> {
  return this.http.get<{ success: boolean; data: PO[] }>(
    `/api/customer/po/${vendorId}`
  ).pipe(
    map(response => response.data)
  );
}

getVendorGR(vendorId: string): Observable<GR[]> {
  return this.http.get<{ success: boolean; data: GR[] }>(
    `/api/customer/gr/${vendorId}`
  ).pipe(
    map(response => response.data)
  );
}

  // Financial Data
getVendorINV(vendorId: string): Observable<INV[]> {
  return this.http.get<{ success: boolean; data: INV[] }>(
    `/api/customer/inv/${vendorId}`
  ).pipe(
    map(response => response.data)
  );
}

  getVendorPAY(vendorId: string): Observable<PAY[]> {
  return this.http.get<{ success: boolean; data: PAY[] }>(
    `/api/customer/pay/${vendorId}`
  ).pipe(
    map(response => response.data)
  );
}
  getVendorMEMO(vendorId: string): Observable<MEMO[]> {
  return this.http.get<{ success: boolean; data: MEMO[] }>(
    `/api/customer/memo/${vendorId}`
  ).pipe(
    map(response => response.data)
  );
}

  getInvoicePdf(belnr: string): Observable<{ success: boolean; belnr: string; pdfBase64: string }> {
    return this.http.get<{ success: boolean; belnr: string; pdfBase64: string }>(
      `/api/customer/form/${belnr}`
    );
  }


}