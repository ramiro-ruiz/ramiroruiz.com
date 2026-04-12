const effects = new Map();

export function registerEffect(effect) {
  if (!effect.id || !effect.name || !effect.schema || !effect.fragmentShader) {
    throw new Error(`Invalid effect: missing required fields. Got: ${Object.keys(effect).join(', ')}`);
  }
  effects.set(effect.id, effect);
}

export function getEffect(id) {
  return effects.get(id);
}

export function listEffects() {
  return Array.from(effects.values());
}

export function getDefaultProps(schema) {
  const props = {};
  for (const [key, def] of Object.entries(schema)) {
    props[key] = def.default;
  }
  return props;
}

export function groupSchema(schema) {
  const groups = new Map();
  for (const [key, def] of Object.entries(schema)) {
    const group = def.group || 'General';
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push([key, def]);
  }
  return groups;
}
