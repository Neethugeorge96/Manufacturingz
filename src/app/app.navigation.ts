export const NavigationItems = [
  {
    title: 'Home',
    tags: 'application home dashboard',
    icon: 'fal fa-home',
    items: [
      {
        title: 'Dashboard',
        tags: 'home dashboard',
        routerLink: '/home/dashboard'
      },
      {
        title: 'Inbox',
        tags: 'home inbox',
        routerLink: '/home/inbox'
      }
    ]
  },
  {
    title: 'General Settings',
    tags: 'settings',
    icon: 'fal fa-cog',
    items: [
      {
        title: 'CPC',
        tags: 'settings-cost-price',
        routerLink: '/settings/cost-price'
      },
      {
        title: 'Manpower Category',
        tags: 'settings-man-power',
        routerLink: '/settings/category'
      },
      {
        title: 'Manpower',
        tags: 'settings-man-power',
        routerLink: '/settings/man-power'
      },
      {
        title: 'Plant',
        tags: 'settings-plant',
        routerLink: '/settings/plant'
      },
      {
        title: 'Production Line',
        tags: 'settings-production-line',
        routerLink: '/settings/production-line'
      },
      {
        title: 'Workcenter',
        tags: 'settings-work-centers',
        routerLink: '/settings/work-centers'
      },
      {
        title: 'Production Shift',
        tags: 'settings-production-shift',
        routerLink: '/settings/production-shift'
      },
      {
        title: 'Batch Size',
        tags: 'settings-batch-control',
        routerLink: '/settings/batch-control'
      },
      {
        title: 'Quality Control',
        tags: 'settings-quality-control',
        routerLink: '/settings/quality-control'
      }
      // {
      //   title: 'Man Power Master',
      //   tags: 'settings-man-power',
      //   items: [
      //     {
      //       title: 'Man Power Category',
      //       tags: 'settings-man-power-category',
      //       routerLink: 'settings/man-power/category'
      //     }
      //   ]
      // },
    ]
  },
  {
    title: 'Mapping',
    tags: 'mapping',
    icon: 'fal fa-arrows-alt-h',
    items: [
      {
        title: 'Manpower to Workcenter',
        tags: 'settings-plant',
        routerLink: '/mapping/manpower-workcenter-mapping'
      },
      {
        title: 'Machine to Workcenter',
        tags: 'settings-man-power',
        routerLink: '/settings/machine-workcenter'
      },
      {
        title: 'Cost Absorption to Workcenter',
        tags: 'mapping-cost-absorption',
        routerLink: '/mapping/cost-absorption-workcenter-mapping'
      },
      {
        title: 'Manpower to Shift',
        tags: 'mapping-manpower-shift',
        routerLink: '/mapping/manpower-shift-mapping'
      },
      {
        title: 'Production Routing',
        tags: 'routing-production',
        routerLink: '/routing/production'
      },
    ]
  },
  {
    title: 'Generic Routing',
    tags: 'routing',
    icon: 'fal fa-code-merge',
    routerLink: '/routing/generic'
  },
  {
    title: 'Bill Of Material',
    tags: 'bom',
    icon: 'fal fa-file-alt',
    routerLink: '/bom/maintain-bom-list'
  },
  {
    title: 'Production Order',
    tags: 'Production Order',
    icon: 'fal fa-list-alt',
    routerLink: '/productionOrder/production-order-list'
  },
  {
    title: 'EOC',
    tags: 'eoc',
    icon: 'fal fa-money-bill',
    routerLink: '/eoc/eoc-list',
  },
  {
    title: 'Material Issue',
    tags: 'materialissue',
    icon: 'fal fa-money-bill',
    routerLink: '/materialissue/material-issue-container',
  },
   {
    title: 'Release To Production',
    tags: 'release to production',
    icon: 'fal fa-money-bill',
    routerLink: '/release-to-production/release-production-list',
  }
];
