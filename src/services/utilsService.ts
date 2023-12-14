export default class UtilsService {
    public async Delay(miliseconds: number): Promise<void>{
        await new Promise<void>(resolve => {
            setTimeout(() => {
                resolve();
            }, miliseconds);
        })
    }
}