<?php
/**
 * Plugin Name:  CheapAirlineTickets Headless
 * Description:  Registers Deal, Destination, and Testimonial CPTs + exposes
 *               their meta to the WP REST API for the Next.js frontend.
 * Version:      1.0.0
 * Author:       Bitsol Marketing
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ── Register Custom Post Types ─────────────────────────────────────────────────

add_action( 'init', 'cat_register_cpts' );
function cat_register_cpts() {

    // Deal
    register_post_type( 'deal', [
        'labels'       => [ 'name' => 'Deals', 'singular_name' => 'Deal', 'add_new_item' => 'Add New Deal' ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_rest' => true,   // required for REST API
        'rest_base'    => 'deal',
        'supports'     => [ 'title', 'custom-fields' ],
        'menu_icon'    => 'dashicons-tickets-alt',
        'menu_position'=> 5,
    ] );

    // Destination
    register_post_type( 'destination', [
        'labels'       => [ 'name' => 'Destinations', 'singular_name' => 'Destination', 'add_new_item' => 'Add New Destination' ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_rest' => true,
        'rest_base'    => 'destination',
        'supports'     => [ 'title', 'thumbnail', 'custom-fields' ],
        'menu_icon'    => 'dashicons-location-alt',
        'menu_position'=> 6,
    ] );

    // Testimonial
    register_post_type( 'testimonial', [
        'labels'       => [ 'name' => 'Testimonials', 'singular_name' => 'Testimonial', 'add_new_item' => 'Add New Testimonial' ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_rest' => true,
        'rest_base'    => 'testimonial',
        'supports'     => [ 'title', 'editor', 'custom-fields' ],
        'menu_icon'    => 'dashicons-format-quote',
        'menu_position'=> 7,
    ] );
}

// ── Register Meta Fields (expose to REST API) ──────────────────────────────────

add_action( 'init', 'cat_register_meta' );
function cat_register_meta() {
    $str = [ 'type' => 'string', 'single' => true, 'show_in_rest' => true ];

    // Deal fields
    // post_title = route  e.g. "NYC → LAX"
    foreach ( [ 'price', 'airline' ] as $key ) {
        register_post_meta( 'deal', $key, $str );
    }

    // Destination fields
    // post_title   = city name
    // Featured Image = destination photo (set via Media Library)
    foreach ( [ 'code', 'country', 'price_from', 'emoji', 'accent_color', 'tag', 'gradient_from', 'gradient_to' ] as $key ) {
        register_post_meta( 'destination', $key, $str );
    }

    // Testimonial fields
    // post_title   = reviewer name
    // post_content = review text
    foreach ( [ 'location', 'rating', 'route', 'savings', 'avatar', 'color' ] as $key ) {
        register_post_meta( 'testimonial', $key, $str );
    }
}

// ── CORS — allow Next.js to call wp-json from any origin ──────────────────────

add_action( 'rest_api_init', 'cat_cors_headers', 15 );
function cat_cors_headers() {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', function ( $served, $result, $request, $server ) {
        $origin  = get_http_origin();
        $allowed = [
            'https://cheapairlinetickets.us',
            'http://localhost:3000',
        ];
        if ( in_array( $origin, $allowed, true ) ) {
            header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
            header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
            header( 'Access-Control-Allow-Credentials: true' );
        }
        return $served;
    }, 10, 4 );
}

// ── Flush rewrite rules on activation ─────────────────────────────────────────

register_activation_hook( __FILE__, function () {
    cat_register_cpts();
    flush_rewrite_rules();
} );
register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
