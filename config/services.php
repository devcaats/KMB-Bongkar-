<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'whatsapp_bot' => [
        'base_url' => env('WHATSAPP_BOT_BASE_URL'),
        'url' => env('WHATSAPP_BOT_URL'),
        'recipient' => env('WHATSAPP_BOT_RECIPIENT'),
        'token' => env('WHATSAPP_BOT_TOKEN'),
        'number_field' => env('WHATSAPP_BOT_NUMBER_FIELD', 'number'),
        'message_field' => env('WHATSAPP_BOT_MESSAGE_FIELD', 'message'),
        'qr_url' => env('WHATSAPP_BOT_QR_URL'),
        'status_url' => env('WHATSAPP_BOT_STATUS_URL'),
        'restart_url' => env('WHATSAPP_BOT_RESTART_URL'),
        'logout_url' => env('WHATSAPP_BOT_LOGOUT_URL'),
        'events_url' => env('WHATSAPP_BOT_EVENTS_URL'),
    ],

];
