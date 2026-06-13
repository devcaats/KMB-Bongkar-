<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;
use RuntimeException;
use Tests\TestCase;

class ServerErrorPageTest extends TestCase
{
    public function test_server_errors_render_the_inertia_500_page_when_debug_is_disabled(): void
    {
        config(['app.debug' => false]);

        Route::get('/test-server-error', function () {
            throw new RuntimeException('Test server error.');
        });

        $this->get('/test-server-error')
            ->assertStatus(500)
            ->assertInertia(fn (Assert $page) => $page->component('Errors/ServerError'));
    }
}
