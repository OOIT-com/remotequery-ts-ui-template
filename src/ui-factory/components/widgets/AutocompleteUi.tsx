import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { Autocomplete, LinearProgress, Stack, TextField } from '@mui/material';
import { SelectValue, WidgetProps } from '../../types';
import { processAction, ttLabel } from '../../tabletool-utils';
import { useCodeTable, useLabels } from '../../redux';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { SRecord, toList } from 'remotequery-ts-common';

export function AutocompleteUi({
  def,
  value,
  action,
  cx = {},
  sx
}: Readonly<WidgetProps & { sx?: SxProps<Theme>; size?: 'small' | 'medium' }>) {
  const { label } = useLabels();
  const [values, setValues] = useState<SelectValue[]>([]);
  const [dependentValue, setDependentValue] = useState<string>();
  const [loading, setLoading] = useState(false);

  const uiTypeOptions = def.uiTypeOptions;
  const codeTable = useCodeTable(uiTypeOptions?.codeTable ?? '');

  useEffect(() => {
    if (def.uiTypeOptions?.selectList && Array.isArray(def.uiTypeOptions?.selectList)) {
      setValues(def.uiTypeOptions?.selectList);
    }
  }, [def]);

  useEffect(() => {
    if (codeTable?.length) {
      setValues(codeTable);
    }
  }, [def, codeTable]);

  useEffect(() => {
    const _run = async (serviceId: string, parameters: SRecord) => {
      try {
        setLoading(true);
        const result = await processAction({ name: def.name, serviceId, parameters }, {});
        setValues(toList(result));
      } finally {
        setLoading(false);
      }
    };
    // eslint-disable-next-line prefer-const
    let { serviceId, parameters = {}, dependentParameter: dependentParameterName } = uiTypeOptions || {};
    if (serviceId) {
      if (dependentParameterName) {
        const dpName = dependentParameterName;
        const dpValue = dependentValue ?? '';
        parameters = { ...parameters, [dpName]: dpValue };
      }
      _run(serviceId, parameters).catch(console.error);
    }
  }, [def, dependentValue, uiTypeOptions]);

  useEffect(() => {
    const { serviceId, dependentParameter } = uiTypeOptions || {};
    if (dependentParameter && serviceId) {
      setDependentValue(cx[dependentParameter]);
    }
  }, [def, cx, uiTypeOptions]);

  const preparedValues: {
    value: string;
    label: string;
  }[] = useMemo(
    () =>
      values.map((e) => ({
        value: (e.code ?? e.value ?? e.name ?? '').toString(),
        label: label(e)
      })),
    [label, values]
  );

  return (
    <Stack sx={{ width: '100%', ...sx }}>
      {loading && <LinearProgress />}
      <Autocomplete
        disablePortal
        id="tt-autocomplete"
        options={preparedValues}
        onChange={(_: SyntheticEvent, newValue: SelectValue | null) => {
          if (newValue && newValue.value && action) {
            const sr = { [def.name]: newValue.value };
            action('value', sr);
          }
        }}
        value={preparedValues.find((v) => v.value === value)}
        fullWidth
        renderInput={(params) => <TextField {...params} label={ttLabel(def)} />}
      />
    </Stack>
  );
}
