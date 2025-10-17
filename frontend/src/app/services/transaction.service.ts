import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Transaction, TransactionsResponse, TransactionKind, TransactionStatus } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getTransactions(
    kind?: TransactionKind,
    status?: TransactionStatus,
    clientId?: string,
    from?: string,
    to?: string,
    page = 1,
    limit = 10
  ): Observable<TransactionsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (kind) params = params.set('kind', kind);
    if (status) params = params.set('status', status);
    if (clientId) params = params.set('clientId', clientId);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get<TransactionsResponse>(this.apiUrl, { params });
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  updateTransaction(id: string, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.patch<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  payTransaction(id: string): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/${id}/pay`, {});
  }
}
