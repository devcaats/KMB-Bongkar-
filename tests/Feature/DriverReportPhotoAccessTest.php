<?php

namespace Tests\Feature;

use App\Models\DeliveryOrder;
use App\Models\LoadReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DriverReportPhotoAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_load_report_photo_url_uses_laravel_route_instead_of_public_storage_path(): void
    {
        $report = $this->createLoadReport();

        $this->assertSame(
            "/laporan-muat/{$report->id}/foto/required",
            $report->photo_required_url,
        );
    }

    public function test_driver_can_view_own_load_report_photo_through_laravel_route(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('reports/loads/proof.jpg', 'photo-content');

        $report = $this->createLoadReport([
            'photo_required_path' => 'reports/loads/proof.jpg',
        ]);

        $this->actingAs($report->driver)
            ->get(route('driver.muat.photo', [$report, 'required']))
            ->assertOk();
    }

    public function test_driver_cannot_view_another_driver_load_report_photo(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('reports/loads/proof.jpg', 'photo-content');

        $report = $this->createLoadReport([
            'photo_required_path' => 'reports/loads/proof.jpg',
        ]);
        $otherDriver = User::factory()->create();

        $this->actingAs($otherDriver)
            ->get(route('driver.muat.photo', [$report, 'required']))
            ->assertForbidden();
    }

    public function test_load_report_can_be_deleted_with_post_fallback_route(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('reports/loads/proof.jpg', 'photo-content');

        $report = $this->createLoadReport([
            'photo_required_path' => 'reports/loads/proof.jpg',
        ]);

        $this->actingAs($report->driver)
            ->post(route('driver.muat.destroy.post', $report))
            ->assertRedirect();

        $this->assertDatabaseMissing('load_reports', ['id' => $report->id]);
        Storage::disk('public')->assertMissing('reports/loads/proof.jpg');
    }

    private function createLoadReport(array $overrides = []): LoadReport
    {
        $driver = User::factory()->create();
        $deliveryOrder = DeliveryOrder::create([
            'driver_id' => $driver->id,
            'nomor_unit' => 'B 1234 KMB',
            'nomor_do' => 'DO-001',
            'uang_jalan' => 100000,
        ]);

        return LoadReport::create(array_merge([
            'driver_id' => $driver->id,
            'delivery_order_id' => $deliveryOrder->id,
            'load_date' => now()->toDateString(),
            'bruto' => 10000,
            'tara' => 2000,
            'netto' => 8000,
            'photo_required_path' => 'reports/loads/proof.jpg',
            'photo_optional_path' => null,
            'notes' => null,
        ], $overrides));
    }
}
