<{!! "?php" !!}
namespace TmlpStats\Providers;

///////////////////////////////
// THIS CODE IS AUTO-GENERATED
// do not edit this code by hand!
//
// To edit the resulting API code, instead edit config/reports.yml
// and then run the command:
//   php artisan reports:codegen
//
///////////////////////////////

use Illuminate\Support\ServiceProvider;
use TmlpStats\Api;

class ApiProvider extends ServiceProvider
{
    protected $defer = true;

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
@foreach ($packageNames as $package)
        $this->app->singleton(Api\{{ $package }}::class);
@endforeach
    }

    public function provides()
    {
        return [
@foreach ($packageNames as $package)
            'TmlpStats\Api\{{ $package }}',
@endforeach
        ];
    }
}
