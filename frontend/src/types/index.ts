// /frontend/src/types/index.ts

// O tipo completo que representa um Aluno, como ele existe no banco de dados
export type Student = {
  id: number;
  name: string;
  birth_date: string;
  guardian_id: number;
  school_id: number;
  address_id: number;
};

// O tipo completo para uma Escola
export type School = {
  id: number;
  name: string;
  cnpj: string | null;
};

export type InstallmentStatus =
  | "paid"
  | "pending"
  | "overdue"
  | "cancelled"
  | "sem_parcela";
