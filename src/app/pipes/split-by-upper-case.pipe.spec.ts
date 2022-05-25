import { SplitByUpperCasePipe } from './split-by-upper-case.pipe';

describe('SplitByUpperCasePipe', () => {
  it('create an instance', () => {
    const pipe = new SplitByUpperCasePipe();
    expect(pipe).toBeTruthy();
  });
});
