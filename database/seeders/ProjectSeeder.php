<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        DB::connection('mongodb')->table('projects')->insert([

            [
                'builder_id' => "69d3992fcf4df026b8085d70",

                'category_ids' => [],
                'amenity_ids' => [
                    "69d353a77e25af7e08073ff5",
                    "69d353627e25af7e08073ff4"
                ],
                'tower_ids' => [],

                'name' => "Devkunj 80",
                'slug' => "devkunj-80",
                'project_type' => "Premium",

                'description' => "Devkunj 80",
                'short_description' => "Devkunj 80",

                'address' => "Ahmedabad",
                'state_id' => "69d352ca16c1eb596c001e5b",
                'city_id' => "69d352cc16c1eb596c001e71",
                'area_id' => "69d352cf16c1eb596c001e7b",

                'pincode' => "385573",

                'latitude' => "12345678",
                'longitude' => "12345678",

                'rera_number' => "rera",

                'possession_date' => now(),
                'launch_date' => now(),

                'project_status' => "upcoming",

                'cover_image_url' => "https://images.keyarea1.com/Ahmedabad_Property/03_Devkunj_Brochure_RERA/70.jpg",

                'gallery_images_url' => [],
                'floorPlans_images_url' => [],
                'slider_image_url' => [],

                'brochure_url' => "https://images.keyarea1.com/Ahmedabad_Property/03_Devkunj_Brochure_RERA/70.jpg",
                'reel_url' => "https://images.keyarea1.com/Ahmedabad_Property/03_Devkunj_Brochure_RERA/70.jpg",

                'price' => "80 lca",
                'carpet_area' => "1200 sq.ft",

                'total_units' => 14,
                'total_towers' => 1,

                'meta_title' => "Devkunj 80",
                'meta_description' => "Devkunj 80",
                'meta_keywords' => "Devkunj 80",

                'meta_data' => [],

                'is_featured' => true,
                'is_emerging_property' => true,
                'is_emerging_area' => true,
                'is_new_launch' => true,
                'is_trending' => true,

                'display_order' => null,
                'status' => true,

                'property_type_ids' => [

                ],
                'unit_type_ids' => [

                ],

                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'builder_id' => "69d4d78ed926ff5f08009623",

                'category_ids' => [],
                'amenity_ids' => [
                    "69d353a77e25af7e08073ff5",
                    "69d353627e25af7e08073ff4"
                ],
                'tower_ids' => [],

                'name' => "PRAYASAM GREEN",
                'slug' => "prayasam-green",
                'project_type' => "Residential Apartments/Flats",

                'description' => "Prayasam Green is a promising investment option in Ahmedabad’s growing residential sector offering modern living and excellent connectivity.",
                'short_description' => "Modern residential project at Science City Road, Ahmedabad",

                'address' => "NR RAJ HOMES, NEW SCIENCE CITY ROAD, AHMEDABAD, 380060",

                'state_id' => "69d352ca16c1eb596c001e5b",
                'city_id' => "69d352cc16c1eb596c001e71",
                'area_id' => "69d352cf16c1eb596c001e7b",

                'pincode' => "380060",

                'latitude' => null,
                'longitude' => null,

                'rera_number' => null,

                'possession_date' => "Mar 2026",
                'launch_date' => null,

                'project_status' => "upcoming",

                'cover_image_url' => null,

                'gallery_images_url' => [],
                'floorPlans_images_url' => [],
                'slider_image_url' => [],

                'brochure_url' => "https://myaidrive.com/BMTvp7AyVxA4PQ8YbhGHrZ/1.-PRAYASAM-.pdf",
                'reel_url' => null,

                'price' => "45 Lac - 55 Lac",
                'carpet_area' => "102.82 Sq.MT",

                'total_units' => null,
                'total_towers' => null,

                'meta_title' => "PRAYASAM GREEN",
                'meta_description' => "Prayasam Green Ahmedabad residential project",
                'meta_keywords' => "Prayasam Green, Ahmedabad, Flats",

                'is_featured' => true,
                'is_emerging_property' => false,
                'is_emerging_area' => true,
                'is_new_launch' => false,
                'is_trending' => false,

                'display_order' => null,
                'status' => true,

                'property_type_ids' => [],
                'unit_type_ids' => [],

                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'builder_id' => "69d39805cf4df026b8085d6f",

                'category_ids' => [],
                'amenity_ids' => [
                    "69d353a77e25af7e08073ff5",
                    "69d353627e25af7e08073ff4"
                ],
                'tower_ids' => [],

                'name' => "Atharva Posh Ville",
                'slug' => "atharva-posh-ville",
                'project_type' => "Residential Apartments/Flats",

                'description' => "Atharva Posh Ville is a promising investment option in Ahmedabad’s growing residential sector offering modern living and excellent connectivity.",
                'short_description' => "Modern residential project at Science City Road, Ahmedabad",

                'address' => "NR RAJ HOMES, NEW SCIENCE CITY ROAD, AHMEDABAD, 380060",

                'state_id' => "69d352ca16c1eb596c001e5b",
                'city_id' => "69d352cc16c1eb596c001e71",
                'area_id' => "69d352cf16c1eb596c001e7b",

                'pincode' => "380060",

                'latitude' => null,
                'longitude' => null,

                'rera_number' => null,

                'possession_date' => "Mar 2026",
                'launch_date' => null,

                'project_status' => "upcoming",

                'cover_image_url' => null,

                'gallery_images_url' => [],
                'floorPlans_images_url' => [],
                'slider_image_url' => [],

                'brochure_url' => "https://myaidrive.com/BMTvp7AyVxA4PQ8YbhGHrZ/1.-PRAYASAM-.pdf",
                'reel_url' => null,

                'price' => "45 Lac - 55 Lac",
                'carpet_area' => "102.82 Sq.MT",

                'total_units' => null,
                'total_towers' => null,

                'meta_title' => "PRAYASAM GREEN",
                'meta_description' => "Prayasam Green Ahmedabad residential project",
                'meta_keywords' => "Prayasam Green, Ahmedabad, Flats",

                'is_featured' => true,
                'is_emerging_property' => false,
                'is_emerging_area' => true,
                'is_new_launch' => false,
                'is_trending' => false,

                'display_order' => null,
                'status' => true,

                'property_type_ids' => [],
                'unit_type_ids' => [],

                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'builder_id' => "69d3b1decf4df026b8085d7d",

                'category_ids' => [],
                'amenity_ids' => [
                    "69d353a77e25af7e08073ff5",
                    "69d353627e25af7e08073ff4"
                ],
                'tower_ids' => [],

                'name' => "Millennium Bungalows",
                'slug' => "millennium-bungalows",
                'project_type' => "Residential Bungalows",

                'description' => "Millennium Bungalows offers a premium living experience in a serene environment with modern amenities and connectivity.",
                'short_description' => "Premium bungalow project in Enasan, Ahmedabad",

                'address' => "B/H Murli Party Plot, Nr. Akash Grant City, Enasan, Ahmedabad - 382330",

                'state_id' => "69d352ca16c1eb596c001e5b",
                'city_id' => "69d352cc16c1eb596c001e71",
                'area_id' => "69d352cf16c1eb596c001e7b",

                'pincode' => "382330",

                'latitude' => null,
                'longitude' => null,

                'rera_number' => null,

                'possession_date' => "Tentative - Dec 2026",
                'launch_date' => null,

                'project_status' => "upcoming",

                'cover_image_url' => null,

                'gallery_images_url' => [],
                'floorPlans_images_url' => [],
                'slider_image_url' => [],

                'brochure_url' => "https://example.com/millennium-bungalows-brochure.pdf",
                'reel_url' => null,

                'price' => "1.25 Cr - 2 Cr",
                'carpet_area' => "1600 - 3150 Sq.ft",

                'total_units' => null,
                'total_towers' => null,

                'meta_title' => "Millennium Bungalows",
                'meta_description' => "Millennium Bungalows Ahmedabad project",
                'meta_keywords' => "Millennium Bungalows, Ahmedabad, Bungalows",

                'is_featured' => true,
                'is_emerging_property' => false,
                'is_emerging_area' => true,
                'is_new_launch' => false,
                'is_trending' => false,

                'display_order' => null,
                'status' => true,

                'property_type_ids' => [],
                'unit_type_ids' => [],

                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'builder_id' => "69d4d81ad926ff5f08009624",

                'category_ids' => [],
                'amenity_ids' => [],
                'tower_ids' => [],

                'name' => "Aristo Aayam",
                'slug' => "aristo-aayam",
                'project_type' => "4BHK + 22 Storey Living Spaces",

                'description' => "Aristo Aayam offers premium living spaces in Ahmedabad with modern amenities, superior construction, and excellent connectivity.",
                'short_description' => "Premium 4BHK apartments at Ambli, Ahmedabad",

                'address' => "Opp. Shivalik Greens, b/h Shell Petrol Pump, Off Bopal Ambali Road, Ambali, Ahmedabad, 380058",

                'state_id' => "69d352ca16c1eb596c001e5b",
                'city_id' => "69d352cc16c1eb596c001e71",
                'area_id' => "69d352cf16c1eb596c001e7b",

                'pincode' => "380058",

                'latitude' => null,
                'longitude' => null,

                'rera_number' => null,

                'possession_date' => "Tentative - 2026",
                'launch_date' => null,

                'project_status' => "upcoming",

                'cover_image_url' => null,

                'gallery_images_url' => [],
                'floorPlans_images_url' => [],
                'slider_image_url' => [],

                'brochure_url' => "https://example.com/aristo-aayam-brochure.pdf",
                'reel_url' => null,

                'price' => "Starting from ₹1.50 Cr",
                'carpet_area' => "235 - 315 Sq.MT",

                'total_units' => null,
                'total_towers' => null,

                'meta_title' => "Aristo Aayam",
                'meta_description' => "Aristo Aayam Ahmedabad premium apartments",
                'meta_keywords' => "Aristo Aayam, Ahmedabad, 4BHK Apartments",

                'is_featured' => true,
                'is_emerging_property' => false,
                'is_emerging_area' => true,
                'is_new_launch' => false,
                'is_trending' => false,

                'display_order' => null,
                'status' => true,

                'property_type_ids' => [],
                'unit_type_ids' => [],

                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'builder_id' => "69d4d6bdd926ff5f08009622",

                'category_ids' => [],
                'amenity_ids' => [],
                'tower_ids' => [],

                'name' => "Abhishree One",
                'slug' => "abhishree-one",
                'project_type' => "3BHK Ultra Luxurious Apartment",

                'description' => "Abhishree One offers ultra-luxurious living spaces in Ahmedabad, designed with premium materials and modern conveniences for a refined lifestyle.",
                'short_description' => "3BHK Ultra Luxurious Apartment",

                'address' => "Opp. Shaival Residency, Usmanpura, Ahmedabad, Gujarat 380013",
                'state_id' => "69d352ca16c1eb596c001e5b",
                'city_id' => "69d352cc16c1eb596c001e71",
                'area_id' => "69d352cf16c1eb596c001e7b",
                'pincode' => "380013",

                'latitude' => null,
                'longitude' => null,

                'rera_number' => null,

                'possession_date' => now(),
                'launch_date' => now(),

                'project_status' => "ready_to_move",

                'cover_image_url' => null,

                'gallery_images_url' => [],
                'floorPlans_images_url' => [],
                'slider_image_url' => [],

                'brochure_url' => "https://drive.google.com/file/d/your_file_id/view",
                'reel_url' => "abhishreeone",

                'price' => "Not specified",
                'carpet_area' => "Not specified",

                'total_units' => null,
                'total_towers' => null,

                'meta_title' => "Abhishree One",
                'meta_description' => "Abhishree One",
                'meta_keywords' => "Abhishree One",

                'meta_data' => [],

                'is_featured' => true,
                'is_emerging_property' => false,
                'is_emerging_area' => true,
                'is_new_launch' => false,
                'is_trending' => false,

                'display_order' => null,
                'status' => true,

                'property_type_ids' => [],
                'unit_type_ids' => [],

                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}