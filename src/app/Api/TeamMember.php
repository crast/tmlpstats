<?php namespace TmlpStats\Api;

use App;
use Carbon\Carbon;
use TmlpStats as Models;
use TmlpStats\Api\Base\AuthenticatedApiBase;
use TmlpStats\Domain;

/**
 * TeamMembers
 */
class TeamMember extends AuthenticatedApiBase
{
    private static $omitGitwTdo = ['tdo' => true, 'gitw' => true];

    private function relevantReport(Models\Center $center, Carbon $reportingDate)
    {
        $quarter = Models\Quarter::getQuarterByDate($reportingDate, $center->region);

        // Get the last stats report in order to pre-populate the class list effectively

        return Models\StatsReport::byCenter($center)
            ->byQuarter($quarter)
            ->official()
            ->where('reporting_date', '<=', $reportingDate)
            ->orderBy('reporting_date', 'desc')
            ->first();
    }

    public function allForCenter(Models\Center $center, Carbon $reportingDate, $includeInProgress = false)
    {

        $allTeamMembers = [];

        if ($includeInProgress) {
            $submissionData = App::make(SubmissionData::class);
            $found = $submissionData->allForType($center, $reportingDate, Domain\TeamMember::class);
            foreach ($found as $domain) {
                $allTeamMembers[$domain->id] = $domain;
                $domain->meta['localChanges'] = true;
            }
        }

        $lastReport = $this->relevantReport($center, $reportingDate);
        if ($lastReport) {
            // If the last report happens to be the same week as this week, we can include GITW/TDO.
            $includeData = ($lastReport->reportingDate->eq($reportingDate));
            $ignore = ($includeData) ? null : self::$omitGitwTdo;
            foreach (App::make(LocalReport::class)->getClassList($lastReport) as $tmd) {
                // it's a small optimization, but prevent creating domain if we have an existing SubmissionData version
                if (!array_key_exists($tmd->teamMemberId, $allTeamMembers)) {
                    $domain = Domain\TeamMember::fromModel($tmd, $tmd->teamMember, null, $ignore);
                    $allTeamMembers[$domain->id] = $domain;
                } else {
                    $allTeamMembers[$tmd->teamMemberId]->meta['hasReportData'] = true;
                }
            }
        }

        return $allTeamMembers;
    }

    public function stash(Models\Center $center, Carbon $reportingDate, array $data)
    {
        $this->assertCan('submitStats', $center);

        $submissionData = App::make(SubmissionData::class);
        $teamMemberId = array_get($data, 'id', null);
        if (is_numeric($teamMemberId)) {
            $teamMemberId = intval($teamMemberId);
        }

        if ($teamMemberId !== null && $teamMemberId > 0) {
            $application = Models\TmlpRegistration::findOrFail($teamMemberId);
            $domain = Domain\TeamMember::fromModel(null, $application);
            $domain->updateFromArray($data, ['incomingQuarter']);
        } else {
            if (!$teamMemberId) {
                $teamMemberId = $submissionData->generateId();
                $data['id'] = $teamMemberId;
            }
            $domain = Domain\TeamMember::fromArray($data);
        }
        $submissionData->store($center, $reportingDate, $domain);
    }

    public function bulkStashWeeklyReporting(Models\Center $center, Carbon $reportingDate, array $updates)
    {
        $this->assertCan('submitStats', $center);
        $submissionData = App::make(SubmissionData::class);
        $sourceData = $this->allForCenter($center, $reportingDate, true);
        foreach ($updates as $item) {
            $updatedDomain = Domain\TeamMember::fromArray($item, ['id', 'gitw', 'tdo']);
            $existing = array_get($sourceData, $updatedDomain->id, null);
            $existing->gitw = $updatedDomain->gitw;
            $existing->tdo = $updatedDomain->tdo;
            $submissionData->store($center, $reportingDate, $existing);
        }

        return [];
    }

    public function create(array $data)
    {
        $domain = Domain\TeamMember::fromArray($data, ['firstName', 'lastName', 'center', 'teamYear', 'incomingQuarter']);
        $this->assertAuthz($this->context->can('submitStats', $domain->center));

        $memberQuarterNumber = Models\TeamMember::getQuarterNumber($domain->incomingQuarter, $domain->center->region);

        $teamMember = Models\TeamMember::firstOrNew([
            'first_name' => $domain->firstName,
            'last_name' => $domain->lastName,
            'center_id' => $domain->center->id,
            'team_year' => $domain->teamYear,
            'incoming_quarter_id' => $domain->incomingQuarter->id,
            'team_quarter' => $memberQuarterNumber,
        ]);

        $teamMember->person->email = $domain->email;
        $teamMember->person->phone = $domain->phone;
        $teamMember->isReviewer = $domain->isReviewer ?: false;

        if ($teamMember->person->isDirty()) {
            $teamMember->person->save();
        }
        $teamMember->save();

        return $teamMember->load('person');
    }

    public function update(Models\TeamMember $teamMember, array $data)
    {
        $domain = Domain\TeamMember::fromArray($data);
        $this->assertAuthz($this->context->can('submitStats', $teamMember->center));

        $domain->fillModel(null, $teamMember, true);

        if ($teamMember->person->isDirty()) {
            $teamMember->person->save();
        }
        if ($teamMember->isDirty()) {
            $teamMember->save();
        }

        return $teamMember->load('person');
    }

    public function setWeekData(Models\TeamMember $teamMember, Carbon $reportingDate, array $data)
    {
        $this->assertAuthz($this->context->can('submitStats', $teamMember->person->center));

        $report = LocalReport::getStatsReport($teamMember->center, $reportingDate);

        $teamMemberData = Models\TeamMemberData::firstOrCreate([
            'team_member_id' => $teamMember->id,
            'stats_report_id' => $report->id,
        ]);

        $domain = Domain\TeamMember::fromModel($teamMemberData, $teamMember, $teamMember->person);
        $domain->clearSetValues();
        $domain->updateFromArray($data);
        $domain->fillModel($teamMemberData, $teamMember);

        if (!$teamMemberData->statsReportId) {
            $teamMemberData->statsReportId = $report->id;
        }

        if ($teamMemberData->isDirty()) {
            $teamMemberData->save();
        }

        if ($teamMember->isDirty()) {
            $teamMember->save();
        }

        return $teamMemberData->load('teamMember.person', 'teamMember.incomingQuarter', 'statsReport', 'withdrawCode');
    }
}
