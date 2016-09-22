import _ from 'lodash'
import { makeAccountabilitiesSelector } from '../core/selectors'
import { createSelector } from 'reselect'

const accSelector = makeAccountabilitiesSelector('team')

const chosenAccountabilities = [
    't1tl',
    't2tl',
    'statistician',
    'logistics',
    'statisticianApprentice',
    'cap',
    'cpc',
    'gitw',
    'lf',
    't1x',
    't2x'
]

export const repromisableAccountabilities = createSelector(
    accSelector,
    (ordered) => {
        // the 'name' property is actually more like a slug... create a lookup via that.
        const rekeyed = _.keyBy(ordered, 'name')
        return chosenAccountabilities.map((id) => rekeyed[id])
    }
)
