export function res200<T>(data: T): [number, T] {
  return [200, data];
}

export function res400<T>(data: T): [number, T] {
  return [400, data];
}

export function res401<T>(data: T): [number, T] {
  return [401, data];
}

export function res403<T>(data: T): [number, T] {
  return [403, data];
}
