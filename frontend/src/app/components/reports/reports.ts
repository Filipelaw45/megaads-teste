import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SidebarComponent } from '../layout/sidebar/sidebar';
import { ReportService } from '../../services/report.service';
import { CashflowReport } from '../../models/report.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SidebarComponent],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {
  reportForm: FormGroup;
  cashflowReport: CashflowReport | null = null;
  isLoading = false;

  constructor(
    private reportService: ReportService,
    private fb: FormBuilder
  ) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.reportForm = this.fb.group({
      from: [firstDay.toISOString().split('T')[0], Validators.required],
      to: [lastDay.toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    if (this.reportForm.invalid) return;

    this.isLoading = true;
    const { from, to } = this.reportForm.value;

    this.reportService.getCashflowReport(from, to).subscribe({
      next: (report) => {
        this.cashflowReport = report;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadReport();
  }

  setCurrentMonth(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.reportForm.patchValue({
      from: firstDay.toISOString().split('T')[0],
      to: lastDay.toISOString().split('T')[0]
    });
    this.loadReport();
  }

  setLastMonth(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);

    this.reportForm.patchValue({
      from: firstDay.toISOString().split('T')[0],
      to: lastDay.toISOString().split('T')[0]
    });
    this.loadReport();
  }

  setCurrentYear(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), 0, 1);
    const lastDay = new Date(today.getFullYear(), 11, 31);

    this.reportForm.patchValue({
      from: firstDay.toISOString().split('T')[0],
      to: lastDay.toISOString().split('T')[0]
    });
    this.loadReport();
  }
}
