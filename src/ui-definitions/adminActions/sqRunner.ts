import { ActionDef, processService, resolveParameters, TtDef } from '../../ui-factory';
import util from 'tweetnacl-util';

export function utf8_to_base64(utf8: string): string {
  return util.encodeBase64(util.decodeUTF8(utf8));
}

export const sqRunner: TtDef = {
  name: 'sqRunner',
  label: 'Manage & Run Service Queries',
  description: 'View and run service queries',
  accessRoles: ['FIM_ADMIN_MGMT', 'FIM_ADMIN'],
  uiType: 'list-page',
  attributes: [
    {
      name: 'key',
      label: 'Service Id (key)',
      filter: 'startWith',
      isKey: true
    },
    {
      name: 'query',
      label: 'Query String (sql)',
      filter: 'startWith',
      width: 500
    },
    {
      name: 'accessGroups',
      label: 'Access Groups',
      filter: 'startWith',
      width: 200
    },
    {
      name: 'tags',
      label: 'Tags',
      filter: 'startWith',
      width: 200
    },
    {
      name: 'cacheMinutes',
      label: 'Cache Minutes',
      filter: 'startWith',
      width: 60
    }
  ],
  actions: [
    {
      name: 'refresh',
      serviceId: 'SQ.select',
      forward: 'refresh',
      source: 'toolbar'
    },
    {
      name: 'new',
      forward: 'sqRunnerInsert',
      source: 'toolbar'
    },
    {
      name: 'exit',
      forward: 'exit',
      source: 'toolbar'
    },
    {
      name: 'Update',
      forward: 'sqRunnerUpdate',
      source: 'rowSelect',
      service: sqGet
    },
    {
      name: 'Run With Parameters',
      source: 'rowSelect',
      forward: 'sqRunWithParameters',
      service: sqGet
    },
    {
      name: 'quick-run2',
      label: 'run!',
      forward: 'processingResult',
      service: sqRun,
      source: 'rowRight'
    }
  ]
};

export const sqRunnerInsert: TtDef = {
  name: 'sqRunnerInsert',
  label: 'Insert Service Queries',
  description: 'View and run service queries',
  accessRoles: ['FIM_ADMIN_MGMT', 'FIM_ADMIN'],
  uiType: 'detail-page',
  attributes: [
    {
      name: 'key',
      label: 'Service Id (key)',
      editable: true,
      width: 600
    },
    {
      name: 'query',
      label: 'Query String (sql)',
      editable: true,
      uiType: 'textarea',
      maxRows: 26
    },
    {
      name: 'tags',
      label: 'Tags',
      editable: true,
      width: 600
    },
    {
      name: 'accessGroups',
      label: 'Access Groups',
      editable: true,
      width: 600
    },
    {
      name: 'cacheMinutes',
      label: 'Cache Minutes',
      editable: true,
      width: 300
    }
  ],
  actions: [
    {
      name: 'save',
      forward: 'sqRunner',
      service: sqInsert
    },
    {
      name: 'close',
      forward: 'close',
      source: 'toolbar'
    }
  ]
};

export const sqRunnerUpdate: TtDef = {
  name: 'sqRunnerUpdate',
  label: 'Update Service Queries',
  description: 'View and run service queries',
  accessRoles: ['FIM_ADMIN_MGMT', 'FIM_ADMIN'],
  uiType: 'detail-page',
  attributes: [
    {
      name: 'key',
      label: 'Service Id (key)',
      editable: false,
      width: 200
    },
    {
      name: 'query',
      label: 'Query String (sql)',
      editable: true,
      maxRows: 26,
      // just a reminder formatter: base64_to_utf8,
      uiType: 'textarea'
    },
    {
      name: 'tags',
      label: 'Tags',
      editable: true,
      width: 600
    },
    {
      name: 'accessGroups',
      label: 'Access Groups',
      editable: true,
      width: 300
    },
    {
      name: 'cacheMinutes',
      label: 'Cache Minutes',
      editable: true,
      width: 300
    }
  ],
  actions: [
    {
      name: 'save',
      forward: 'sqRunner',
      service: sqUpdate
    },
    {
      name: 'delete',
      forward: 'close',
      serviceId: 'SQ.delete',
      confirmation: 'Are you sure you want to delete this item?',
      service: async (actionDef: ActionDef) => {
        const { key } = resolveParameters(actionDef.parameters);
        const actionDef2: ActionDef = { ...actionDef, parameters: { key } };
        if (actionDef2.serviceId && typeof actionDef2.parameters === 'object') {
          return processService(actionDef2.serviceId, actionDef2.parameters);
        }
        return { exception: 'Error occurred' };
      }
    },
    {
      name: 'close',
      forward: 'close',
      source: 'toolbar'
    }
  ]
};

export const sqRunWithParameters: TtDef = {
  name: 'sqRunWithParameters',
  label: 'Exec Param',
  accessRoles: ['FIM_ADMIN_MGMT', 'FIM_ADMIN'],
  uiType: 'detail-page',
  attributes: [
    {
      name: 'key',
      label: 'Service Id (key)',
      editable: false,
      width: 200
    },
    {
      name: 'query',
      label: 'Query String (sql)',
      maxRows: 26,
      uiType: 'textarea'
    },
    {
      name: 'execParameters',
      label: 'Parameters',
      uiType: 'ExecParameter'
    }
  ],
  actions: [
    {
      name: 'save and run',
      service: async (actionDef: ActionDef) => {
        const { key, execParameters } = resolveParameters(actionDef.parameters);

        if (key) {
          await sqUpdate(actionDef);
          const serviceId = key;

          return await processService(serviceId, { execParameters });
        }
        return { exception: 'Missing service Id (key' };
      },
      forward: 'processingResult'
    },
    {
      name: 'close',
      forward: 'close',
      source: 'toolbar'
    }
  ]
};

function sqUpdate(actionDef: ActionDef) {
  const { query } = resolveParameters(actionDef.parameters);
  const queryBase64 = utf8_to_base64(query);
  const parameters = { ...actionDef.parameters, queryBase64, query: '' };
  return processService('SQ.updateBase64', parameters);
}

function sqInsert(actionDef: ActionDef) {
  const { query } = resolveParameters(actionDef.parameters);
  const queryBase64 = utf8_to_base64(query);
  const parameters = { ...actionDef.parameters, queryBase64, query: '' };
  return processService('SQ.insertBase64', parameters);
}

function sqGet(actionDef: ActionDef) {
  const p = resolveParameters(actionDef.parameters);

  return processService('SQ.get', { key: p.key || '' });
}

function sqRun(actionDef: ActionDef) {
  const { key } = resolveParameters(actionDef.parameters);
  if (key) {
    const serviceId = key as string;
    return processService(serviceId);
  } else {
    return Promise.resolve({ exception: 'No key found in parameters!' });
  }
}
