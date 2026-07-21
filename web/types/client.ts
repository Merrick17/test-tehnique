export type Client = {
  id: string;
  name: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { deliveries: number; distributions: number };
};

export type ClientInput = {
  name: string;
  email?: string | null;
  isActive?: boolean;
};