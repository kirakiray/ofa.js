export const aliasMap = {};

export default async function config(opts) {
  const { alias } = opts;

  if (alias) {
    Object.entries(alias).forEach(([name, path]) => {
      if (/^@.+/.test(name)) {
        if (!aliasMap[name]) {
          if (/^\//.test(path)) {
            aliasMap[name] = path;
          } else {
            throw `The address does not match the specification, please use '/' or or the beginning of the protocol: '${path}'`;
          }
        } else {
          throw `Alias already exists: '${name}'`;
        }
      }
    });
  }

  return true;
}
