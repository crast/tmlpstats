import { coreInit, centerQuarterData, cqResponse } from './data'
import { objectAssign } from '../../reusable/ponyfill'
import { bestErrorValue } from '../../reusable/ajax_utils'
import Api from '../../api'
import { normalize } from 'normalizr'

export const initState = coreInit.actionCreator()

export function initSubmission(centerId, reportingDate) {
    return (dispatch) => {
        dispatch(initState('loading'))
        return Api.SubmissionCore.initSubmission({
            center: centerId,
            reportingDate: reportingDate
        }).then((data) => {
            dispatch(setSubmissionLookups(data))
        }).catch((jqXHR, textStatus) => {
            dispatch(initState({error: bestErrorValue(jqXHR, textStatus)}))
        })
    }
}

export function setSubmissionLookups(data) {
    return (dispatch) => {
        const lookups = objectAssign({}, data.lookups)

        // yuck, but works for now while we're remapping
        const n = normalize(data, cqResponse)
        lookups.validRegQuarters = n.entities.c[n.result].validRegQuarters
        dispatch(centerQuarterData.replaceItems(n.entities.quarters))

        dispatch({
            type: 'core/setSubmissionLookups',
            payload: lookups
        })
        dispatch(initState('loaded'))
    }
}

export function setReportingDate(reportingDate) {
    return {
        type: 'submission.setReportingDate',
        payload: reportingDate
    }
}
