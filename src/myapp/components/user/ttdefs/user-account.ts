import { TtDef } from '../../../../ui-factory';

export const UserAccount_select: TtDef = {
  name: 'UserAccount_select',
  uiType: 'list-page',
  attributes: [
    {
      name: 'userTid'
    },
    {
      name: 'userId'
    },
    {
      name: 'mobileNumber'
    }
  ],
  actions: [
    {
      name: 'Refresh',
      forward: 'refresh',
      source: 'toolbar',
      serviceId: 'UserAccount.select'
    },
    {
      name: 'Exit',
      forward: 'exit',
      source: 'toolbar'
    },
    {
      name: 'New',
      forward: 'UserAccount_insert',
      source: 'toolbar'
    },
    {
      name: 'Update',
      forward: 'UserAccount_update',
      source: 'rowSelect'
    }
  ]
};

export const UserAccount_update: TtDef = {
  name: 'UserAccount_update',
  uiType: 'detail-page',
  attributes: [
    {
      name: 'userTid',
      editable: false
    },
    {
      name: 'userId',
      editable: false
    },
    {
      name: 'mobileNumber'
    }
  ],
  actions: [
    {
      name: 'Close',
      forward: 'close',
      source: 'toolbar'
    },
    {
      name: 'Update',
      forward: 'close',
      serviceId: 'UserAccount.update'
    },
    {
      name: 'Delete',
      forward: 'close',
      serviceId: 'UserAccount.delete',
      confirmation: 'Do you really want to delete the this training record :name / :officeId ?'
    }
  ]
};
export const UserAccount_insert: TtDef = {
  name: 'UserAccount_insert',
  uiType: 'detail-page',
  attributes: [
    {
      name: 'userId'
    },
    {
      name: 'mobileNumber'
    }
  ],
  actions: [
    {
      name: 'Insert',
      forward: 'close',
      serviceId: 'UserAccount.insert'
    },
    {
      name: 'Close',
      forward: 'close',
      source: 'toolbar'
    }
  ]
};
