import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { SidebarComponent } from '../layout/sidebar/sidebar';
import { ClientService, ClientQueryParams } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SidebarComponent],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css'],
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  isLoading = false;
  showModal = false;
  isEditMode = false;
  clientForm: FormGroup;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalItems = 0;
  searchTerm = '';
  searchFilter: 'firstName' | 'lastName' | 'email' | 'cpfCnpj' = 'firstName';
  selectedClientId: string | null = null;
  errorMessage = '';

  constructor(private clientService: ClientService, private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      cpfCnpj: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
    });
  }

  ngOnInit(): void {
    console.log('ClientsComponent initialized');
    this.loadClients();
  }

  loadClients(): void {
    console.log('Loading clients...');
    this.isLoading = true;
    this.errorMessage = '';

    const queryParams: ClientQueryParams = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };

    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.trim();

      queryParams[this.searchFilter] = term;
    }

    this.clientService.getClients(queryParams).subscribe({
      next: (response) => {
        console.log('Clients loaded:', response);
        this.clients = response.data;
        this.totalItems = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.errorMessage = 'Erro ao carregar clientes. Por favor, tente novamente.';
        this.isLoading = false;
      },
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.currentPage = 1;
    this.loadClients();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadClients();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchFilter = 'firstName';
    this.currentPage = 1;
    this.loadClients();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedClientId = null;
    this.errorMessage = '';
    this.clientForm.reset();
    this.showModal = true;
  }

  openEditModal(client: Client): void {
    this.isEditMode = true;
    this.selectedClientId = client.id;
    this.errorMessage = '';
    this.clientForm.patchValue({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      cpfCnpj: client.cpfCnpj,
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.clientForm.reset();
    this.selectedClientId = null;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      Object.keys(this.clientForm.controls).forEach((key) => {
        this.clientForm.get(key)?.markAsTouched();
      });
      return;
    }

    const clientData = this.clientForm.value;

    if (this.isEditMode && this.selectedClientId) {
      this.updateClient(this.selectedClientId, clientData);
    } else {
      this.createClient(clientData);
    }
  }

  private createClient(clientData: any): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.createClient(clientData).subscribe({
      next: () => {
        this.loadClients();
        this.closeModal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao criar cliente:', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      },
    });
  }

  private updateClient(id: string, clientData: any): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.updateClient(id, clientData).subscribe({
      next: () => {
        this.loadClients();
        this.closeModal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao atualizar cliente:', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      },
    });
  }

  deleteClient(id: string): void {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.loadClients();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao excluir cliente:', error);
        this.errorMessage = 'Erro ao excluir cliente. Por favor, tente novamente.';
        this.isLoading = false;
      },
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      if (Array.isArray(error.error.message)) {
        return error.error.message.join(', ');
      }
      return error.error.message;
    }

    if (error.status === 409) {
      return 'Já existe um cliente cadastrado com este email ou CPF/CNPJ.';
    }

    if (error.status === 400) {
      return 'Dados inválidos. Verifique as informações e tente novamente.';
    }

    return 'Erro ao processar a solicitação. Por favor, tente novamente.';
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadClients();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadClients();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadClients();
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

  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);

    if (!field || !field.touched || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'Este campo é obrigatório.';
    }

    if (field.errors['email']) {
      return 'Email inválido.';
    }

    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Deve ter no mínimo ${minLength} caracteres.`;
    }

    if (field.errors['maxlength']) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `Deve ter no máximo ${maxLength} caracteres.`;
    }

    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
