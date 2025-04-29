import { TtDef } from '../../ui-factory';

export const reinit: TtDef = {
  name: 'reinit',
  label: 'Re-init',
  description:
    "The Service Query 'Reinit' allows to reset the following parts: " +
    'reload of preview substitution files, recreation of missing PDF preview icons, ' +
    'forced recreation of preview icons, ' +
    'add a task with the execution of all files in WEB-INF/sql.',
  uiType: 'detail-page',
  attributes: [],
  actions: [
    {
      name: 'LoadSqSqlFiles',
      label: 'Reload all Services',
      description: 'Reload all deployed sq.sql and sql files (part of the deployment package)',
      serviceId: 'LoadSqSqlFiles',
      forward: 'processingResult'
    },
    {
      name: 'done',
      forward: 'exit',
      source: 'toolbar'
    }
  ]
};
