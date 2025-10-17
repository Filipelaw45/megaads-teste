import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Client, ClientsResponse, CreateClientDto, UpdateClientDto } from '../models/client.model';

export interface ClientQueryParams {
  email?: string;
  cpfCnpj?: string;
  firstName?: string;
  lastName?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getClients(queryParams?: ClientQueryParams): Observable<ClientsResponse> {
    let params = new HttpParams();

    if (queryParams) {
      if (queryParams.email) {
        params = params.set('email', queryParams.email);
      }
      if (queryParams.cpfCnpj) {
        params = params.set('cpfCnpj', queryParams.cpfCnpj);
      }
      if (queryParams.firstName) {
        params = params.set('firstName', queryParams.firstName);
      }
      if (queryParams.lastName) {
        params = params.set('lastName', queryParams.lastName);
      }
      if (queryParams.page) {
        params = params.set('page', queryParams.page.toString());
      }
      if (queryParams.limit) {
        params = params.set('limit', queryParams.limit.toString());
      }
    }

    return this.http.get<ClientsResponse>(this.apiUrl, { params });
  }

  getClient(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  createClient(client: CreateClientDto): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: string, client: UpdateClientDto): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
