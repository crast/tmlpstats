import { objectAssign } from './ponyfill'
import SortableCollection from './sortable_collection'
import { ReduxLoader, rebindActionCreators } from './base'

const SC_ACTIONS = ['replaceItem', 'replaceCollection', 'changeSortCriteria', 'iterItems']

export default class SortableReduxLoader extends ReduxLoader {
    constructor(opts) {
        super(opts)

        var sc = this.sc = new SortableCollection(objectAssign({name: opts.prefix}, opts.sortable))

        objectAssign(this, rebindActionCreators(SC_ACTIONS, sc))
    }

    dataReducer(opts) {
        return this.sc.reducer(opts.collection_reducer)
    }
}
