import { actions as formActions } from 'react-redux-form'

import { bestErrorValue } from '../../reusable/ajax_utils'
import { classListLoad, teamMembersCollection, weeklyReportingData, weeklyReportingSave } from './data'
import { TEAM_MEMBERS_COLLECTION_FORM_KEY, TEAM_MEMBER_FORM_KEY, WEEKLY_REPORTING_CHANGE } from './reducers'
import Api from '../../api'

export const loadState = classListLoad.actionCreator()
const weeklySaveState = weeklyReportingSave.actionCreator()

export function loadClassList(centerId, reportingDate) {
    return (dispatch, _, { Api }) => {
        dispatch(loadState('loading'))
        return Api.TeamMember.allForCenter({
            center: centerId,
            reportingDate: reportingDate,
            includeInProgress: true
        }).done((data) => {
            dispatch(initializeClassList(data))
        }).fail((jqXHR, textStatus) => {
            dispatch(loadState({error: bestErrorValue(jqXHR, textStatus)}))
        })
    }
}

function initializeClassList(data) {
    return (dispatch) => {
        // Re-format the collection as a key-ordered collection
        data = teamMembersCollection.ensureCollection(data)
        dispatch(formActions.load(TEAM_MEMBERS_COLLECTION_FORM_KEY, data))
        dispatch(loadState('loaded'))
    }
}

export function chooseTeamMember(data) {
    console.log('load', TEAM_MEMBER_FORM_KEY, data)
    return formActions.load(TEAM_MEMBER_FORM_KEY, data)
}

export function weeklyReportingUpdated(teamMemberId) {
    return weeklyReportingData.mark(teamMemberId)
}

export function weeklyReportingSubmit(center, reportingDate, tracking, rawData) {
    var updates = []
    for (var id in tracking.changed) {
        let {gitw, tdo} = rawData[id]
        updates.push({id, gitw, tdo})
    }
    console.log('updates', updates)

    return (dispatch) => {
        dispatch(weeklyReportingData.beginWork())
        dispatch(weeklySaveState('loading'))

        const success = (data) => {
            dispatch(weeklySaveState('loaded'))
            setTimeout(() => {
                dispatch(weeklyReportingData.endWork())
                dispatch(weeklySaveState('new'))
            }, 3000)
            return data
        }
        const fail = (err) => {
            dispatch(weeklySaveState({error: err.error || err}))
        }

        return Api.TeamMember.bulkStashWeeklyReporting({center, reportingDate, updates}).then(success, fail)
    }
}
