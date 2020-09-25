
<?php
/**
 * This file contains all the routes for the project
 */

use App\Api\Router;

Router::group(['namespace' => '\App\Api\Controllers'/*, 'exceptionHandler' => \Demo\Handlers\CustomExceptionHandler::class*/], function () {
	Router::group(['middleware' => \App\Api\Middlewares\RequestValidation::class], function () {
        Router::resource('/field', 'FieldController');
        Router::resource('/subscribers', 'SubscriberController');
    
        Router::get('/subscriber/{id}/fields', 'SubscriberController@getFields');
        Router::post('/subscriber/{id}/fields', 'SubscriberController@addField');
        Router::delete('/subscriber/{id}/fields/{field_id}', 'SubscriberController@deleteField');
	});
});
