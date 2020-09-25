<?php
// define application's directories
define('PUBLIC_DIR', dirname(__FILE__) .'/');
define('ROOT_DIR', dirname(PUBLIC_DIR) .'/');

chdir(ROOT_DIR);

// setup class autoloading
require ROOT_DIR . 'vendor/autoload.php';

use App\Api\Router;
use App\Domain\Factory\RequestFactory;
use Symfony\Component\Dotenv\Dotenv;
use DI\ContainerBuilder;
use App\Storage\Mysql;
use App\Domain\Repository\{
    FieldsRepository,
    FieldsRepositoryInterface,
    SubscribersRepository,
    SubscribersRepositoryInterface,
    SubscriberFieldsRepository,
    SubscriberFieldsRepositoryInterface
};

$dotenv = new Dotenv();
$dotenv->load(ROOT_DIR.'/.env');

if (isset($_ENV['APP_ENV']) && $_ENV['APP_ENV'] === 'devel') {
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
}

$builder = new ContainerBuilder();

$builder->addDefinitions(
    [
        FieldsRepositoryInterface::class => DI\get(FieldsRepository::class),
        SubscribersRepositoryInterface::class => DI\get(SubscribersRepository::class),
        SubscriberFieldsRepositoryInterface::class => DI\get(SubscriberFieldsRepository::class),
    ]
);

$container = $builder->useAutowiring(true)->build();

Router::enableDependencyInjection($container);

Router::start();

