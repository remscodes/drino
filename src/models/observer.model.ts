export interface Observer<T = any> {
  result?: (result: T) => void;
  error?: (error: any) => void;
  finish?: () => void;

  // info?: () => void;
  // success?: (result: T) => void;
  // redirect?: () => void;
  // clientError?: (error: any) => void;
  // serverError?: (error: any) => void;
  //
  // retry?: (count: number) => void;
  abort?: (reason: any) => void;
}
