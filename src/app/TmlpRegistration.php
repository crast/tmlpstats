<?php
namespace TmlpStats;

use Eloquence\Database\Traits\CamelCaseModel;
use Illuminate\Database\Eloquent\Model;
use TmlpStats\Traits\CachedRelationships;

class TmlpRegistration extends Model
{
    use CamelCaseModel, CachedRelationships;

    protected $fillable = [
        'person_id',
        'team_year',
        'reg_date',
        'is_reviewer',
    ];

    protected $dates = [
        'reg_date',
    ];

    protected $casts = [
        'is_reviewer' => 'boolean',
    ];

    public function __get($name)
    {
        switch ($name) {
            case 'firstName':
            case 'lastName':
            case 'fullName':
            case 'shortName':
            case 'center':
                return $this->person->$name;
            default:
                return parent::__get($name);
        }
    }

    public static function firstOrNew(array $attributes)
    {
        $regDateString = $attributes['reg_date']->toDateString();

        $identifier = "r:{$regDateString}:{$attributes['team_year']}";

        $people = Person::where('center_id', $attributes['center_id'])
            ->where('first_name', $attributes['first_name'])
            ->where('last_name', $attributes['last_name'])
            ->get();

        $person = null;
        if ($people->count() > 1) {
            $person = $people->where('identifier', $identifier)->first();

            if (!$person) {
                // Maybe they withdrew and changed reg dates
                $searchIdentifier = "r:%:{$attributes['team_year']}";
                $person = $people->where('identifier', 'like', $searchIdentifier)->first();
                if ($person) {
                    $person->identifier = $identifier;
                    $person->save();
                }
            }
        }

        // If there was only one, or if we couldn't find them by now, just grab the first one
        if (!$person && !$people->isEmpty()) {
            $person = $people->first();

            // Fix for when people withdraw to change quarters
            if ($people->count() == 1 && $person->identifier != $identifier) {
                $person->identifier = $identifier;
                $person->save();
            }
        }

        // If we couldnt find anyone with that name, create a new person
        if (!$person) {
            $person = Person::create([
                'center_id' => $attributes['center_id'],
                'first_name' => $attributes['first_name'],
                'last_name' => $attributes['last_name'],
                'identifier' => $identifier,
            ]);
        } else if ($person->identifier != $identifier) {

            // Only update it on the first week of the quarter. Otherwise, they should be done intentionally.
            $center = static::getFromCache('center', $attributes['center_id'], function () use ($attributes) {
                return Center::find($attributes['center_id']);
            });

            if (Quarter::isFirstWeek($center->region)) {
                $person->identifier = $identifier;
            }
        }

        if (isset($attributes['email'])) {
            $person->email = $attributes['email'];
        }

        if (isset($attributes['phone'])) {
            $person->phone = $attributes['phone'];
        }

        if ($person->isDirty()) {
            $person->save();
        }

        // TODO: FIXME
        // No idea why I have to do this, but it was breaking because parent::firstOfNew
        // was actually re-calling this method
        $attributes = [
            'reg_date' => $attributes['reg_date'],
            'team_year' => $attributes['team_year'],
            'person_id' => $person->id,
        ];

        if (!is_null($instance = (new static())->newQueryWithoutScopes()->where($attributes)->first())) {
            return $instance;
        }

        return new static($attributes);
        //return parent::firstOrNew([
        //    'reg_date'  => $attributes['reg_date'],
        //    'team_year' => $attributes['team_year'],
        //    'person_id' => $person->id,
        //]);
    }

    public function scopeTeamYear($query, $teamYear)
    {
        return $query->whereTeamYear($teamYear);
    }

    public function scopeIncomingQuarter($query, $quarter)
    {
        return $query->whereIncomingQuarterId($quarter->id);
    }

    public function scopeReviewer($query, $reviewer = true)
    {
        return $query->whereIsReviewer($reviewer);
    }

    public function scopeByPerson($query, Person $person)
    {
        return $query->wherePersonId($person->id);
    }

    public function person()
    {
        return $this->belongsTo('TmlpStats\Person');
    }

    public function incomingQuarter()
    {
        return $this->belongsTo('TmlpStats\Quarter', 'id', 'incoming_quarter_id');
    }

    public function registrationData()
    {
        return $this->hasMany('TmlpStats\TmlpRegistrationData');
    }
}
