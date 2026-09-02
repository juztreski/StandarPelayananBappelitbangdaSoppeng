export type ServiceCategory = 'langsung' | 'tidak_langsung';

export interface Service {
  id: string;
  category: ServiceCategory;
  service_number: number;
  name: string;
  slug: string;
  description: string;
  responsible_person: string | null;
  requirements: string;
  procedure: string;
  duration: string;
  cost: string;
  product: string;
  complaint_handling: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceInput {
  category: ServiceCategory;
  service_number: number;
  name: string;
  slug: string;
  description: string;
  responsible_person: string | null;
  requirements: string;
  procedure: string;
  duration: string;
  cost: string;
  product: string;
  complaint_handling: string;
  icon: string | null;
}
