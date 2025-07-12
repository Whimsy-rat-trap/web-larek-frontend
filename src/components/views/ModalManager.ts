export class ModalManager {
    private static instance: ModalManager;

    static getInstance(): ModalManager {
        if (!ModalManager.instance) {
            ModalManager.instance = new ModalManager();
        }
        return ModalManager.instance;
    }

    openModal(modal: HTMLElement): void {
        modal.classList.add('modal_active');
        document.body.classList.add('_modal-open');
        modal.scrollTo(0, 0);
    }

    closeModal(modal: HTMLElement): void {
        modal.classList.remove('modal_active');
        document.body.classList.remove('_modal-open');
    }

    setupCloseHandlers(): void {
        // Единая логика для всех модальных окон
        document.querySelectorAll('.modal__close, .order-success__close')
            .forEach(button => {
                button.addEventListener('click', (e) => {
                    const modal = button.closest('.modal') as HTMLElement;
                    if (modal) this.closeModal(modal);
                });
            });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal as HTMLElement);
                }
            });
        });
    }
}