export interface Appointment {
  id: number;
  house: {
    id: number;
    title: string;
    price: number;
    images?: string;
  };
  tenant: {
    id: number;
    username: string;
    realName?: string;
    phone?: string;
  };
  landlord: {
    id: number;
    username: string;
    realName?: string;
    phone?: string;
  };
  visitDate: string;
  visitTime: string;
  message?: string;
  status: string;
  createdAt: string;
}

export interface AppointmentRequest {
  houseId: number;
  visitDate: string;
  visitTime: string;
  message?: string;
}
