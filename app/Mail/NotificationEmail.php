<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $greeting;
    public $message;
    public $alertType;
    public $content;
    public $actionUrl;
    public $actionText;
    public $additionalInfo;
    public $closing;
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct(
        string $subject,
        array $data = [],
        $user = null
    ) {
        $this->subject = $subject;
        $this->greeting = $data['greeting'] ?? null;
        $this->message = $data['message'] ?? null;
        $this->alertType = $data['alertType'] ?? 'info';
        $this->content = $data['content'] ?? null;
        $this->actionUrl = $data['actionUrl'] ?? null;
        $this->actionText = $data['actionText'] ?? null;
        $this->additionalInfo = $data['additionalInfo'] ?? null;
        $this->closing = $data['closing'] ?? null;
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notification',
            with: [
                'subject' => $this->subject,
                'greeting' => $this->greeting,
                'message' => $this->message,
                'alertType' => $this->alertType,
                'content' => $this->content,
                'actionUrl' => $this->actionUrl,
                'actionText' => $this->actionText,
                'additionalInfo' => $this->additionalInfo,
                'closing' => $this->closing,
                'user' => $this->user,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}