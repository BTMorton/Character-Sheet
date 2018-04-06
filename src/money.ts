export enum Currency {
    CP,
    SP,
    EP,
    GP,
    PP
}

export class Money {
    public static CURRENCY_MODIFIERS: Map<Currency, number> = new Map<Currency, number>([
        [ Currency.CP, 1 ],
        [ Currency.SP, 10 ],
        [ Currency.EP, 50 ],
        [ Currency.GP, 100 ],
        [ Currency.PP, 1000 ],
    ]);
    public static WEIGHT_MODIFIER: number = 1 / 50;

    public cp = 0;  //  1
    public sp = 0;  //  10
    public ep = 0;  //  50
    public gp = 0;  //  100
    public pp = 0;  //  1000
    public useEP = true;

    //  Converts from one currency to another returning a floating point value
    public static convert(fromCurrency: Currency, toCurrency: Currency, currentValue: number): number {
        currentValue = currentValue * Money.CURRENCY_MODIFIERS.get(fromCurrency);
        return currentValue / Money.CURRENCY_MODIFIERS.get(toCurrency);
    }

    //  Gives the remainder when converting from one currency to another
    public static getRemainder(fromCurrency: Currency, toCurrency: Currency, currentValue: number): number {
        currentValue = currentValue * Money.CURRENCY_MODIFIERS.get(fromCurrency);
        return currentValue % Money.CURRENCY_MODIFIERS.get(toCurrency);
    }

    constructor(cp: number = 0, sp: number = 0, ep: number = 0, gp: number = 0, pp: number = 0, useEp: boolean = true) {
        this.cp += cp;
        this.sp += sp;
        this.ep += ep;
        this.gp += gp;
        this.pp += pp;
        this.useEP = useEp;
    }

    public autoConvertCoins(): Money {
        const convertedMoney = new Money();
        convertedMoney.useEP = this.useEP;

        const extraSP = Math.floor(Money.convert(Currency.CP, Currency.SP, this.cp));

        convertedMoney.cp = Money.getRemainder(Currency.CP, Currency.SP, this.cp);
        const totalSP: number = this.sp + extraSP;

        let extraGP: number = this.gp;

        if (this.useEP) {
            const extraEP: number = Math.floor(Money.convert(Currency.SP, Currency.EP, totalSP));

            convertedMoney.sp = Money.getRemainder(Currency.SP, Currency.EP, totalSP);
            const totalEP: number = this.ep + extraEP;

            extraGP = Math.floor(Money.convert(Currency.EP, Currency.GP, totalEP));

            convertedMoney.ep = Money.getRemainder(Currency.EP, Currency.GP, totalEP);
        } else {
            extraGP = Math.floor(Money.convert(Currency.SP, Currency.GP, totalSP));

            convertedMoney.sp = Money.getRemainder(Currency.SP, Currency.GP, totalSP);
        }

        const totalGP = this.gp + extraGP;

        const extraPP = Math.floor(Money.convert(Currency.GP, Currency.PP, totalGP));
        convertedMoney.pp = this.pp + extraPP;

        return convertedMoney;
    }

    public totalCoinWeight(): number {
        const totalCoins: number = this.cp + this.sp + this.ep + this.gp + this.pp;
        return Math.floor(totalCoins * Money.WEIGHT_MODIFIER);
    }

    public add(moneyToAdd: Money): Money {
        const addedMoney = new Money(this.cp, this.sp, this.ep, this.gp, this.pp, this.useEP);

        addedMoney.cp += moneyToAdd.cp;
        addedMoney.sp += moneyToAdd.sp;
        addedMoney.ep += moneyToAdd.ep;
        addedMoney.gp += moneyToAdd.gp;
        addedMoney.pp += moneyToAdd.pp;

        return addedMoney;
    }

    public subtract(moneyToSubtract: Money): Money {
        if (!this.canAfford(moneyToSubtract)) {
            throw new Error('Cannot afford this purchase');
        }

        const subtractedMoney = new Money(this.cp, this.sp, this.ep, this.gp, this.pp, this.useEP);

        subtractedMoney.cp -= moneyToSubtract.cp;
        subtractedMoney.sp -= moneyToSubtract.sp;
        subtractedMoney.ep -= moneyToSubtract.ep;
        subtractedMoney.gp -= moneyToSubtract.gp;
        subtractedMoney.pp -= moneyToSubtract.pp;

        if (subtractedMoney.cp < 0) {
            const neededSP: number = Math.ceil(Money.convert(Currency.CP, Currency.SP, -this.cp));
            subtractedMoney.sp -= neededSP;
            subtractedMoney.cp += Math.ceil(Money.convert(Currency.SP, Currency.CP, neededSP));
        }

        if (subtractedMoney.sp < 0) {
            if (this.useEP) {
                const neededEP: number = Math.ceil(Money.convert(Currency.SP, Currency.EP, -this.sp));
                subtractedMoney.ep -= neededEP;
                subtractedMoney.sp += Math.ceil(Money.convert(Currency.EP, Currency.SP, neededEP));
            } else {
                const neededGP: number = Math.ceil(Money.convert(Currency.SP, Currency.GP, -this.sp));
                subtractedMoney.gp -= neededGP;
                subtractedMoney.sp += Math.ceil(Money.convert(Currency.GP, Currency.SP, neededGP));
            }
        }

        if (subtractedMoney.ep < 0) {
            const neededGP: number = Math.ceil(Money.convert(Currency.EP, Currency.GP, -this.ep));
            subtractedMoney.sp -= neededGP;
            subtractedMoney.ep += Math.ceil(Money.convert(Currency.GP, Currency.EP, neededGP));
        }

        if (subtractedMoney.gp < 0) {
            const neededPP: number = Math.ceil(Money.convert(Currency.GP, Currency.PP, -this.gp));
            subtractedMoney.sp -= neededPP;
            subtractedMoney.gp += Math.ceil(Money.convert(Currency.PP, Currency.GP, neededPP));
        }

        return subtractedMoney;
    }

    public canAfford(cost: Money): boolean {
        return this.getTotal() >= cost.getTotal();
    }

    public getTotal(): number {
        const cp = this.cp * Money.CURRENCY_MODIFIERS.get(Currency.CP);
        const sp = this.sp * Money.CURRENCY_MODIFIERS.get(Currency.SP);
        const ep = this.ep * Money.CURRENCY_MODIFIERS.get(Currency.EP);
        const gp = this.gp * Money.CURRENCY_MODIFIERS.get(Currency.GP);
        const pp = this.pp * Money.CURRENCY_MODIFIERS.get(Currency.PP);

        return cp + sp + ep + gp + pp;

    }
}
