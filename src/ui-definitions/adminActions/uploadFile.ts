import { PageUiTypes, TtDef } from '../../ui-factory';

export const uploadFile: TtDef = {
  name: 'uploadFile',
  label: 'Data upload (xlsx)',
  uiType: 'detail-page',
  attributes: [
    {
      label: 'Select File',
      name: 'fileTid',
      uiType: 'FileuploadUi',
      uiTypeOptions: {
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        fileTypes: ['xlsx'],
        uploadButtonLabel: 'Upload XLSX File'
      }
    },
    {
      label: 'Reduce Log Info',
      name: 'reduceProcessInfo',
      uiType: 'select',
      uiTypeOptions: {
        selectList: [
          {
            value: '',
            label: '...'
          },
          {
            value: 'true',
            label: 'yes'
          },
          {
            value: 'false',
            label: 'no'
          }
        ]
      }
    },
    {
      label: 'Use Batch',
      name: '$USEBATCH',
      uiType: 'select',
      defaultValue: 'true',

      uiTypeOptions: {
        selectList: [
          {
            value: '',
            label: '...'
          },
          {
            value: 'true',
            label: 'yes'
          },
          {
            value: 'false',
            label: 'no'
          }
        ]
      }
    },

    {
      label: 'Use Tab as Prefix',
      name: '$USE_SHEETNAME_FOR_PREFIX',
      uiType: 'select',
      defaultValue: 'false',
      uiTypeOptions: {
        selectList: [
          {
            value: '',
            label: '...'
          },
          {
            value: 'true',
            label: 'yes'
          },
          {
            value: 'false',
            label: 'no'
          }
        ]
      }
    }
  ],
  actions: [
    {
      name: 'process',
      label: 'Process XLSX File...',
      serviceId: 'SqLoad2',
      parameters: {
        $USE_STYLES: 'false',
        filetypeTid: '1'
      },
      forward: 'spreadSheetUploadResult'
    },
    {
      name: 'done',
      forward: 'exit',
      source: 'toolbar'
    }
  ]
};

export const spreadSheetUploadResult: TtDef<'', PageUiTypes | 'SpreadSheetUploadResult'> = {
  actions: [],
  attributes: [],
  name: 'spreadSheetUploadResult',
  label: 'Result of Spreadsheet Upload',
  uiType: 'SpreadSheetUploadResult'
};
