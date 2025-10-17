import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../layout/sidebar/sidebar';
import { TransactionService } from '../../services/transaction.service';
import { TransactionKind, TransactionStatus } from '../../models/transaction.model';

interface DashboardStats {
  totalReceivable: number;
  totalPayable: number;
  overdueReceivable: number;
  overduePayable: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalReceivable: 0,
    totalPayable: 0,
    overdueReceivable: 0,
    overduePayable: 0,
  };
  isLoading = true;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;

    // Carregar a receber
    this.transactionService
      .getTransactions(
        TransactionKind.RECEIVABLE,
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        100
      )
      .subscribe({
        next: (response) => {
          this.stats.totalReceivable = response.data
            .filter((t) => t.status === TransactionStatus.PENDING)
            .reduce((sum, t) => sum + t.amount, 0);

        },
      });

    // Carregar a pagar
    this.transactionService
      .getTransactions(TransactionKind.PAYABLE, undefined, undefined, undefined, undefined, 1, 100)
      .subscribe({
        next: (response) => {
          this.stats.totalPayable = response.data
            .filter((t) => t.status === TransactionStatus.PENDING)
            .reduce((sum, t) => sum + t.amount, 0);

          this.isLoading = false;
        },
      });
  }
}
