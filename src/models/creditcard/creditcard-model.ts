import { request } from "../../utils/axios-utils"
import { CreditCard, CreditCardSummary, CreditCardTrend } from "./creditcard-types"

class CreditCardModel {
    static fetchCreditCards = async () => {
        return request<CreditCard[]>({ url: "credit-card" })
    }
    static fetchSummary = async (params: { credit_card_id: number, month: number, year: number }) => {
        return request<CreditCardSummary>({ url: "credit-card/summary", params })
    }

    static fetchCreditCardTrend = (creditCardId: number) => {
        return request<CreditCardTrend[]>({
            url: `/credit-card/trend`,
            params: { credit_card_id: creditCardId },
        });
    };
}

export default CreditCardModel