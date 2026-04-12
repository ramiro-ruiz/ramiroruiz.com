import { groupSchema, getDefaultProps } from './effects/registry.js';

/**
 * Auto-generate sidebar controls from a template schema.
 * Returns the current props object. Calls onChange(props) on every input change.
 */
export function renderControls(container, schema, initialProps, onChange) {
  container.innerHTML = '';
  const props = { ...initialProps };
  const groups = groupSchema(schema);
  const defaults = getDefaultProps(schema);

  for (const [groupName, entries] of groups) {
    const groupEl = document.createElement('div');
    groupEl.className = 'control-group';

    // Group header with reset button
    const header = document.createElement('div');
    header.className = 'control-group-header';
    header.innerHTML = `
      <span class="control-group-title">${groupName}</span>
      <button class="control-group-reset">Reset</button>
    `;
    header.querySelector('.control-group-reset').addEventListener('click', () => {
      for (const [key] of entries) {
        props[key] = defaults[key];
      }
      renderControls(container, schema, props, onChange);
      onChange(props);
    });
    groupEl.appendChild(header);

    for (const [key, def] of entries) {
      const item = document.createElement('div');
      item.className = 'control-item';

      const label = document.createElement('label');
      label.className = 'control-label';

      const valueDisplay = document.createElement('span');
      valueDisplay.className = 'control-value';

      let input;

      switch (def.type) {
        case 'color':
          input = document.createElement('input');
          input.type = 'color';
          input.value = props[key];
          valueDisplay.textContent = props[key];
          input.addEventListener('input', () => {
            props[key] = input.value;
            valueDisplay.textContent = input.value;
            onChange(props);
          });
          break;

        case 'range':
          input = document.createElement('input');
          input.type = 'range';
          input.min = def.min;
          input.max = def.max;
          input.step = def.step || 1;
          input.value = props[key];
          valueDisplay.textContent = props[key];
          input.addEventListener('input', () => {
            props[key] = parseFloat(input.value);
            valueDisplay.textContent = input.value;
            onChange(props);
          });
          break;

        case 'select':
          input = document.createElement('select');
          for (const opt of def.options) {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            if (opt === props[key]) option.selected = true;
            input.appendChild(option);
          }
          input.addEventListener('change', () => {
            props[key] = input.value;
            onChange(props);
          });
          break;

        case 'text':
          input = document.createElement('input');
          input.type = 'text';
          input.value = props[key];
          input.addEventListener('input', () => {
            props[key] = input.value;
            onChange(props);
          });
          break;

        case 'textarea':
          input = document.createElement('textarea');
          input.rows = 4;
          input.value = props[key];
          input.addEventListener('input', () => {
            props[key] = input.value;
            onChange(props);
          });
          break;

        default:
          continue;
      }

      label.innerHTML = `<span>${def.label}</span>`;
      if (def.type === 'color' || def.type === 'range') {
        label.appendChild(valueDisplay);
      }

      item.appendChild(label);
      item.appendChild(input);
      groupEl.appendChild(item);
    }

    container.appendChild(groupEl);
  }

  return props;
}
