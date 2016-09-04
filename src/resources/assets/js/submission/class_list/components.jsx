import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field } from 'react-redux-form'

import { Form, SimpleField, BooleanSelect, BooleanSelectView, connectCustomField, SimpleSelect, SimpleFormGroup, AddOneLink } from '../../reusable/form_utils'
import { Promise, objectAssign, arrayFind } from '../../reusable/ponyfill'
import { ModeSelectButtons, LoadStateFlip, SubmitFlip, Alert } from '../../reusable/ui_basic'
import { delayDispatch } from '../../reusable/dispatch'

import { centerQuarterData } from '../core/data'
import { SubmissionBase, React } from '../base_components'
import { TEAM_MEMBERS_COLLECTION_FORM_KEY, TEAM_MEMBER_FORM_KEY } from './reducers'
import { classListSorts, teamMembersCollection } from './data'
import * as actions from './actions'

const GITW_LABELS = ['Ineffective', 'Effective']
const TDO_LABELS = ['N', 'Y']

class ClassListBase extends SubmissionBase {
    // Check the loading state of our initial data, and dispatch a loadClassList if we never loaded
    checkLoading() {
        const { loading, dispatch } = this.props
        if (loading.state == 'new') {
            const { centerId, reportingDate } = this.props.params
            dispatch(actions.loadClassList(centerId, reportingDate))
            return false
        }
        return (loading.state == 'loaded')
    }
}

const STATE_UPDATING = 'Updating'
const STATE_NOTHING = 'Nothing'
const STATE_SAVED = 'Saved'

class ClassListIndexView extends ClassListBase {
    componentWillMount() {
        this.saveWeeklyReporting = this.saveWeeklyReporting.bind(this)
    }
    render() {
        if (!this.checkLoading()) {
            return this.renderBasicLoading()
        }

        const baseUri = this.baseUri()
        const changeSort = (newSort) => this.props.dispatch(teamMembersCollection.changeSortCriteria(newSort))
        const wr = this.props.weeklyReporting
        const wsLoaded = this.props.weeklySave
        var teamMemberRows = []
        teamMembersCollection.iterItems(this.props.teamMembers, (teamMember, key) => {
            var updating = STATE_NOTHING
            if (wr.changed[key]) {
                updating = (wsLoaded.loaded && wr.working && wr.working[key] >= wr.changed[key])? STATE_SAVED : STATE_UPDATING
            }
            teamMemberRows.push(
                <TeamMemberIndexRow key={key} teamMember={teamMember} baseUri={baseUri} updating={updating} />
            )
        })

        return (
            <Form model={TEAM_MEMBERS_COLLECTION_FORM_KEY} onSubmit={this.saveWeeklyReporting}>
                <h3>Class List</h3>
                <ModeSelectButtons items={classListSorts} current={this.props.teamMembers.meta.sort_by}
                                   onClick={changeSort} ariaGroupDesc="Sort Preferences" />
                <Alert alert="info">
                    Tip: you can use the "tab" key to quickly jump through the GITW/TDO. Set each one
                    with the keyboard using "E" "I" for GITW and "Y" "N" for TDO. You can quick-save the
                    GITW/TDO by hitting the enter key.
                </Alert>
                <table className="table submissionClassList">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Year</th>
                            <th>GITW</th>
                            <th>TDO</th>
                        </tr>
                    </thead>
                    <tbody>{teamMemberRows}</tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2"></td>
                            <td colSpan="2" style={{minWidth: '15em'}}>
                                <SubmitFlip loadState={wsLoaded} wrapGroup={false}>Save GITW/TDO changes</SubmitFlip>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <br />
                <AddOneLink link={`${baseUri}/class_list/add`} />
            </Form>
        )
    }

