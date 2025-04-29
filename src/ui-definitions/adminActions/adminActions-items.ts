import { TtMenuSection } from '../../app-support/types';

export const adminActionMenuItems: TtMenuSection[] = [
  {
    name: 'Uploads',
    colIndex: 0,
    roles: ['FIM_ADMIN'],
    menuEntries: [
      {
        name: 'uploadFile'
      },
      {
        name: 'uploadImage'
      }
    ]
  },
  {
    name: 'Misc',
    colIndex: 1,
    roles: ['FIM_ADMIN'],
    menuEntries: [
      {
        name: 'reinit'
      },
      {
        name: 'sqRunner'
      },
      {
        name: 'memoryLogger'
      }
    ]
  }
];
