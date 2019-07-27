type Unpacked<T> =
  T extends (infer U)[] ? U :
  T extends (...args: any[]) => infer U ? U :
  T extends Promise<infer U> ? U :
  T;

type T0 = Unpacked<boolean>;  
type T1 = Unpacked<string[]>; 
type T2 = Unpacked<() => number>;
type T3 = Unpacked<Promise<number>>;  
type T4 = Unpacked<Promise<string>[]>; 
type T5 = Unpacked<Unpacked<Promise<boolean>[]>>;

// These?

type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;
type T16 = Foo<{ a: string; b: string }>; 
type T17 = Foo<{ a: string; b: number }>; 