    saveWeeklyReporting(data) {
        if (this.props.weeklySave.state == 'new') {
            const { centerId, reportingDate } = this.props.params
            delayDispatch(this, actions.weeklyReportingSubmit(
                centerId, reportingDate,
                this.props.weeklyReporting, data
            ))
        }
    }
}
class GitwTdoLiveSelectView extends BooleanSelectView {
    onChange(e) {
        super.onChange(e)
        let bits = this.props.model.split('.')
        bits.reverse() // the model looks like path.<teamMemberid>.tdo so if we reverse it, we get the right answer
        this.props.dispatch(actions.weeklyReportingUpdated(bits[1]))
    }
}
const GitwTdoLiveSelect = connectCustomField(GitwTdoLiveSelectView)

class TeamMemberIndexRow extends React.PureComponent {
    render() {
        const { teamMember, updating } = this.props
        const modelKey = `${TEAM_MEMBERS_COLLECTION_FORM_KEY}.${teamMember.id}`

        var className
        if (updating == STATE_SAVED) {
            className = 'bg-success'
        } else if (updating == STATE_UPDATING) {
            className = 'bg-warning'
        }

        return (
            <tr className={className}>
                <td>
                    <Link to={`${this.props.baseUri}/class_list/edit/${teamMember.id}`}>
                        {teamMember.firstName} {teamMember.lastName}
                    </Link>
                </td>
                <td>T{teamMember.teamYear}</td>
                <td className="gitw"><GitwTdoLiveSelect model={modelKey+'.gitw'} emptyChoice=" " labels={GITW_LABELS} /></td>
                <td className="tdo"><GitwTdoLiveSelect model={modelKey+'.tdo'} emptyChoice=" " labels={TDO_LABELS} /></td>
            </tr>
        )
    }
}

class _EditCreate extends ClassListBase {
    getCenterQuarter(quarterId) {
        const { currentMember, centerQuarters } = this.props
        if (!quarterId) {
            quarterId = currentMember.incomingQuarter
        }
        return centerQuarters.data[quarterId]
    }

    checkLoading() {
        if (!super.checkLoading()) {
            return false
        }
        const { currentMember, centerQuarters } = this.props
        if (currentMember) {
            const iq = currentMember.incomingQuarter
            if (iq && !this.getCenterQuarter(iq)) {
                if (centerQuarters.loadState.available) {
                    const { centerId } = this.props.params
                    delayDispatch(this, centerQuarterData.load({center: centerId, quarter: iq}))
                }
                return false
            }
        }
        return true
    }

