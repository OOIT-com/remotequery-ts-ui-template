export function isError(arg: any): arg is Error {
  return arg && arg.message;
}
