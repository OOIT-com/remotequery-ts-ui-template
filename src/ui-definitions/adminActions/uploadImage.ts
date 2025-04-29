import { TtDef } from '../../ui-factory';

export const uploadImage: TtDef = {
  name: 'uploadImage',
  label: 'Upload Image',
  description: 'Upload an image file.',

  uiType: 'detail-page',
  attributes: [
    {
      label: 'Select File',
      name: 'fileTid',
      uiType: 'FileuploadUi',
      uiTypeOptions: {
        accept: 'image/*',
        fileTypes: ['jpg', 'png', 'gif', 'jpeg'],
        uploadButtonLabel: 'Upload Image File'
      }
    }
  ],
  actions: [
    {
      name: 'process',
      label: 'Process Image File...',
      serviceId: 'UploadImage',
      forward: 'result'
    },
    {
      name: 'done',
      forward: 'exit',
      source: 'toolbar'
    }
  ]
};
