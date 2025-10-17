import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CashflowReport } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getCashflowReport(from: string, to: string): Observable<CashflowReport> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    return this.http.get<CashflowReport>(`${this.apiUrl}/cashflow`, { params });
  }
}
