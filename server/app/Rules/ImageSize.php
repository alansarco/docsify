<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ImageSize implements Rule
{
    public function passes($attribute, $value)
    {

       // Check if the uploaded file is an image
    $isValidImage = @getimagesize($value->path());

    // Get the maximum allowed file size from your configuration or settings
    $maxFileSize = 2 * 1024 * 1024; // 2MB in bytes

    // Get the size of the image data (BLOB)
    $imageDataSize = strlen($value);

    return $isValidImage !== false && $imageDataSize < $maxFileSize;
    }

    public function message()
    {
        return 'The file must be an image and less than 100KB.';
    }
}
