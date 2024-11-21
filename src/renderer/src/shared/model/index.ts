export type IPCResponse<T> = {
  error: boolean
  message?: string
  data: T
}
