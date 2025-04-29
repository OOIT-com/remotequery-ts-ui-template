import React, { useState } from 'react';
import {
  dispatchException,
  infoMessage,
  isError,
  StatusMessageElement,
  successMessage,
  WidgetProps
} from '../ui-factory';
import { Box, LinearProgress } from '@mui/material';
import { uploadFile } from '../app-support/api-helper';
import { FileUploader } from 'react-drag-drop-files';
import { SRecord, toList } from 'remotequery-ts-common';

export function FileuploadUi({ def, action = () => {} }: WidgetProps) {
  const [loading, setLoading] = useState('');
  const [uploadedFile, setUploadedFile] = useState<SRecord>();
  const fileTypes = def?.uiTypeOptions?.fileTypes;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '0fr 1fr', gap: '1em', alignItems: 'center' }}>
      <FileUploader handleChange={doUpload} name="file" hoverTitle={'Drop file here!'} types={fileTypes}>
        <Box
          sx={{
            whiteSpace: 'nowrap',
            border: 'dashed 1px green',
            padding: '1em',
            margin: '0.1em',
            cursor: 'pointer',
            borderRadius: '4px',
            color: 'green'
          }}
        >
          DRAG AND DROP AREA
        </Box>
      </FileUploader>

      <UploadedFile file={uploadedFile} />
      <Box sx={{ width: '100%', display: loading ? 'block' : 'none' }}>
        <LinearProgress />
      </Box>
    </div>
  );

  async function doUpload(file: File) {
    setLoading('upload');
    try {
      const r = await uploadFile(file, 'ShaFile.tempUpload');
      if (r.exception) {
        dispatchException(r.exception);
      }
      const tmpFile = toList(r)[0];
      if (tmpFile) {
        setUploadedFile(tmpFile);
        action('value', { [def.name]: tmpFile.fileTid, filename: tmpFile.filename });
      }
    } catch (e) {
      if (isError(e)) {
        dispatchException(e.message);
      }
    } finally {
      setLoading('');
    }
  }
}

function UploadedFile({ file }: any) {
  if (file !== undefined) {
    return (
      <StatusMessageElement
        statusMessage={successMessage(`File ${file.filename} is uploaded and ready (${file.fileTid})`)}
      />
    );
  } else {
    return <StatusMessageElement statusMessage={infoMessage(`No file uploaded yet.`)} />;
  }
}
