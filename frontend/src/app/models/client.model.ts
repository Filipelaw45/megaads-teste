export interface Client {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  cpfCnpj: string;
}

export interface CreateClientDto {
  firstName: string;
  lastName: string;
  email: string;
  cpfCnpj: string;
}

export interface UpdateClientDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  cpfCnpj?: string;
}

export interface ClientsResponse {
  data: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
