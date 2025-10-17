export interface Payload {
  sub: string;
  email: string;
  roles: 'ADMIN' | 'USER';
  type?: 'access' | 'refresh';
}
