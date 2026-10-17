export const product = { name: 'Samsung galaxy s6', price: 360 };
export const customer = { name: 'QA Demo', country: 'Vietnam', city: 'Hanoi', card: '4111111111111111', month: '12', year: '2030' };
/** Test-only generated account: never place real passwords in the repository. */
export function newUser() {
  const username = `qa_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  return { username, password: `Qa!${Math.random().toString(36).slice(2)}98` };
}
