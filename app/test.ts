export const num = 42;

export function sleep (milliseconds: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, milliseconds);
  });
}