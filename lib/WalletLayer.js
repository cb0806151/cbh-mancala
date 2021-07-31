import { stateQuery, set } from './State'
import { loadStdlib } from '@reach-sh/stdlib'
const reach = loadStdlib('CFX');

export const getAccount = async () => {
    let acc = await reach.getDefaultAccount()
    set(acc, 'account')
}

export const getBalance = async () => {
    let account = stateQuery.select('account')
    account.subscribe(async (acc) => {
        let rawBalance = await reach.balanceOf(acc)
        set(reach.formatCurrency(rawBalance, 4), 'balance')
    })
}