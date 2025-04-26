<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountRejectEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $reject_message;

    /**
     * Create a new message instance.
     *
     * @param string $data
     */
    public function __construct($data, $reject_message)
    {
        $this->data = $data;
        $this->reject_message = $reject_message;
    }

    /**
     * Build the message.
     *
     * @return $this    
    */ 
    public function build()
    {
    return $this->subject('Account Rejected!')
        ->view('emails.account_reject')
        ->with([
            'data' => $this->data,
            'reject_message' => $this->reject_message,
        ]);
    }
}