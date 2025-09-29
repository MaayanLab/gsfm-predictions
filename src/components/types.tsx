export type UnPromise<PT> = PT extends Promise<infer T> ? T : never
