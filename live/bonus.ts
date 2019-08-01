type InferTest<T> =
  T extends (infer U)[] ? U :
  T extends (...args: any[]) => infer U ? U :
  T extends Promise<infer U> ? U :
  T;

type T0 = InferTest<boolean>;
type T1 = InferTest<string[]>;
type T2 = InferTest<(a: string) => number>;
type T3 = InferTest<Promise<number>>;
type T4 = InferTest<Promise<string>[]>;
type T5 = InferTest<InferTest<Promise<boolean>[]>>;

// These?

type MoreInferTest<T> = T extends { a: infer U; b: infer U } ? U : never;

type T6 = MoreInferTest<{ a: string; b: string }>;
type T7 = MoreInferTest<{ a: string; b: number }>; 