export interface UserItem {
  id: string;
  partnerId?: string;
  partnerCode?: string;
  partnerName?: string;
  companyId?: string;
  companyCode?: string;
  companyName?: string;
  email: string;
  phone?: string;
  fullName: string;
  role: 'SuperAdmin' | 'Admin' | 'User';
  avatarUrl?: string;
  status: 'Active' | 'Locked' | 'Disabled';
  createdAt: string;
  updatedAt?: string;
}

export interface EcosystemAppItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  serviceName?: string;
  namespace?: string;
  clientId?: string;
  clientSecret?: string;
  redirectUrls?: string[];
  url?: string;
  icon?: string;
  color?: string;
  category?: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PartnerEntity {
  id: string;
  code: string;
  name: string;
  taxCode?: string;
  email?: string;
  phone?: string;
  website?: string;
  logo?: string;
  address?: string;
  representative?: string;
  isActive: boolean;
  userCount: number;
  createdAt: string;
  updatedAt?: string;
}

export type CompanyEntity = PartnerEntity;

export enum ProvinceDivisionType {
  Province = 1,
  Municipality = 2,
}

export enum WardDivisionType {
  Ward = 1,
  Commune = 2,
  Township = 3,
}

export interface ProvinceEntity {
  id: string;
  code: string;
  name: string;
  fullName: string;
  divisionType?: ProvinceDivisionType | string;
  divisionTypeName?: string;
  administrativeRegion?: string;
  sortOrder?: number;
  isActive: boolean;
  wardCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface WardEntity {
  id: string;
  provinceId: string;
  provinceCode: string;
  provinceName?: string;
  code: string;
  name: string;
  fullName: string;
  divisionType?: WardDivisionType | string;
  divisionTypeName?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SessionItem {
  id: string;
  familyId: string;
  deviceName: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface LoginLogItem {
  id: string;
  userId?: string;
  userName?: string;
  emailAttempted: string;
  eventType: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  failureReason?: string;
  createdAt: string;
}
