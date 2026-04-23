export interface Service {
  id: string;
  est_id: string;
  name: string;
  prefix: string;
  is_active: boolean;
}

export type QueueMode = 'normal' | 'multi_service_single' | 'multi_service_multi';

export interface Customer {
  id: string;
  phone: string;
  name?: string;
  joined_at: string;
  status: "waiting" | "called" | "served";
  ticket_number: string;
  is_arrived?: boolean;
  service_id?: string;
  service_name?: string;
}

export interface Establishment {
  id: string;
  code: string; 
  name: string;
  initials: string;
  nif: string;
  admin_email: string;
  admin_password: string;
  phone?: string;
  logo_url?: string;
  plan?: string;
  sms_campaigns_balance?: number;
  is_active?: boolean;
  queue_mode?: QueueMode;
  services?: Service[];
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
  phone?: string;
  logo_url?: string;
  plan?: string;
  status: 'pending' | 'approved' | 'rejected';
}
