import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SidebarComponent } from '../layout/sidebar/sidebar';
import { TransactionService } from '../../services/transaction.service';
import { ClientService } from '../../services/client.service';
import { Transaction, TransactionKind, TransactionStatus } from '../../models/transaction.model';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SidebarComponent],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  clients: Client[] = [];
  isLoading = false;
  showModal = false;
  isEditMode = false;
  transactionForm: FormGroup;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalItems = 0;
  selectedTransactionId: string | null = null;

  filterKind: TransactionKind | '' = '';
  filterStatus: TransactionStatus | '' = '';
  filterClientId = '';

  TransactionKind = TransactionKind;
  TransactionStatus = TransactionStatus;

  constructor(
    private transactionService: TransactionService,
    private clientService: ClientService,
    private fb: FormBuilder
  ) {
    this.transactionForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      dueDate: ['', Validators.required],
      kind: [TransactionKind.RECEIVABLE, Validators.required],
      status: [TransactionStatus.PENDING],
      clientId: ['']
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
    this.loadClients();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.transactionService.getTransactions(
      this.filterKind || undefined,
      this.filterStatus || undefined,
      this.filterClientId || undefined,
      undefined,
      undefined,
      this.currentPage,
      this.itemsPerPage
    ).subscribe({
      next: (response) => {
        this.transactions = response.data;
        this.totalItems = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadClients(): void {
    this.clientService.getClients({
      page: 1,
      limit: 100
    }).subscribe({
      next: (response) => {
        this.clients = response.data;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadTransactions();
  }

  clearFilters(): void {
    this.filterKind = '';
    this.filterStatus = '';
    this.filterClientId = '';
    this.currentPage = 1;
    this.loadTransactions();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedTransactionId = null;
    this.transactionForm.reset({
      kind: TransactionKind.RECEIVABLE,
      status: TransactionStatus.PENDING
    });
    this.showModal = true;
  }

  openEditModal(transaction: Transaction): void {
    this.isEditMode = true;
    this.selectedTransactionId = transaction.id;
    this.transactionForm.patchValue({
      description: transaction.description,
      amount: transaction.amount,
      dueDate: transaction.dueDate,
      kind: transaction.kind,
      status: transaction.status,
      clientId: transaction.clientId || ''
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.transactionForm.reset();
    this.selectedTransactionId = null;
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      return;
    }

    const formValue = this.transactionForm.value;

    const transactionData: Partial<Transaction> = {
      description: formValue.description,
      amount: formValue.amount,
      dueDate: formValue.dueDate,
      kind: formValue.kind,
      clientId: formValue.clientId || null
    };

    if (this.isEditMode) {
      transactionData.status = formValue.status;
    }

    if (this.isEditMode && this.selectedTransactionId) {
      this.transactionService.updateTransaction(this.selectedTransactionId, transactionData).subscribe({
        next: () => {
          this.loadTransactions();
          this.closeModal();
        }
      });
    } else {
      this.transactionService.createTransaction(transactionData).subscribe({
        next: () => {
          this.loadTransactions();
          this.closeModal();
        }
      });
    }
  }

  deleteTransaction(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions();
        }
      });
    }
  }

  payTransaction(id: string): void {
    if (confirm('Deseja realmente marcar esta transação como paga?')) {
      this.transactionService.payTransaction(id).subscribe({
        next: () => {
          this.loadTransactions();
          alert('Transação paga com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao pagar transação:', error);
          alert('Erro ao pagar transação. Tente novamente.');
        }
      });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTransactions();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadTransactions();
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
