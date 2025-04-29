const intersection = (array1: string[], array2: string[]) => array1.filter((value) => array2.includes(value));

export function checkRoles(requestedRoles: string[] | undefined, providedRoles: string[]) {
  return !requestedRoles || requestedRoles.length === 0 || intersection(requestedRoles || [], providedRoles).length > 0;
}
