import { ElementHandle, Page }from 'puppeteer';

export default class PuppeteerPageObjectBase {
    private _page: Page;

    constructor(page: Page){
        this._page = page;
    }   

    public GetPage() : Page{
        return this._page;
    }

    protected async OpenPage(url: string){
        await this._page.goto(url);
    }

    public async GetElements(selector: string) : Promise<ElementHandle<any>[]> {
        await this.WaitSelector(selector);
        return await this._page.$$(selector);
    }

    public async GetHrefFromElement(selector: string) : Promise<string | null>{
        await this.WaitSelector(selector);
        return await this._page.$eval(selector, element => element.getAttribute('href'));
    }

    public async WaitSelector(selector: string){
        await this._page.waitForSelector(selector);
    }

    public async Delay(miliseconds: number) : Promise<void> {
        await new Promise<void>(resolve => {
            setTimeout(() => {
                resolve();
            }, miliseconds);
        });
    }
}