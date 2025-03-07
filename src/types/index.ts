export interface User {
  id: string;
  email: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  roi: number;
  imageUrl: string;
  type: 'residential' | 'commercial';
  status: 'available' | 'coming_soon' | 'funded';
}

export interface Business {
  id: string;
  name: string;
  description: string;
  sector: string;
  location: string;
  investmentRequired: number;
  roi: number;
  imageUrl: string;
  status: 'available' | 'coming_soon' | 'funded';
}

export interface Investment {
  id: string;
  userId: string;
  amount: number;
  startDate: string;
  endDate: string;
  interestRate: number;
  status: 'pending' | 'active' | 'completed';
  type: 'property' | 'business';
  targetId: string;
}

export interface InvestmentDocument {
  id: string;
  userId: string;
  documentName: string;
  status: 'pending' | 'completed';
  dateCreated: string;
  dateCompleted?: string;
}