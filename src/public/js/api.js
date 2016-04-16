//// THIS FILE IS AUTOMATICALLY GENERATED!
//// DO NOT EDIT BY HAND!

function apiCall(name, params, callback, errback) {
	var input = $.extend({method: name}, params)
    if (!callback) {
        callback = function(data, textStatus) {
            console.log(data);
        };
    }
    if (!errback) {
        errback = function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        };
    }
	return $.ajax({
		url: "/api",
		method: 'POST',
		contentType: "application/json",
		data: JSON.stringify(input)
	}).done(callback).fail(errback);
}

var Api = {};

Api.Context = {

    /*
    Get the current center
    Parameters:
    */
    getCenter: function(params, callback, errback) {
        return apiCall('Context.getCenter', params, (callback || null), (errback || null));
    },

    /*
    Set the current center
    Parameters:
      center: Center
      permanent: bool
    */
    setCenter: function(params, callback, errback) {
        return apiCall('Context.setCenter', params, (callback || null), (errback || null));
    },

    /*
    Get a single setting value given a center
    Parameters:
      name: string
      center: Center
    */
    getSetting: function(params, callback, errback) {
        return apiCall('Context.getSetting', params, (callback || null), (errback || null));
    }
};
Api.GlobalReport = {

    /*
    Get ratings for all teams
    Parameters:
      globalReport: GlobalReport
      region: Region
    */
    getRating: function(params, callback, errback) {
        return apiCall('GlobalReport.getRating', params, (callback || null), (errback || null));
    },

    /*
    Get scoreboard for all weeks within a quarter
    Parameters:
      globalReport: GlobalReport
      region: Region
    */
    getQuarterScoreboard: function(params, callback, errback) {
        return apiCall('GlobalReport.getQuarterScoreboard', params, (callback || null), (errback || null));
    },

    /*
    Get scoreboard for a single week within a quarter
    Parameters:
      globalReport: GlobalReport
      region: Region
    */
    getWeekScoreboard: function(params, callback, errback) {
        return apiCall('GlobalReport.getWeekScoreboard', params, (callback || null), (errback || null));
    },

    /*
    Get scoreboard for a single week within a quarter by center
    Parameters:
      globalReport: GlobalReport
      region: Region
      options: array
    */
    getWeekScoreboardByCenter: function(params, callback, errback) {
        return apiCall('GlobalReport.getWeekScoreboardByCenter', params, (callback || null), (errback || null));
    },

    /*
    Get the list of incoming team members by center
    Parameters:
      globalReport: GlobalReport
      region: Region
      options: array
    */
    getIncomingTeamMembersListByCenter: function(params, callback, errback) {
        return apiCall('GlobalReport.getIncomingTeamMembersListByCenter', params, (callback || null), (errback || null));
    }
};
Api.LiveScoreboard = {

    /*
    Get scores for a center
    Parameters:
      center: Center
    */
    getCurrentScores: function(params, callback, errback) {
        return apiCall('LiveScoreboard.getCurrentScores', params, (callback || null), (errback || null));
    },

    /*
    Set a single score
    Parameters:
      center: Center
      game: string
      type: string
      value: int
    */
    setScore: function(params, callback, errback) {
        return apiCall('LiveScoreboard.setScore', params, (callback || null), (errback || null));
    }
};
Api.LocalReport = {

    /*
    Get scoreboard for all weeks within a quarter
    Parameters:
      localReport: LocalReport
      options: array
    */
    getQuarterScoreboard: function(params, callback, errback) {
        return apiCall('LocalReport.getQuarterScoreboard', params, (callback || null), (errback || null));
    },

    /*
    Get scoreboard for a single week within a quarter
    Parameters:
      localReport: LocalReport
    */
    getWeekScoreboard: function(params, callback, errback) {
        return apiCall('LocalReport.getWeekScoreboard', params, (callback || null), (errback || null));
    },

    /*
    Get the list of incoming team members
    Parameters:
      localReport: LocalReport
      options: array
    */
    getIncomingTeamMembersList: function(params, callback, errback) {
        return apiCall('LocalReport.getIncomingTeamMembersList', params, (callback || null), (errback || null));
    },

    /*
    Get the list of all team members
    Parameters:
      localReport: LocalReport
    */
    getClassList: function(params, callback, errback) {
        return apiCall('LocalReport.getClassList', params, (callback || null), (errback || null));
    },

    /*
    Get the list of all team members, arranged by T1/T2 and by quarter
    Parameters:
      localReport: LocalReport
    */
    getClassListByQuarter: function(params, callback, errback) {
        return apiCall('LocalReport.getClassListByQuarter', params, (callback || null), (errback || null));
    }
};
Api.UserProfile = {

    /*
    Set locale information
    Parameters:
      locale: string
      timezone: string
    */
    setLocale: function(params, callback, errback) {
        return apiCall('UserProfile.setLocale', params, (callback || null), (errback || null));
    }
};
