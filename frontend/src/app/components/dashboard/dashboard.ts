import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { TransactionKind, TransactionStatus } from '../../models/transaction.model';
import { SidebarComponent } from '../layout/sidebar/sidebar';
import { forkJoin } from 'rxjs';

interface DashboardStats {
  totalReceivable: number;
  totalPayable: number;
  totalOverdue: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  TransactionKind = TransactionKind;
  TransactionStatus = TransactionStatus;

  stats: DashboardStats = {
    totalReceivable: 0,
    totalPayable: 0,
    totalOverdue: 0,
  };
  isLoading = true;

  constructor(private transactionService: TransactionService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      receivable: this.transactionService.getTransactions(
        TransactionKind.RECEIVABLE,
        TransactionStatus.PENDING,
        undefined,
        undefined,
        undefined,
        1,
        1000
      ),
      payable: this.transactionService.getTransactions(
        TransactionKind.PAYABLE,
        TransactionStatus.PENDING,
        undefined,
        undefined,
        undefined,
        1,
        1000
      ),
      allPending: this.transactionService.getTransactions(
        undefined,
        TransactionStatus.PENDING,
        undefined,
        undefined,
        undefined,
        1,
        1000
      ),
    }).subscribe({
      next: (results) => {
        this.stats.totalReceivable = results.receivable.data.reduce(
          (sum, transaction) => sum + parseFloat(transaction.amount.toString()),
          0
        );

        this.stats.totalPayable = results.payable.data.reduce(
          (sum, transaction) => sum + parseFloat(transaction.amount.toString()),
          0
        );

        // Calcular total em atraso
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.stats.totalOverdue = results.allPending.data
          .filter((transaction) => {
            const dueDate = new Date(transaction.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate < today;
          })
          .reduce((sum, transaction) => sum + parseFloat(transaction.amount.toString()), 0);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados do dashboard:', error);
        this.isLoading = false;
      },
    });
  }

  navigateToTransactions(kind?: TransactionKind, status?: TransactionStatus): void {
    this.router.navigate(['/transactions'], {
      queryParams: {
        kind: kind || '',
        status: status || '',
      },
    });
  }

  navigateToReports(): void {
    this.router.navigate(['/reports']);
  }
}