    render() {
        const modelKey = TEAM_MEMBER_FORM_KEY
        const options = this.getRenderOptions()

        return (
            <Form className="form-horizontal submissionClassListEdit" model={modelKey} onSubmit={this.saveTeamMember.bind(this)}>
                <div className="row">
                    <div className="col-lg-12 tmBox">
                        {this.renderBasicInfo(modelKey, options)}
                    </div>
                    <div className="col-lg-12 tmBox">
                        {this.renderRegPrefs(modelKey, options)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 tmBox">
                        {this.renderTravelRoom(modelKey, options)}
                    </div>
                    <div className="col-lg-12 tmBox">
                        {this.renderGitwTdo(modelKey, options)}
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-8">
                        <LoadStateFlip loadState={this.props.loading}>
                            <button className="btn btn-primary" type="submit">Save</button>
                        </LoadStateFlip>
                    </div>
                </div>
            </Form>
        )
    }

    renderBasicInfo(modelKey, { disableBasicInfo, disableYearQuarter }) {
        return (
            <div>
                <SimpleField label="First Name" model={modelKey+'.firstName'} divClass="col-md-6" disabled={disableBasicInfo} />
                <SimpleField label="Last Name" model={modelKey+'.lastName'} divClass="col-md-6" disabled={disableBasicInfo} />
                <SimpleField label="Email" model={modelKey+'.email'} divClass="col-md-8" />
            </div>
        )
    }

    renderRegPrefs(modelKey, { disableYearQuarter }) {
        const incomingQuarter = this.getCenterQuarter()
        var yearQuarter
        if (disableYearQuarter) {
            yearQuarter = centerQuarterData.getLabel(incomingQuarter)
        } else {
            const cqd = this.props.centerQuarters.data
            const cqc = Object.keys(cqd).map((k) => cqd[k])
            yearQuarter = (
                <SimpleSelect
                        model={modelKey+'.incomingQuarter'} items={cqc} emptyChoice=" "
                        keyProp="quarterId" getLabel={centerQuarterData.getLabel} />
            )
        }

        return (
            <div>
                <h4>Initial Setup</h4>
                <SimpleField label="Team Year" model={modelKey+'.teamYear'} divClass="col-md-4" customField={true}>
                    <select disabled={disableYearQuarter} className="form-control">
                        <option value="1">Team 1</option>
                        <option value="2">Team 2</option>
                    </select>
                </SimpleField>
                <SimpleFormGroup label="Incoming Quarter">
                    {yearQuarter}
                </SimpleFormGroup>
                <SimpleFormGroup label="Settings">
                    <div><Field model={modelKey+'.isReviewer'}><label><input type="checkbox" />Is Reviewer</label></Field></div>
                    <div><Field model={modelKey+'.atWeekend'}><label><input type="checkbox" />Was on this team at weekend</label></Field></div>
                    <div><Field model={modelKey+'.xferIn'}><label><input type="checkbox" />Transfer In</label></Field></div>
                    <div><Field model={modelKey+'.xferOut'}><label><input type="checkbox" />Transfer Out</label></Field></div>
                </SimpleFormGroup>
            </div>
        )
    }

    renderTravelRoom(modelKey) {
        return (
            <div>
                <SimpleFormGroup label="Travel Booked" divClass="col-md-6 boolSelect">
                    <BooleanSelect model={modelKey+'.travel'} style={{maxWidth: '4em'}} />
                </SimpleFormGroup>
                <SimpleFormGroup label="Room Booked" divClass="col-md-6 boolSelect">
                    <BooleanSelect model={modelKey+'.room'} />
                </SimpleFormGroup>
            </div>
        )
    }

    renderGitwTdo(modelKey) {
        return (
            <div>
                <SimpleFormGroup label="GITW">
                    <BooleanSelect model={modelKey+'.gitw'} emptyChoice=" " labels={GITW_LABELS} className="form-control gitw" />
                </SimpleFormGroup>
                <SimpleFormGroup label="TDO">
                    <BooleanSelect model={modelKey+'.tdo'} emptyChoice=" " labels={TDO_LABELS} className="form-control boolSelect" />
                </SimpleFormGroup>

            </div>
        )
    }
}

// Detailed edit of class list
class ClassListEditView extends _EditCreate {
    checkLoading() {
        if (!super.checkLoading()) {
            return false
        }
        const { currentMember, params, dispatch, teamMembers } = this.props
        if (!currentMember || currentMember.id != params.teamMemberId) {
            const item = teamMembers.collection[params.teamMemberId]
            if (item) {
                delayDispatch(dispatch, actions.chooseTeamMember(item))
            }
            return false
        }
        return true
    }

    getRenderOptions() {
        return { disableYearQuarter: true }
    }

    saveTeamMember() {
        // TODO
    }

    render() {
        if (!this.checkLoading()) {
            return this.renderBasicLoading()
        }
        return (
            <div>
                <h3>Edit Team Member</h3>
                {super.render()}
            </div>
        )
    }
}

class ClassListAddView extends _EditCreate {
    getRenderOptions() {
        return {}
    }

    saveTeamMember() {
        // TODO
    }

    render() {
        if (!this.checkLoading()) {
            return this.renderBasicLoading()
        }
        return (
            <div>
                <h3>Add Team Member</h3>
                {super.render()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { centerQuarters } = state.submission.core
    return objectAssign({centerQuarters}, state.submission.class_list)
}
const connector = connect(mapStateToProps)

export const ClassListIndex = connector(ClassListIndexView)
export const ClassListEdit = connector(ClassListEditView)
export const ClassListAdd = connector(ClassListAddView)
