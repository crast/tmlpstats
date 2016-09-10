import objectPick from 'lodash/pick'

import { scoreboardLoad, redux_scoreboard } from './data'
import Api from '../api'

const loadState = scoreboardLoad.actionCreator()

const DESIRED_SB_KEYS = ['games', 'meta', 'week']

export function getCurrentScores(center) {
    return (dispatch, _, { Api }) => {
        dispatch(loadState('loading'))
        Api.LiveScoreboard.getCurrentScores({center}, function (data) {
            dispatch(updateScoreboard(objectPick(data, DESIRED_SB_KEYS)))
            dispatch(loadState('loaded'))
        })
    }
}

export function updateScoreboard(data) {
    return {
        type: 'live_scoreboard/setAll',
        payload: data
    }
}

export function changeGameField(game, field, value) {
    return {
        type: 'live_scoreboard/setGameValue',
        payload: { game, field, value }
    }
}

export function setGameOp(game, op) {
    return changeGameField(game, 'op', op)
}

export function postGameValue(center, game, type, value) {
    return (dispatch, getState) => {
        const request = { center, game, type, value }
        return Api.LiveScoreboard.setScore(request).then((data) => {
            if (data.games) {
                const existing = getState().live_scoreboard.scoreboard
                dispatch(updateScoreboard(redux_scoreboard.mergeGameUpdates(existing, data.games)))
            }
        })
    }
}

export function submitUpdates(center, game, field, gameValue) {
    return (dispatch, getState) => {
        dispatch(setGameOp(game, 'updating'))
        const makeRevert = () => {
            const generation = generationSelector(getState(), game)
            return ifGeneration(getState, game, () => {
                dispatch(setGameOp(game, 'default'))
            })
        }
        const successHandler = (data) => {
            dispatch(setGameOp(game, 'success'))
            setTimeout(makeRevert(), 5000)
            return data
        }
        const failHandler = () => {
            dispatch(setGameOp(game, 'failed'))
            setTimeout(makeRevert(), 8000)
        }
        return dispatch(postGameValue(center, game, field, gameValue)).then(successHandler, failHandler)
    }
}

export function changeGameFieldPotentialUpdate(center, game, field, gameValue) {
    return (dispatch, getState) => {
        dispatch(changeGameField(game, field, gameValue))

        if (!isNaN(parseInt(gameValue))) {
            const cb = ifGeneration(getState, game, () => {
                dispatch(submitUpdates(center, game, field, gameValue))
            })
            setTimeout(cb, 700)
        }
    }

}

function ifGeneration(getState, game, handler) {
    const generation = generationSelector(getState(), game)
    return () => {
        if (generationSelector(getState(), game) == generation) {
            handler(...arguments)
        }
    }
}

function gameSelector(state, game) {
    return state.live_scoreboard.scoreboard.games[game]
}

function generationSelector(state, game) {
    return gameSelector(state, game)._gen
}
