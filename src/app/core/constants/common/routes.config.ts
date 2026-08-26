export interface RouteConfig {
  key: string;
  label: string;
  path: string;
  icon?: string;
  isShow?: boolean;
  permission?: string;
  children?: Record<string, RouteConfig>;
}

export interface SidebarMenuItem {
  key: string;
  label: string;
  path: string;
  icon?: string;
  isShow?: boolean;
  permission?: string;
  children?: SidebarMenuItem[];
}

export const ROUTES_CONFIG = {
  DASHBOARD: {
    key: 'DASHBOARD',
    label: 'Dashboard Tổng quan',
    path: '/dashboard',
    icon: 'dashboard',
  },

  TOPOLOGY: {
    key: 'TOPOLOGY',
    label: 'Sơ đồ Microservices',
    path: '/topology',
    icon: 'share-alt',
  },

  ROUTES: {
    key: 'ROUTES',
    label: 'Bảng Định Tuyến (YARP)',
    path: '/routes',
    icon: 'branches',
  },

  TRAFFIC_LOGS: {
    key: 'TRAFFIC_LOGS',
    label: 'Nhật Ký Lưu Lượng Live',
    path: '/traffic-logs',
    icon: 'file-search',
  },

  SECURITY: {
    key: 'SECURITY',
    label: 'Bảo Mật & Rate Limit',
    path: '/security',
    icon: 'safety-certificate',
  },

  API_EXPLORER: {
    key: 'API_EXPLORER',
    label: 'Unified API Explorer',
    path: '/api-explorer',
    icon: 'code',
  },
} as const satisfies Record<string, RouteConfig>;

export function getRouteByPath(path: string): RouteConfig | undefined {
  const routes = ROUTES_CONFIG as unknown as Record<string, RouteConfig>;
  let bestMatch: RouteConfig | undefined = undefined;

  const traverse = (routeList: Record<string, RouteConfig>) => {
    for (const key of Object.keys(routeList)) {
      const r = routeList[key];
      if (r.path === path) {
        bestMatch = r;
        return;
      }
      if (r.children) {
        traverse(r.children);
      }
    }
  };

  traverse(routes);
  return bestMatch;
}

export function convertRoutesToMenuItems(
  config: Record<string, RouteConfig>,
): SidebarMenuItem[] {
  const items: SidebarMenuItem[] = [];

  for (const key of Object.keys(config)) {
    const route = config[key];
    if (route.isShow === false) continue;

    const item: SidebarMenuItem = {
      key: route.key,
      label: route.label,
      path: route.path,
      icon: route.icon,
      permission: route.permission,
    };

    if (route.children) {
      item.children = convertRoutesToMenuItems(route.children);
    }

    items.push(item);
  }

  return items;
}

export function filterMenuByPermission(
  items: SidebarMenuItem[],
  hasPermission: (permission?: string) => boolean,
): SidebarMenuItem[] {
  return items
    .filter((item) => hasPermission(item.permission))
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: filterMenuByPermission(item.children, hasPermission),
        };
      }
      return item;
    });
}

export function getFirstNavigableRoute(route: RouteConfig): RouteConfig | undefined {
  if (!route.children) return route;
  const children = Object.values(route.children);
  if (children.length === 0) return route;
  return children[0];
}
