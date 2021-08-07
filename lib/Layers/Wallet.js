import { stateQuery, set, get } from '../StateManagement/State'
import { loadStdlib } from '@reach-sh/stdlib'
const reach = loadStdlib('ETH');

export const getAccount = async () => {
    let acc = await reach.getDefaultAccount()
    set(acc, 'account')
}

export const getBalance = async () => {
    let account = get('account')
    let rawBalance = await reach.balanceOf(account)
    set(reach.formatCurrency(rawBalance, 4), 'balance')
}

export const fundAccount = async () => {
    let account = get('account')
    await reach.fundFromFaucet(account, reach.parseCurrency(10))
}