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

  EMPLOYEE_LEVEL: {
    INTERNSHIP: {
      code: 'INTERNSHIP',
      label: 'enums.employeeLevel.internship',
      value: 'INTERNSHIP',
      color: '#8c8c8c',
    },
    FRESHER: {
      code: 'FRESHER',
      label: 'enums.employeeLevel.fresher',
      value: 'FRESHER',
      color: '#52c41a',
    },
    JUNIOR: {
      code: 'JUNIOR',
      label: 'enums.employeeLevel.junior',
      value: 'JUNIOR',
      color: '#1890ff',
    },
    MIDDLE: {
      code: 'MIDDLE',
      label: 'enums.employeeLevel.middle',
      value: 'MIDDLE',
      color: '#faad14',
    },
    SENIOR: {
      code: 'SENIOR',
      label: 'enums.employeeLevel.senior',
      value: 'SENIOR',
      color: '#f5222d',
    },
    LEADER: {
      code: 'LEADER',
      label: 'enums.employeeLevel.leader',
      value: 'LEADER',
      color: '#722ed1',
    },
    MANAGER: {
      code: 'MANAGER',
      label: 'enums.employeeLevel.manager',
      value: 'MANAGER',
      color: '#eb2f96',
    },
    DIRECTOR: {
      code: 'DIRECTOR',
      label: 'enums.employeeLevel.director',
      value: 'DIRECTOR',
      color: '#13c2c2',
    },
    EXECUTIVE: {
      code: 'EXECUTIVE',
      label: 'enums.employeeLevel.executive',
      value: 'EXECUTIVE',
      color: '#2f54eb',
    },
  },

  WORKING_MODE: {
    ON_SITE: {
      code: 'ON_SITE',
      label: 'enums.workingMode.onSite',
      value: 'ON_SITE',
      color: '#1890ff',
    },
    REMOTE: {
      code: 'REMOTE',
      label: 'enums.workingMode.remote',
      value: 'REMOTE',
      color: '#52c41a',
    },
    HYBRID: {
      code: 'HYBRID',
      label: 'enums.workingMode.hybrid',
      value: 'HYBRID',
      color: '#faad14',
    },
    FLEXIBLE: {
      code: 'FLEXIBLE',
      label: 'enums.workingMode.flexible',
      value: 'FLEXIBLE',
      color: '#722ed1',
    },
    BUSINESS_TRIP: {
      code: 'BUSINESS_TRIP',
      label: 'enums.workingMode.businessTrip',
      value: 'BUSINESS_TRIP',
      color: '#13c2c2',
    },
  },

  WORK_STATUS: {
    WORKING: {
      code: 'WORKING',
      label: 'enums.workStatus.working',
      value: 'WORKING',
      color: '#52c41a',
    },
    PROBATION: {
      code: 'PROBATION',
      label: 'enums.workStatus.probation',
      value: 'PROBATION',
      color: '#1890ff',
    },
    OFFICIAL: {
      code: 'OFFICIAL',
      label: 'enums.workStatus.official',
      value: 'OFFICIAL',
      color: '#13c2c2',
    },
    ON_LEAVE: {
      code: 'ON_LEAVE',
      label: 'enums.workStatus.onLeave',
      value: 'ON_LEAVE',
      color: '#faad14',
    },
    SUSPENDED: {
      code: 'SUSPENDED',
      label: 'enums.workStatus.suspended',
      value: 'SUSPENDED',
      color: '#722ed1',
    },
    RESIGNED: {
      code: 'RESIGNED',
      label: 'enums.workStatus.resigned',
      value: 'RESIGNED',
      color: '#f5222d',
    },
    RETIRED: {
      code: 'RETIRED',
      label: 'enums.workStatus.retired',
      value: 'RETIRED',
      color: '#8c8c8c',
    },
  },

  PAYMENT_METHOD: {
    BANK_TRANSFER: {
      code: 'BANK_TRANSFER',
      label: 'enums.paymentMethod.bankTransfer',
      value: 'BANK_TRANSFER',
      color: '#1890ff',
    },
    CASH: {
      code: 'CASH',
      label: 'enums.paymentMethod.cash',
      value: 'CASH',
      color: '#52c41a',
    },
    OTHER: {
      code: 'OTHER',
      label: 'enums.paymentMethod.other',
      value: 'OTHER',
      color: '#8c8c8c',
    },
  },

  CURRENCY: {
    VND: {
      code: 'VND',
      label: 'enums.currency.vnd',
      value: 'VND',
      color: '#1890ff',
    },
    USD: {
      code: 'USD',
      label: 'enums.currency.usd',
      value: 'USD',
      color: '#52c41a',
    },
  },

  CONTRACT_STATUS: {
    DRAFT: {
      code: 'DRAFT',
      label: 'enums.contractStatus.draft',
      value: 'DRAFT',
      color: '#8c8c8c',
    },
    PENDING_SIGN: {
      code: 'PENDING_SIGN',
      label: 'enums.contractStatus.pendingSign',
      value: 'PENDING_SIGN',
      color: '#1890ff',
    },
    ACTIVE: {
      code: 'ACTIVE',
      label: 'enums.contractStatus.active',
      value: 'ACTIVE',
      color: '#52c41a',
    },
    EXPIRING_SOON: {
      code: 'EXPIRING_SOON',
      label: 'enums.contractStatus.expiringSoon',
      value: 'EXPIRING_SOON',
      color: '#faad14',
    },
    EXPIRED: {
      code: 'EXPIRED',
      label: 'enums.contractStatus.expired',
      value: 'EXPIRED',
      color: '#f5222d',
    },
    TERMINATED: {
      code: 'TERMINATED',
      label: 'enums.contractStatus.terminated',
      value: 'TERMINATED',
      color: '#cf1322',
    },
    LIQUIDATED: {
      code: 'LIQUIDATED',
      label: 'enums.contractStatus.liquidated',
      value: 'LIQUIDATED',
      color: '#595959',
    },
  },

  REVIEW_RENEWAL_STATUS: {
    PENDING_REVIEW: {
      code: 'PENDING_REVIEW',
      label: 'enums.reviewRenewalStatus.pendingReview',
      value: 'PENDING_REVIEW',
      color: '#faad14',
    },
    PENDING_APPROVAL: {
      code: 'PENDING_APPROVAL',
      label: 'enums.reviewRenewalStatus.pendingApproval',
      value: 'PENDING_APPROVAL',
      color: '#1890ff',
    },
    APPROVED: {
      code: 'APPROVED',
      label: 'enums.reviewRenewalStatus.approved',
      value: 'APPROVED',
      color: '#52c41a',
    },
    REJECTED: {
      code: 'REJECTED',
      label: 'enums.reviewRenewalStatus.rejected',
      value: 'REJECTED',
      color: '#f5222d',
    },
    APPLIED: {
      code: 'APPLIED',
      label: 'enums.reviewRenewalStatus.applied',
      value: 'APPLIED',
      color: '#13c2c2',
    },
  },

  REVIEW_RECOMMENDATION: {
    RENEW: {
      code: 'RENEW',
      label: 'enums.reviewRecommendation.renew',
      value: 'RENEW',
      color: '#52c41a',
    },
    CONVERT: {
      code: 'CONVERT',
      label: 'enums.reviewRecommendation.convert',
      value: 'CONVERT',
      color: '#1890ff',
    },
    INCREASE_SALARY: {
      code: 'INCREASE_SALARY',
      label: 'enums.reviewRecommendation.increaseSalary',
      value: 'INCREASE_SALARY',
      color: '#722ed1',
    },
    TERMINATE: {
      code: 'TERMINATE',
      label: 'enums.reviewRecommendation.terminate',
      value: 'TERMINATE',
      color: '#f5222d',
    },
    NO_CHANGE: {
      code: 'NO_CHANGE',
      label: 'enums.reviewRecommendation.noChange',
      value: 'NO_CHANGE',
      color: '#8c8c8c',
    },
  },

  SALARY_STATUS: {
    DRAFT: {
      code: 'DRAFT',
      label: 'enums.salaryStatus.draft',
      value: 'DRAFT',
      color: '#8c8c8c',
    },
    PROCESSING: {
      code: 'PROCESSING',
      label: 'enums.salaryStatus.processing',
      value: 'PROCESSING',
      color: '#1890ff',
    },
    APPROVED: {
      code: 'APPROVED',
      label: 'enums.salaryStatus.approved',
      value: 'APPROVED',
      color: '#52c41a',
    },
    PAID: {
      code: 'PAID',
      label: 'enums.salaryStatus.paid',
      value: 'PAID',
      color: '#13c2c2',
    },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.salaryStatus.cancelled',
      value: 'CANCELLED',
      color: '#f5222d',
    },
  },

  SLIP_STATUS: {
    DRAFT: {
      code: 'DRAFT',
      label: 'enums.slipStatus.draft',
      value: 'DRAFT',
      color: '#8c8c8c',
    },
    PENDING: {
      code: 'PENDING',
      label: 'enums.slipStatus.pending',
      value: 'PENDING',
      color: '#faad14',
    },
    APPROVED: {
      code: 'APPROVED',
      label: 'enums.slipStatus.approved',
      value: 'APPROVED',
      color: '#52c41a',
    },
    APPLIED: {
      code: 'APPLIED',
      label: 'enums.slipStatus.applied',
      value: 'APPLIED',
      color: '#13c2c2',
    },
    REJECTED: {
      code: 'REJECTED',
      label: 'enums.slipStatus.rejected',
      value: 'REJECTED',
      color: '#f5222d',
    },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.slipStatus.cancelled',
      value: 'CANCELLED',
      color: '#bfbfbf',
    },
  },

  SLIP_KIND: {
    DEDUCTION: {
      code: 'DEDUCTION',
      label: 'enums.slipKind.deduction',
      value: 'DEDUCTION',
      color: '#f5222d',
    },
    ADDITION: {
      code: 'ADDITION',
      label: 'enums.slipKind.addition',
      value: 'ADDITION',
      color: '#52c41a',
    },
  },

  SALARY_ITEM_TYPE: {
    INCOME: {
      code: 'INCOME',
      label: 'enums.salaryItemType.income',
      value: 'INCOME',
      color: '#52c41a',
    },
    DEDUCTION: {
      code: 'DEDUCTION',
      label: 'enums.salaryItemType.deduction',
      value: 'DEDUCTION',
      color: '#f5222d',
    },
  },

  DEDUCTION_SLIP_TYPE: {
    FINE: {
      code: 'FINE',
      label: 'enums.deductionSlipType.fine',
      value: 'FINE',
    },
    COMPENSATION: {
      code: 'COMPENSATION',
      label: 'enums.deductionSlipType.compensation',
      value: 'COMPENSATION',
    },
    OTHER: {
      code: 'OTHER',
      label: 'enums.deductionSlipType.other',
      value: 'OTHER',
    },
  },

  ADDITION_SLIP_TYPE: {
    BONUS: {
      code: 'BONUS',
      label: 'enums.additionSlipType.bonus',
      value: 'BONUS',
    },
    SUPPORT: {
      code: 'SUPPORT',
      label: 'enums.additionSlipType.support',
      value: 'SUPPORT',
    },
    OTHER: {
      code: 'OTHER',
      label: 'enums.additionSlipType.other',
      value: 'OTHER',
    },
  },

  PUNCH_TYPE: {
    IN: { code: 'IN', label: 'enums.punchType.in', value: 'IN' },
    OUT: { code: 'OUT', label: 'enums.punchType.out', value: 'OUT' },
    CHECKIN: { code: 'CHECKIN', label: 'enums.punchType.checkIn', value: 'CHECKIN' },
    CHECKOUT: { code: 'CHECKOUT', label: 'enums.punchType.checkOut', value: 'CHECKOUT' },
  },

  LEAVE_CALENDAR_EVENT_TYPE: {
    LEAVE: { code: 'LEAVE', label: 'enums.leaveCalendarEventType.leave', value: 'LEAVE' },
    HOLIDAY: {
      code: 'HOLIDAY',
      label: 'enums.leaveCalendarEventType.holiday',
      value: 'HOLIDAY',
    },
  },

  ATTENDANCE_SCHEDULE_SOURCE: {
    DAY_OVERRIDE: {
      code: 'DAY_OVERRIDE',
      label: 'enums.attendanceScheduleSource.dayOverride',
      value: 'DAY_OVERRIDE',
    },
    WORK_PATTERN: {
      code: 'WORK_PATTERN',
      label: 'enums.attendanceScheduleSource.workPattern',
      value: 'WORK_PATTERN',
    },
    POSITION: {
      code: 'POSITION',
      label: 'enums.attendanceScheduleSource.position',
      value: 'POSITION',
    },
  },

  TRANSFER_STATUS: {
    PENDING: {
      code: 'PENDING',
      label: 'enums.transferStatus.pending',
      value: 'PENDING',
      color: '#faad14',
    },
    APPROVED: {
      code: 'APPROVED',
      label: 'enums.transferStatus.approved',
      value: 'APPROVED',
      color: '#52c41a',
    },
    REJECTED: {
      code: 'REJECTED',
      label: 'enums.transferStatus.rejected',
      value: 'REJECTED',
      color: '#f5222d',
    },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.transferStatus.cancelled',
      value: 'CANCELLED',
      color: '#8c8c8c',
    },
    APPLIED: {
      code: 'APPLIED',
      label: 'enums.transferStatus.applied',
      value: 'APPLIED',
      color: '#13c2c2',
    },
  },

  TRANSFER_TYPE: {
    INTERNAL_TRANSFER: {
      code: 'INTERNAL_TRANSFER',
      label: 'enums.transferType.internalTransfer',
      value: 'INTERNAL_TRANSFER',
      color: '#1890ff',
    },
    SECONDMENT: {
      code: 'SECONDMENT',
      label: 'enums.transferType.secondment',
      value: 'SECONDMENT',
      color: '#722ed1',
    },
    ROTATION: {
      code: 'ROTATION',
      label: 'enums.transferType.rotation',
      value: 'ROTATION',
      color: '#13c2c2',
    },
    COMPANY_TRANSFER: {
      code: 'COMPANY_TRANSFER',
      label: 'enums.transferType.companyTransfer',
      value: 'COMPANY_TRANSFER',
      color: '#2f54eb',
    },
    BRANCH_TRANSFER: {
      code: 'BRANCH_TRANSFER',
      label: 'enums.transferType.branchTransfer',
      value: 'BRANCH_TRANSFER',
      color: '#597ef7',
    },
    PROMOTION: {
      code: 'PROMOTION',
      label: 'enums.transferType.promotion',
      value: 'PROMOTION',
      color: '#52c41a',
    },
    DEMOTION: {
      code: 'DEMOTION',
      label: 'enums.transferType.demotion',
      value: 'DEMOTION',
      color: '#fa8c16',
    },
    DISMISSAL: {
      code: 'DISMISSAL',
      label: 'enums.transferType.dismissal',
      value: 'DISMISSAL',
      color: '#f5222d',
    },
  },

  ATTENDANCE_STATUS: {
    ON_TIME: {
      code: 'ON_TIME',
      label: 'enums.attendanceStatus.onTime',
      value: 'ON_TIME',
      color: '#52c41a',
    },
    LATE: {
      code: 'LATE',
      label: 'enums.attendanceStatus.late',
      value: 'LATE',
      color: '#faad14',
    },
    EARLY: {
      code: 'EARLY',
      label: 'enums.attendanceStatus.early',
      value: 'EARLY',
      color: '#13c2c2',
    },
    LEAVE: {
      code: 'LEAVE',
      label: 'enums.attendanceStatus.leave',
      value: 'LEAVE',
      color: '#1890ff',
    },
    ABSENT: {
      code: 'ABSENT',
      label: 'enums.attendanceStatus.absent',
      value: 'ABSENT',
      color: '#f5222d',
    },
    INCOMPLETE: {
      code: 'INCOMPLETE',
      label: 'enums.attendanceStatus.incomplete',
      value: 'INCOMPLETE',
      color: '#8c8c8c',
    },
  },

  DAY_OFF_STATUS: {
    PENDING: {
      code: 'PENDING',
      label: 'enums.dayOffStatus.pending',
      value: 'PENDING',
      color: '#faad14',
    },
    APPROVED: {
      code: 'APPROVED',
      label: 'enums.dayOffStatus.approved',
      value: 'APPROVED',
      color: '#52c41a',
    },
    REJECTED: {
      code: 'REJECTED',
      label: 'enums.dayOffStatus.rejected',
      value: 'REJECTED',
      color: '#f5222d',
    },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.dayOffStatus.cancelled',
      value: 'CANCELLED',
      color: '#8c8c8c',
    },
  },

  LEAVE_SESSION: {
    FULL: {
      code: 'FULL',
      label: 'enums.leaveSession.full',
      value: 'FULL',
    },
    AM: {
      code: 'AM',
      label: 'enums.leaveSession.am',
      value: 'AM',
    },
    PM: {
      code: 'PM',
      label: 'enums.leaveSession.pm',
      value: 'PM',
    },
  },

  LEAVE_STATUS: {
    NEW: {
      code: 'NEW',
      label: 'enums.leaveStatus.new',
      value: 'NEW',
      color: '#faad14',
    },
    AWAITING_APPROVAL: {
      code: 'AWAITING_APPROVAL',
      label: 'enums.leaveStatus.awaitingApproval',
      value: 'AWAITING_APPROVAL',
      color: '#1890ff',
    },
    APPROVED: {
      code: 'APPROVED',
      label: 'enums.leaveStatus.approved',
      value: 'APPROVED',
      color: '#52c41a',
    },
    REJECTED: {
      code: 'REJECTED',
      label: 'enums.leaveStatus.rejected',
      value: 'REJECTED',
      color: '#f5222d',
    },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.leaveStatus.cancelled',
      value: 'CANCELLED',
      color: '#8c8c8c',
    },
  },

  ATTENDANCE_COMPLAINT_STATUS: {
    PENDING: {
      code: 'PENDING',
      label: 'enums.attendanceComplaintStatus.pending',
      value: 'PENDING',
      color: '#faad14',
    },
    APPROVED: {
      code: 'APPROVED',
      label: 'enums.attendanceComplaintStatus.approved',
      value: 'APPROVED',
      color: '#52c41a',
    },
    REJECTED: {
      code: 'REJECTED',
      label: 'enums.attendanceComplaintStatus.rejected',
      value: 'REJECTED',
      color: '#f5222d',
    },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.attendanceComplaintStatus.cancelled',
      value: 'CANCELLED',
      color: '#8c8c8c',
    },
  },

  ATTENDANCE_COMPLAINT_TYPE: {
    FORGOT_CHECK_IN: {
      code: 'FORGOT_CHECK_IN',
      label: 'enums.attendanceComplaintType.forgotCheckIn',
      value: 'FORGOT_CHECK_IN',
    },
    FORGOT_CHECK_OUT: {
      code: 'FORGOT_CHECK_OUT',
      label: 'enums.attendanceComplaintType.forgotCheckOut',
      value: 'FORGOT_CHECK_OUT',
    },
    FORGOT_BOTH: {
      code: 'FORGOT_BOTH',
      label: 'enums.attendanceComplaintType.forgotBoth',
      value: 'FORGOT_BOTH',
    },
    WRONG_TIME: {
      code: 'WRONG_TIME',
      label: 'enums.attendanceComplaintType.wrongTime',
      value: 'WRONG_TIME',
    },
    OTHER: {
      code: 'OTHER',
      label: 'enums.attendanceComplaintType.other',
      value: 'OTHER',
    },
  },

  OVERTIME_REQUEST_STATUS: {
    DRAFT: {
      code: 'DRAFT',
      label: 'enums.overtimeRequestStatus.draft',
      value: 'DRAFT',
      color: '#8c8c8c',
    },
    SUBMITTED: {
      code: 'SUBMITTED',
      label: 'enums.overtimeRequestStatus.submitted',
      value: 'SUBMITTED',
      color: '#faad14',
    },
    APPROVED: {
      code: 'APPROVED',
      label: 'enums.overtimeRequestStatus.approved',
      value: 'APPROVED',
      color: '#52c41a',
    },
    REJECTED: {
      code: 'REJECTED',
      label: 'enums.overtimeRequestStatus.rejected',
      value: 'REJECTED',
      color: '#f5222d',
    },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.overtimeRequestStatus.cancelled',
      value: 'CANCELLED',
      color: '#8c8c8c',
    },
  },

  OVERTIME_TYPE: {
    AFTER_SHIFT: {
      code: 'AFTER_SHIFT',
      label: 'enums.overtimeType.afterShift',
      value: 'AFTER_SHIFT',
    },
    DAY_OFF: {
      code: 'DAY_OFF',
      label: 'enums.overtimeType.dayOff',
      value: 'DAY_OFF',
    },
    HOLIDAY: {
      code: 'HOLIDAY',
      label: 'enums.overtimeType.holiday',
      value: 'HOLIDAY',
    },
  },

  DATA_SCOPE: {
    ALL: {
      code: 'ALL',
      label: 'enums.dataScope.all',
      value: 'ALL',
    },
    COMPANY: {
      code: 'COMPANY',
      label: 'enums.dataScope.company',
      value: 'COMPANY',
    },
    BRANCH: {
      code: 'BRANCH',
      label: 'enums.dataScope.branch',
      value: 'BRANCH',
    },
    DEPARTMENT: {
      code: 'DEPARTMENT',
      label: 'enums.dataScope.department',
      value: 'DEPARTMENT',
    },
    PART: {
      code: 'PART',
      label: 'enums.dataScope.part',
      value: 'PART',
    },
    OWN: {
      code: 'OWN',
      label: 'enums.dataScope.own',
      value: 'OWN',
    },
  },

  USER_TYPE: {
    ADMIN: { code: 'ADMIN', label: 'enums.userType.admin', value: 'ADMIN' },
    HR: { code: 'HR', label: 'enums.userType.hr', value: 'HR' },
    MANAGER: { code: 'MANAGER', label: 'enums.userType.manager', value: 'MANAGER' },
    EMPLOYEE: { code: 'EMPLOYEE', label: 'enums.userType.employee', value: 'EMPLOYEE' },
  },

  RECRUITMENT_REQUEST_STATUS: {
    DRAFT: { code: 'DRAFT', label: 'enums.recruitmentRequestStatus.draft', value: 'DRAFT' },
    PENDING: {
      code: 'PENDING',
      label: 'enums.recruitmentRequestStatus.pending',
      value: 'PENDING',
    },
    APPROVED: {
      code: 'APPROVED',
      label: 'enums.recruitmentRequestStatus.approved',
      value: 'APPROVED',
    },
    REJECTED: {
      code: 'REJECTED',
      label: 'enums.recruitmentRequestStatus.rejected',
      value: 'REJECTED',
    },
    CLOSED: { code: 'CLOSED', label: 'enums.recruitmentRequestStatus.closed', value: 'CLOSED' },
  },

  RECRUITMENT_REQUEST_LEVEL: {
    COMPANY: {
      code: 'COMPANY',
      label: 'enums.recruitmentRequestLevel.company',
      value: 'COMPANY',
    },
    BRANCH: { code: 'BRANCH', label: 'enums.recruitmentRequestLevel.branch', value: 'BRANCH' },
    DEPARTMENT: {
      code: 'DEPARTMENT',
      label: 'enums.recruitmentRequestLevel.department',
      value: 'DEPARTMENT',
    },
    PART: { code: 'PART', label: 'enums.recruitmentRequestLevel.part', value: 'PART' },
  },

  HIRING_PLAN_STATUS: {
    DRAFT: { code: 'DRAFT', label: 'enums.hiringPlanStatus.draft', value: 'DRAFT' },
    OPEN: { code: 'OPEN', label: 'enums.hiringPlanStatus.open', value: 'OPEN' },
    CLOSED: { code: 'CLOSED', label: 'enums.hiringPlanStatus.closed', value: 'CLOSED' },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.hiringPlanStatus.cancelled',
      value: 'CANCELLED',
    },
  },

  CANDIDATE_STATUS: {
    NEW: { code: 'NEW', label: 'enums.candidateStatus.new', value: 'NEW' },
    SCREENING: {
      code: 'SCREENING',
      label: 'enums.candidateStatus.screening',
      value: 'SCREENING',
    },
    INTERVIEW: {
      code: 'INTERVIEW',
      label: 'enums.candidateStatus.interview',
      value: 'INTERVIEW',
    },
    WAITLIST: { code: 'WAITLIST', label: 'enums.candidateStatus.waitlist', value: 'WAITLIST' },
    OFFER: { code: 'OFFER', label: 'enums.candidateStatus.offer', value: 'OFFER' },
    HIRED: { code: 'HIRED', label: 'enums.candidateStatus.hired', value: 'HIRED' },
    REJECTED: { code: 'REJECTED', label: 'enums.candidateStatus.rejected', value: 'REJECTED' },
    WITHDRAWN: {
      code: 'WITHDRAWN',
      label: 'enums.candidateStatus.withdrawn',
      value: 'WITHDRAWN',
    },
  },

  INTERVIEW_STATUS: {
    SCHEDULED: {
      code: 'SCHEDULED',
      label: 'enums.interviewStatus.scheduled',
      value: 'SCHEDULED',
    },
    COMPLETED: {
      code: 'COMPLETED',
      label: 'enums.interviewStatus.completed',
      value: 'COMPLETED',
    },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.interviewStatus.cancelled',
      value: 'CANCELLED',
    },
    NO_SHOW: { code: 'NO_SHOW', label: 'enums.interviewStatus.noShow', value: 'NO_SHOW' },
  },

  HIRING_SOURCE_CHANNEL: {
    REFERRAL: {
      code: 'REFERRAL',
      label: 'enums.hiringSourceChannel.referral',
      value: 'REFERRAL',
    },
    EMAIL: { code: 'EMAIL', label: 'enums.hiringSourceChannel.email', value: 'EMAIL' },
    CAREERS_SITE: {
      code: 'CAREERS_SITE',
      label: 'enums.hiringSourceChannel.careersSite',
      value: 'CAREERS_SITE',
    },
    JOBBOARD: {
      code: 'JOBBOARD',
      label: 'enums.hiringSourceChannel.jobboard',
      value: 'JOBBOARD',
    },
    SOCIAL: { code: 'SOCIAL', label: 'enums.hiringSourceChannel.social', value: 'SOCIAL' },
    AGENCY: { code: 'AGENCY', label: 'enums.hiringSourceChannel.agency', value: 'AGENCY' },
    WALK_IN: { code: 'WALK_IN', label: 'enums.hiringSourceChannel.walkIn', value: 'WALK_IN' },
    OTHER: { code: 'OTHER', label: 'enums.hiringSourceChannel.other', value: 'OTHER' },
  },

  VIOLATION_SEVERITY: {
    LOW: { code: 'LOW', label: 'enums.violationSeverity.low', value: 'LOW' },
    MEDIUM: { code: 'MEDIUM', label: 'enums.violationSeverity.medium', value: 'MEDIUM' },
    HIGH: { code: 'HIGH', label: 'enums.violationSeverity.high', value: 'HIGH' },
    CRITICAL: {
      code: 'CRITICAL',
      label: 'enums.violationSeverity.critical',
      value: 'CRITICAL',
    },
  },

  VIOLATION_STATUS: {
    DRAFT: {
      code: 'DRAFT',
      label: 'enums.violationStatus.draft',
      value: 'DRAFT',
      color: '#8c8c8c',
    },
    CONFIRMED: {
      code: 'CONFIRMED',
      label: 'enums.violationStatus.confirmed',
      value: 'CONFIRMED',
      color: '#52c41a',
    },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.violationStatus.cancelled',
      value: 'CANCELLED',
      color: '#f5222d',
    },
  },

  PENALTY_TYPE: {
    WARNING: { code: 'WARNING', label: 'enums.penaltyType.warning', value: 'WARNING' },
    WRITTEN_WARNING: {
      code: 'WRITTEN_WARNING',
      label: 'enums.penaltyType.writtenWarning',
      value: 'WRITTEN_WARNING',
    },
    FINE: { code: 'FINE', label: 'enums.penaltyType.fine', value: 'FINE' },
    SUSPENSION: {
      code: 'SUSPENSION',
      label: 'enums.penaltyType.suspension',
      value: 'SUSPENSION',
    },
    TERMINATION: {
      code: 'TERMINATION',
      label: 'enums.penaltyType.termination',
      value: 'TERMINATION',
    },
    NONE: { code: 'NONE', label: 'enums.penaltyType.none', value: 'NONE' },
  },

  REVIEW_CYCLE_STATUS: {
    DRAFT: { code: 'DRAFT', label: 'enums.reviewCycleStatus.draft', value: 'DRAFT' },
    OPEN: { code: 'OPEN', label: 'enums.reviewCycleStatus.open', value: 'OPEN' },
    CLOSED: { code: 'CLOSED', label: 'enums.reviewCycleStatus.closed', value: 'CLOSED' },
  },

  TRAINING_COURSE_STATUS: {
    DRAFT: { code: 'DRAFT', label: 'enums.trainingCourseStatus.draft', value: 'DRAFT' },
    OPEN: { code: 'OPEN', label: 'enums.trainingCourseStatus.open', value: 'OPEN' },
    CLOSED: { code: 'CLOSED', label: 'enums.trainingCourseStatus.closed', value: 'CLOSED' },
  },

  TRAINING_ENROLLMENT_STATUS: {
    ENROLLED: {
      code: 'ENROLLED',
      label: 'enums.trainingEnrollmentStatus.enrolled',
      value: 'ENROLLED',
    },
    COMPLETED: {
      code: 'COMPLETED',
      label: 'enums.trainingEnrollmentStatus.completed',
      value: 'COMPLETED',
    },
    DROPPED: {
      code: 'DROPPED',
      label: 'enums.trainingEnrollmentStatus.dropped',
      value: 'DROPPED',
    },
  },

  PERFORMANCE_360_REVIEWER_TYPE: {
    SELF: { code: 'SELF', label: 'enums.performance360ReviewerType.self', value: 'SELF' },
    PEER: { code: 'PEER', label: 'enums.performance360ReviewerType.peer', value: 'PEER' },
    MANAGER: {
      code: 'MANAGER',
      label: 'enums.performance360ReviewerType.manager',
      value: 'MANAGER',
    },
  },

  PERFORMANCE_360_STATUS: {
    DRAFT: { code: 'DRAFT', label: 'enums.performance360Status.draft', value: 'DRAFT' },
    SUBMITTED: {
      code: 'SUBMITTED',
      label: 'enums.performance360Status.submitted',
      value: 'SUBMITTED',
    },
  },

  TRAINING_QUIZ_OPTION: {
    A: { code: 'A', label: 'enums.trainingQuizOption.a', value: 'A' },
    B: { code: 'B', label: 'enums.trainingQuizOption.b', value: 'B' },
    C: { code: 'C', label: 'enums.trainingQuizOption.c', value: 'C' },
    D: { code: 'D', label: 'enums.trainingQuizOption.d', value: 'D' },
  },

  ASSET_STATUS: {
    AVAILABLE: {
      code: 'AVAILABLE',
      label: 'enums.assetStatus.available',
      value: 'AVAILABLE',
      color: '#52c41a',
    },
    ASSIGNED: {
      code: 'ASSIGNED',
      label: 'enums.assetStatus.assigned',
      value: 'ASSIGNED',
      color: '#1890ff',
    },
    MAINTENANCE: {
      code: 'MAINTENANCE',
      label: 'enums.assetStatus.maintenance',
      value: 'MAINTENANCE',
      color: '#faad14',
    },
    RETIRED: {
      code: 'RETIRED',
      label: 'enums.assetStatus.retired',
      value: 'RETIRED',
      color: '#f5222d',
    },
    LOST: {
      code: 'LOST',
      label: 'enums.assetStatus.lost',
      value: 'LOST',
      color: '#ff4d4f',
    },
    DISPOSED: {
      code: 'DISPOSED',
      label: 'enums.assetStatus.disposed',
      value: 'DISPOSED',
      color: '#8c8c8c',
    },
  },

  ASSET_TICKET_TYPE: {
    ISSUE: { code: 'ISSUE', label: 'enums.assetTicketType.issue', value: 'ISSUE' },
    RETURN: { code: 'RETURN', label: 'enums.assetTicketType.return', value: 'RETURN' },
    REPAIR: { code: 'REPAIR', label: 'enums.assetTicketType.repair', value: 'REPAIR' },
    TRANSFER: { code: 'TRANSFER', label: 'enums.assetTicketType.transfer', value: 'TRANSFER' },
  },

  ASSET_TICKET_STATUS: {
    DRAFT: {
      code: 'DRAFT',
      label: 'enums.assetTicketStatus.draft',
      value: 'DRAFT',
      color: '#faad14',
    },
    DONE: {
      code: 'DONE',
      label: 'enums.assetTicketStatus.done',
      value: 'DONE',
      color: '#52c41a',
    },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.assetTicketStatus.cancelled',
      value: 'CANCELLED',
      color: '#f5222d',
    },
    NEW: {
      code: 'DRAFT',
      label: 'enums.assetTicketStatus.draft',
      value: 'DRAFT',
      color: '#faad14',
    },
    COMPLETED: {
      code: 'DONE',
      label: 'enums.assetTicketStatus.done',
      value: 'DONE',
      color: '#52c41a',
    },
  },

  WORKFLOW_ENTITY_TYPE: {
    LEAVE: { code: 'LEAVE', label: 'enums.workflowEntityType.leave', value: 'LEAVE' },
    OT: { code: 'OT', label: 'enums.workflowEntityType.ot', value: 'OT' },
    TRANSFER: {
      code: 'TRANSFER',
      label: 'enums.workflowEntityType.transfer',
      value: 'TRANSFER',
    },
    DISCIPLINE: {
      code: 'DISCIPLINE',
      label: 'enums.workflowEntityType.discipline',
      value: 'DISCIPLINE',
    },
    RECRUITMENT_REQUEST: {
      code: 'RECRUITMENT_REQUEST',
      label: 'enums.workflowEntityType.recruitmentRequest',
      value: 'RECRUITMENT_REQUEST',
    },
    COMPLAINT: {
      code: 'COMPLAINT',
      label: 'enums.workflowEntityType.complaint',
      value: 'COMPLAINT',
    },
  },

  WORKFLOW_APPROVER_RESOLVER: {
    MANAGER: {
      code: 'MANAGER',
      label: 'enums.workflowApproverResolver.manager',
      value: 'MANAGER',
    },
    HR: { code: 'HR', label: 'enums.workflowApproverResolver.hr', value: 'HR' },
    ROLE: { code: 'ROLE', label: 'enums.workflowApproverResolver.role', value: 'ROLE' },
  },

  WORKFLOW_INSTANCE_STATUS: {
    RUNNING: {
      code: 'RUNNING',
      label: 'enums.workflowInstanceStatus.running',
      value: 'RUNNING',
    },
    APPROVED: {
      code: 'APPROVED',
      label: 'enums.workflowInstanceStatus.approved',
      value: 'APPROVED',
    },
    REJECTED: {
      code: 'REJECTED',
      label: 'enums.workflowInstanceStatus.rejected',
      value: 'REJECTED',
    },
    CANCELLED: {
      code: 'CANCELLED',
      label: 'enums.workflowInstanceStatus.cancelled',
      value: 'CANCELLED',
    },
  },
};
