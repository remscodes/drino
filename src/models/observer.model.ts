export interface Observer<T = any> {
  result?: (result: T) => void;
  error?: (error: any) => void;
  finished?: () => void;

  info?: () => void;
  success?: (result: T) => void;
  redirect?: () => void;
  clientError?: (error: any) => void;
  serverError?: (error: any) => void;

  aborted?: (reason: any) => void;
}
