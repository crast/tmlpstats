import _ from 'lodash'
import React from 'react'
import { Form, Field, SimpleSelect, formActions, SimpleFormGroup } from '../../reusable/form_utils'
import { Alert, Panel, SubmitFlip } from '../../reusable/ui_basic'
import { rebind, connectRedux } from '../../reusable/dispatch'
import { getLabelTeamMember } from '../core/selectors'

import * as selectors from './selectors'

export class QuarterAccountabilities extends React.Component {
    render() {
        return (
            <div>
                <h3>Next Quarter Accountabilities</h3>
                <Alert alert="info">
                    Fill this form out after classroom 3 to indicate accountabilities for next quarter
                </Alert>
                <QuarterAccountabilitiesTable />
            </div>
        )
    }
}

@connectRedux()
export class QuarterAccountabilitiesTable extends React.Component {
    static mapStateToProps(state) {
        return {
            accountabilities: selectors.repromisableAccountabilities(state),
            qa: state.submission.qtr_accountabilities,
            lookups: state.submission.core.lookups,
            browser: state.browser
        }
    }

    render() {
        if (!this.props.accountabilities) {
            return <div>Loading</div>
        }
        const MODEL='submission.qtr_accountabilities'
        const tabular = this.props.browser.greaterThan.medium

        const accountabilities = this.props.accountabilities.map((acc) => {
            return (
                <QuarterAccountabilitiesRow key={acc.id} acc={acc} modelBase={MODEL} lookups={this.props.lookups} tabular={tabular} />
            )
        })
        if (tabular) {
            return (
                <Form model={MODEL} className="table-responsive">
                    <table className="table table-hover table-responsive">
                        <thead>
                            <tr>
                                <th>Accountability</th>
                                <th>Team Member</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accountabilities}
                        </tbody>
                    </table>
                    <SubmitFlip loadState={{state: 'loaded'}}>Submit</SubmitFlip>
                </Form>
            )
        } else {
            return (
                <Form model={MODEL} className="form-horizontal nextQuarterAccountabilities">
                    {accountabilities}
                    <SubmitFlip loadState={{state: 'loaded'}}>Submit</SubmitFlip>
                </Form>
            )
        }
    }
}

class QuarterAccountabilitiesRow extends React.PureComponent {
    constructor(props) {
        super(props)
        rebind(this, 'changeAction')
    }

    render() {
        const { acc, modelBase, tabular } = this.props

        const model = modelBase + '.' + acc.id

        const tmSelectField = (
            <SimpleSelect
                    model={model+'.tmId'} items={this.props.lookups.team_members}
                    keyProp="teamMemberId" getLabel={getLabelTeamMember} emptyChoice="Choose One"
                    changeAction={this.changeAction} />
        )
        const emailField = <Field model={model+'.email'}><input type="text" className="form-control nqEmail" /></Field>
        const phoneField = <Field model={model+'.phone'}><input type="text" className="form-control nqPhone" /></Field>
        const notesField = <Field model={model+'.notes'}><input type="text" className="form-control nqNotes" /></Field>

        if (tabular) {
            return (
                <tr>
                    <th>{acc.display}</th>
                    <td>{tmSelectField}</td>
                    <td>{emailField}</td>
                    <td>{phoneField}</td>
                    <td>{notesField}</td>
                </tr>
            )
        } else {
            const color = _.includes(requiredAccountabilities, acc.name) ? 'primary' : 'default'
            return (
                <Panel color={color} heading={acc.display} headingLevel="h3">
                    <SimpleFormGroup label="Team Member">{tmSelectField}</SimpleFormGroup>
                    <SimpleFormGroup label="Email">{emailField}</SimpleFormGroup>
                    <SimpleFormGroup label="Phone">{phoneField}</SimpleFormGroup>
                </Panel>
            )
        }
    }

    changeAction(key, value) {
        const li = key.lastIndexOf('.')
        const fixed = key.substr(0, li)
        const tmd = this.props.lookups.team_members.find((x) => x.teamMember.id == value)
        return formActions.change(fixed, {
            tmId: value,
            email: tmd.teamMember.person.email,
            phone: tmd.teamMember.person.phone
        })
    }
}

const requiredAccountabilities = ['t1tl', 't2tl', 'statistician', 'logistics']
