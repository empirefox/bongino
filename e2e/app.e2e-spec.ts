import { BonginoPage } from './app.po';

describe('bongino App', () => {
  let page: BonginoPage;

  beforeEach(() => {
    page = new BonginoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
