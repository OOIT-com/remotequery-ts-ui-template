import { WidgetProps } from '../../types';
import { resolveUiType } from '../../tabletool-utils';
import React from 'react';
import { InputUi } from './InputUi';

export function Widget({ def, value, action, cx }: WidgetProps) {
  const uiTypeFun = resolveUiType(def.uiType || 'InputUi');
  return typeof uiTypeFun === 'function' ? (
    <>{React.createElement(uiTypeFun, { def, value, action, cx }, null)} </>
  ) : (
    <InputUi def={def} value={value} action={action} cx={cx} />
  );
}
