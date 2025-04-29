import React, { useEffect, useMemo, useState } from 'react';
import { FormControl, InputLabel, LinearProgress, MenuItem, Select } from '@mui/material';
import { SelectValue, WidgetProps } from '../../types';
import { processAction, resolveBoolean, ttLabel } from '../../tabletool-utils';
import { useCodeTable, useLabels } from '../../redux';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { SRecord, toList } from 'remotequery-ts-common';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';

let counter = 1;

export function SelectUi({
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
  const [currentValue, setCurrentValue] = useState(def.defaultValue ?? '');

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

  const id = useMemo(() => '' + counter++, []);
  //
  const editable = resolveBoolean(def, 'editable', cx, true);

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

  useEffect(() => {
    if (!value && 'selectFirst' === def.defaultValue && preparedValues.length > 0) {
      setCurrentValue(preparedValues[0].value);
    }
    setCurrentValue((value || def.defaultValue) ?? '');
  }, [def, value, preparedValues]);

  const currentValue0 =
    preparedValues.findIndex(({ value }) => value === currentValue.toString()) === -1 ? '' : currentValue;
  const label0 = useMemo(() => (def.noLabel ? '' : `${ttLabel(def)}${def.mandatory ? '*' : ''}`), [def]);
  return (
    <FormControl fullWidth={true} sx={sx} size="small">
      {loading && <LinearProgress />}
      <InputLabel id={id} sx={{ display: def.noLabel ? 'none' : undefined }}>
        {label0}
      </InputLabel>
      <Select<string>
        labelId={id}
        label={label0}
        value={currentValue0}
        onChange={(e: SelectChangeEvent<string>) => {
          if (action) {
            const value = e.target.value;
            action('value', { [def.name]: value });
          }
        }}
        disabled={!editable}
      >
        {preparedValues.map(({ value, label }) => {
          return (
            <MenuItem key={'k' + value + label} value={value}>
              {label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
