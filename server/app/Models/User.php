<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;
    protected $table = 'tbl_users';
    protected $primaryKey = 'user_id';
    protected $fillable = [
        'profile_image',
        'first_name',
        'middle_name',
        'last_name',
        'suffix_name',
        'age',
        'gender',
        'contact',
        'address',
        'role_id',
        'email',
        'password',

    ];

    protected $hidden = [
        'password',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'user_id', 'user_id');
    }
}
