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
  nif: string;
  admin_email: string;
  admin_password: string;
  logo_url?: string;
  plan?: string;
  average_wait_time?: number;
  queues?: Customer[];
  history?: Customer[];
}

export interface QueueState {
  establishments: Establishment[];
}

export interface Subscription {
  id: string;
  created_at: string;
  name: string;
  nif: string;
  admin_email: string;
  admin_password: string;
  logo_url?: string;
  plan?: string;
  status: 'pending' | 'approved' | 'rejected';
}
