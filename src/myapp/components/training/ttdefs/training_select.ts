import { TtDef } from '../../../../ui-factory';

export const Training_select: TtDef = {
  name: 'Training_select',
  uiType: 'list-page',
  attributes: [
    {
      name: 'startTime'
    },
    {
      name: 'duration'
    },
    {
      name: 'level'
    },
    {
      name: 'name'
    },
    {
      name: 'trainingTid'
    }
  ],
  actions: [
    {
      name: 'Refresh',
      forward: 'refresh',
      source: 'toolbar',
      serviceId: 'Training.select'
    },
    {
      name: 'Exit',
      forward: 'exit',
      source: 'toolbar'
    },
    {
      name: 'New',
      forward: 'Training_insert',
      source: 'toolbar'
    },
    {
      name: 'Update',
      forward: 'Training_update',
      source: 'rowSelect'
    }
  ]
};

export const Training_update: TtDef = {
  name: 'Training_update',
  uiType: 'detail-page',
  attributes: [
    {
      name: 'startTime'
    },
    {
      name: 'duration'
    },
    {
      name: 'level'
    },
    {
      name: 'name'
    },
    {
      name: 'trainingTid',
      editable: false
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
      serviceId: 'Training.update'
    },
    {
      name: 'Delete',
      forward: 'close',
      serviceId: 'Training.delete',
      confirmation: 'Do you really want to delete the this training record :name / :officeId ?'
    }
  ]
};
export const Training_insert: TtDef = {
  name: 'Training_insert',
  uiType: 'detail-page',
  attributes: [
    {
      name: 'startTime'
    },
    {
      name: 'duration'
    },
    {
      name: 'level'
    },
    {
      name: 'name'
    }
  ],
  actions: [
    {
      name: 'Insert',
      forward: 'close',
      serviceId: 'Training.insert'
    },
    {
      name: 'Close',
      forward: 'close',
      source: 'toolbar'
    }
  ]
};
export default [Training_select, Training_update, Training_insert];
