export abstract class BasePresenter {
    protected view: any;
    protected model: any;

    constructor(view: any, model: any) {
        this.view = view;
        this.model = model;
        this.init();
    }

    protected abstract init(): void;
}