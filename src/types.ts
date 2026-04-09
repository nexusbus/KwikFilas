export interface Customer {
  id: string;
  phone: string;
  name?: string;
  joined_at: string;
  status: "waiting" | "called" | "served";
  ticket_number: string;
  is_arrived?: boolean;
}

export interface Establishment {
  id: string;
  code: string; 
  name: string;
  initials: string;
  password?: string;
  average_wait_time?: number;
  customers: Customer[];
  history: Customer[];
  contacts: string[]; 
}

export interface QueueState {
  establishments: Establishment[];
}
