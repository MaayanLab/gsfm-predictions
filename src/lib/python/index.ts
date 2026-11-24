/* eslint-disable @typescript-eslint/no-require-imports -- guarded require()s keep node builtins out of client bundles */
/** Stolen from https://raw.githubusercontent.com/MaayanLab/Playbook-Workflow-Builder/refs/heads/main/utils/python.ts
 * Run python scripts/functions from typescript
 * Usage:
 * ```ts
 * import python from '@/utils/python'
 * async function run() {
 *   try {
 *     const result = await python('@/path/from/root/myscript.py', 'myfunc', { kargs: [ 'myarg' ], kwargs: { 'myarg2': '2' } })
 *   } catch (e) {
 *     // e is a ProcessError
 *   }
 * }
 */
import type * as child_process_type from 'child_process'
import type * as path_type from 'path'
import { Readable } from 'stream'

export class ProcessError extends Error {
  constructor(public message: string, public exitcode: number | null) {
    super(message)
    this.name = 'ProcessError'
  }
}

/**
 * @param script: of the form python_file.py:func_in_file
 * @param args: The kwargs to provide to the file
 */
export default function python<T>(pathspec: string, args: { kargs?: unknown[], kwargs?: Record<string, unknown> }, callback?: (data: string) => void): Promise<T> {
  if (typeof window !== 'undefined') throw new Error("python is server side only")
  const spawn = typeof window === 'undefined' ? (require('child_process') as typeof child_process_type).spawn : undefined
  const path = typeof window === 'undefined' ? require('path') as typeof path_type : undefined
  return new Promise((resolve, reject) => {
    let stdin: string
    try {
      stdin = JSON.stringify(args)
    } catch (e) {
      return reject(new ProcessError(`Process input could not be serialized`, null))
    }
    if (typeof spawn === 'undefined') return reject(new Error("python is server side only"))
    if (typeof path === 'undefined') return reject(new Error("python is server side only"))
    const proc = spawn(process.env.PYTHON_BIN || 'python', [
      path.join(process.env.PYTHON_ROOT || '', 'src', 'lib', 'python', 'helper.py'),
      pathspec,
    ], { env: { ...process.env } })
    proc.on('error', (err) => reject(new ProcessError(`[${pathspec}]: ${err.message}`, null)))
    proc.stdin.on('error', () => {}) // EPIPE if python dies early; reported via 'close'
    let stdout = ''
    proc.stdout.on('data', (chunk: string) => { stdout += chunk })
    proc.stderr.on('data', callback !== undefined ? (chunk) => callback(chunk.toString()) : (chunk: string) => { console.warn(`[${pathspec}]: ${chunk.toString()}`) })
    proc.on('close', (code) => {
      try {
        const stdout_parsed = JSON.parse(stdout)
        if (stdout_parsed.error) return reject(new ProcessError(stdout_parsed.error, code))
        else if (code !== 0) return reject(new ProcessError(`[${pathspec}]: ${`Process exited with unexpected code ${code}`}`, code))
        else resolve(stdout_parsed.data)
      } catch (e) {
        console.debug(stdout)
        return reject(new ProcessError(`[${pathspec}]: Process output could not be parsed as json. ${e}`, code))
      }
    })
    proc.stdin.write(stdin, (e) => {
      if (e) {
        reject(new ProcessError(`[${pathspec}]: Failed to write stdin ${e}`, 1))
      }
      proc.stdin.end()
    })
  })
}


/**
 * @param script: of the form python_file.py:func_in_file
 * @param args: The kwargs to provide to the file
 */
export function pythonStream(pathspec: string, args: { kargs?: unknown[], kwargs?: Record<string, unknown> }, signal?: AbortSignal) {
  if (typeof window !== 'undefined') throw new Error("python is server side only")
  const spawn = typeof window === 'undefined' ? (require('child_process') as typeof child_process_type).spawn : undefined
  const path = typeof window === 'undefined' ? require('path') as typeof path_type : undefined
  let stdin: string
  try {
    stdin = JSON.stringify(args)
  } catch (e) {
    throw new ProcessError(`Process input could not be serialized`, null)
  }
  if (typeof spawn === 'undefined') throw new Error("python is server side only")
  if (typeof path === 'undefined') throw new Error("python is server side only")
  const proc = spawn(process.env.PYTHON_BIN || 'python3', [
    '-u',
    path.join(process.env.PYTHON_ROOT || '', 'src', 'lib', 'python', 'helper.py'),
    pathspec,
  ], { env: { ...process.env, PYTHONUNBUFFERED: '1' }, signal })
  let stderr = ''
  proc.stderr.on('data', (chunk: string) => { stderr += chunk })
  // Failures must not be thrown from these listeners (that's an uncaughtException which kills the server),
  //  instead they settle `exited`, which consumers should await after reading stdout.
  //  An abort (client went away) is an expected way to stop, so it resolves.
  const exited = new Promise<void>((resolve, reject) => {
    proc.on('error', (err) => {
      if (signal?.aborted) resolve()
      else reject(new ProcessError(`[${pathspec}]: ${err.message}`, null))
    })
    proc.on('close', (code) => {
      if (signal?.aborted) return resolve()
      if (code !== 0) return reject(new ProcessError(`[${pathspec}]: ${stderr || `Process exited with unexpected code ${code}`}`, code))
      if (stderr) console.warn(`[${pathspec}]: ${stderr}`)
      resolve()
    })
  })
  // a consumer that stops early (e.g. on abort) never awaits `exited`; don't let that become an unhandledRejection
  exited.catch(() => {})
  // if python dies before reading stdin this is EPIPE; `exited` already reports the failure
  proc.stdin.on('error', () => {})
  proc.stdin.end(stdin)
  return Object.assign(proc, { exited })
}