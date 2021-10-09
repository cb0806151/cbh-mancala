import { stateQuery, set, get } from '../StateManagement/State'
import { loadStdlib } from '@reach-sh/stdlib'
const reach = loadStdlib('CFX');
try {
    reach.setProviderByName('TestNet');
} catch (e) {
    console.log('provider already set', e)
}


export const getAccount = async () => {
    const now = await reach.getNetworkTime();
    reach.setQueryLowerBound(reach.sub(now, 2000));
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
    await reach.fundFromFaucet(account, reach.parseCurrency(100))
}