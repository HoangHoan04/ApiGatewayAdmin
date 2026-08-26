export interface NotificationItem {
  id: string;
  userId: string;
  employeeId?: string;
  title: string;
  content: string;
  type: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER' | string;
  targetUrl?: string;
  targetType?: string;
  targetId?: string;
  dataJson?: string;
  isRead: boolean;
  readAt?: string;
  isBroadcast: boolean;
  senderId?: string;
  senderName?: string;
  createdAt: string;
}

export interface NotificationFilter {
  pageIndex: number;
  pageSize: number;
  isRead?: boolean;
  type?: string;
  keyword?: string;
}

export interface BroadcastNotificationPayload {
  title: string;
  content: string;
  type: string;
  severity: string;
  targetUrl?: string;
  companyId?: string;
  branchId?: string;
  departmentId?: string;
  targetUserIds?: string[];
}

export interface NotificationSetting {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  notifyOnLeave: boolean;
  notifyOnOvertime: boolean;
  notifyOnAttendance: boolean;
  notifyOnPayslip: boolean;
  notifyOnContract: boolean;
  notifyOnRecruitment: boolean;
}
