import './scss/styles.scss';
import { ensureElement } from './utils/utils';

const productModal = ensureElement<HTMLElement>('#product-modal');
const basketModal = ensureElement<HTMLElement>('#basket-modal');
const paymentModal = ensureElement<HTMLElement>('#payment-modal');
const contactsModal = ensureElement<HTMLElement>('#contacts-modal');
const successModal = ensureElement<HTMLElement>('#success-modal');

