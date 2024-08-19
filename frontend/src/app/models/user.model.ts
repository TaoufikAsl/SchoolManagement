export interface User {
    id: number ;
    username: string;
    password: string;
    role?: string; //nullable pour permettre le passage dans logincomponent et retrouver le role via le backend
  }
  