<?php
namespace TmlpStats\Domain;

use App;
use Carbon\Carbon;
use TmlpStats as Models;
use TmlpStats\Api;
use TmlpStats\Traits\ParsesQuarterDates;

class ReportDeadlines
{
    use ParsesQuarterDates;

    protected $context;
    protected $center;
    protected $quarter;
    protected $reportingDate = null;
    protected $allSettings = null;

    public function __construct(Models\Center $center, Models\Quarter $quarter, Api\Context $context = null)
    {
        $this->center = $center;
        $this->quarter = $quarter;
        $this->context = $context ?: App::make(Api\Context::class);
    }

    /**
     * Parse the setting object and merge with defaults
     *
     * @return array
     * @throws \Exception
     */
    public function parseFromArray($settings)
    {
        $this->allSettings = [];
        if ($settings) {
            foreach ($settings as $dateInfo) {
                if (!isset($dateInfo['reportingDate'])) {
                    throw new \Exception("Missing reportingDate in setting {$this->setting->id}");
                }
                $deadlines = [
                    'report' => [
                        'dueDate' => '+0days',
                        'time' => '19:00:59',
                        'timezone' => $this->center->timezone,
                    ],
                    'response' => [
                        'dueDate' => '+1days',
                        'time' => '10:00:00',
                        'timezone' => $this->center->timezone,
                    ],
                ];

                $reportingDate = $this->parseQuarterDate($dateInfo['reportingDate']);
                $deadlines = $this->mergeSettings($deadlines, $dateInfo);
                $this->allSettings[$reportingDate->toDateString()] = $deadlines;
            }
        }
    }

    public function getWeek(Carbon $reportingDate)
    {
        if ($this->allSettings === null) {
            $this->parseFromArray($this->context->getSetting('reportDeadlines', $this->center, $this->quarter));
        }
        $this->reportingDate = $reportingDate;
        $deadlines = array_get($this->allSettings, $reportingDate->toDateString());
        if ($deadlines === null) {
            $deadlines = [];

        }

        return $this->prepareResults($deadlines);
    }

    /**
     * Merge the updated settings with the default values
     *
     * The settings override the defaults
     *
     * @param $defaults
     * @param $settings
     *
     * @return mixed
     */
    protected function mergeSettings($defaults, $settings)
    {
        foreach (['report', 'response'] as $type) {
            if (!isset($settings[$type]) || !$settings[$type]) {
                unset($defaults[$type]);
                continue;
            }

            $setting = $settings[$type];

            if (isset($setting['dueDate'])) {
                $defaults[$type]['dueDate'] = $setting['dueDate'];
            }
            if (isset($setting['time'])) {
                $defaults[$type]['time'] = $setting['time'];
            }
            if (isset($setting['timezone'])) {
                $defaults[$type]['timezone'] = $setting['timezone'];
            }
        }

        return $defaults;
    }

    /**
     * Parse the dueDate field.
     *
     * Values can be any of the following:
     *     +0days, +1day, +2days, etc
     *     An actual date in string format. e.g. 2015-12-31
     *
     * @param $settingValue
     *
     * @return null|static
     * @throws \Exception
     */
    protected function parseDueDate($settingValue)
    {
        if (preg_match('/^\+(\d+)days?$/', $settingValue, $matches)) {
            $offsetDays = $matches[1];
            $dueDate = $this->reportingDate->copy();

            return $dueDate->addDays($offsetDays);
        }

        if (preg_match('/^\d\d\d\d-\d\d-\d\d$/', $settingValue)) {
            return Carbon::parse($settingValue);
        }

        $blame = $this->setting ? "setting {$this->setting->id}" : 'default';
        throw new \Exception("Invalid report dueDate format in {$blame}: {$settingValue}");
    }

    /**
     * Parse the time field.
     *
     * Values must be in the following 24 hour format
     *     01:01:01, 12:00:00, 23:59:59, etc
     *
     * @param $settingValue
     *
     * @return null
     * @throws \Exception
     */
    protected function parseTime($settingValue)
    {
        if (!preg_match('/^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/', $settingValue)) {
            $blame = $this->setting ? "setting {$this->setting->id}" : 'default';
            throw new \Exception("Invalid report time format in {$blame}: {$settingValue}");
        }

        return $settingValue;
    }

    /**
     * Convert prepared settings arrays into date objects
     *
     * @param $results
     *
     * @return array
     * @throws \Exception
     */
    protected function prepareResults($results)
    {
        $response = [
            'report' => null,
            'response' => null,
        ];

        foreach (['report', 'response'] as $type) {
            if (!isset($results[$type]) || !$results[$type]) {
                continue;
            }

            $deadline = $results[$type];

            $dueDate = $this->parseDueDate($deadline['dueDate']);
            $time = $this->parseTime($deadline['time']);
            $timezone = $deadline['timezone'];

            $dateString = $dueDate->toDateString();
            $response[$type] = Carbon::parse(
                "{$dateString} {$time}",
                $timezone
            );
        }

        return $response;
    }

    public static function get(Models\Center $center, Models\Quarter $quarter, $reportingDate = null)
    {
        return App::make(Api\Context::class)
            ->getEncapsulation(self::class, compact('center', 'quarter'))
            ->getWeek($reportingDate);
    }
}
