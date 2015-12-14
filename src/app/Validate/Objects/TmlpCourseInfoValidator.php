<?php
namespace TmlpStats\Validate\Objects;

use TmlpStats\Import\Xlsx\ImportDocument\ImportDocument;
use Respect\Validation\Validator as v;

class TmlpCourseInfoValidator extends ObjectsValidatorAbstract
{
    protected $sheetId = ImportDocument::TAB_COURSES;

    protected function populateValidators($data)
    {
        $positiveIntValidator        = v::int()->min(0, true);
        $positiveIntNotNullValidator = v::when(v::nullValue(), v::alwaysInvalid(), $positiveIntValidator);

        $types = [
            'Incoming T1',
            'Future T1',
            'Incoming T2',
            'Future T2',
        ];

        $this->dataValidators['type']                   = v::in($types);
        $this->dataValidators['quarterStartRegistered'] = $positiveIntNotNullValidator;
        $this->dataValidators['quarterStartApproved']   = $positiveIntNotNullValidator;
    }

    protected function validate($data)
    {
        if (!$this->validateQuarterStartValues($data)) {
            $this->isValid = false;
        }

        return $this->isValid;
    }

    public function validateQuarterStartValues($data)
    {
        $isValid = true;

        if ($data->quarterStartApproved > $data->quarterStartRegistered) {
            $this->addMessage('TMLPCOURSE_QSTART_TER_LESS_THAN_QSTART_APPROVED');
            $isValid = false;
        }

        return $isValid;
    }
}
