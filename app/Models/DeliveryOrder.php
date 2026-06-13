<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeliveryOrder extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'driver_id',
        'nomor_unit',
        'nomor_do',
        'uang_jalan',
    ];

    /**
     * Get the driver that owns the delivery order.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * Get the load report associated with the delivery order.
     */
    public function loadReport(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(LoadReport::class, 'delivery_order_id');
    }

    /**
     * Get the unload report associated with the delivery order.
     */
    public function unloadReport(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(UnloadReport::class, 'delivery_order_id');
    }
}
