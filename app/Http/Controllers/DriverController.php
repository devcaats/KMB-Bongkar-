<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\DeliveryOrder;
use App\Models\LoadReport;
use App\Models\UnloadReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DriverController extends Controller
{
    public function laporanMuat(): Response
    {
        $driverId = auth()->id();

        // Find reported DO IDs
        $reportedDoIds = LoadReport::where('driver_id', $driverId)
            ->pluck('delivery_order_id')
            ->toArray();

        $dos = DeliveryOrder::where('driver_id', $driverId)
            ->whereNotIn('id', $reportedDoIds)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'nomor_do', 'nomor_unit']);

        $reports = LoadReport::where('driver_id', $driverId)
            ->with('deliveryOrder')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Driver/LaporanMuat', [
            'deliveryOrders' => $dos,
            'loadReports' => $reports,
        ]);
    }

    public function storeLaporanMuat(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'do_id' => ['required', 'exists:delivery_orders,id', 'unique:load_reports,delivery_order_id'],
            'load_date' => ['required', 'date'],
            'bruto' => ['required', 'numeric', 'min:0'],
            'tara' => ['required', 'numeric', 'min:0', 'lt:bruto'],
            'photo_required' => ['required', 'file', 'image', 'max:2048'],
            'photo_optional' => ['nullable', 'file', 'image', 'max:2048'],
            'notes' => ['nullable', 'string', 'max:500'],
        ], [
            'do_id.required' => 'Nomor DO wajib dipilih.',
            'do_id.exists' => 'DO tidak valid.',
            'do_id.unique' => 'Laporan muat untuk DO ini sudah pernah dikirim.',
            'load_date.required' => 'Tanggal muat wajib diisi.',
            'load_date.date' => 'Format tanggal muat tidak valid.',
            'bruto.required' => 'Berat bruto wajib diisi.',
            'bruto.numeric' => 'Berat bruto harus berupa angka.',
            'bruto.min' => 'Berat bruto tidak boleh negatif.',
            'tara.required' => 'Berat tara wajib diisi.',
            'tara.numeric' => 'Berat tara harus berupa angka.',
            'tara.min' => 'Berat tara tidak boleh negatif.',
            'tara.lt' => 'Berat tara harus lebih kecil dari bruto.',
            'photo_required.required' => 'Foto bukti muat wajib diunggah.',
            'photo_required.image' => 'File bukti muat harus berupa gambar (jpg, png, dsb).',
            'photo_required.max' => 'Ukuran foto maksimal 2MB.',
            'photo_optional.image' => 'File tambahan harus berupa gambar (jpg, png, dsb).',
            'photo_optional.max' => 'Ukuran file tambahan maksimal 2MB.',
        ]);

        $photoRequiredPath = null;
        if ($request->hasFile('photo_required')) {
            $photoRequiredPath = $request->file('photo_required')->store('reports/loads', 'public');
        }

        $photoOptionalPath = null;
        if ($request->hasFile('photo_optional')) {
            $photoOptionalPath = $request->file('photo_optional')->store('reports/loads', 'public');
        }

        $do = DeliveryOrder::findOrFail($validated['do_id']);
        $netto = $validated['bruto'] - $validated['tara'];

        // Save load report
        LoadReport::create([
            'driver_id' => auth()->id(),
            'delivery_order_id' => $do->id,
            'load_date' => $validated['load_date'],
            'bruto' => $validated['bruto'],
            'tara' => $validated['tara'],
            'netto' => $netto,
            'photo_required_path' => $photoRequiredPath,
            'photo_optional_path' => $photoOptionalPath,
            'notes' => $validated['notes'],
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'activity' => 'Laporan Muat',
            'details' => 'Mengirim laporan muat untuk DO #'.$do->nomor_do.' ('.$do->nomor_unit.') - Bruto: '.$validated['bruto'].' kg, Tara: '.$validated['tara'].' kg, Netto: '.$netto.' kg pada '.$validated['load_date'].($photoOptionalPath ? ' (dengan file lampiran tambahan)' : ''),
        ]);

        return back()->with('success', 'Laporan muat berhasil dikirim!');
    }

    public function updateLaporanMuat(Request $request, LoadReport $loadReport): RedirectResponse
    {
        if (! $this->canAccessDriverReport($loadReport->driver_id)) {
            abort(403);
        }

        $validated = $request->validate([
            'load_date' => ['required', 'date'],
            'bruto' => ['required', 'numeric', 'min:0'],
            'tara' => ['required', 'numeric', 'min:0', 'lt:bruto'],
            'photo_required' => ['nullable', 'file', 'image', 'max:2048'],
            'photo_optional' => ['nullable', 'file', 'image', 'max:2048'],
            'notes' => ['nullable', 'string', 'max:500'],
        ], [
            'load_date.required' => 'Tanggal muat wajib diisi.',
            'load_date.date' => 'Format tanggal muat tidak valid.',
            'bruto.required' => 'Berat bruto wajib diisi.',
            'bruto.numeric' => 'Berat bruto harus berupa angka.',
            'bruto.min' => 'Berat bruto tidak boleh negatif.',
            'tara.required' => 'Berat tara wajib diisi.',
            'tara.numeric' => 'Berat tara harus berupa angka.',
            'tara.min' => 'Berat tara tidak boleh negatif.',
            'tara.lt' => 'Berat tara harus lebih kecil dari bruto.',
            'photo_required.image' => 'File bukti muat harus berupa gambar (jpg, png, dsb).',
            'photo_required.max' => 'Ukuran foto maksimal 2MB.',
            'photo_optional.image' => 'File tambahan harus berupa gambar (jpg, png, dsb).',
            'photo_optional.max' => 'Ukuran file tambahan maksimal 2MB.',
        ]);

        $updateData = [
            'load_date' => $validated['load_date'],
            'bruto' => $validated['bruto'],
            'tara' => $validated['tara'],
            'netto' => $validated['bruto'] - $validated['tara'],
            'notes' => $validated['notes'],
        ];

        // Handle required photo replacement
        if ($request->hasFile('photo_required')) {
            if ($loadReport->photo_required_path) {
                Storage::disk('public')->delete($loadReport->photo_required_path);
            }
            $updateData['photo_required_path'] = $request->file('photo_required')->store('reports/loads', 'public');
        }

        // Handle optional photo replacement
        if ($request->hasFile('photo_optional')) {
            if ($loadReport->photo_optional_path) {
                Storage::disk('public')->delete($loadReport->photo_optional_path);
            }
            $updateData['photo_optional_path'] = $request->file('photo_optional')->store('reports/loads', 'public');
        }

        $loadReport->update($updateData);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'activity' => 'Edit Laporan Muat',
            'details' => 'Mengedit laporan muat untuk DO #'.$loadReport->deliveryOrder->nomor_do.' ('.$loadReport->deliveryOrder->nomor_unit.')',
        ]);

        return back()->with('success', 'Laporan muat berhasil diperbarui!');
    }

    public function destroyLaporanMuat(LoadReport $loadReport): RedirectResponse
    {
        if (! $this->canAccessDriverReport($loadReport->driver_id)) {
            abort(403);
        }

        $doNumber = $loadReport->deliveryOrder->nomor_do;

        // Delete files from storage
        if ($loadReport->photo_required_path) {
            Storage::disk('public')->delete($loadReport->photo_required_path);
        }
        if ($loadReport->photo_optional_path) {
            Storage::disk('public')->delete($loadReport->photo_optional_path);
        }

        $loadReport->delete();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'activity' => 'Hapus Laporan Muat',
            'details' => 'Menghapus laporan muat untuk DO #'.$doNumber,
        ]);

        return back()->with('success', 'Laporan muat berhasil dihapus.');
    }

    public function showLaporanMuatPhoto(LoadReport $loadReport, string $type): StreamedResponse
    {
        if (! $this->canAccessDriverReport($loadReport->driver_id)) {
            abort(403);
        }

        $path = $this->reportPhotoPath($type, $loadReport->photo_required_path, $loadReport->photo_optional_path);

        return $this->downloadReportPhoto($path);
    }

    public function laporanBongkar(): Response
    {
        $driverId = auth()->id();

        // Only show DOs that have an existing load report (so netto muat is known)
        $reportedDoIds = LoadReport::where('driver_id', $driverId)
            ->pluck('delivery_order_id')
            ->toArray();

        // Also exclude DOs that already have an unload report
        $unloadedDoIds = UnloadReport::where('driver_id', $driverId)
            ->pluck('delivery_order_id')
            ->toArray();

        // Available DOs = have load report but NOT yet unloaded
        $dos = DeliveryOrder::where('driver_id', $driverId)
            ->whereIn('id', $reportedDoIds)
            ->whereNotIn('id', $unloadedDoIds)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'nomor_do', 'nomor_unit']);

        // Load reports to retrieve netto muat per DO (for selisih calculation)
        $loadReports = LoadReport::where('driver_id', $driverId)
            ->whereIn('delivery_order_id', $reportedDoIds)
            ->get(['delivery_order_id', 'netto']);

        $nettoMuatByDo = $loadReports->keyBy('delivery_order_id')->map(fn ($r) => $r->netto);

        // Unload reports history
        $reports = UnloadReport::where('driver_id', $driverId)
            ->with('deliveryOrder')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Driver/LaporanBongkar', [
            'deliveryOrders' => $dos,
            'nettoMuatByDo' => $nettoMuatByDo,
            'unloadReports' => $reports,
        ]);
    }

    public function storeLaporanBongkar(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'do_id' => ['required', 'exists:delivery_orders,id', 'unique:unload_reports,delivery_order_id'],
            'unload_date' => ['required', 'date'],
            'bruto' => ['required', 'numeric', 'min:0'],
            'tara' => ['required', 'numeric', 'min:0', 'lt:bruto'],
            'photo_required' => ['required', 'file', 'image', 'max:2048'],
            'photo_optional' => ['nullable', 'file', 'image', 'max:2048'],
            'notes' => ['nullable', 'string', 'max:500'],
        ], [
            'do_id.required' => 'Nomor DO wajib dipilih.',
            'do_id.exists' => 'DO tidak valid.',
            'do_id.unique' => 'Laporan bongkar untuk DO ini sudah pernah dikirim.',
            'unload_date.required' => 'Tanggal bongkar wajib diisi.',
            'unload_date.date' => 'Format tanggal bongkar tidak valid.',
            'bruto.required' => 'Berat bruto wajib diisi.',
            'bruto.numeric' => 'Berat bruto harus berupa angka.',
            'bruto.min' => 'Berat bruto tidak boleh negatif.',
            'tara.required' => 'Berat tara wajib diisi.',
            'tara.numeric' => 'Berat tara harus berupa angka.',
            'tara.min' => 'Berat tara tidak boleh negatif.',
            'tara.lt' => 'Berat tara harus lebih kecil dari bruto.',
            'photo_required.required' => 'Foto bukti bongkar wajib diunggah.',
            'photo_required.image' => 'File bukti bongkar harus berupa gambar (jpg, png, dsb).',
            'photo_required.max' => 'Ukuran foto maksimal 2MB.',
            'photo_optional.image' => 'File tambahan harus berupa gambar (jpg, png, dsb).',
            'photo_optional.max' => 'Ukuran file tambahan maksimal 2MB.',
        ]);

        $driverId = auth()->id();
        $do = DeliveryOrder::findOrFail($validated['do_id']);

        $netto = $validated['bruto'] - $validated['tara'];

        // Get netto muat from existing load report
        $loadReport = LoadReport::where('driver_id', $driverId)
            ->where('delivery_order_id', $do->id)
            ->firstOrFail();

        $selisih = $netto - $loadReport->netto;
        $statusSelisih = $selisih > 0 ? 'surplus' : ($selisih < 0 ? 'susut' : 'pas');

        $photoRequiredPath = $request->file('photo_required')->store('reports/unloads', 'public');
        $photoOptionalPath = $request->hasFile('photo_optional')
            ? $request->file('photo_optional')->store('reports/unloads', 'public')
            : null;

        UnloadReport::create([
            'driver_id' => $driverId,
            'delivery_order_id' => $do->id,
            'unload_date' => $validated['unload_date'],
            'bruto' => $validated['bruto'],
            'tara' => $validated['tara'],
            'netto' => $netto,
            'selisih' => $selisih,
            'status_selisih' => $statusSelisih,
            'photo_required_path' => $photoRequiredPath,
            'photo_optional_path' => $photoOptionalPath,
            'notes' => $validated['notes'],
        ]);

        ActivityLog::create([
            'user_id' => $driverId,
            'activity' => 'Laporan Bongkar',
            'details' => 'Mengirim laporan bongkar DO #'.$do->nomor_do.' ('.$do->nomor_unit.') - Bruto: '.$validated['bruto'].' kg, Tara: '.$validated['tara'].' kg, Netto: '.$netto.' kg, Selisih: '.($selisih >= 0 ? '+' : '').$selisih.' kg ('.$statusSelisih.')',
        ]);

        return back()->with('success', 'Laporan bongkar berhasil dikirim!');
    }

    public function updateLaporanBongkar(Request $request, UnloadReport $unloadReport): RedirectResponse
    {
        if (! $this->canAccessDriverReport($unloadReport->driver_id)) {
            abort(403);
        }

        $validated = $request->validate([
            'unload_date' => ['required', 'date'],
            'bruto' => ['required', 'numeric', 'min:0'],
            'tara' => ['required', 'numeric', 'min:0', 'lt:bruto'],
            'photo_required' => ['nullable', 'file', 'image', 'max:2048'],
            'photo_optional' => ['nullable', 'file', 'image', 'max:2048'],
            'notes' => ['nullable', 'string', 'max:500'],
        ], [
            'unload_date.required' => 'Tanggal bongkar wajib diisi.',
            'bruto.required' => 'Berat bruto wajib diisi.',
            'tara.required' => 'Berat tara wajib diisi.',
            'tara.lt' => 'Berat tara harus lebih kecil dari bruto.',
        ]);

        $netto = $validated['bruto'] - $validated['tara'];

        $loadReport = LoadReport::where('driver_id', auth()->id())
            ->where('delivery_order_id', $unloadReport->delivery_order_id)
            ->firstOrFail();

        $selisih = $netto - $loadReport->netto;
        $statusSelisih = $selisih > 0 ? 'surplus' : ($selisih < 0 ? 'susut' : 'pas');

        $updateData = [
            'unload_date' => $validated['unload_date'],
            'bruto' => $validated['bruto'],
            'tara' => $validated['tara'],
            'netto' => $netto,
            'selisih' => $selisih,
            'status_selisih' => $statusSelisih,
            'notes' => $validated['notes'],
        ];

        if ($request->hasFile('photo_required')) {
            if ($unloadReport->photo_required_path) {
                Storage::disk('public')->delete($unloadReport->photo_required_path);
            }
            $updateData['photo_required_path'] = $request->file('photo_required')->store('reports/unloads', 'public');
        }

        if ($request->hasFile('photo_optional')) {
            if ($unloadReport->photo_optional_path) {
                Storage::disk('public')->delete($unloadReport->photo_optional_path);
            }
            $updateData['photo_optional_path'] = $request->file('photo_optional')->store('reports/unloads', 'public');
        }

        $unloadReport->update($updateData);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'activity' => 'Edit Laporan Bongkar',
            'details' => 'Mengedit laporan bongkar untuk DO #'.$unloadReport->deliveryOrder->nomor_do.' ('.$unloadReport->deliveryOrder->nomor_unit.')',
        ]);

        return back()->with('success', 'Laporan bongkar berhasil diperbarui!');
    }

    public function destroyLaporanBongkar(UnloadReport $unloadReport): RedirectResponse
    {
        if (! $this->canAccessDriverReport($unloadReport->driver_id)) {
            abort(403);
        }

        $doNumber = $unloadReport->deliveryOrder->nomor_do;

        if ($unloadReport->photo_required_path) {
            Storage::disk('public')->delete($unloadReport->photo_required_path);
        }
        if ($unloadReport->photo_optional_path) {
            Storage::disk('public')->delete($unloadReport->photo_optional_path);
        }

        $unloadReport->delete();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'activity' => 'Hapus Laporan Bongkar',
            'details' => 'Menghapus laporan bongkar untuk DO #'.$doNumber,
        ]);

        return back()->with('success', 'Laporan bongkar berhasil dihapus.');
    }

    public function showLaporanBongkarPhoto(UnloadReport $unloadReport, string $type): StreamedResponse
    {
        if (! $this->canAccessDriverReport($unloadReport->driver_id)) {
            abort(403);
        }

        $path = $this->reportPhotoPath($type, $unloadReport->photo_required_path, $unloadReport->photo_optional_path);

        return $this->downloadReportPhoto($path);
    }

    public function maintenanceUnit(): Response
    {
        return Inertia::render('Driver/MaintenanceUnit');
    }

    public function storeMaintenanceUnit(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'unit_plate' => ['required', 'string', 'max:20'],
            'type' => ['required', 'string', 'max:50'],
            'description' => ['required', 'string', 'max:1000'],
            'priority' => ['required', 'string', 'in:Normal,Urgent'],
        ], [
            'unit_plate.required' => 'Plat nomor / unit wajib diisi.',
            'type.required' => 'Jenis maintenance wajib dipilih.',
            'description.required' => 'Detail/deskripsi masalah wajib diisi.',
            'priority.required' => 'Prioritas wajib dipilih.',
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'activity' => 'Laporan Maintenance',
            'details' => 'Melaporkan maintenance unit '.$validated['unit_plate'].' ('.$validated['type'].', Prioritas: '.$validated['priority'].'): '.$validated['description'],
        ]);

        return back()->with('success', 'Laporan maintenance berhasil dikirim!');
    }

    private function reportPhotoPath(string $type, ?string $requiredPath, ?string $optionalPath): string
    {
        $path = match ($type) {
            'required' => $requiredPath,
            'optional' => $optionalPath,
            default => null,
        };

        abort_if(blank($path), 404);

        return $path;
    }

    private function canAccessDriverReport(int|string|null $driverId): bool
    {
        $user = auth()->user();

        if (! $user) {
            return false;
        }

        $role = strtolower(trim((string) $user->role));

        if (filled($role) && $role !== 'driver') {
            return true;
        }

        return (int) $driverId === (int) $user->id;
    }

    private function downloadReportPhoto(string $path): StreamedResponse
    {
        abort_unless(Storage::disk('public')->exists($path), 404);

        return Storage::disk('public')->response($path, null, [
            'Cache-Control' => 'private, max-age=3600',
        ]);
    }
}
