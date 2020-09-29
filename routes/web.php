
<?php
/**
 * This file contains all the routes for the project
 */

use App\Api\Router;

Router::group(['namespace' => '\App\Api\Controllers'], function () {
	Router::group(['middleware' => \App\Api\Middlewares\RequestValidation::class], function () {
                Router::resource('/field', 'FieldController');
                Router::resource('/subscribers', 'SubscriberController');
        
                Router::options('/subscriber/{id}/fields', 'SubscriberController@getFields');
                Router::get('/subscriber/{id}/fields', 'SubscriberController@getFields');
                Router::options('/subscriber/{id}/availableFields', 'SubscriberController@getAvailableFields');
                Router::get('/subscriber/{id}/availableFields', 'SubscriberController@getAvailableFields');
                Router::options('subscriber/count', 'SubscriberController@getNumberOfRecords');
                Router::get('subscriber/count', 'SubscriberController@getNumberOfRecords');
                Router::post('/subscriber/{id}/fields', 'SubscriberController@addField');
                Router::options('/subscriber/{id}/fields/{field_id}', 'SubscriberController@deleteField');
                Router::delete('/subscriber/{id}/fields/{field_id}', 'SubscriberController@deleteField');
	});
});
