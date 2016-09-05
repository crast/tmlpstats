<?php
namespace TmlpStats\Api;

use App;
use Carbon\Carbon;
use TmlpStats as Models;
use TmlpStats\Api\Base\AuthenticatedApiBase;
use TmlpStats\Api\Exceptions;

class SubmissionCore extends AuthenticatedApiBase
{
    /**
     * Initialize a submission, checking if parameters are valid.
     * @param  Models\Center $center        [description]
     * @param  Carbon        $reportingDate [description]
     * @return [type]                       [description]
     */
    public function initSubmission(Models\Center $center, Carbon $reportingDate)
    {
        $this->checkCenterDate($center, $reportingDate);

        $localReport = App::make(LocalReport::class);
        $rq = $this->reportAndQuarter($center, $reportingDate);

        $lastValidReport = $rq['report'];
        $quarter = $rq['quarter'];

        if ($lastValidReport === null) {
            $team_members = [];
        } else {
            $team_members = $localReport->getClassList($lastValidReport);
        }

        // Get values for lookups
        $withdraw_codes = Models\WithdrawCode::get();
        $validRegQuarters = App::make(Application::class)->validRegistrationQuarters($center, $reportingDate, $quarter);

        return [
            'success' => true,
            'id' => $center->id,
            'validRegQuarters' => $validRegQuarters,
            'lookups' => compact('withdraw_codes', 'team_members', 'center'),
        ];
    }

    public function checkCenterDate(Models\Center $center, Carbon $reportingDate)
    {
        if ($reportingDate->dayOfWeek !== Carbon::FRIDAY) {
            throw new Exceptions\BadRequestException('Reporting date must be a Friday.');
        }

        // TODO check reporting date is in this center's quarter and so on.

        return ['success' => true];
    }

    /**
     * Do the very common lookup of getting the last stats report and the quarter for a given
     * center-reportingdate pair.
     *
     * In the case there is no official report on dates before the given reportingDate,
     * (this happens on the first weekly submission) the report will be null.
     *
     * @param  Models\Center $center        The center we're getting the statsReport from
     * @param  Carbon        $reportingDate The reporting date of a stats report.
     * @return array[report, quarter]       An associative array with keys report and quarter
     */
    public function reportAndQuarter(Models\Center $center, Carbon $reportingDate)
    {
        $report = App::make(LocalReport::class)->getLastStatsReportSince($center, $reportingDate);
        if ($report === null) {
            $quarter = Models\Quarter::getQuarterByDate($reportingDate, $center->region);
        } else {
            $quarter = $report->quarter;
        }

        return compact('report', 'quarter');
    }
}
