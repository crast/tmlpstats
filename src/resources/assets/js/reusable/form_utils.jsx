import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, Field, actions as formActions } from 'react-redux-form'
import _get from 'lodash/get'
import { Link } from 'react-router'

var omit = require('lodash/omit')

export { Form, Field, formActions }

export class SimpleField extends React.Component {
    static defaultProps = {
        labelClass: 'col-md-2',
        divClass: 'col-md-8'
    }
    render() {
        var field
        if (this.props.customField) {
            field = this.props.children
        } else if (this.props.disabled) {
            field = <input type="text" className="form-control" disabled={this.props.disabled} />
        } else {
            field = <input type="text" className="form-control" />
        }

        const { labelClass, divClass } = this.props

        return (
            <Field model={this.props.model}>
                <div className="form-group">
                    <label className={labelClass + ' control-label'}>{this.props.label}</label>
                    <div className={divClass}>{field}</div>
                </div>
            </Field>
        )
    }
}

export class SimpleFormGroup extends React.PureComponent {
    static defaultProps = {
        labelClass: 'col-md-2',
        divClass: 'col-md-8'
    }
    render() {
        const { label, labelClass, divClass } = this.props
        return (
            <div className="form-group">
                <label className={labelClass + ' control-label'}>{label}</label>
                <div className={divClass}>{this.props.children}</div>
            </div>
        )
    }
}

export class AddOneLink extends React.PureComponent {
    render() {

        var label = this.props.label
        if (!label) {
            label = '+ Add One'
        }

        return (
            <Link to={this.props.link}>{label}</Link>
        )
    }
}

export class SimpleSelect extends React.Component {
    static defaultProps = {
        keyProp: 'key',
        labelProp: 'label',
        multiple: false,
        rows: 1
    }
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.object).isRequired,
        keyProp: PropTypes.string,
        getKey: PropTypes.func,
        labelProp: PropTypes.string,
        getLabel: PropTypes.func,
        selectClasses: PropTypes.string,
        multiple: PropTypes.bool,
        rows: PropTypes.number
    }
    render() {
        const items = this.props.items || []
        let { getKey, getLabel, emptyChoice } = this.props
        if (!getKey) {
            getKey = (obj) => obj[this.props.keyProp]
        }
        if (!getLabel) {
            getLabel = (obj) => obj[this.props.labelProp]
        }

        const options = []
        if (emptyChoice) {
            options.push(<option key={-1} value="">{emptyChoice}</option>)
        }
        items.forEach((item, i) => {
            options.push(
                <option key={i} value={getKey(item)}>{getLabel(item)}</option>
            )
        })
        return (
            <Field model={this.props.model} multiple={this.props.multiple} rows={this.props.rows}>
                <select className="form-control">{options}</select>
            </Field>
        )
    }
}

const customFieldMSP = (state, props) => {
    const modelValue = _get(state, props.model)
    return {modelValue}
}
export const connectCustomField = connect(customFieldMSP)


// Boolean select
export class BooleanSelectView extends React.Component {
    static defaultProps = {
        labels: ['N', 'Y'],
        className: 'form-control'
    }
    _renderOmit = ['modelValue', 'emptyChoice', 'labels', 'dispatch', 'model', 'params']

    componentWillMount() {
        this.onChange = this.onChange.bind(this)
    }

    render() {
        const { modelValue, emptyChoice, labels } = this.props
        const rest = omit(this.props, this._renderOmit)
        const sValue = this.selectValue(modelValue)

        var empty
        if (emptyChoice) {
            empty = <option value="">{emptyChoice}</option>
        }

        return (
            <select value={sValue} onChange={this.onChange} {...rest}>
                {empty}
                <option value="0">{labels[0]}</option>
                <option value="1">{labels[1]}</option>
            </select>
        )
    }

    // return the value for the select box
    selectValue(modelValue) {
        if (modelValue === false || modelValue === '0' || modelValue === '') {
            return '0'
        } else if (modelValue) {
            return '1'
        }
        return ''
    }

    onChange(e) {
        const v = e.target.value
        const newValue = (v === '')? null : ((v === '1') ? true : false)
        this.props.dispatch(formActions.change(this.props.model, newValue))
    }
}
export const BooleanSelect = connectCustomField(BooleanSelectView)

