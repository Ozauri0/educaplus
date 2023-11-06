export interface User {
  id?: number;
	nombres?: string;
	apellidos?: string;
	rut?: string;
	telefono?: string;
	correo: string;
	contrasena: string;
}

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  signin: (user: User) => void;
  logout: () => void;
  loading: boolean;
}