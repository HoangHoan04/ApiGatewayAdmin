export const enumData = {
  PAGE: {
    PAGE_INDEX: 1,
    PAGE_SIZE: 10,
    PAGE_SIZE_MAX: 1000000,
    LST_PAGE_SIZE: [10, 20, 50, 100],
    TOTAL: 0,
    SORT_ORDER: {
      ASC: 'asc',
      DESC: 'desc',
    },

    SORT_FIELD: {
      CREATED_AT: 'createdAt',
      UPDATED_AT: 'updatedAt',
      NAME: 'name',
      CODE: 'code',
      ACTIVATE_STATUS: 'activateStatus',
      IS_DELETED: 'isDeleted',
      STATUS_LABEL: 'statusLabel',
      STATUS: 'status',
      YEAR: 'year',
      REMAINING_DAYS: 'remainingDays',
      WORK_DATE: 'workDate',
      REQUEST_DATE: 'requestDate',
      DISPLAY_ORDER: 'displayOrder',
      SLIP_DATE: 'slipDate',
      USERNAME: 'username',
    },
  },

  maxSizeUpload: 5 * 1024 * 1024,

  STATUS_FILTER_IS_DELETED: {
    ACTIVE: { code: 'ACTIVE', label: 'enums.statusFilter.active', value: false },
    INACTIVE: { code: 'INACTIVE', label: 'enums.statusFilter.inactive', value: true },
    ALL: { code: 'ALL', label: 'enums.statusFilter.all', value: null },
  },

  STATUS_FILTER_IS_ACTIVE: {
    ACTIVE: { code: 'ACTIVE', label: 'enums.statusFilter.active', value: true },
    INACTIVE: { code: 'INACTIVE', label: 'enums.statusFilter.inactive', value: false },
    ALL: { code: 'ALL', label: 'enums.statusFilter.all', value: null },
  },

  YES_NO_FILTER: {
    YES: { code: 'YES', label: 'enums.yesNoFilter.yes', value: true },
    NO: { code: 'NO', label: 'enums.yesNoFilter.no', value: false },
    ALL: { code: 'ALL', label: 'enums.yesNoFilter.all', value: null },
  },

  GENDER: {
    MALE: { code: 'MALE', label: 'enums.gender.male', value: 'MALE', color: '#1890ff' },
    FEMALE: { code: 'FEMALE', label: 'enums.gender.female', value: 'FEMALE', color: '#faad14' },
    OTHER: { code: 'OTHER', label: 'enums.gender.other', value: 'OTHER', color: '#722ed1' },
  },

  ACTION_TYPE: {
    CREATE: {
      code: 'CREATE',
      label: 'Tạo mới',
      type: 'ThemMoi',
      color: '#00FF00',
    },
    APPROVE: {
      code: 'APPROVE',
      label: 'enums.actionType.approve',
      type: 'Duyet',
      color: '#00FF00',
    },
    ACTIVATE: {
      code: 'ACTIVATE',
      label: 'enums.actionType.activate',
      type: 'KichHoat',
      color: '#00FF00',
    },
    LOGIN: {
      code: 'LOGIN',
      label: 'enums.actionType.login',
      type: 'DangNhap',
      color: '#00FF00',
    },

    UPDATE: {
      code: 'UPDATE',
      label: 'enums.actionType.update',
      type: 'CapNhat',
      color: '#FFFF00',
    },
    EDIT: {
      code: 'EDIT',
      label: 'enums.actionType.edit',
      type: 'ChinhSua',
      color: '#FFA500',
    },

    DELETE: {
      code: 'DELETE',
      label: 'enums.actionType.delete',
      type: 'XoaBo',
      color: '#FF0000',
    },
    REJECT: {
      code: 'REJECT',
      label: 'enums.actionType.reject',
      type: 'TuChoi',
      color: '#FF0000',
    },
    CANCEL: {
      code: 'CANCEL',
      label: 'enums.actionType.cancel',
      type: 'Huy',
      color: '#78716C',
    },
    DEACTIVATE: {
      code: 'DEACTIVATE',
      label: 'enums.actionType.deactivate',
      type: 'NgungHoatDong',
      color: '#808080',
    },
    LOGOUT: {
      code: 'LOGOUT',
      label: 'enums.actionType.logout',
      type: 'DangXuat',
      color: '#78716C',
    },

    SYNC: {
      code: 'SYNC',
      label: 'enums.actionType.sync',
      type: 'DongBo',
      color: '#0000FF',
    },
    SEND_APPROVE: {
      code: 'SEND_APPROVE',
      label: 'enums.actionType.sendApprove',
      type: 'GuiDuyet',
      color: '#00FFFF',
    },
    RESTORE: {
      code: 'RESTORE',
      label: 'enums.actionType.restore',
      type: 'KhoiPhuc',
      color: '#00FFFF',
    },
    REGISTER: {
      code: 'REGISTER',
      label: 'enums.actionType.register',
      type: 'DangKy',
      color: '#4B0082',
    },
    IMPORT_EXCEL: {
      code: 'IMPORT_EXCEL',
      label: 'enums.actionType.importExcel',
      type: 'NhapExcel',
      color: '#800080',
    },
    UPLOAD_FILE: {
      code: 'UPLOAD_FILE',
      label: 'enums.actionType.uploadFile',
      type: 'TaiFileLen',
      color: '#800080',
    },
    LOCK: {
      code: 'LOCK',
      label: 'enums.actionType.lock',
      color: '#FF0000',
    },
    UNLOCK: {
      code: 'UNLOCK',
      label: 'enums.actionType.unlock',
      color: '#00FF00',
    },
  },

  DAY_OF_WEEK: {
    SUNDAY: {
      code: 'SUNDAY',
      key: 'CN',
      label: 'enums.daysOfWeek.sun',
      value: 0,
    },
    MONDAY: {
      code: 'MONDAY',
      key: 'T2',
      label: 'enums.daysOfWeek.mon',
      value: 1,
    },
    TUESDAY: {
      code: 'TUESDAY',
      key: 'T3',
      label: 'enums.daysOfWeek.tue',
      value: 2,
    },
    WEDNESDAY: {
      code: 'WEDNESDAY',
      key: 'T4',
      label: 'enums.daysOfWeek.wed',
      value: 3,
    },
    THURSDAY: {
      code: 'THURSDAY',
      key: 'T5',
      label: 'enums.daysOfWeek.thu',
      value: 4,
    },
    FRIDAY: {
      code: 'FRIDAY',
      key: 'T6',
      label: 'enums.daysOfWeek.fri',
      value: 5,
    },
    SATURDAY: {
      code: 'SATURDAY',
      key: 'T7',
      label: 'enums.daysOfWeek.sat',
      value: 6,
    },
  },

  MONTH: {
    JANUARY: { code: 'JANUARY', label: 'enums.month.january', value: 0 },
    FEBRUARY: { code: 'FEBRUARY', label: 'enums.month.february', value: 1 },
    MARCH: { code: 'MARCH', label: 'enums.month.march', value: 2 },
    APRIL: { code: 'APRIL', label: 'enums.month.april', value: 3 },
    MAY: { code: 'MAY', label: 'enums.month.may', value: 4 },
    JUNE: { code: 'JUNE', label: 'enums.month.june', value: 5 },
    JULY: { code: 'JULY', label: 'enums.month.july', value: 6 },
    AUGUST: { code: 'AUGUST', label: 'enums.month.august', value: 7 },
    SEPTEMBER: { code: 'SEPTEMBER', label: 'enums.month.september', value: 8 },
    OCTOBER: { code: 'OCTOBER', label: 'enums.month.october', value: 9 },
    NOVEMBER: { code: 'NOVEMBER', label: 'enums.month.november', value: 10 },
    DECEMBER: { code: 'DECEMBER', label: 'enums.month.december', value: 11 },
  },

  HTTP_METHOD: {
    GET: { code: 'GET', name: 'GET', color: '#10b981', severity: 'success' as const },
    POST: { code: 'POST', name: 'POST', color: '#3b82f6', severity: 'primary' as const },
    PUT: { code: 'PUT', name: 'PUT', color: '#f59e0b', severity: 'warning' as const },
    PATCH: { code: 'PATCH', name: 'PATCH', color: '#8b5cf6', severity: 'info' as const },
    DELETE: { code: 'DELETE', name: 'DELETE', color: '#ef4444', severity: 'danger' as const },
    OPTIONS: { code: 'OPTIONS', name: 'OPTIONS', color: '#64748b', severity: 'secondary' as const },
    HEAD: { code: 'HEAD', name: 'HEAD', color: '#64748b', severity: 'secondary' as const },
  },

  GATEWAY_CLUSTER: {
    AUTH: {
      code: 'auth-cluster',
      name: 'Auth Cluster',
      description: 'Dịch vụ xác thực tập trung & SSO',
      color: '#6366f1',
    },
    HRM: {
      code: 'hrm-cluster',
      name: 'HRM Cluster',
      description: 'Quản trị Nhân sự & Tiền lương',
      color: '#0ea5e9',
    },
    INTEGRATION_HUB: {
      code: 'integration-hub-cluster',
      name: 'Integration Hub Cluster',
      description: 'Cổng tích hợp đối tác & Webhooks',
      color: '#10b981',
    },
    NOTIFICATIONS_HUB: {
      code: 'notifications-hub-cluster',
      name: 'Notifications Hub Cluster',
      description: 'Dịch vụ thông báo thời gian thực SignalR',
      color: '#f59e0b',
    },
    AI_GATEWAY: {
      code: 'ai-gateway-cluster',
      name: 'AI Gateway Cluster',
      description: 'Cổng điều phối AI, LLM Chatbot',
      color: '#ec4899',
    },
    WMS: {
      code: 'wms-cluster',
      name: 'WMS Cluster',
      description: 'Quản lý kho bãi & Hàng tồn',
      color: '#8b5cf6',
    },
    TMS: {
      code: 'tms-cluster',
      name: 'TMS Cluster',
      description: 'Quản lý vận tải & Điều phối xe',
      color: '#14b8a6',
    },
  },
};
