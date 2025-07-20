import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- ✅ Add this
import { VendorService } from '../vendor.service';
import { RFQ } from '../vendor.model';
import { Location } from '@angular/common';

@Component({
  standalone: true,  // <-- If you're using standalone components
  selector: 'app-vendor-rfq',
  templateUrl: './vendor-rfq-table.component.html',
  styleUrls: ['./vendor-rfq-table.component.css'],
  imports: [CommonModule] // <-- ✅ REQUIRED for *ngIf, *ngFor
})
export class VendorRfqComponent implements OnInit {
  rfqs: RFQ[] = [];

  constructor(
    private vendorService: VendorService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const vendorId = this.vendorService.getCurrentVendorId();
    if (vendorId) {
      this.vendorService.getVendorRfq(vendorId).subscribe({
        next: (rfqData) => {
          this.rfqs = Array.isArray(rfqData) ? rfqData : [rfqData];
        },
        error: (err) => {
          console.error('Error fetching RFQ data:', err);
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
