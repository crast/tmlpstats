//// THIS FILE IS AUTOMATICALLY GENERATED!
//// DO NOT EDIT BY HAND!

/* eslint-disable */
const GlobalReport = {
    "root": [
        "WeeklySummaryGroup",
        "RegionalStatsGroup",
        "GameEffectivenessGroup",
        "ApplicationsGroup",
        "CoursesGroup",
        "TeamMemberStatusGroup",
        "WeekendGroup"
    ],
    "children": {
        "RatingSummary": {
            "id": "RatingSummary",
            "n": 0,
            "type": "report",
            "name": "Ratings"
        },
        "RegionSummary": {
            "id": "RegionSummary",
            "n": 1,
            "type": "report",
            "name": "At A Glance"
        },
        "CenterStatsReports": {
            "id": "CenterStatsReports",
            "n": 2,
            "type": "report",
            "name": "Center Reports"
        },
        "WeeklySummaryGroup": {
            "id": "WeeklySummaryGroup",
            "n": 3,
            "type": "grouping",
            "name": "Weekly Summary",
            "shortName": "Summary",
            "children": [
                "RatingSummary",
                "RegionSummary",
                "CenterStatsReports"
            ]
        },
        "RegionalStats": {
            "id": "RegionalStats",
            "n": 4,
            "type": "report",
            "name": "Scoreboard"
        },
        "GamesByCenter": {
            "id": "GamesByCenter",
            "n": 5,
            "type": "report",
            "name": "By Center"
        },
        "RepromisesByCenter": {
            "id": "RepromisesByCenter",
            "n": 6,
            "type": "report",
            "name": "Repromises"
        },
        "RegPerParticipantWeekly": {
            "id": "RegPerParticipantWeekly",
            "n": 7,
            "type": "report",
            "name": "Reg. Per Participant"
        },
        "Gaps": {
            "id": "Gaps",
            "n": 8,
            "type": "report",
            "name": "Gaps"
        },
        "RegionalStatsGroup": {
            "id": "RegionalStatsGroup",
            "n": 9,
            "type": "grouping",
            "name": "Regional Games",
            "shortName": "Games",
            "children": [
                "RegionalStats",
                "GamesByCenter",
                "RepromisesByCenter",
                "RegPerParticipantWeekly",
                "Gaps"
            ]
        },
        "AccessToPowerEffectiveness": {
            "id": "AccessToPowerEffectiveness",
            "n": 10,
            "type": "report",
            "name": "CAP"
        },
        "PowerToCreateEffectiveness": {
            "id": "PowerToCreateEffectiveness",
            "n": 11,
            "type": "report",
            "name": "CPC"
        },
        "Team1ExpansionEffectiveness": {
            "id": "Team1ExpansionEffectiveness",
            "n": 12,
            "type": "report",
            "name": "T1X"
        },
        "Team2ExpansionEffectiveness": {
            "id": "Team2ExpansionEffectiveness",
            "n": 13,
            "type": "report",
            "name": "T2X"
        },
        "GameInTheWorldEffectiveness": {
            "id": "GameInTheWorldEffectiveness",
            "n": 14,
            "type": "report",
            "name": "GITW"
        },
        "LandmarkForumEffectiveness": {
            "id": "LandmarkForumEffectiveness",
            "n": 15,
            "type": "report",
            "name": "LF"
        },
        "GameEffectivenessGroup": {
            "id": "GameEffectivenessGroup",
            "n": 16,
            "type": "grouping",
            "name": "Games Effectiveness",
            "shortName": "Effectiveness",
            "children": [
                "AccessToPowerEffectiveness",
                "PowerToCreateEffectiveness",
                "Team1ExpansionEffectiveness",
                "Team2ExpansionEffectiveness",
                "GameInTheWorldEffectiveness",
                "LandmarkForumEffectiveness"
            ]
        },
        "TmlpRegistrationsOverview": {
            "id": "TmlpRegistrationsOverview",
            "n": 17,
            "type": "report",
            "name": "Overview"
        },
        "TmlpRegistrationsByStatus": {
            "id": "TmlpRegistrationsByStatus",
            "n": 18,
            "type": "report",
            "name": "By Status"
        },
        "TmlpRegistrationsByCenter": {
            "id": "TmlpRegistrationsByCenter",
            "n": 19,
            "type": "report",
            "name": "By Center"
        },
        "Team2RegisteredAtWeekend": {
            "id": "Team2RegisteredAtWeekend",
            "n": 20,
            "type": "report",
            "name": "T2 Reg. At Weekend"
        },
        "TmlpRegistrationsOverdue": {
            "id": "TmlpRegistrationsOverdue",
            "n": 21,
            "type": "report",
            "name": "Overdue"
        },
        "ApplicationsGroup": {
            "id": "ApplicationsGroup",
            "n": 22,
            "type": "grouping",
            "name": "Applications",
            "children": [
                "TmlpRegistrationsOverview",
                "TmlpRegistrationsByStatus",
                "TmlpRegistrationsByCenter",
                "Team2RegisteredAtWeekend",
                "TmlpRegistrationsOverdue"
            ]
        },
        "CoursesThisWeek": {
            "id": "CoursesThisWeek",
            "n": 23,
            "type": "report",
            "name": "Completed This Week"
        },
        "CoursesNextMonth": {
            "id": "CoursesNextMonth",
            "n": 24,
            "type": "report",
            "name": "Next 5 Weeks"
        },
        "CoursesUpcoming": {
            "id": "CoursesUpcoming",
            "n": 25,
            "type": "report",
            "name": "Upcoming"
        },
        "CoursesCompleted": {
            "id": "CoursesCompleted",
            "n": 26,
            "type": "report",
            "name": "Completed"
        },
        "CoursesGuestGames": {
            "id": "CoursesGuestGames",
            "n": 27,
            "type": "report",
            "name": "Guest Games"
        },
        "CoursesSummary": {
            "id": "CoursesSummary",
            "n": 28,
            "type": "report",
            "name": "Summary"
        },
        "CoursesGroup": {
            "id": "CoursesGroup",
            "n": 29,
            "type": "grouping",
            "name": "Courses",
            "children": [
                "CoursesThisWeek",
                "CoursesNextMonth",
                "CoursesUpcoming",
                "CoursesCompleted",
                "CoursesGuestGames",
                "CoursesSummary"
            ]
        },
        "TdoSummary": {
            "id": "TdoSummary",
            "n": 30,
            "type": "report",
            "name": "Training & Development",
            "shortName": "TDO"
        },
        "GitwSummary": {
            "id": "GitwSummary",
            "n": 31,
            "type": "report",
            "name": "GITW",
            "shortName": "GITW"
        },
        "TeamMemberStatusCtw": {
            "id": "TeamMemberStatusCtw",
            "n": 32,
            "type": "report",
            "name": "CTW"
        },
        "TeamMemberStatusTransfer": {
            "id": "TeamMemberStatusTransfer",
            "n": 33,
            "type": "report",
            "name": "Transfers"
        },
        "TeamMemberStatusWithdrawn": {
            "id": "TeamMemberStatusWithdrawn",
            "n": 34,
            "type": "report",
            "name": "Withdrawn"
        },
        "WithdrawReport": {
            "id": "WithdrawReport",
            "n": 35,
            "type": "report",
            "name": "Withdraw Compliance"
        },
        "TeamMemberStatusGroup": {
            "id": "TeamMemberStatusGroup",
            "n": 36,
            "type": "grouping",
            "name": "Team Members",
            "children": [
                "TdoSummary",
                "GitwSummary",
                "TeamMemberStatusCtw",
                "TeamMemberStatusTransfer",
                "TeamMemberStatusWithdrawn",
                "WithdrawReport"
            ]
        },
        "TravelReport": {
            "id": "TravelReport",
            "n": 37,
            "type": "report",
            "name": "Travel Summary"
        },
        "TeamMemberStatusPotentialsOverview": {
            "id": "TeamMemberStatusPotentialsOverview",
            "n": 38,
            "type": "report",
            "name": "Potentials Overview"
        },
        "TeamMemberStatusPotentials": {
            "id": "TeamMemberStatusPotentials",
            "n": 39,
            "type": "report",
            "name": "Potentials Details"
        },
        "WeekendGroup": {
            "id": "WeekendGroup",
            "n": 40,
            "type": "grouping",
            "name": "Weekend",
            "children": [
                "TravelReport",
                "TeamMemberStatusPotentialsOverview",
                "TeamMemberStatusPotentials"
            ]
        }
    }
}
/* eslint-enable */


const Reports = {
    Global: GlobalReport
}

export default Reports
