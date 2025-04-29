import * as React from 'react';
import { useState } from 'react';

const selection = ['bread', 'butter', 'milk'];

export default function TestApp() {
  const name = 'name0';
  const [value, setValue] = useState(selection[0]);

  return (
    <div>
      <h1>Radios</h1>
      {selection.map((s) => {
        return (
          <div key={s}>
            <input
              id={s}
              type={'radio'}
              name={name}
              checked={s === value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.checked) {
                  setValue(s);
                }
              }}
            />
            <label htmlFor={s}>{s}</label>
          </div>
        );
      })}
    </div>
  );
}
