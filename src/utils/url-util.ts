// export function buildUrl(): URL {
//   const { prefix, queryParams } = this.options;
//
//   let baseUrl = this.url;
//
//   if (queryParams && (queryParams?.size || Object.keys(queryParams).length)) {
//     const searchParams: URLSearchParams = (queryParams instanceof URLSearchParams)
//       ? queryParams
//       : new URLSearchParams(queryParams);
//
//     baseUrl = `${baseUrl}?${searchParams}`;
//   }
//
//   return new URL(baseUrl, prefix);
// }
export {};
