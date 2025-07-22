import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { INV } from '../vendor.model';

@Component({
  selector: 'app-vendor-inv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-inv-table.component.html',
  styleUrls: ['./vendor-inv-table.component.css']
})
export class VendorinvComponent implements OnInit {
  invs: INV[] = [];
  isLoading = true;
  vendorId: string | null = null;
  isDownloading: { [belnr: string]: boolean } = {};

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vendorId = this.vendorService.getCurrentVendorId();
    if (!this.vendorId) {
      this.router.navigate(['/vendor/login']);
      return;
    }
    this.loadInvoices();
  }

  loadInvoices(): void {
    if (!this.vendorId) return;
    
    this.isLoading = true;
    this.vendorService.getVendorINV(this.vendorId).subscribe({
      next: (invs) => {
        this.invs = invs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Invoices:', error);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    // Handle OData date format (e.g., "/Date(1234567890000)/")
    if (dateString.includes('/Date(')) {
      const timestamp = parseInt(dateString.replace(/[^0-9]/g, ''), 10);
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Handle regular date strings
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  }

  goBack(): void {
    this.router.navigate(['/vendor/dashboard']);
  }

  downloadInvoicePdf(belnr: string): void {
    this.isDownloading[belnr] = true;
    this.vendorService.getInvoicePdf(belnr).subscribe({
      next: (response) => {
        if (response.success && response.pdfBase64) {
          const byteCharacters = atob(response.pdfBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `Invoice_${belnr}.pdf`;
          link.click();
          window.URL.revokeObjectURL(link.href);
        } else {
          alert('Failed to download PDF.');
        }
        this.isDownloading[belnr] = false;
      },
      error: (err) => {
        alert('Error downloading PDF.');
        this.isDownloading[belnr] = false;
      }
    });
  }
}
