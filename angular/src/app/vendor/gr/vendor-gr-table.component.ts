import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- ✅ Add this
import { VendorService } from '../vendor.service';
import { GR } from '../vendor.model';
import { Location } from '@angular/common';

@Component({
  standalone: true,  // <-- If you're using standalone components
  selector: 'app-vendor-po',
  templateUrl: './vendor-gr-table.component.html',
  styleUrls: ['./vendor-gr-table.component.css'],
  imports: [CommonModule] // <-- ✅ REQUIRED for *ngIf, *ngFor
})
export class VendorgrComponent implements OnInit {
  grs: GR[] = [];

  constructor(
    private vendorService: VendorService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const vendorId = this.vendorService.getCurrentVendorId();
    if (vendorId) {
      this.vendorService.getVendorGR(vendorId).subscribe({
        next: (grData) => {
          this.grs = Array.isArray(grData) ? grData : [grData];
        },
        error: (err) => {
          console.error('Error fetching PO data:', err);
        }
      });
    } else {
      console.error('No Vendor ID found. Please login again.');
    }
  }

  goBack(): void {
    this.location.back();
  }

  formatDate(odataDate: string): string {
    const timestamp = parseInt(odataDate.replace(/[^0-9]/g, ''), 10);
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }
}
