<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoadReport extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'driver_id',
        'delivery_order_id',
        'load_date',
        'bruto',
        'tara',
        'netto',
        'photo_required_path',
        'photo_optional_path',
        'notes',
    ];

    protected $appends = [
        'photo_required_url',
        'photo_optional_url',
    ];

    public function getPhotoRequiredUrlAttribute(): ?string
    {
        return $this->photo_required_path
            ? route('driver.muat.photo', [$this, 'required'], false)
            : null;
    }

    public function getPhotoOptionalUrlAttribute(): ?string
    {
        return $this->photo_optional_path
            ? route('driver.muat.photo', [$this, 'optional'], false)
            : null;
    }

    /**
     * Get the driver that submitted the load report.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * Get the delivery order associated with the load report.
     */
    public function deliveryOrder(): BelongsTo
    {
        return $this->belongsTo(DeliveryOrder::class, 'delivery_order_id');
    }
}
