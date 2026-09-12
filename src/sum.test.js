import sum from "./sum";

test("Testing my sum function", () => {
    const a = 20;
    const b = 20;
    const output = 40;
  expect(sum(a,b)).toBe(output);
});

test("Testing my sum function", ()=>{
    expect(sum(20, 30)).toBe(50);
});